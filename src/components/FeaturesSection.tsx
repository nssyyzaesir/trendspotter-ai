import { useRef } from "react";
import { Search, TrendingUp, BarChart3, Bell, Layers, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: TrendingUp,
    title: "Score de Viralização",
    description: "Cada produto recebe uma pontuação baseada em engajamento, crescimento e potencial de venda. Nosso algoritmo analisa padrões de 15M+ vídeos.",
    size: "large",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    number: "01",
  },
  {
    icon: Search,
    title: "Descoberta Automática",
    description: "Identifica produtos que aparecem com frequência crescente em vídeos virais do TikTok.",
    size: "small",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    number: "02",
  },
  {
    icon: BarChart3,
    title: "Métricas em Tempo Real",
    description: "Dados de crescimento e engajamento atualizados constantemente.",
    size: "small",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
    number: "03",
  },
  {
    icon: Bell,
    title: "Alertas de Tendência",
    description: "Receba notificações quando um produto começa a ganhar tração antes da saturação.",
    size: "small",
    gradient: "from-primary/20 to-accent/10",
    iconColor: "text-primary",
    number: "04",
  },
  {
    icon: Layers,
    title: "Categorias Organizadas",
    description: "Navegue por nichos específicos como beleza, tech, fitness e muito mais.",
    size: "small",
    gradient: "from-accent/20 to-primary/10",
    iconColor: "text-accent",
    number: "05",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Pare de gastar horas pesquisando. Encontre oportunidades em segundos.",
    size: "small",
    gradient: "from-secondary/20 to-accent/10",
    iconColor: "text-secondary",
    number: "06",
  },
];

const FeaturesSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".feature-card");
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
      }
    );
  }, []);

  const [large, ...smalls] = features;

  return (
    <section id="features" className="relative py-section overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
            Recursos da Plataforma
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Tudo que você precisa para{" "}
            <span className="text-gradient block sm:inline">encontrar oportunidades</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Uma suíte completa de inteligência de mercado para quem quer sair na frente e dominar as vendas no TikTok.
          </p>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {/* Large featured card */}
          <div className="feature-card lg:col-span-2 lg:row-span-1 group relative overflow-hidden rounded-3xl border-gradient-subtle p-8 transition-all duration-500 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${large.gradient} opacity-50 rounded-3xl`} />
            <div className="absolute -right-8 -top-8 font-display text-[140px] font-bold text-white/3 leading-none select-none">
              {large.number}
            </div>
            <div className="relative z-10">
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow`}>
                <large.icon className="h-7 w-7 text-background" />
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold">{large.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{large.description}</p>
              
              {/* Mini stats */}
              <div className="mt-8 flex gap-6">
                {[
                  { val: "99.2%", label: "Precisão" },
                  { val: "1h", label: "Atualização" },
                  { val: "15M+", label: "Vídeos" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-xl font-bold text-primary">{s.val}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Small cards */}
          {smalls.map((feature, i) => (
            <div
              key={i}
              className="feature-card group relative overflow-hidden rounded-3xl border-gradient-subtle p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-30 rounded-3xl transition-opacity group-hover:opacity-60`} />
              <div className="absolute -right-4 -top-4 font-display text-[80px] font-bold text-white/3 leading-none select-none">
                {feature.number}
              </div>
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 border border-border/50">
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-2.5 font-display text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
