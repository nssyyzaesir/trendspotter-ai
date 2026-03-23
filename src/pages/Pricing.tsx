import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

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

const Pricing = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const { user, isPro } = useAuth();
  const navigate = useNavigate();

  const monthlyPrice = 29;
  const annualPrice = Math.round(monthlyPrice * 0.75); // 25% desconto

  const price = billing === "annual" ? annualPrice : monthlyPrice;

  return (
    <div className="min-h-screen bg-background data-grid">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" />
            Simples e transparente
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Escolha o plano certo para{" "}
            <span className="text-gradient">seu negócio</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece gratuitamente. Faça upgrade quando precisar de mais poder.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-muted p-1"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              billing === "monthly"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              billing === "annual"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Anual
            <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
              -25%
            </span>
          </button>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 text-left"
          >
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold">Grátis</h2>
              <p className="mt-1 text-sm text-muted-foreground">Para começar a explorar tendências</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">€0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>

            <ul className="mb-8 space-y-3">
              {FREE_FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{feat}</span>
                </li>
              ))}
            </ul>

            {user ? (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard">Entrar no Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth">Começar Grátis</Link>
              </Button>
            )}
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl p-8 text-left overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--secondary) / 0.12))",
              border: "1px solid hsl(var(--primary) / 0.4)",
              boxShadow: "0 0 40px hsl(var(--primary) / 0.15)",
            }}
          >
            {/* Popular badge */}
            <div className="absolute -right-8 top-6 rotate-45">
              <div className="bg-gradient-primary px-10 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                Popular
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold">Pro</h2>
                <Star className="h-4 w-4 fill-accent text-accent" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Para quem quer dominar o mercado</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-gradient">€{price}</span>
                <span className="text-muted-foreground">/{billing === "annual" ? "mês" : "mês"}</span>
              </div>
              {billing === "annual" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Cobrado anualmente (€{price * 12}/ano)
                </p>
              )}
            </div>

            <ul className="mb-8 space-y-3">
              {PRO_FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {isPro ? (
              <Button className="w-full bg-gradient-primary gap-2" disabled>
                <Shield className="h-4 w-4" />
                Você já é Pro!
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-primary gap-2 hover:opacity-90 transition-opacity"
                onClick={() => navigate(user ? "/checkout" : "/auth")}
                disabled={!user}
                id="upgrade-pro-btn"
              >
                <Zap className="h-4 w-4" />
                {user ? "Assinar Pro" : "Criar conta primeiro"}
              </Button>
            )}

            {!user && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">Crie uma conta</Link> para fazer upgrade
              </p>
            )}
          </motion.div>
        </div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          {["Pagamento seguro via Stripe", "Cancele a qualquer momento", "Suporte 24/7", "Sem compromisso"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
