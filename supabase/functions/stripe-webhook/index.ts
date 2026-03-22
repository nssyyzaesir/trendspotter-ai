// @ts-expect-error — Deno edge runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error — Deno edge runtime
import Stripe from "https://esm.sh/stripe@12?target=deno";
// @ts-expect-error — Deno edge runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // @ts-expect-error — Deno.env
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  // @ts-expect-error — Deno.env
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  // @ts-expect-error — Deno.env
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  // @ts-expect-error — Deno.env
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return new Response("Missing env vars", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-04-10" });
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        const isActive = sub.status === "active" || sub.status === "trialing";
        const newRole = isActive ? "pro" : "free";
        const expiresAt = isActive
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;

        await supabase
          .from("profiles")
          .update({
            role: newRole,
            stripe_subscription_id: sub.id,
            stripe_subscription_status: sub.status,
            plan_expires_at: expiresAt,
          })
          .eq("id", userId);

        console.log(`Updated user ${userId} to role=${newRole}, status=${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        await supabase
          .from("profiles")
          .update({
            role: "free",
            stripe_subscription_id: null,
            stripe_subscription_status: "cancelled",
            plan_expires_at: null,
          })
          .eq("id", userId);

        console.log(`Downgraded user ${userId} to free (subscription deleted)`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
