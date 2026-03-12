import { Package, Hash } from "lucide-react";
import { useTrendProducts, useHashtags } from "@/hooks/useTrendProducts";

const AdminStatsTab = () => {
  const { data: products } = useTrendProducts();
  const { data: hashtags } = useHashtags();

  const hotCount = (products || []).filter((p) => p.trend_level === "hot").length;
  const risingCount = (products || []).filter((p) => p.trend_level === "rising").length;
  const newCount = (products || []).filter((p) => p.trend_level === "new").length;
  const saturatedCount = (products || []).filter((p) => p.trend_level === "saturated").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 flex items-center gap-2 font-display font-bold">
          <Package className="h-5 w-5 text-primary" /> Distribuição por Nível
        </h3>
        <div className="space-y-2">
          {[
            { label: "Hot", count: hotCount, color: "bg-destructive" },
            { label: "Rising", count: risingCount, color: "bg-accent" },
            { label: "New", count: newCount, color: "bg-primary" },
            { label: "Saturated", count: saturatedCount, color: "bg-muted-foreground" },
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
          {(!hashtags || hashtags.length === 0) && (
            <p className="text-sm text-muted-foreground">Nenhuma hashtag coletada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatsTab;
