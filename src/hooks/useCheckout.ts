import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook para iniciar o fluxo de checkout Stripe.
 * Chama a Edge Function create-checkout e redireciona para a URL retornada.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado para fazer upgrade.");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Erro ao iniciar checkout: " + (err.message ?? "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return { startCheckout, loading };
}
