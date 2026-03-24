import { useRef, useEffect } from "react";
import { Database, Cpu, BarChart2, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateSvgDraw } from "@/lib/gsapAnimations";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Database,
    title: "Coleta de Dados",
    description: "Monitoramos milhões de vídeos do TikTok em tempo real usando scrapers automatizados.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  {
    icon: Cpu,
    title: "Processamento IA",
    description: "Nossos modelos de ML identificam padrões de viralização e calculam o TrendScore™.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
  },
  {
    icon: BarChart2,
    title: "Análise de Mercado",
    description: "Cruzamos dados com preços, margens e volume de busca para ranquear oportunidades.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/30",
  },
  {
    icon: Zap,
    title: "Insights no Dashboard",
    description: "Você recebe tendências prontas para agir, com alertas instantâneos no app.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate steps
    gsap.fromTo(
      stepsRef.current.filter(Boolean),
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      }
    );

    // SVG line draw
    animateSvgDraw(lineRef.current, 0.3);
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-section overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-1/40 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-sm font-semibold text-accent">
            Como Funciona
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Do dado bruto ao{" "}
            <span className="text-gradient">insight acionável</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Em menos de 60 minutos, transformamos dados crus do TikTok em oportunidades de mercado prontas para você agir.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-[52px] left-0 right-0 hidden lg:block overflow-hidden h-px">
            <svg className="w-full h-8" viewBox="0 0 100 8" preserveAspectRatio="none">
              <path
                ref={lineRef}
                d="M 6 4 Q 25 1 50 4 Q 75 7 94 4"
                stroke="url(#lineGrad)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(183 100% 50%)" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="hsl(258 90% 66%)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(340 100% 55%)" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                {/* Icon */}
                <div className={`relative z-10 mb-6 flex h-[56px] w-[56px] items-center justify-center rounded-2xl border ${step.border} ${step.bg} shadow-lg`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                  <div className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-3 border border-border/50 text-[10px] font-bold text-muted-foreground`}>
                    {i + 1}
                  </div>
                </div>

                <h3 className="mb-3 font-display text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-px w-12 bg-border" />
            Processo automatizado 24/7 — sem intervenção manual
            <span className="h-px w-12 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
