import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero pt-32 pb-20 md:pt-40 lg:pb-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-12">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full text-center lg:w-1/2 lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/90 backdrop-blur-md">
              <Zap className="h-4 w-4 text-accent" />
              Radar de Produtos Virais do TikTok
            </div>

            <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Descubra produtos virais{" "}
              <span className="text-gradient">antes da concorrência</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70 lg:mx-0">
              A plataforma definitiva de inteligência de mercado para criadores e vendedores. 
              Identifique tendências ocultas, analise métricas de crescimento e encontre seu próximo produto vencedor.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link to="/auth">
                <Button size="lg" className="h-14 bg-gradient-primary px-8 text-base font-semibold text-white shadow-glow hover:opacity-90">
                  Começar Teste Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-md hover:bg-white/10">
                Ver Demonstração
              </Button>
            </div>
          </motion.div>

          {/* Visual/Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 w-full lg:mt-0 lg:w-1/2"
          >
            <div className="relative mx-auto max-w-lg rounded-2xl border border-white/10 bg-card/10 p-2 shadow-2xl backdrop-blur-xl lg:max-w-none">
              <div className="absolute -left-4 -top-4 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-[80px]" />
              
              {/* Fake Dashboard Header */}
              <div className="flex items-center gap-2 rounded-t-xl bg-background/40 p-3 backdrop-blur-md">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/80" />
                  <div className="h-3 w-3 rounded-full bg-accent/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto h-5 w-1/2 rounded-md bg-white/5" />
              </div>

              {/* Fake Dashboard Content */}
              <div className="rounded-b-xl bg-background/60 p-4 sm:p-6 backdrop-blur-md">
                <div className="mb-6 flex gap-4">
                  <div className="h-24 w-1/3 rounded-xl bg-primary/20 p-4">
                    <LineChart className="mb-2 h-5 w-5 text-primary" />
                    <div className="h-2 w-1/2 rounded bg-white/20" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-white/40" />
                  </div>
                  <div className="h-24 w-1/3 rounded-xl border border-white/5 bg-white/5 p-4">
                    <TrendingUp className="mb-2 h-5 w-5 text-accent" />
                    <div className="h-2 w-1/2 rounded bg-white/20" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-white/40" />
                  </div>
                  <div className="h-24 w-1/3 rounded-xl border border-white/5 bg-white/5 p-4">
                    <BarChart3 className="mb-2 h-5 w-5 text-secondary" />
                    <div className="h-2 w-1/2 rounded bg-white/20" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-white/40" />
                  </div>
                </div>

                {/* Fake List */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg bg-white/5 p-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-1/3 rounded bg-white/30" />
                        <div className="h-2 w-1/4 rounded bg-white/10" />
                      </div>
                      <div className="h-6 w-16 rounded-full bg-accent/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4"
        >
          {[
            { icon: TrendingUp, label: "Produtos monitorados", value: "2M+" },
            { icon: BarChart3, label: "Vídeos analisados", value: "15M+" },
            { icon: Zap, label: "Tendências detectadas", value: "8.5K+" },
            { icon: LineChart, label: "Precisão de predição", value: "94%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-accent opacity-80" />
              <p className="font-display text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
