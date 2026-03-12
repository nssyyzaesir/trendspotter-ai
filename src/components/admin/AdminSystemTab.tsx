import { useState } from "react";
import { RefreshCw, ScanSearch, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminSystemTab = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const queryClient = useQueryClient();

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

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Ações do Sistema</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <RefreshCw className="mb-2 h-6 w-6 text-primary" />
          <h4 className="mb-1 font-display font-bold">Coletar Dados</h4>
          <p className="mb-4 text-xs text-muted-foreground">Coleta novos vídeos e hashtags do TikTok</p>
          <Button size="sm" onClick={() => handleAction("collect-trends", setIsCollecting)} disabled={isCollecting} className="w-full gap-2">
            <RefreshCw className={`h-4 w-4 ${isCollecting ? "animate-spin" : ""}`} />
            {isCollecting ? "Coletando..." : "Executar"}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <ScanSearch className="mb-2 h-6 w-6 text-secondary" />
          <h4 className="mb-1 font-display font-bold">Identificar Produtos</h4>
          <p className="mb-4 text-xs text-muted-foreground">Analisa vídeos e identifica produtos por IA</p>
          <Button size="sm" onClick={() => handleAction("identify-products", setIsIdentifying)} disabled={isIdentifying} className="w-full gap-2">
            <ScanSearch className={`h-4 w-4 ${isIdentifying ? "animate-pulse" : ""}`} />
            {isIdentifying ? "Identificando..." : "Executar"}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <Calculator className="mb-2 h-6 w-6 text-accent" />
          <h4 className="mb-1 font-display font-bold">Calcular Tendências</h4>
          <p className="mb-4 text-xs text-muted-foreground">Recalcula o Trend Score de todos os produtos</p>
          <Button size="sm" onClick={() => handleAction("calculate-trends", setIsCalculating)} disabled={isCalculating} className="w-full gap-2">
            <Calculator className={`h-4 w-4 ${isCalculating ? "animate-pulse" : ""}`} />
            {isCalculating ? "Calculando..." : "Executar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemTab;
