import { useState } from "react";
import { Search, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TrendBadge from "@/components/TrendBadge";
import { useTrendProducts } from "@/hooks/useTrendProducts";

const AdminProductsTab = () => {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useTrendProducts();

  const filtered = (products || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Desativar "${name}"?`)) return;
    const { error } = await supabase
      .from("tracked_products")
      .update({ is_active: false })
      .eq("id", id);
    if (error) toast.error("Erro ao desativar");
    else {
      toast.success(`"${name}" desativado`);
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditCategory(p.category || "");
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("tracked_products")
      .update({ name: editName, category: editCategory })
      .eq("id", id);
    if (error) toast.error("Erro ao salvar");
    else {
      toast.success("Produto atualizado");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["trend-products"] });
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar produtos..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} produtos</p>
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
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  {editingId === p.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 text-sm" />
                  ) : (
                    <span className="font-medium">{p.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === p.id ? (
                    <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="h-8 text-sm" />
                  ) : (
                    <span className="text-muted-foreground">{p.category || "—"}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-display font-bold text-primary">{p.trend_score || 0}</td>
                <td className="px-4 py-3 text-center">
                  <TrendBadge level={(p.trend_level || "new") as any} />
                </td>
                <td className="px-4 py-3 text-center font-medium text-accent">+{p.growth_percentage || 0}%</td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {p.total_views ? `${(p.total_views / 1000000).toFixed(1)}M` : "0"}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {editingId === p.id ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => saveEdit(p.id)} className="text-primary hover:text-primary">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="text-muted-foreground">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(p)} className="text-muted-foreground hover:text-foreground">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id, p.name)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsTab;
