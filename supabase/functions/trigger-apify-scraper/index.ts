import Deno from "https://deno.land/x/deno/mod.ts";
// @ts-expect-error — Deno edge runtime
const serve = Deno.serve;

const APIFY_API_URL = "https://api.apify.com/v2";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apifyToken = Deno.env.get("APIFY_API_TOKEN");
  const actorId = Deno.env.get("APIFY_ACTOR_ID");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");

  if (!apifyToken || !actorId || !supabaseUrl) {
    return new Response(
      JSON.stringify({ error: "Missing required environment variables" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { keywords?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // body vazio é OK, usar keywords padrão
  }

  const keywords = body.keywords ?? ["trending products", "viral items", "tiktok viral"];

  // Webhook URL — a edge function apify-webhook receberá os resultados
  const webhookUrl = `${supabaseUrl}/functions/v1/apify-webhook`;

  const runBody = {
    startUrls: keywords.map((kw) => ({
      url: `https://www.tiktok.com/search?q=${encodeURIComponent(kw)}`,
    })),
    maxItems: 50,
    webhookUrl,
  };

  try {
    // Dispara o Actor de forma assíncrona — não esperamos o resultado aqui
    const runResp = await fetch(
      `${APIFY_API_URL}/acts/${actorId}/runs?token=${apifyToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(runBody),
      }
    );

    if (!runResp.ok) {
      const text = await runResp.text();
      console.error("Apify run failed:", text);
      return new Response(
        JSON.stringify({ error: "Failed to start Apify actor", details: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const runData = await runResp.json();

    // Retorna 200 imediatamente — resultados chegam via webhook
    return new Response(
      JSON.stringify({
        success: true,
        message: "Apify actor started. Results will be delivered via webhook.",
        runId: runData.data?.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error triggering Apify:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
