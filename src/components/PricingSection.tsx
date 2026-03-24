import { useState, useRef, useEffect } from "react";
import { Check, Zap, Star, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCheckout";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FREE_FEATURES = [
  "5 produtos rastreados",
  "Dados de 7 dias",
  "Dashboard básico",
  "Atualização diária",
  "Suporte por email",
];

const PRO_FEATURES = [
  "Produtos ilimitados",
  "Dados de 90 dias",
  "Dashboard 3D em tempo real",
  "TrendScore™ avançado",
  "Alertas instantâneos",
  "Exportar relatórios",
  "Atualização a cada hora",
  "Suporte prioritário",
];

const PricingSection = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const { user, isPro } = useAuth();
  const { startCheckout, loading } = useCheckout();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  const monthlyPrice = 29;
  const annualPrice = Math.round(monthlyPrice * 0.75);
  const price = billing === "annual" ? annualPrice : monthlyPrice;

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".pricing-card");
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      }
    );
  }, []);

  const handleUpgrade = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    startCheckout();
  };

  return (
    <section ref={sectionRef} id="pricing" className="relative py-section overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-secondary/25 bg-secondary/8 px-4 py-1.5 text-sm font-semibold text-secondary">
            <Zap className="h-3.5 w-3.5" />
            Simples e transparente
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Escolha o plano certo para{" "}
            <span className="text-gradient block sm:inline">seu negócio</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
            Comece gratuitamente. Faça upgrade quando precisar de mais poder.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center rounded-2xl border border-border/50 bg-surface-1 p-1.5 gap-1">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`rounded-xl px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                  billing === b
                    ? "bg-gradient-primary text-background shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b === "monthly" ? "Mensal" : (
                  <>Anual <span className="ml-1 text-[10px] font-bold text-green-400">-25%</span></>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {/* Free */}
          <div className="pricing-card glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="mb-7">
              <h3 className="font-display text-2xl font-bold">Grátis</h3>
              <p className="mt-1 text-sm text-muted-foreground">Para começar a explorar tendências</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">€0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>
            <ul className="mb-8 space-y-3.5">
              {FREE_FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                    <Check className="h-3 w-3 text-muted-foreground" />
                  </span>
                  <span className="text-muted-foreground">{feat}</span>
                </li>
              ))}
            </ul>
            {user ? (
              <Button variant="outline" className="w-full rounded-xl border-border/50" asChild>
                <Link to="/dashboard">Entrar no Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" className="w-full rounded-xl border-border/50" asChild>
                <Link to="/auth">Começar Grátis</Link>
              </Button>
            )}
          </div>

          {/* Pro */}
          <div className="pricing-card relative rounded-3xl p-8 overflow-hidden border-gradient">
            {/* Orbital glow */}
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-[60px]" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/15 blur-[60px]" />

            {/* Popular badge */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold text-background uppercase tracking-widest">
              <Star className="h-2.5 w-2.5 fill-current" />
              Popular
            </div>

            <div className="relative z-10 mb-7">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-2xl font-bold">Pro</h3>
                <Zap className="h-4 w-4 text-primary fill-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Para quem quer dominar o mercado</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-gradient">€{price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              {billing === "annual" && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Cobrado anualmente (€{price * 12}/ano) · Economize €{(monthlyPrice - price) * 12}
                </p>
              )}
            </div>

            <ul className="relative z-10 mb-8 space-y-3.5">
              {PRO_FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="relative z-10">
              {isPro ? (
                <Button className="w-full bg-gradient-primary gap-2 rounded-xl h-12 font-bold" disabled>
                  <Shield className="h-4 w-4" /> Você já é Pro!
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-primary gap-2 rounded-xl h-12 font-bold hover:opacity-85 transition-all relative overflow-hidden group shadow-glow"
                  onClick={handleUpgrade}
                  disabled={loading}
                  id="upgrade-pro-btn"
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Redirecionando...</>
                    ) : (
                      <><Zap className="h-4 w-4 fill-current" /> {user ? "Assinar Pro — €" + price + "/mês" : "Criar conta e assinar"}</>
                    )}
                  </span>
                </Button>
              )}
              {!user && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  <Link to="/auth" className="text-primary hover:underline">Crie uma conta</Link> para fazer upgrade
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {["Pagamento seguro via Stripe", "Cancele a qualquer momento", "Suporte 24/7", "Garantia 14 dias"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
