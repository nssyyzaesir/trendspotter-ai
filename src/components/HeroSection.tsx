import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero pt-32 pb-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Radar de Produtos Virais do TikTok
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Descubra produtos virais{" "}
            <span className="text-gradient">antes de todos</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/60">
            Identifique produtos em tendência no TikTok com inteligência de dados. 
            Pare de pesquisar manualmente e comece a vender o que está viralizando.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                Explorar Tendências
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/10">
              Ver Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-8"
        >
          {[
            { icon: TrendingUp, label: "Produtos analisados", value: "12.4K+" },
            { icon: BarChart3, label: "Vídeos monitorados", value: "850K+" },
            { icon: Zap, label: "Tendências detectadas", value: "2.1K+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-accent" />
              <p className="font-display text-2xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-xs text-primary-foreground/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
