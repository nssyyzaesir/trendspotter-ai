import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Package, Users, BarChart3, Settings, LogOut,
  RefreshCw, ScanSearch, Calculator, Trash2, Eye, Hash, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTrendProducts, useHashtags } from "@/hooks/useTrendProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TrendBadge from "@/components/TrendBadge";

const tabs = [
  { id: "products", label: "Produtos", icon: Package },
  { id: "users", label: "Usuários", icon: Users },
  { id: "stats", label: "Estatísticas", icon: BarChart3 },
  { id: "system", label: "Sistema", icon: Settings },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [search, setSearch] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useTrendProducts();
  const { data: hashtags } = useHashtags();

  const handleAction = async (action: string, setLoading: (v: boolean) => void) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(action);
      if (error) throw error;
      toast.success(`${action} concluído com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
      queryClient.invalidateQueries({ queryKey: ["hashtags"] });
      console.log(`${action} result:`, data);
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente desativar "${name}"?`)) return;
    const { error } = await supabase
      .from("tracked_products")
      .update({ is_active: false })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao desativar produto");
    } else {
      toast.success(`"${name}" desativado`);
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const hotCount = (products || []).filter((p) => p.trend_level === "hot").length;
  const risingCount = (products || []).filter((p) => p.trend_level === "rising").length;
  const avgScore = products && products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.trend_score || 0), 0) / products.length)
    : 0;

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
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" /> Ver Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Produtos", value: (products || []).length, color: "text-primary" },
            { label: "Em Alta (Hot)", value: hotCount, color: "text-destructive" },
            { label: "Crescendo", value: risingCount, color: "text-accent" },
            { label: "Score Médio", value: avgScore, color: "text-secondary" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produtos
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produto</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoria</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Nível</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Crescimento</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Views</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {productsLoading ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
                  ) : filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category || "—"}</td>
                      <td className="px-4 py-3 text-center font-display font-bold text-primary">{p.trend_score || 0}</td>
                      <td className="px-4 py-3 text-center">
                        <TrendBadge level={(p.trend_level || "new") as any} />
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-accent">
                        +{p.growth_percentage || 0}%
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {p.total_views ? `${(p.total_views / 1000000).toFixed(1)}M` : "0"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 font-display text-lg font-bold">Gerenciamento de Usuários</h3>
            <p className="text-sm text-muted-foreground">
              O gerenciamento de usuários será implementado em breve.
            </p>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display font-bold">
                <Package className="h-5 w-5 text-primary" /> Distribuição por Nível
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Hot", count: hotCount, color: "bg-destructive" },
                  { label: "Rising", count: risingCount, color: "bg-accent" },
                  { label: "New", count: (products || []).filter(p => p.trend_level === "new").length, color: "bg-primary" },
                  { label: "Saturated", count: (products || []).filter(p => p.trend_level === "saturated").length, color: "bg-muted-foreground" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="font-display font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display font-bold">
                <Hash className="h-5 w-5 text-accent" /> Top Hashtags
              </h3>
              <div className="space-y-2">
                {(hashtags || []).slice(0, 8).map((ht: any) => (
                  <div key={ht.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ht.tag}</span>
                    <span className="text-muted-foreground">
                      {ht.current_view_count ? `${(ht.current_view_count / 1000000).toFixed(1)}M` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold">Ações do Sistema</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <RefreshCw className="mb-2 h-6 w-6 text-primary" />
                <h4 className="mb-1 font-display font-bold">Coletar Dados</h4>
                <p className="mb-4 text-xs text-muted-foreground">Coleta novos vídeos e hashtags do TikTok</p>
                <Button
                  size="sm"
                  onClick={() => handleAction("collect-trends", setIsCollecting)}
                  disabled={isCollecting}
                  className="w-full gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isCollecting ? "animate-spin" : ""}`} />
                  {isCollecting ? "Coletando..." : "Executar"}
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <ScanSearch className="mb-2 h-6 w-6 text-secondary" />
                <h4 className="mb-1 font-display font-bold">Identificar Produtos</h4>
                <p className="mb-4 text-xs text-muted-foreground">Analisa vídeos e identifica produtos por IA</p>
                <Button
                  size="sm"
                  onClick={() => handleAction("identify-products", setIsIdentifying)}
                  disabled={isIdentifying}
                  className="w-full gap-2"
                >
                  <ScanSearch className={`h-4 w-4 ${isIdentifying ? "animate-pulse" : ""}`} />
                  {isIdentifying ? "Identificando..." : "Executar"}
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <Calculator className="mb-2 h-6 w-6 text-accent" />
                <h4 className="mb-1 font-display font-bold">Calcular Tendências</h4>
                <p className="mb-4 text-xs text-muted-foreground">Recalcula o Trend Score de todos os produtos</p>
                <Button
                  size="sm"
                  onClick={() => handleAction("calculate-trends", setIsCalculating)}
                  disabled={isCalculating}
                  className="w-full gap-2"
                >
                  <Calculator className={`h-4 w-4 ${isCalculating ? "animate-pulse" : ""}`} />
                  {isCalculating ? "Calculando..." : "Executar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
