// @ts-expect-error — Deno edge runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error — Deno edge runtime
import Stripe from "https://esm.sh/stripe@12?target=deno";
// @ts-expect-error — Deno edge runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    // @ts-expect-error — Deno.env
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    // @ts-expect-error — Deno.env
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    // @ts-expect-error — Deno.env
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    // @ts-expect-error — Deno.env
    const proPriceId = Deno.env.get("STRIPE_PRO_PRICE_ID");
    // @ts-expect-error — Deno.env
    const appUrl = Deno.env.get("VITE_APP_URL") ?? "http://localhost:8080";

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey || !proPriceId) {
      return new Response(JSON.stringify({ error: "Missing env vars" }), { status: 500 });
    }

    // Verificar autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single();

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-04-10" });

    // Criar ou recuperar Stripe Customer
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Salvar customer_id no perfil
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: proPriceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
