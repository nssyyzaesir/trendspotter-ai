import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: { monthly: 29, quarterly: 79, yearly: 249 },
    description: "Perfeito para iniciantes",
    features: [
      "Até 50 produtos monitorados",
      "Atualizações diárias",
      "Relatórios básicos",
      "Suporte por email",
    ],
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: { monthly: 79, quarterly: 199, yearly: 699 },
    description: "Para vendedores sérios",
    features: [
      "Até 500 produtos monitorados",
      "Atualizações em tempo real",
      "Relatórios avançados com IA",
      "Alertas de tendência",
      "Análise de concorrência",
      "Suporte prioritário",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Rocket,
    price: { monthly: 199, quarterly: 499, yearly: 1799 },
    description: "Para equipes e agências",
    features: [
      "Produtos ilimitados",
      "API completa",
      "Relatórios white-label",
      "Múltiplos usuários",
      "Webhooks personalizados",
      "Gerente de conta dedicado",
      "SLA garantido",
    ],
    popular: false,
  },
];

const periods = [
  { key: "monthly" as const, label: "Mensal" },
  { key: "quarterly" as const, label: "Trimestral", save: "10%" },
  { key: "yearly" as const, label: "Anual", save: "30%" },
];

import { useState } from "react";

const PricingSection = () => {
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  return (
    <section id="pricing" className="relative py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Planos e Preços
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Invista no seu <span className="text-gradient">crescimento</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Escolha o plano ideal e comece a identificar produtos virais antes da concorrência, multiplicando suas vendas.
          </p>
        </motion.div>

        {/* Period Selector Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-card p-1.5 shadow-sm">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`relative flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  period === p.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {p.label}
                {p.save && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      period === p.key
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    -{p.save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 lg:gap-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col overflow-hidden rounded-3xl border ${
                plan.popular
                  ? "border-primary/50 bg-card shadow-xl shadow-primary/10 md:-mt-8 md:mb-8"
                  : "border-border/50 bg-card shadow-sm mt-0"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 flex w-full justify-center bg-gradient-primary py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  O Mais Escolhido
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? "pt-12" : ""}`}>
                <div className="mb-6 flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-8 flex items-end gap-2">
                  <span className="font-display text-5xl font-extrabold tracking-tight">
                    R${plan.price[period]}
                  </span>
                  <span className="mb-1 text-sm font-medium text-muted-foreground">
                    /{period === "monthly" ? "mês" : period === "quarterly" ? "trimestre" : "ano"}
                  </span>
                </div>

                <Link to="/auth" className="block w-full">
                  <Button
                    size="lg"
                    className={`w-full rounded-xl h-12 text-base font-semibold ${
                      plan.popular
                        ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>

              <div className="flex-1 bg-muted/20 p-8 pt-6 border-t border-border/50">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">O que está incluído:</p>
                <ul className="space-y-4">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
