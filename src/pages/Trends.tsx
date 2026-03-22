import { useState, useMemo, type ElementType } from "react";

import { motion } from "framer-motion";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp,
  Flame, Zap, Sparkles, Eye, Heart, BarChart3, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTrendProducts, dbProductToTrendCard } from "@/hooks/useTrendProducts";
import { mockProducts } from "@/data/mockProducts";
import MainLayout from "@/components/layout/MainLayout";
import TrendBadge from "@/components/TrendBadge";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import type { TrendProduct } from "@/components/TrendCard";

type SortKey = "score" | "growth" | "views" | "name";
type SortDir = "asc" | "desc";

const FILTERS = [
  { label: "Todos", value: null, icon: Filter },
  { label: "Viral 🔥", value: "hot", icon: Flame },
  { label: "Rising ⚡", value: "rising", icon: Zap },
  { label: "Novo ✨", value: "new", icon: Sparkles },
];

const CATEGORIES = ["Todas", "Tecnologia", "Beleza", "Casa & Decoração", "Fitness", "Conteúdo"];

function SortIcon({ col, active, dir }: { col: string; active: SortKey; dir: SortDir }) {
  if (col !== active) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
}

const Trends = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedProduct, setSelectedProduct] = useState<TrendProduct | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { data: dbProducts, isLoading } = useTrendProducts();
  const hasDBData = dbProducts && dbProducts.length > 0;
  const products = hasDBData ? dbProducts.map(dbProductToTrendCard) : mockProducts;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchLevel = !activeFilter || p.trendLevel === activeFilter;
      const matchCat = activeCategory === "Todas" || p.category === activeCategory;
      return matchSearch && matchLevel && matchCat;
    });

    list = [...list].sort((a, b) => {
      let va = 0, vb = 0;
      if (sortKey === "score") { va = a.score; vb = b.score; }
      else if (sortKey === "growth") { va = a.growth; vb = b.growth; }
      else if (sortKey === "views") {
        va = parseFloat(String(a.views).replace(/[KMk]/g, (m) => m.toUpperCase() === "M" ? "000000" : "000"));
        vb = parseFloat(String(b.views).replace(/[KMk]/g, (m) => m.toUpperCase() === "M" ? "000000" : "000"));
      }
      else if (sortKey === "name") return sortDir === "asc"
        ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return sortDir === "asc" ? va - vb : vb - va;
    });

    return list;
  }, [products, search, activeFilter, activeCategory, sortKey, sortDir]);

  const columns: { key: SortKey; label: string; icon: ElementType }[] = [
    { key: "name", label: "Produto", icon: BarChart3 },
    { key: "score", label: "Score", icon: TrendingUp },
    { key: "growth", label: "Crescimento", icon: TrendingUp },
    { key: "views", label: "Views", icon: Eye },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Produtos em <span className="text-gradient">Tendência</span>
        </h1>
        <p className="text-muted-foreground mt-1.5">
          {filtered.length} produtos encontrados — actualizados diariamente
        </p>
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-4">
        {/* Search + view toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos por nome..."
              className="pl-9 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="trends-search"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-border p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >☰ Tabela</button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >⊞ Grid</button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => setActiveFilter(f.value)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="h-8 w-px bg-border mx-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-secondary/20 text-secondary border border-secondary/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/60" />
          ))}
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="glass-panel overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-8">#</th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {col.label}
                      <SortIcon col={col.key} active={sortKey} dir={sortDir} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nível</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engaj.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/50">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${Math.max(12, Math.min(100, product.score))}px` }}
                      />
                      <span className="font-bold font-display text-sm">{product.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-accent font-semibold text-sm">
                      <TrendingUp className="h-3.5 w-3.5" />
                      +{product.growth}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Eye className="h-3.5 w-3.5" />
                      {product.views}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <TrendBadge level={product.trendLevel} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Heart className="h-3 w-3" />
                      {product.engagement}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-display font-bold">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros acima</p>
            </div>
          )}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedProduct(product)}
              className="glass-panel cursor-pointer rounded-2xl p-4 hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover border border-border/50" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold line-clamp-1 group-hover:text-primary transition-colors text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <TrendBadge level={product.trendLevel} />
                <span className="font-display font-bold text-primary text-lg">{product.score}</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span className="text-accent font-semibold">+{product.growth}%</span>
                <span>{product.views} views</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </MainLayout>
  );
};

export default Trends;
