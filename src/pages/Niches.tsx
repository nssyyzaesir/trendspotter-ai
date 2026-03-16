import { motion } from "framer-motion";
import { Hash, TrendingUp, Eye, BarChart3 } from "lucide-react";
import { useHashtags, useTrendProducts } from "@/hooks/useTrendProducts";
import MainLayout from "@/components/layout/MainLayout";

const Niches = () => {
  const { data: hashtags, isLoading: hashLoading } = useHashtags();
  const { data: products } = useTrendProducts();

  const categories = ["Tecnologia", "Beleza", "Casa & Decoração", "Fitness", "Conteúdo", "Outros"];

  const categoryStats = categories.map((cat) => {
    const catProducts = (products || []).filter((p) => p.category === cat);
    const totalViews = catProducts.reduce((s, p) => s + (p.total_views || 0), 0);
    const avgScore = catProducts.length > 0 ? Math.round(catProducts.reduce((s, p) => s + (p.trend_score || 0), 0) / catProducts.length) : 0;
    return { name: cat, count: catProducts.length, totalViews, avgScore };
  }).filter((c) => c.count > 0).sort((a, b) => b.avgScore - a.avgScore);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Nichos em Alta</h1>
        <p className="text-muted-foreground mt-1">Explore categorias e hashtags que estão crescendo no TikTok.</p>
      </div>

      {/* Category Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryStats.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="mb-4 font-display text-lg font-bold">{cat.name}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="font-display text-xl font-bold text-primary">{cat.avgScore}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-accent" />
                <p className="font-display text-xl font-bold">{cat.count}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Produtos</p>
              </div>
              <div className="text-center">
                <Eye className="mx-auto mb-1 h-4 w-4 text-secondary" />
                <p className="font-display text-xl font-bold">
                  {cat.totalViews >= 1000000 ? `${(cat.totalViews / 1000000).toFixed(1)}M` : cat.totalViews >= 1000 ? `${(cat.totalViews / 1000).toFixed(0)}K` : cat.totalViews}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Views</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hashtags */}
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <Hash className="h-5 w-5 text-accent" /> Hashtags Monitoradas
      </h2>
      {hashLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(hashtags || []).map((ht: any, i: number) => (
            <motion.div
              key={ht.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Hash className="h-4 w-4" />
                </div>
                <span className="font-medium">#{ht.tag.replace("#", "")}</span>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-bold">
                  {ht.current_view_count ? `${(ht.current_view_count / 1000000).toFixed(1)}M` : "—"}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">views</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {(!hashtags || hashtags.length === 0) && !hashLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Hash className="mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhuma hashtag coletada. Execute a coleta no Dashboard.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Niches;
