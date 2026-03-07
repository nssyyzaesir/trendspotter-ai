
-- Create tracked_products table
CREATE TABLE public.tracked_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  first_detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trend_level TEXT DEFAULT 'new' CHECK (trend_level IN ('hot', 'rising', 'new')),
  trend_score INTEGER DEFAULT 0,
  growth_percentage NUMERIC DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  total_mentions BIGINT DEFAULT 0,
  avg_engagement NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tiktok_videos table
CREATE TABLE public.tiktok_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES public.tracked_products(id) ON DELETE CASCADE,
  author_username TEXT,
  description TEXT,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  share_count BIGINT DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  video_url TEXT,
  thumbnail_url TEXT
);

-- Create hashtags table
CREATE TABLE public.hashtags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL UNIQUE,
  current_video_count BIGINT DEFAULT 0,
  current_view_count BIGINT DEFAULT 0,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_tracked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_hashtags junction table
CREATE TABLE public.product_hashtags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.tracked_products(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  UNIQUE(product_id, hashtag_id)
);

-- Create hashtag_metrics table (time series for hashtag growth)
CREATE TABLE public.hashtag_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  video_count BIGINT DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_mention_metrics table (time series for product mentions)
CREATE TABLE public.product_mention_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.tracked_products(id) ON DELETE CASCADE,
  mention_count INTEGER DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  total_likes BIGINT DEFAULT 0,
  total_comments BIGINT DEFAULT 0,
  avg_engagement NUMERIC DEFAULT 0,
  new_videos_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tracked_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtag_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_mention_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (data is public market intelligence)
CREATE POLICY "Public read access" ON public.tracked_products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.tiktok_videos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.hashtags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.product_hashtags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.hashtag_metrics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.product_mention_metrics FOR SELECT USING (true);

-- Service role only for inserts/updates (edge functions will use service role)
CREATE POLICY "Service role insert" ON public.tracked_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON public.tracked_products FOR UPDATE USING (true);
CREATE POLICY "Service role insert" ON public.tiktok_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role insert" ON public.hashtags FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON public.hashtags FOR UPDATE USING (true);
CREATE POLICY "Service role insert" ON public.product_hashtags FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role insert" ON public.hashtag_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role insert" ON public.product_mention_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON public.product_mention_metrics FOR UPDATE USING (true);

-- Indexes for performance
CREATE INDEX idx_tiktok_videos_product ON public.tiktok_videos(product_id);
CREATE INDEX idx_tiktok_videos_published ON public.tiktok_videos(published_at DESC);
CREATE INDEX idx_hashtag_metrics_hashtag ON public.hashtag_metrics(hashtag_id, recorded_at DESC);
CREATE INDEX idx_product_mentions_product ON public.product_mention_metrics(product_id, recorded_at DESC);
CREATE INDEX idx_tracked_products_score ON public.tracked_products(trend_score DESC);
CREATE INDEX idx_tracked_products_trend ON public.tracked_products(trend_level);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_tracked_products_updated_at
  BEFORE UPDATE ON public.tracked_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hashtags_updated_at
  BEFORE UPDATE ON public.hashtags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
