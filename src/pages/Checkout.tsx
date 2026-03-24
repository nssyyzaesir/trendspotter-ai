import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Zap, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCheckout";

/**
 * Real Stripe Checkout page.
 * Immediately calls the `create-checkout` Edge Function and redirects
 * the user to Stripe's hosted checkout session. No fake form fields.
 */
const Checkout = () => {
  const { user, isPro } = useAuth();
  const { startCheckout, loading } = useCheckout();
  const navigate = useNavigate();

  // Auto-start checkout on mount if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isPro) {
      navigate("/dashboard");
      return;
    }
    // Small delay for UX — let the user see the loading state
    const t = setTimeout(() => startCheckout(), 800);
    return () => clearTimeout(t);
  }, [user, isPro]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

      {/* Back link */}
      <Link
        to="/pricing"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Preços
      </Link>

      {/* Card */}
      <div className="relative z-10 glass-panel rounded-3xl p-10 text-center max-w-md w-full">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
          <Zap className="h-8 w-8 text-background" fill="currentColor" />
        </div>

        <h1 className="font-display text-2xl font-bold mb-2">Iniciando Checkout Seguro</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Você será redirecionado para o ambiente seguro da Stripe para completar sua assinatura Pro.
        </p>

        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Preparando sua sessão de pagamento...</p>
            </div>
          ) : (
            <Button
              onClick={startCheckout}
              className="w-full bg-gradient-primary gap-2 rounded-xl h-12 font-bold hover:opacity-85 shadow-glow"
            >
              <Zap className="h-4 w-4 fill-current" />
              Prosseguir para Stripe
            </Button>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Conexão SSL 256-bit · Dados protegidos pela Stripe
          </div>
        </div>

        {/* Plan summary */}
        <div className="mt-8 rounded-2xl border border-border/50 bg-surface-1 p-5 text-left">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Resumo do Plano</p>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-muted-foreground">TrendSpotter Pro</span>
            <span className="font-bold text-primary">€29/mês</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Renova mensalmente · Cancele a qualquer momento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
