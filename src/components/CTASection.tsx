import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="relative py-section overflow-hidden scan-overlay">
    {/* Grid background */}
    <div className="absolute inset-0 data-grid opacity-25" />

    {/* Gradient overlays */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[100px]" />
    <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[80px]" />

    <div className="container relative z-10 mx-auto px-4 text-center">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
          Comece agora
        </div>

        <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl mb-8">
          Pronto para descobrir o{" "}
          <span className="text-gradient">próximo produto viral?</span>
        </h2>

        <p className="mx-auto mb-12 max-w-lg text-lg text-white/50 leading-relaxed">
          Junte-se a 12.000+ vendedores que já usam o TrendSpotter para encontrar oportunidades antes da concorrência.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/auth">
            <Button
              size="lg"
              className="h-14 bg-gradient-primary px-10 text-base font-bold text-background shadow-glow hover:opacity-85 transition-all duration-300 rounded-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                Começar Grátis — 14 dias
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          <Link to="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-white/15 bg-transparent px-10 text-base text-white/70 hover:text-white hover:border-white/30 transition-all rounded-xl"
            >
              Ver todos os planos
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-sm text-white/30">
          ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ Cancele a qualquer momento &nbsp;·&nbsp; ✓ Dados reais do TikTok
        </p>
      </div>
    </div>
  </section>
);

export default CTASection;
