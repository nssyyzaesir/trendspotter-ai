import { lazy, Suspense, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, BarChart3, LineChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { animateTextReveal, animateCardEntry } from "@/lib/gsapAnimations";

const GlobeScene = lazy(() =>
  import("@/components/3d/GlobeScene").then((m) => ({ default: m.GlobeScene }))
);

const STATS = [
  { icon: TrendingUp, label: "Produtos monitorados", value: "2M+", color: "text-primary" },
  { icon: BarChart3, label: "Vídeos analisados", value: "15M+", color: "text-accent" },
  { icon: Zap, label: "Tendências detectadas", value: "8.5K+", color: "text-secondary" },
  { icon: Users, label: "Vendedores ativos", value: "12K+", color: "text-primary" },
];

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      animateTextReveal(titleRef.current, 0.5);
      animateCardEntry(statRefs.current, 1.0);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Hero gradient background */}
      <div className="absolute inset-0 bg-background bg-hero" />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[15%] top-[20%] h-[700px] w-[700px] rounded-full bg-primary/10 blur-[160px] animate-pulse-glow" />
        <div className="absolute right-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-accent/8 blur-[120px]" />
        <div className="absolute left-[40%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-secondary/8 blur-[100px]" />
      </div>

      {/* Dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 dot-grid opacity-30" />

      <div className="container relative z-10 mx-auto px-4 py-32 lg:py-20">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">

          {/* ── Left: Text Content ── */}
          <div className="w-full flex-1 text-center lg:text-left lg:max-w-[56%]">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/8 px-5 py-2 text-sm font-semibold text-white/85 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Radar de Produtos Virais do TikTok
            </motion.div>

            {/* Headline */}
            <h1
              ref={titleRef}
              className="mb-7 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Descubra produtos virais antes da concorrência
            </h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-white/55 lg:mx-0"
            >
              Dashboard de inteligência de mercado em tempo real.
              TrendScore™ proprietário, cena 3D e dados do TikTok atualizados a cada hora.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link to="/auth" id="hero-cta-btn">
                <Button
                  size="lg"
                  className="h-14 bg-gradient-primary px-9 text-base font-bold text-white shadow-glow hover:opacity-85 hover:shadow-glow transition-all duration-300 group rounded-xl"
                >
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 border-white/15 bg-white/4 px-9 text-base text-white/80 backdrop-blur-md hover:bg-white/8 hover:border-white/30 hover:text-white transition-all duration-300 rounded-xl"
                >
                  Ver Planos
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-sm text-white/35"
            >
              ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ 14 dias grátis &nbsp;·&nbsp; ✓ Cancele quando quiser
            </motion.p>
          </div>

          {/* ── Right: Globe 3D ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full lg:w-[44%] shrink-0"
          >
            {/* Glow ring behind globe */}
            <div className="absolute inset-0 rounded-full blur-[80px] bg-primary/15 scale-75" />

            <Suspense fallback={
              <div className="aspect-square w-full flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-primary animate-ping" />
              </div>
            }>
              <GlobeScene className="aspect-square w-full max-w-[480px] mx-auto" />
            </Suspense>

            {/* Floating data card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-8 -left-4 glass-panel rounded-2xl p-4 min-w-[160px] shadow-glow hidden lg:block"
            >
              <p className="text-xs text-white/50 mb-1">TrendScore™ Médio</p>
              <p className="font-display text-2xl font-bold text-primary">87.4</p>
              <p className="text-xs text-primary/60 mt-1">▲ +12% esta semana</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-12 -right-4 glass-panel rounded-2xl p-4 min-w-[160px] hidden lg:block"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-white/50">Live</p>
              </div>
              <p className="font-display text-xl font-bold text-white">2.4K</p>
              <p className="text-xs text-white/40 mt-1">produtos ativos agora</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto mt-24 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              ref={(el) => { statRefs.current[i] = el; }}
              className="text-center"
            >
              <stat.icon className={`mx-auto mb-3 h-5 w-5 ${stat.color} opacity-60`} />
              <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-white/35">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
