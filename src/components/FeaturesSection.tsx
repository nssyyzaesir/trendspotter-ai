import { motion } from "framer-motion";
import { Search, TrendingUp, BarChart3, Bell, Layers, Clock } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Descoberta Automática",
    description: "Identifica produtos que aparecem com frequência crescente em vídeos virais do TikTok.",
  },
  {
    icon: TrendingUp,
    title: "Score de Viralização",
    description: "Cada produto recebe uma pontuação baseada em engajamento, crescimento e potencial de venda.",
  },
  {
    icon: BarChart3,
    title: "Métricas em Tempo Real",
    description: "Visualize dados de crescimento, menções e engajamento atualizados constantemente.",
  },
  {
    icon: Bell,
    title: "Alertas de Tendência",
    description: "Receba notificações quando um produto começa a ganhar tração antes da saturação.",
  },
  {
    icon: Layers,
    title: "Categorias Organizadas",
    description: "Navegue por nichos específicos como beleza, tech, fitness e mais.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Pare de gastar horas pesquisando manualmente. Encontre oportunidades em segundos.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Tudo que você precisa para{" "}
            <span className="text-gradient">encontrar oportunidades</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Ferramentas inteligentes para identificar produtos com potencial de viralização no TikTok.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
