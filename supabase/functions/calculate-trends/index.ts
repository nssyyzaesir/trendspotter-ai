import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface ProductWithVideos {
  id: string
  name: string
  total_views: number | null
  total_mentions: number | null
  avg_engagement: number | null
  growth_percentage: number | null
  first_detected_at: string
  created_at: string
}

interface VideoMetrics {
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
  published_at: string | null
}

function calculateTrendScore(
  product: ProductWithVideos,
  videos: VideoMetrics[],
  previousMentions: number | null
): { score: number; level: string; growth: number } {
  if (videos.length === 0) {
    return { score: 0, level: 'new', growth: 0 }
  }

  // ── Factor 1: Video Growth Rate (0-25 points) ──
  const currentVideoCount = videos.length
  const prevMentions = previousMentions || 1
  const videoGrowthRate = ((currentVideoCount - prevMentions) / prevMentions) * 100
  const videoGrowthScore = Math.min(25, Math.max(0, (videoGrowthRate / 200) * 25))

  // ── Factor 2: View Volume & Growth (0-25 points) ──
  const totalViews = videos.reduce((sum, v) => sum + (v.view_count || 0), 0)
  // Logarithmic scale: 1M views = ~15pts, 10M = ~20pts, 100M = ~25pts
  const viewScore = Math.min(25, Math.max(0, (Math.log10(Math.max(totalViews, 1)) / 8) * 25))

  // ── Factor 3: Engagement Rate (0-25 points) ──
  const totalLikes = videos.reduce((sum, v) => sum + (v.like_count || 0), 0)
  const totalComments = videos.reduce((sum, v) => sum + (v.comment_count || 0), 0)
  const totalShares = videos.reduce((sum, v) => sum + (v.share_count || 0), 0)
  const totalEngagement = totalLikes + totalComments * 2 + totalShares * 3 // weighted
  const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0
  // Engagement rate 5% = ~12pts, 10% = ~20pts, 15%+ = ~25pts
  const engagementScore = Math.min(25, Math.max(0, (engagementRate / 15) * 25))

  // ── Factor 4: Velocity / Recency (0-25 points) ──
  const now = Date.now()
  const firstDetected = new Date(product.first_detected_at || product.created_at).getTime()
  const daysSinceFirst = Math.max(1, (now - firstDetected) / (1000 * 60 * 60 * 24))

  // Recent videos in last 48h
  const recentVideos = videos.filter(v => {
    if (!v.published_at) return false
    const hoursAgo = (now - new Date(v.published_at).getTime()) / (1000 * 60 * 60)
    return hoursAgo <= 48
  }).length

  const velocityRatio = recentVideos / Math.max(1, currentVideoCount)
  const freshnessBonus = daysSinceFirst <= 7 ? 10 : daysSinceFirst <= 14 ? 5 : 0
  const velocityScore = Math.min(25, Math.max(0, velocityRatio * 15 + freshnessBonus))

  // ── Final Score ──
  const rawScore = videoGrowthScore + viewScore + engagementScore + velocityScore
  const score = Math.round(Math.min(99, Math.max(0, rawScore)))

  // ── Classification ──
  let level: string
  if (score >= 75 && daysSinceFirst <= 14 && videoGrowthRate > 50) {
    level = 'hot' // Tendência emergente com alto crescimento
  } else if (score >= 50) {
    level = 'rising' // Tendência em crescimento
  } else if (score >= 30 && totalViews > 5000000 && videoGrowthRate < 20) {
    level = 'saturated' // Produto saturado
  } else {
    level = 'new'
  }

  // Override: high views + low growth = saturated
  if (totalViews > 10000000 && videoGrowthRate < 10 && engagementRate < 3) {
    level = 'saturated'
  }

  const growth = Math.round(videoGrowthRate)

  return { score, level, growth }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting trend score calculation...')

    // Fetch all active products
    const { data: products, error: productsError } = await supabase
      .from('tracked_products')
      .select('*')
      .eq('is_active', true)

    if (productsError) throw productsError

    let updated = 0
    let hotCount = 0
    let risingCount = 0
    let saturatedCount = 0

    for (const product of (products || [])) {
      // Fetch videos for this product
      const { data: videos } = await supabase
        .from('tiktok_videos')
        .select('view_count, like_count, comment_count, share_count, published_at')
        .eq('product_id', product.id)

      // Fetch previous mention metrics for growth calculation
      const { data: prevMetrics } = await supabase
        .from('product_mention_metrics')
        .select('mention_count')
        .eq('product_id', product.id)
        .order('recorded_at', { ascending: false })
        .limit(2)

      const previousMentionCount = prevMetrics && prevMetrics.length > 1
        ? prevMetrics[1].mention_count
        : null

      const videoMetrics: VideoMetrics[] = (videos || []).map(v => ({
        view_count: v.view_count || 0,
        like_count: v.like_count || 0,
        comment_count: v.comment_count || 0,
        share_count: v.share_count || 0,
        published_at: v.published_at,
      }))

      const { score, level, growth } = calculateTrendScore(
        product as ProductWithVideos,
        videoMetrics,
        previousMentionCount
      )

      // Calculate aggregate metrics
      const totalViews = videoMetrics.reduce((s, v) => s + v.view_count, 0)
      const totalLikes = videoMetrics.reduce((s, v) => s + v.like_count, 0)
      const totalComments = videoMetrics.reduce((s, v) => s + v.comment_count, 0)
      const engagementRate = totalViews > 0
        ? parseFloat((((totalLikes + totalComments) / totalViews) * 100).toFixed(1))
        : 0

      // Update product
      const { error: updateError } = await supabase
        .from('tracked_products')
        .update({
          trend_score: score,
          trend_level: level,
          growth_percentage: growth,
          total_views: totalViews,
          total_mentions: videoMetrics.length,
          avg_engagement: engagementRate,
        })
        .eq('id', product.id)

      if (!updateError) {
        updated++
        if (level === 'hot') hotCount++
        else if (level === 'rising') risingCount++
        else if (level === 'saturated') saturatedCount++
      }
    }

    const summary = {
      products_analyzed: (products || []).length,
      products_updated: updated,
      hot_products: hotCount,
      rising_products: risingCount,
      saturated_products: saturatedCount,
      calculated_at: new Date().toISOString(),
    }

    console.log('Trend calculation complete:', summary)

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Calculation error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
