import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Monitoramos o TikTok",
    description: "Nossa IA analisa milhares de vídeos, hashtags e menções de produtos em tempo real.",
  },
  {
    number: "02",
    title: "Identificamos tendências",
    description: "Detectamos produtos com crescimento acelerado de engajamento e menções.",
  },
  {
    number: "03",
    title: "Você decide e vende",
    description: "Acesse o dashboard, veja os produtos em alta e comece a vender antes da concorrência.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            Simples e Rápido
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Como funciona
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Três passos simples para encontrar seu próximo produto viral antes que o mercado sature.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center md:text-left"
            >
              {/* Connector Line for Desktop */}
              {i < steps.length - 1 && (
                <div className="absolute left-[50%] top-8 hidden w-full -translate-y-1/2 border-t-2 border-dashed border-border/60 md:block lg:left-[60%]" />
              )}
              
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow md:mx-0">
                <span className="font-display text-2xl font-extrabold text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-3 font-display text-xl font-bold">{step.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
