import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TrendCard from "@/components/TrendCard";
import { useTrendProducts, dbProductToTrendCard } from "@/hooks/useTrendProducts";
import { mockProducts } from "@/data/mockProducts";
import MainLayout from "@/components/layout/MainLayout";

const trendFilters = ["Todos", "Em Alta", "Crescendo", "Novos", "Saturados"];

const filterMap: Record<string, string | null> = {
  "Todos": null,
  "Em Alta": "hot",
  "Crescendo": "rising",
  "Novos": "new",
  "Saturados": "saturated",
};

const Trends = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const { data: dbProducts, isLoading } = useTrendProducts();

  const hasDBData = dbProducts && dbProducts.length > 0;
  const products = hasDBData ? dbProducts.map(dbProductToTrendCard) : mockProducts;

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const level = filterMap[activeFilter];
    const matchLevel = !level || p.trendLevel === level;
    return matchSearch && matchLevel;
  });

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Produtos em Tendência</h1>
        <p className="text-muted-foreground mt-1">Todos os produtos monitorados com seus scores de tendência.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar produtos..." className="pl-9 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {trendFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <TrendCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="font-display text-lg font-bold">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">Ajuste seus filtros ou busque por termos diferentes.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Trends;
