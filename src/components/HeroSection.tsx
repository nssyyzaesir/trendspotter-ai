import { lazy, Suspense, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, BarChart3, LineChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { animateTextReveal, animateCardEntry } from "@/lib/gsapAnimations";

// Lazy load Three.js particles para não bloquear LCP
const DataParticles = lazy(() =>
  import("@/components/3d/DataParticles").then((m) => ({ default: m.DataParticles }))
);

const STATS = [
  { icon: TrendingUp, label: "Produtos monitorados", value: "2M+" },
  { icon: BarChart3, label: "Vídeos analisados", value: "15M+" },
  { icon: Zap, label: "Tendências detectadas", value: "8.5K+" },
  { icon: Users, label: "Vendedores activos", value: "12K+" },
];

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Atraso leve para garantir DOM montado
    const t = setTimeout(() => {
      animateTextReveal(titleRef.current, 0.3);
      animateCardEntry(statRefs.current, 0.6);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-hero flex items-center">
      {/* DataParticles 3D no fundo */}
      <Suspense fallback={null}>
        <DataParticles className="absolute inset-0 z-0 opacity-70" />
      </Suspense>

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-primary/25 blur-[140px] animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[100px]" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      {/* Data grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 data-grid opacity-20" />

      <div className="container relative z-10 mx-auto px-4 py-28">
        <div className="flex flex-col items-center lg:flex-row lg:gap-16">

          {/* Text Content */}
          <div className="w-full flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md"
            >
              <Zap className="h-4 w-4 text-accent fill-accent" />
              Radar de Produtos Virais do TikTok
            </motion.div>

            <h1
              ref={titleRef}
              className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Descubra produtos virais{" "}
              <span className="text-gradient">antes da concorrência</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mx-auto mb-10 max-w-xl text-lg text-white/70 lg:mx-0"
            >
              Dashboard de inteligência de mercado em tempo real.
              TrendScore™ proprietário, animações 3D e dados do TikTok atualizados a cada hora.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link to="/auth" id="hero-cta-btn">
                <Button
                  size="lg"
                  className="h-14 bg-gradient-primary px-8 text-base font-bold text-white shadow-glow hover:opacity-90 hover:shadow-xl transition-all group"
                >
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all"
                >
                  Ver Planos
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-5 text-sm text-white/40"
            >
              ✓ Sem cartão de crédito · ✓ 14 dias grátis · ✓ Cancele quando quiser
            </motion.p>
          </div>

          {/* Hero visual: animated dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
            className="mt-16 w-full lg:mt-0 lg:w-5/12 shrink-0"
          >
            <div className="relative mx-auto max-w-md rounded-2xl border border-white/10 bg-card/10 p-2 shadow-2xl backdrop-blur-xl">
              <div className="neon-glow absolute -inset-px rounded-2xl opacity-30" />

              {/* Window chrome */}
              <div className="flex items-center gap-2 rounded-t-xl bg-white/5 p-3">
                <div className="flex gap-1.5">
                  {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c) => (
                    <div key={c} className={`h-3 w-3 rounded-full ${c} opacity-80`} />
                  ))}
                </div>
                <div className="mx-auto h-5 w-2/5 rounded-md bg-white/10 text-center">
                  <span className="text-[9px] text-white/40 leading-5">fluxmetric.io/dashboard</span>
                </div>
              </div>

              {/* Fake dashboard content */}
              <div className="rounded-b-xl bg-black/30 p-4 backdrop-blur-md space-y-3">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Score Médio", val: "87", color: "text-primary" },
                    { label: "Tendências", val: "+43%", color: "text-accent" },
                    { label: "Produtos", val: "2.4K", color: "text-secondary" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-white/5 p-2.5 text-center">
                      <div className={`font-display text-lg font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-[9px] text-white/40">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Trend bars */}
                <div className="rounded-lg bg-white/5 p-3 space-y-2">
                  {[
                    { name: "Mini Projetor LED", score: 97, color: "bg-red-400" },
                    { name: "Sérum Vitamina C", score: 94, color: "bg-orange-400" },
                    { name: "Ring Light Pro", score: 82, color: "bg-primary" },
                    { name: "Garrafa Térmica", score: 75, color: "bg-blue-400" },
                  ].map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-4 text-[9px] font-bold text-white/30">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[10px] text-white/60">{item.name}</span>
                          <span className={`text-[10px] font-bold ${item.color.replace("bg-", "text-")}`}>{item.score}</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.7 }}
                            className={`h-full rounded-full ${item.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live indicator */}
                <div className="flex items-center justify-end gap-1.5 text-[9px] text-white/30">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Actualizado há 2 min
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              ref={(el) => { statRefs.current[i] = el; }}
              className="text-center"
            >
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-accent opacity-70" />
              <p className="font-display text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
