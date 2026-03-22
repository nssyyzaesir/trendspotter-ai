// @ts-expect-error — Deno edge runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error — Deno edge runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3";

const TikTokVideoSchema = z.object({
  id: z.string().optional(),
  url: z.string().url().optional(),
  authorMeta: z.object({ name: z.string().optional() }).optional(),
  text: z.string().optional(),
  createTime: z.number().optional(),
  statsV2: z.object({
    playCount: z.union([z.string(), z.number()]).optional(),
    diggCount: z.union([z.string(), z.number()]).optional(),
    commentCount: z.union([z.string(), z.number()]).optional(),
    shareCount: z.union([z.string(), z.number()]).optional(),
  }).optional(),
  covers: z.object({ default: z.string().url().optional() }).optional(),
  mentions: z.array(z.string()).optional(),
});

const ApifyWebhookSchema = z.object({
  eventType: z.string(),
  actorRunId: z.string(),
  actorId: z.string(),
  defaultDatasetId: z.string(),
});

const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseInt(v, 10) || 0;
  return 0;
};

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const parsed = ApifyWebhookSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Invalid webhook payload:", parsed.error);
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  const { defaultDatasetId } = parsed.data;

  // @ts-expect-error — Deno.env
  const apifyToken = Deno.env.get("APIFY_API_TOKEN");
  // @ts-expect-error — Deno.env
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  // @ts-expect-error — Deno.env
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!apifyToken || !supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), { status: 500 });
  }

  // Buscar itens do dataset Apify
  const datasetResp = await fetch(
    `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${apifyToken}&format=json&limit=100`
  );
  if (!datasetResp.ok) {
    console.error("Failed to fetch dataset");
    return new Response(JSON.stringify({ error: "Failed to fetch dataset" }), { status: 500 });
  }

  const items = await datasetResp.json();
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let processedCount = 0;
  let errorCount = 0;

  for (const rawItem of items) {
    const item = TikTokVideoSchema.safeParse(rawItem);
    if (!item.success) { errorCount++; continue; }

    const v = item.data;
    const views = toNum(v.statsV2?.playCount);
    const likes = toNum(v.statsV2?.diggCount);
    const comments = toNum(v.statsV2?.commentCount);
    const shares = toNum(v.statsV2?.shareCount);

    // Extrair produto mencionado do texto/mentions
    const productName = (v.mentions ?? [])[0] ?? v.text?.slice(0, 60) ?? "Unknown Product";

    // Calcular score básico
    const engagementRate = views > 0 ? (likes + comments + shares) / views : 0;
    const trendScore = Math.min(100, Math.round(engagementRate * 100 + Math.log10(Math.max(1, views)) * 5));

    // Upsert produto
    const { data: product, error: productErr } = await supabase
      .from("tracked_products")
      .upsert({
        name: productName,
        total_views: views,
        total_mentions: 1,
        avg_engagement: Math.round(engagementRate * 10000) / 100,
        trend_score: trendScore,
        trend_level: trendScore >= 80 ? "viral" : trendScore >= 50 ? "hot" : trendScore >= 20 ? "rising" : "new",
        updated_at: new Date().toISOString(),
      }, { onConflict: "name", ignoreDuplicates: false })
      .select("id")
      .single();

    if (productErr || !product) { errorCount++; continue; }

    // Inserir vídeo TikTok
    if (v.id) {
      await supabase.from("tiktok_videos").upsert({
        video_id: v.id,
        video_url: v.url,
        author_username: v.authorMeta?.name,
        description: v.text,
        published_at: v.createTime ? new Date(v.createTime * 1000).toISOString() : null,
        view_count: views,
        like_count: likes,
        comment_count: comments,
        share_count: shares,
        thumbnail_url: v.covers?.default,
        product_id: product.id,
      }, { onConflict: "video_id", ignoreDuplicates: false });
    }

    // Registrar métrica
    await supabase.from("product_mention_metrics").insert({
      product_id: product.id,
      total_views: views,
      total_likes: likes,
      total_comments: comments,
      avg_engagement: Math.round(engagementRate * 10000) / 100,
    });

    processedCount++;
  }

  console.log(`Webhook processed: ${processedCount} ok, ${errorCount} errors`);
  return new Response(
    JSON.stringify({ success: true, processed: processedCount, errors: errorCount }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
