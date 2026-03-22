import { useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, BarChart3, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { TrendProduct } from "@/components/TrendCard";
import { animateCardEntry } from "@/lib/gsapAnimations";


const TrendOrb = lazy(() => import("@/components/3d/TrendOrb").then((m) => ({ default: m.TrendOrb })));

interface ProductDetailModalProps {
  product: TrendProduct;
  onClose: () => void;
}

// Mock histórico de crescimento (em produção viria de product_mention_metrics)
function generateGrowthHistory(baseViews: number) {
  const days = 14;
  return Array.from({ length: days }, (_, i) => {
    const growthFactor = Math.pow(1.08, i);
    const noise = (Math.random() - 0.5) * 0.2 * baseViews * growthFactor;
    return {
      day: `D${i + 1}`,
      views: Math.round(baseViews * growthFactor + noise),
      engagement: Math.round(Math.random() * 10 + 3),
    };
  });
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  const growthData = generateGrowthHistory(product.views ?? 100_000);
  const trendScore = product.trendScore ?? 50;

  useEffect(() => {
    animateCardEntry(statRefs.current, 0.15);
  }, []);

  // Fechar com Esc
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const stats = [
    { label: "Visualizações", value: product.views ? `${(product.views / 1_000_000).toFixed(1)}M` : "—", icon: Eye },
    { label: "Likes", value: product.likes ? `${(product.likes / 1000).toFixed(0)}K` : "—", icon: Heart },
    { label: "Comentários", value: "—", icon: MessageCircle },
    { label: "Partilhas", value: "—", icon: Share2 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="relative z-10 w-full max-w-2xl glass-panel rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <Suspense fallback={<div className="h-full w-full rounded-full bg-primary/20 animate-pulse" />}>
                <TrendOrb trendScore={trendScore} className="h-full w-full" />
              </Suspense>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold truncate">{product.name}</h2>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    trendScore >= 80 ? "bg-red-500/20 text-red-400" :
                    trendScore >= 50 ? "bg-orange-500/20 text-orange-400" :
                    trendScore >= 20 ? "bg-blue-500/20 text-blue-400" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {trendScore >= 80 ? "Viral" : trendScore >= 50 ? "Hot" : trendScore >= 20 ? "Rising" : "New"}
                </span>
                <span className="text-sm font-semibold text-primary">Score {trendScore}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={(el) => { statRefs.current[i] = el; }}
                className="rounded-xl bg-muted/40 p-3 text-center"
              >
                <stat.icon className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <div className="font-display text-lg font-bold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Gráfico de crescimento */}
          <div className="mb-2">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
              <BarChart3 className="h-4 w-4" />
              Histórico de Crescimento (14 dias)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`${(v / 1000).toFixed(0)}k`, "Views"]}
                  />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex gap-3">
            <Button className="flex-1 gap-2 bg-gradient-primary" size="sm">
              <TrendingUp className="h-4 w-4" />
              Rastrear Produto
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
