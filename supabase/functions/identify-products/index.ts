import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// ── Keyword-based product detection ──
const PRODUCT_KEYWORDS: Record<string, string[]> = {
  "Mini Projetor": ["projetor", "projector", "mini projetor", "projetor portátil", "projetor 4k", "projetor led"],
  "Sérum Facial": ["sérum", "serum", "vitamina c", "ácido hialurônico", "skincare sérum"],
  "Ring Light": ["ring light", "ringlight", "luz anel", "iluminação circular"],
  "Fone Bluetooth": ["fone bluetooth", "earbuds", "fone sem fio", "noise cancelling", "cancelamento de ruído"],
  "Luminária Sunset": ["sunset lamp", "luminária sunset", "projetor sunset", "sunset projetor"],
  "Garrafa Térmica": ["garrafa térmica", "garrafa inteligente", "smart bottle", "garrafa led"],
  "Massageador Facial": ["massageador facial", "facial massager", "gua sha elétrico", "jade roller elétrico"],
  "Organizador Maquiagem": ["organizador maquiagem", "makeup organizer", "organizador rotativo", "organizador cosmético"],
  "Câmera Segurança": ["câmera segurança", "câmera wifi", "security camera", "câmera 360"],
  "Kit Skincare": ["skincare routine", "k-beauty", "korean skincare", "glass skin", "kit skincare", "skincare coreano"],
  "Impressora Portátil": ["mini impressora", "impressora portátil", "pocket printer", "mini printer"],
  "Purificador de Ar": ["purificador", "air purifier", "purificador de ar"],
  "Escova Alisadora": ["escova alisadora", "hair straightener brush", "escova elétrica"],
  "Cílios Magnéticos": ["cílios magnéticos", "magnetic lashes", "cílios postiços magnéticos"],
  "Aspirador Robô": ["aspirador robô", "robot vacuum", "robô aspirador"],
}

const PRODUCT_HASHTAGS: Record<string, string[]> = {
  "Mini Projetor": ["#miniprojetor", "#projetor4k", "#projetor"],
  "Sérum Facial": ["#serumfacial", "#vitamicac", "#serum"],
  "Ring Light": ["#ringlight", "#iluminacao"],
  "Fone Bluetooth": ["#bluetooth", "#noisecancelling", "#fones", "#earbuds"],
  "Luminária Sunset": ["#sunsetlamp", "#sunsetlight"],
  "Garrafa Térmica": ["#smartbottle", "#garrafatermica"],
  "Massageador Facial": ["#facialmassager", "#guasha"],
  "Kit Skincare": ["#kbeauty", "#glassskin", "#koreanbeauty", "#skincareroutine"],
  "Impressora Portátil": ["#miniprinter", "#impressoraportatil"],
  "Câmera Segurança": ["#securitycamera", "#smarthome"],
}

interface VideoRow {
  id: string
  description: string | null
  view_count: number | null
  like_count: number | null
  comment_count: number | null
  share_count: number | null
  product_id: string | null
  video_id: string
  author_username: string | null
  published_at: string | null
}

// Match a video to a product using keywords in the description
function matchByKeywords(description: string): string | null {
  const lower = description.toLowerCase()
  let bestMatch: string | null = null
  let bestScore = 0

  for (const [product, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length // longer keyword = more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = product
    }
  }

  return bestScore > 0 ? bestMatch : null
}

// Match a video to a product using hashtags in the description
function matchByHashtags(description: string): string | null {
  const lower = description.toLowerCase()
  let bestMatch: string | null = null
  let bestScore = 0

  for (const [product, hashtags] of Object.entries(PRODUCT_HASHTAGS)) {
    let score = 0
    for (const ht of hashtags) {
      if (lower.includes(ht.toLowerCase())) {
        score++
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = product
    }
  }

  return bestScore > 0 ? bestMatch : null
}

// ── AI-based product identification for unmatched videos ──
async function identifyWithAI(videos: VideoRow[]): Promise<Map<string, string>> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")
  if (!LOVABLE_API_KEY || videos.length === 0) return new Map()

  const descriptions = videos.map((v, i) => `[${i}] ${v.description || "(sem descrição)"}`).join("\n")

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em identificação de produtos em vídeos do TikTok. Analise as descrições de vídeos e identifique qual produto está sendo demonstrado ou mencionado em cada um. Agrupe vídeos que falam do mesmo produto sob o mesmo nome. Use nomes curtos e descritivos em português para os produtos (ex: "Mini Impressora Portátil", "Sérum Vitamina C"). Se não conseguir identificar um produto, use "Desconhecido".`
        },
        {
          role: "user",
          content: `Identifique os produtos mencionados em cada vídeo abaixo:\n\n${descriptions}`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "identify_products",
            description: "Map each video index to an identified product name",
            parameters: {
              type: "object",
              properties: {
                identifications: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      video_index: { type: "number", description: "Index of the video from the list" },
                      product_name: { type: "string", description: "Identified product name in Portuguese" },
                      category: { type: "string", enum: ["Tecnologia", "Beleza", "Casa & Decoração", "Fitness", "Conteúdo", "Moda", "Outros"] },
                      confidence: { type: "number", description: "Confidence score 0-1" }
                    },
                    required: ["video_index", "product_name", "category", "confidence"],
                    additionalProperties: false
                  }
                }
              },
              required: ["identifications"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "identify_products" } }
    }),
  })

  if (!response.ok) {
    console.error("AI gateway error:", response.status, await response.text())
    return new Map()
  }

  const result = await response.json()
  const toolCall = result.choices?.[0]?.message?.tool_calls?.[0]
  if (!toolCall) return new Map()

  try {
    const parsed = JSON.parse(toolCall.function.arguments)
    const map = new Map<string, string>()
    for (const item of parsed.identifications) {
      if (item.confidence >= 0.5 && item.product_name !== "Desconhecido") {
        const video = videos[item.video_index]
        if (video) {
          map.set(video.id, `${item.product_name}|||${item.category}`)
        }
      }
    }
    return map
  } catch (e) {
    console.error("Error parsing AI response:", e)
    return new Map()
  }
}

// ── Clustering: group unmatched videos by text similarity ──
function clusterByTextSimilarity(videos: VideoRow[]): Map<string, VideoRow[]> {
  const clusters = new Map<string, VideoRow[]>()
  const assigned = new Set<string>()

  for (let i = 0; i < videos.length; i++) {
    if (assigned.has(videos[i].id)) continue
    const cluster: VideoRow[] = [videos[i]]
    assigned.add(videos[i].id)

    const wordsA = extractSignificantWords(videos[i].description || "")

    for (let j = i + 1; j < videos.length; j++) {
      if (assigned.has(videos[j].id)) continue
      const wordsB = extractSignificantWords(videos[j].description || "")
      const similarity = jaccardSimilarity(wordsA, wordsB)
      if (similarity >= 0.3) {
        cluster.push(videos[j])
        assigned.add(videos[j].id)
      }
    }

    if (cluster.length >= 2) {
      const key = `cluster_${i}`
      clusters.set(key, cluster)
    }
  }

  return clusters
}

function extractSignificantWords(text: string): Set<string> {
  const stopwords = new Set(["de", "do", "da", "dos", "das", "e", "em", "um", "uma", "o", "a", "os", "as",
    "para", "com", "no", "na", "por", "que", "se", "não", "mais", "muito", "como",
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "is",
    "review", "video", "tiktok", "viral", "trend", "fyp", "foryou", "foryoupage"])
  const words = text.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúçñ\s]/g, " ").split(/\s+/)
  return new Set(words.filter(w => w.length > 2 && !stopwords.has(w)))
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0
  const intersection = new Set([...a].filter(x => b.has(x)))
  const union = new Set([...a, ...b])
  return intersection.size / union.size
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting product identification...')

    // 1. Fetch all videos
    const { data: videos, error: videosError } = await supabase
      .from('tiktok_videos')
      .select('*')
      .order('collected_at', { ascending: false })
      .limit(500)

    if (videosError) throw videosError

    const allVideos = (videos || []) as VideoRow[]
    console.log(`Found ${allVideos.length} videos to analyze`)

    const productAssignments = new Map<string, { videoIds: string[], category: string }>()
    const unmatchedVideos: VideoRow[] = []

    // ── Step 1: Keyword + Hashtag matching ──
    for (const video of allVideos) {
      const desc = video.description || ""
      const keywordMatch = matchByKeywords(desc)
      const hashtagMatch = matchByHashtags(desc)
      const match = keywordMatch || hashtagMatch

      if (match) {
        if (!productAssignments.has(match)) {
          // Infer category from PRODUCT_KEYWORDS context
          const categories: Record<string, string> = {
            "Mini Projetor": "Tecnologia", "Sérum Facial": "Beleza", "Ring Light": "Conteúdo",
            "Fone Bluetooth": "Tecnologia", "Luminária Sunset": "Casa & Decoração",
            "Garrafa Térmica": "Fitness", "Massageador Facial": "Beleza",
            "Organizador Maquiagem": "Beleza", "Câmera Segurança": "Tecnologia",
            "Kit Skincare": "Beleza", "Impressora Portátil": "Tecnologia",
            "Purificador de Ar": "Casa & Decoração", "Escova Alisadora": "Beleza",
            "Cílios Magnéticos": "Beleza", "Aspirador Robô": "Tecnologia",
          }
          productAssignments.set(match, { videoIds: [], category: categories[match] || "Outros" })
        }
        productAssignments.get(match)!.videoIds.push(video.id)
      } else {
        unmatchedVideos.push(video)
      }
    }

    console.log(`Keyword/hashtag matched: ${allVideos.length - unmatchedVideos.length} videos`)
    console.log(`Unmatched videos for AI/clustering: ${unmatchedVideos.length}`)

    // ── Step 2: Cluster unmatched videos by text similarity ──
    const clusters = clusterByTextSimilarity(unmatchedVideos)
    const clusteredVideoIds = new Set<string>()

    // ── Step 3: Use AI to identify products in clusters ──
    const videosForAI: VideoRow[] = []
    for (const [, clusterVideos] of clusters) {
      videosForAI.push(...clusterVideos)
      for (const v of clusterVideos) clusteredVideoIds.add(v.id)
    }

    // Also add remaining unclustered videos to AI analysis
    const unclusteredVideos = unmatchedVideos.filter(v => !clusteredVideoIds.has(v.id))
    videosForAI.push(...unclusteredVideos)

    let aiIdentified = 0
    if (videosForAI.length > 0) {
      // Process in batches of 20 to avoid token limits
      const batchSize = 20
      for (let i = 0; i < videosForAI.length; i += batchSize) {
        const batch = videosForAI.slice(i, i + batchSize)
        const aiResults = await identifyWithAI(batch)

        for (const [videoId, value] of aiResults) {
          const [productName, category] = value.split("|||")
          if (!productAssignments.has(productName)) {
            productAssignments.set(productName, { videoIds: [], category: category || "Outros" })
          }
          productAssignments.get(productName)!.videoIds.push(videoId)
          aiIdentified++
        }
      }
    }

    console.log(`AI identified: ${aiIdentified} videos`)

    // ── Step 4: Upsert products and link videos ──
    let productsCreated = 0
    let videosLinked = 0

    for (const [productName, assignment] of productAssignments) {
      // Check if product exists
      const { data: existing } = await supabase
        .from('tracked_products')
        .select('id')
        .eq('name', productName)
        .single()

      let productId: string

      if (existing) {
        productId = existing.id
        // Update mention count
        await supabase
          .from('tracked_products')
          .update({
            total_mentions: assignment.videoIds.length,
            is_active: true,
          })
          .eq('id', productId)
      } else {
        const { data: newProduct, error: insertError } = await supabase
          .from('tracked_products')
          .insert({
            name: productName,
            category: assignment.category,
            total_mentions: assignment.videoIds.length,
            trend_level: 'new',
            trend_score: 0,
            is_active: true,
          })
          .select('id')
          .single()

        if (insertError) {
          console.error(`Error creating product ${productName}:`, insertError)
          continue
        }
        productId = newProduct.id
        productsCreated++
      }

      // Link videos to product
      for (const videoId of assignment.videoIds) {
        const { error } = await supabase
          .from('tiktok_videos')
          .update({ product_id: productId })
          .eq('id', videoId)

        if (!error) videosLinked++
      }

      // Record mention metrics
      await supabase.from('product_mention_metrics').insert({
        product_id: productId,
        mention_count: assignment.videoIds.length,
        new_videos_count: assignment.videoIds.length,
      })
    }

    const summary = {
      total_videos_analyzed: allVideos.length,
      keyword_matched: allVideos.length - unmatchedVideos.length,
      clusters_found: clusters.size,
      ai_identified: aiIdentified,
      products_created: productsCreated,
      products_total: productAssignments.size,
      videos_linked: videosLinked,
      identified_at: new Date().toISOString(),
    }

    console.log('Identification complete:', summary)

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Identification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
