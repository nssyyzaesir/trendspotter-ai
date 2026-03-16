import { useState } from "react";
import { motion } from "framer-motion";
import { PlaySquare, Eye, Heart, MessageCircle, Share2, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const Videos = () => {
  const [search, setSearch] = useState("");

  const { data: videos, isLoading } = useQuery({
    queryKey: ["tiktok-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tiktok_videos")
        .select("*, tracked_products(name, category)")
        .order("view_count", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const filtered = (videos || []).filter((v: any) =>
    (v.description || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.author_username || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Vídeos Virais</h1>
        <p className="text-muted-foreground mt-1">Últimos vídeos coletados com métricas de engajamento.</p>
      </div>

      <div className="mb-6 relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar vídeos..." className="pl-9 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video: any, i: number) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Thumbnail */}
              {video.thumbnail_url && (
                <div className="relative h-36 w-full overflow-hidden bg-muted">
                  <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <PlaySquare className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
              )}

              <div className="p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">@{video.author_username || "unknown"}</p>
                <p className="mb-3 line-clamp-2 text-sm font-medium leading-snug">{video.description || "Sem descrição"}</p>

                {video.tracked_products && (
                  <span className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {(video.tracked_products as any).name}
                  </span>
                )}

                <div className="grid grid-cols-4 gap-2 rounded-xl bg-muted/40 p-2.5">
                  {[
                    { icon: Eye, value: video.view_count || 0 },
                    { icon: Heart, value: video.like_count || 0 },
                    { icon: MessageCircle, value: video.comment_count || 0 },
                    { icon: Share2, value: video.share_count || 0 },
                  ].map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <m.icon className="mb-0.5 h-3.5 w-3.5 text-muted-foreground/70" />
                      <span className="font-display text-[11px] font-bold">{formatNum(m.value)}</span>
                    </div>
                  ))}
                </div>

                {video.video_url && (
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ver no TikTok
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <PlaySquare className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="font-display text-lg font-bold">Nenhum vídeo encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">Execute a coleta de dados no Dashboard para buscar vídeos.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Videos;
