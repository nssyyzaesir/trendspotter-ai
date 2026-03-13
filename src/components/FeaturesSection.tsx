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
    <section id="features" className="relative py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Recursos da Plataforma
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Tudo que você precisa para{" "}
            <span className="text-gradient block sm:inline">encontrar oportunidades</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Uma suíte completa de inteligência de mercado projetada para quem quer sair na frente e dominar as vendas no TikTok.
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
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Subtle background glow effect on hover */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-display text-xl font-bold">{feature.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
