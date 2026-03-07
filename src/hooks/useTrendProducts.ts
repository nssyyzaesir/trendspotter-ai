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
      return data as DBTrendProduct[];
    },
  });
}

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
