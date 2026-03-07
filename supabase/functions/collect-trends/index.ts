import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simulated TikTok data collection (replace with real API when available)
// In production, this would connect to TikTok's Research API or scraping service
function generateSimulatedTrendData() {
  const products = [
    { name: "Mini Projetor Portátil LED 4K", category: "Tecnologia", hashtags: ["#miniprojetor", "#projetor4k", "#techtrend", "#tiktokmademebuyit"] },
    { name: "Sérum Facial com Vitamina C", category: "Beleza", hashtags: ["#skincare", "#vitamicac", "#glowup", "#serumfacial"] },
    { name: "Luminária Sunset Projetor", category: "Casa & Decoração", hashtags: ["#sunsetlamp", "#roomdecor", "#aesthetic", "#tiktokmademebuyit"] },
    { name: "Garrafa Térmica Inteligente", category: "Fitness", hashtags: ["#smartbottle", "#fitness", "#hydration", "#techgadgets"] },
    { name: "Fone Bluetooth com Cancelamento de Ruído", category: "Tecnologia", hashtags: ["#bluetooth", "#noisecancelling", "#techreview", "#fones"] },
    { name: "Massageador Facial Elétrico", category: "Beleza", hashtags: ["#facialmassager", "#skincare", "#beautytool", "#selfcare"] },
    { name: "Ring Light Profissional 18\"", category: "Conteúdo", hashtags: ["#ringlight", "#contentcreator", "#setup", "#tiktoker"] },
    { name: "Organizador de Maquiagem Rotativo", category: "Beleza", hashtags: ["#makeup", "#organizer", "#beautyhack", "#tiktokmademebuyit"] },
    { name: "Câmera de Segurança WiFi 360°", category: "Tecnologia", hashtags: ["#security", "#smartHome", "#wifi", "#techgadgets"] },
    { name: "Kit Skincare Coreano 10 Steps", category: "Beleza", hashtags: ["#kbeauty", "#skincareroutine", "#glasskin", "#koreanbeauty"] },
  ];

  return products.map((product) => {
    const baseViews = Math.floor(Math.random() * 15000000) + 1000000;
    const baseLikes = Math.floor(baseViews * (Math.random() * 0.15 + 0.05));
    const baseComments = Math.floor(baseLikes * (Math.random() * 0.1 + 0.02));
    const growth = Math.floor(Math.random() * 400) + 50;
    const score = Math.min(99, Math.floor(growth / 4) + Math.floor(Math.random() * 20) + 50);
    const mentions = Math.floor(Math.random() * 9000) + 500;
    const engagement = parseFloat((Math.random() * 12 + 3).toFixed(1));

    const videos = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
      video_id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 10)}_${i}`,
      author_username: `creator_${Math.random().toString(36).slice(2, 8)}`,
      description: `${product.name} - review e demonstração ${product.hashtags.join(' ')}`,
      view_count: Math.floor(baseViews * (Math.random() * 0.3 + 0.1)),
      like_count: Math.floor(baseLikes * (Math.random() * 0.3 + 0.1)),
      comment_count: Math.floor(baseComments * (Math.random() * 0.3 + 0.1)),
      share_count: Math.floor(baseComments * (Math.random() * 0.5 + 0.1)),
      published_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      video_url: `https://tiktok.com/@creator/video/${Math.random().toString(36).slice(2)}`,
      thumbnail_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 200000000)}?w=400&h=400&fit=crop`,
    }));

    let trendLevel: string;
    if (score >= 85) trendLevel = 'hot';
    else if (score >= 70) trendLevel = 'rising';
    else trendLevel = 'new';

    return {
      product: {
        name: product.name,
        category: product.category,
        image_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 200000000)}?w=400&h=400&fit=crop`,
        trend_level: trendLevel,
        trend_score: score,
        growth_percentage: growth,
        total_views: baseViews,
        total_mentions: mentions,
        avg_engagement: engagement,
      },
      videos,
      hashtags: product.hashtags,
      mentionMetrics: {
        mention_count: mentions,
        total_views: baseViews,
        total_likes: baseLikes,
        total_comments: baseComments,
        avg_engagement: engagement,
        new_videos_count: videos.length,
      },
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting trend data collection...');

    const trendData = generateSimulatedTrendData();
    let productsProcessed = 0;
    let videosCollected = 0;
    let hashtagsTracked = 0;

    for (const item of trendData) {
      // Upsert product
      const { data: product, error: productError } = await supabase
        .from('tracked_products')
        .upsert(
          { ...item.product, is_active: true },
          { onConflict: 'name', ignoreDuplicates: false }
        )
        .select('id')
        .single();

      if (productError) {
        // If upsert fails due to no unique constraint on name, try insert or find existing
        const { data: existing } = await supabase
          .from('tracked_products')
          .select('id')
          .eq('name', item.product.name)
          .single();

        let productId: string;
        if (existing) {
          productId = existing.id;
          await supabase
            .from('tracked_products')
            .update(item.product)
            .eq('id', productId);
        } else {
          const { data: newProduct, error: insertError } = await supabase
            .from('tracked_products')
            .insert(item.product)
            .select('id')
            .single();
          if (insertError) {
            console.error('Error inserting product:', insertError);
            continue;
          }
          productId = newProduct.id;
        }

        // Insert videos
        for (const video of item.videos) {
          const { error: videoError } = await supabase
            .from('tiktok_videos')
            .upsert({ ...video, product_id: productId }, { onConflict: 'video_id' });
          if (!videoError) videosCollected++;
        }

        // Process hashtags
        for (const tag of item.hashtags) {
          const { data: hashtag } = await supabase
            .from('hashtags')
            .upsert({ tag, current_video_count: Math.floor(Math.random() * 50000) + 1000, current_view_count: Math.floor(Math.random() * 100000000) + 1000000 }, { onConflict: 'tag' })
            .select('id')
            .single();

          if (hashtag) {
            await supabase.from('product_hashtags').upsert({ product_id: productId, hashtag_id: hashtag.id }, { onConflict: 'product_id,hashtag_id' });
            await supabase.from('hashtag_metrics').insert({ hashtag_id: hashtag.id, video_count: Math.floor(Math.random() * 50000) + 1000, view_count: Math.floor(Math.random() * 100000000) + 1000000 });
            hashtagsTracked++;
          }
        }

        // Record mention metrics
        await supabase.from('product_mention_metrics').insert({ product_id: productId, ...item.mentionMetrics });

        productsProcessed++;
        continue;
      }

      if (product) {
        const productId = product.id;

        for (const video of item.videos) {
          const { error: videoError } = await supabase
            .from('tiktok_videos')
            .upsert({ ...video, product_id: productId }, { onConflict: 'video_id' });
          if (!videoError) videosCollected++;
        }

        for (const tag of item.hashtags) {
          const { data: hashtag } = await supabase
            .from('hashtags')
            .upsert({ tag, current_video_count: Math.floor(Math.random() * 50000) + 1000, current_view_count: Math.floor(Math.random() * 100000000) + 1000000 }, { onConflict: 'tag' })
            .select('id')
            .single();

          if (hashtag) {
            await supabase.from('product_hashtags').upsert({ product_id: productId, hashtag_id: hashtag.id }, { onConflict: 'product_id,hashtag_id' });
            await supabase.from('hashtag_metrics').insert({ hashtag_id: hashtag.id, video_count: Math.floor(Math.random() * 50000) + 1000, view_count: Math.floor(Math.random() * 100000000) + 1000000 });
            hashtagsTracked++;
          }
        }

        await supabase.from('product_mention_metrics').insert({ product_id: productId, ...item.mentionMetrics });
        productsProcessed++;
      }
    }

    console.log(`Collection complete: ${productsProcessed} products, ${videosCollected} videos, ${hashtagsTracked} hashtags`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          products_processed: productsProcessed,
          videos_collected: videosCollected,
          hashtags_tracked: hashtagsTracked,
          collected_at: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Collection error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
