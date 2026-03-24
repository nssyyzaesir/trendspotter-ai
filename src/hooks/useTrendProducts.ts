import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DBTrendProduct {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  trend_level: string | null;
  trend_score: number | null;
  growth_percentage: number | null;
  total_views: number | null;
  total_mentions: number | null;
  avg_engagement: number | null;
  is_active: boolean | null;
  created_at: string;
}

const MOCK_PRODUCTS: DBTrendProduct[] = [
  {
    id: "mock-1", name: "Glow Recipe Watermelon Drops", category: "Beauty",
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    trend_level: "hot", trend_score: 98, growth_percentage: 145,
    total_views: 12500000, total_mentions: 45000, avg_engagement: 12.5, is_active: true, created_at: new Date().toISOString()
  },
  {
    id: "mock-2", name: "Stanley Quencher H2.0", category: "Home",
    image_url: "https://images.unsplash.com/photo-1622338162253-da89650e8a71?w=400&h=400&fit=crop",
    trend_level: "rising", trend_score: 85, growth_percentage: 67,
    total_views: 5400000, total_mentions: 12000, avg_engagement: 8.2, is_active: true, created_at: new Date().toISOString()
  },
  {
    id: "mock-3", name: "Heatless Hair Curler", category: "Beauty",
    image_url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
    trend_level: "hot", trend_score: 92, growth_percentage: 210,
    total_views: 8900000, total_mentions: 28000, avg_engagement: 15.1, is_active: true, created_at: new Date().toISOString()
  },
  {
    id: "mock-4", name: "Sunset Projection Lamp", category: "Decor",
    image_url: "https://images.unsplash.com/photo-1542406775-80f58d0422c5?w=400&h=400&fit=crop",
    trend_level: "rising", trend_score: 78, growth_percentage: 45,
    total_views: 2100000, total_mentions: 5400, avg_engagement: 6.8, is_active: true, created_at: new Date().toISOString()
  }
];

export function useTrendProducts() {
  return useQuery({
    queryKey: ["trend-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_products")
        .select("*")
        .eq("is_active", true)
        .order("trend_score", { ascending: false });

      if (error) throw error;
      
      // Fallback to mock data if database is empty (e.g. Apify not running)
      if (!data || data.length === 0) {
        return MOCK_PRODUCTS;
      }
      
      return data as DBTrendProduct[];
    },
  });
}

const MOCK_HASHTAGS = [
  { id: "h1", name: "tiktokmademebuyit", current_view_count: 85000000000, is_tracked: true, hashtag_metrics: [] },
  { id: "h2", name: "beautyhacks", current_view_count: 42000000000, is_tracked: true, hashtag_metrics: [] },
  { id: "h3", name: "amazonfinds", current_view_count: 38000000000, is_tracked: true, hashtag_metrics: [] },
  { id: "h4", name: "homehacks", current_view_count: 15000000000, is_tracked: true, hashtag_metrics: [] },
];

export function useHashtags() {
  return useQuery({
    queryKey: ["hashtags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hashtags")
        .select("*, hashtag_metrics(video_count, view_count, recorded_at)")
        .eq("is_tracked", true)
        .order("current_view_count", { ascending: false })
        .limit(20);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return MOCK_HASHTAGS;
      }
      
      return data;
    },
  });
}

export function useProductMentions(productId?: string) {
  return useQuery({
    queryKey: ["product-mentions", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_mention_metrics")
        .select("*")
        .eq("product_id", productId!)
        .order("recorded_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    },
  });
}

export function useCollectTrends() {
  return async () => {
    const { data, error } = await supabase.functions.invoke("collect-trends");
    if (error) throw error;
    return data;
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function dbProductToTrendCard(product: DBTrendProduct) {
  return {
    id: product.id as unknown as number,
    name: product.name,
    category: product.category || "Outros",
    image: product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    trendLevel: (product.trend_level || "new") as "hot" | "rising" | "new",
    score: product.trend_score || 0,
    growth: product.growth_percentage || 0,
    views: formatNumber(product.total_views || 0),
    mentions: formatNumber(product.total_mentions || 0),
    engagement: `${(product.avg_engagement || 0).toFixed(1)}%`,
  };
}
