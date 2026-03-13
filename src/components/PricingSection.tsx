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
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
            Planos & <span className="text-gradient">Preços</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Escolha o plano ideal para o seu negócio e comece a identificar tendências antes da concorrência.
          </p>
        </motion.div>

        {/* Period selector */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`relative rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  period === p.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
                {p.save && (
                  <span className="ml-1.5 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    -{p.save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 ${
                plan.popular
                  ? "border-primary bg-card shadow-card-hover"
                  : "border-border bg-card shadow-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Mais Popular
                </div>
              )}
              <plan.icon className={`mb-4 h-8 w-8 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold">
                  R${plan.price[period]}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{period === "monthly" ? "mês" : period === "quarterly" ? "tri" : "ano"}
                </span>
              </div>

              <Link to="/auth">
                <Button
                  className={`mb-6 w-full ${
                    plan.popular
                      ? "bg-gradient-primary text-primary-foreground hover:opacity-90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Começar Agora
                </Button>
              </Link>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
