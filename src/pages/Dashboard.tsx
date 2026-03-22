import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, TrendingUp, BarChart3, Flame, Package, RefreshCw, Hash, ScanSearch, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrendCard from "@/components/TrendCard";
import type { TrendProduct } from "@/components/TrendCard";
import { mockProducts } from "@/data/mockProducts";
import { useTrendProducts, useHashtags, dbProductToTrendCard } from "@/hooks/useTrendProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import { animateCardEntry, animateCountUp } from "@/lib/gsapAnimations";
import { ProductDetailModal } from "@/components/ProductDetailModal";


// Lazy load Three.js components
const TrendOrb = lazy(() => import("@/components/3d/TrendOrb").then((m) => ({ default: m.TrendOrb })));

const categories = ["Todos", "Tecnologia", "Beleza", "Casa & Decoração", "Fitness", "Conteúdo"];

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TrendProduct | null>(null);
  const queryClient = useQueryClient();
  const { role } = useAuth();

  const { data: dbProducts, isLoading: productsLoading } = useTrendProducts();
  const { data: hashtags } = useHashtags();

  const hasDBData = dbProducts && dbProducts.length > 0;
  const products = hasDBData ? dbProducts.map(dbProductToTrendCard) : mockProducts;

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Top produto por score (para o TrendOrb hero)
  const topProduct = [...products].sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0))[0];
  const topScore = topProduct?.trendScore ?? 75;

  const stats = [
    { label: "Produtos em Alta", value: hasDBData ? dbProducts.filter(p => p.trend_level === 'hot').length : 127, icon: Flame, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Tendências Hoje", value: hasDBData ? dbProducts.length : 34, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Crescimento Médio", value: hasDBData ? Math.round(dbProducts.reduce((a, p) => a + (p.growth_percentage || 0), 0) / dbProducts.length) : 186, icon: BarChart3, color: "text-primary", bg: "bg-primary/10", suffix: "%" },
    { label: "Novos Detectados", value: hasDBData ? dbProducts.filter(p => p.trend_level === 'new').length : 12, icon: Package, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  // Refs para GSAP
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statValueRefs = useRef<(HTMLElement | null)[]>([]);

  // GSAP: entry animations
  useEffect(() => {
    animateCardEntry(cardRefs.current, 0.1);
  }, [filtered.length]);

  // GSAP: count-up nos stat cards
  useEffect(() => {
    stats.forEach((stat, i) => {
      const el = statValueRefs.current[i];
      if (el) animateCountUp(el, stat.value, 1.2, stat.suffix ?? "");
    });
  }, [hasDBData]);

  const handleAction = async (fn: string, setLoading: (v: boolean) => void) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      toast.success(`${fn} concluído!`);
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
      queryClient.invalidateQueries({ queryKey: ["hashtags"] });
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero: TrendOrb + título */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Dashboard{" "}
              <span className="text-gradient">Overview</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Panorama das tendências virais do TikTok em tempo real.
            </p>
          </motion.div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleAction("collect-trends", setIsCollecting)} disabled={isCollecting} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isCollecting ? "animate-spin text-primary" : ""}`} />
              {isCollecting ? "Coletando..." : "Sincronizar"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction("identify-products", setIsIdentifying)} disabled={isIdentifying} className="gap-2">
              <ScanSearch className={`h-4 w-4 ${isIdentifying ? "animate-pulse text-primary" : ""}`} />
              {isIdentifying ? "Identificando..." : "Descobrir"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction("calculate-trends", setIsCalculating)} disabled={isCalculating} className="gap-2">
              <Calculator className={`h-4 w-4 ${isCalculating ? "animate-pulse text-primary" : ""}`} />
              {isCalculating ? "Calculando..." : "Analisar"}
            </Button>
          </div>
        </div>

        {/* TrendOrb hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "backOut" }}
          className="relative mx-auto h-44 w-44 md:h-52 md:w-52 shrink-0"
        >
          <div className="absolute inset-0 rounded-full neon-glow" style={{ "--glow-color": "var(--primary)" } as React.CSSProperties} />
          <Suspense fallback={
            <div className="h-full w-full rounded-full bg-primary/20 animate-pulse" />
          }>
            <TrendOrb trendScore={topScore} className="h-full w-full" />
          </Suspense>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full glass px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
            Score #{topScore}
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="glass-panel group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1"
          >
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl ${stat.bg} opacity-60`} />
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <span
              ref={(el) => { statValueRefs.current[i] = el; }}
              className="font-display text-3xl font-bold"
            >
              0
            </span>
          </div>
        ))}
      </div>

      {/* Hashtags */}
      {hashtags && hashtags.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
            <Hash className="h-4 w-4 text-accent" />
            Hashtags em Alta
          </h2>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((ht: any) => (
              <div key={ht.id} className="glass rounded-full px-4 py-1.5 text-sm font-medium hover:border-primary/50 transition-all">
                #{ht.tag.replace('#', '')}
                {ht.current_view_count && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    {(ht.current_view_count / 1_000_000).toFixed(1)}M
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Section */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-bold">Explorar Produtos</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar tendências..."
                className="h-10 rounded-full pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 flex overflow-x-auto pb-1">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-none rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {productsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted/60" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                ref={(el) => { cardRefs.current[stats.length + i] = el; }}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer"
              >
                <TrendCard product={product} />
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !productsLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Package className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-display text-base font-bold">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tente ajustar seus filtros.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
