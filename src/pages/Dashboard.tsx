import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, TrendingUp, BarChart3, Flame, Package, RefreshCw, Hash, ScanSearch, Calculator, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrendCard from "@/components/TrendCard";
import { mockProducts } from "@/data/mockProducts";
import { Link, useNavigate } from "react-router-dom";
import { useTrendProducts, useHashtags, dbProductToTrendCard } from "@/hooks/useTrendProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import MainLayout from "@/components/layout/MainLayout";

const categories = ["Todos", "Tecnologia", "Beleza", "Casa & Decoração", "Fitness", "Conteúdo"];
const filters = ["Em Alta", "Crescendo", "Novos"];

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const queryClient = useQueryClient();
  const { role, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: dbProducts, isLoading: productsLoading } = useTrendProducts();
  const { data: hashtags } = useHashtags();

  const hasDBData = dbProducts && dbProducts.length > 0;
  const products = hasDBData
    ? dbProducts.map(dbProductToTrendCard)
    : mockProducts;

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const stats = [
    { icon: Flame, label: "Produtos em Alta", value: hasDBData ? String(dbProducts.filter(p => p.trend_level === 'hot').length) : "127", color: "text-destructive" },
    { icon: TrendingUp, label: "Tendências Hoje", value: hasDBData ? String(dbProducts.length) : "34", color: "text-accent" },
    { icon: BarChart3, label: "Crescimento Médio", value: hasDBData ? `+${Math.round(dbProducts.reduce((acc, p) => acc + (p.growth_percentage || 0), 0) / dbProducts.length)}%` : "+186%", color: "text-primary" },
    { icon: Package, label: "Novos Detectados", value: hasDBData ? String(dbProducts.filter(p => p.trend_level === 'new').length) : "12", color: "text-secondary" },
  ];

  const handleAction = async (fn: string, setLoading: (v: boolean) => void) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(fn);
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <MainLayout>
      {/* Stats Header Area */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o panorama das tendências virais do TikTok hoje.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction("collect-trends", setIsCollecting)} disabled={isCollecting} className="gap-2 bg-background shadow-sm hover:shadow-md transition-all">
            <RefreshCw className={`h-4 w-4 ${isCollecting ? "animate-spin text-primary" : "text-muted-foreground"}`} />
            <span className="hidden sm:inline">{isCollecting ? "Coletando..." : "Sincronizar"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction("identify-products", setIsIdentifying)} disabled={isIdentifying} className="gap-2 bg-background shadow-sm hover:shadow-md transition-all">
            <ScanSearch className={`h-4 w-4 ${isIdentifying ? "animate-pulse text-primary" : "text-muted-foreground"}`} />
            <span className="hidden sm:inline">{isIdentifying ? "Identificando..." : "Descobrir"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction("calculate-trends", setIsCalculating)} disabled={isCalculating} className="gap-2 bg-background shadow-sm hover:shadow-md transition-all">
            <Calculator className={`h-4 w-4 ${isCalculating ? "animate-pulse text-primary" : "text-muted-foreground"}`} />
            <span className="hidden sm:inline">{isCalculating ? "Calculando..." : "Analisar"}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${stat.color.replace('text-', 'bg-')}`} />
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-3xl font-bold tracking-tight">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hashtags */}
      {hashtags && hashtags.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Hash className="h-5 w-5 text-accent" />
            Hashtags em Alta na Semana
          </h2>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((ht: any) => (
              <div
                key={ht.id}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <span className="font-medium">#{ht.tag.replace('#', '')}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {ht.current_view_count ? `${(ht.current_view_count / 1000000).toFixed(1)}M` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Section */}
      <div className="mb-8 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-bold">Explorar Produtos</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar em tendências..." 
                className="h-10 rounded-full border-border bg-background pl-9 focus-visible:ring-primary" 
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
        <div className="mb-8 flex overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-none rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {productsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted/60" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, duration: 0.2 }}>
                <TrendCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !productsLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-display text-lg font-bold">Nenhum produto encontrado</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Tente ajustar seus filtros ou buscar por termos diferentes.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
