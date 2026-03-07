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
    <section id="how-it-works" className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Três passos simples para encontrar seu próximo produto viral.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary font-display text-xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
