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

  // Use DB data if available, otherwise fall back to mock data
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

  const handleCollect = async () => {
    setIsCollecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("collect-trends");
      if (error) throw error;
      toast.success(`Coleta concluída! ${data.summary.products_processed} produtos, ${data.summary.videos_collected} vídeos, ${data.summary.hashtags_tracked} hashtags`);
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
      queryClient.invalidateQueries({ queryKey: ["hashtags"] });
    } catch (err: any) {
      toast.error("Erro na coleta: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsCollecting(false);
    }
  };

  const handleIdentify = async () => {
    setIsIdentifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("identify-products");
      if (error) throw error;
      toast.success(
        `Identificação concluída! ${data.summary.products_total} produtos detectados (${data.summary.keyword_matched} por palavras-chave, ${data.summary.ai_identified} por IA, ${data.summary.clusters_found} clusters). ${data.summary.videos_linked} vídeos vinculados.`
      );
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
    } catch (err: any) {
      toast.error("Erro na identificação: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsIdentifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">TrendPulse</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleIdentify}
              disabled={isIdentifying}
              className="gap-2"
            >
              <ScanSearch className={`h-4 w-4 ${isIdentifying ? "animate-pulse" : ""}`} />
              {isIdentifying ? "Identificando..." : "Identificar Produtos"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollect}
              disabled={isCollecting}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isCollecting ? "animate-spin" : ""}`} />
              {isCollecting ? "Coletando..." : "Coletar Dados"}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Minha Conta
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Hashtags Trending */}
        {hashtags && hashtags.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <Hash className="h-5 w-5 text-accent" />
              Hashtags em Alta
            </h2>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((ht: any) => (
                <div
                  key={ht.id}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-accent"
                >
                  <span className="font-medium">{ht.tag}</span>
                  <span className="text-xs text-muted-foreground">
                    {ht.current_view_count
                      ? `${(ht.current_view_count / 1000000).toFixed(1)}M views`
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            {filters.map((f) => (
              <Button key={f} variant="outline" size="sm" className="text-xs">
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">
            Produtos em Tendência
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} produtos encontrados • {hasDBData ? "Dados reais do banco" : "Dados de demonstração"} • Atualizado há 5 minutos
          </p>
        </div>

        {/* Grid */}
        {productsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TrendCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !productsLoading && (
          <div className="py-20 text-center text-muted-foreground">
            Nenhum produto encontrado para essa busca.
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
