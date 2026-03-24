import { useState, useRef } from "react";
import { TrendingUp, Eye, MessageCircle, Share2, Star } from "lucide-react";
import TrendBadge from "./TrendBadge";

export interface TrendProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  trendLevel: "hot" | "rising" | "new";
  score: number;
  growth: number;
  views: string;
  mentions: string;
  engagement: string;
}

const SCORE_COLOR = (score: number) => {
  if (score >= 90) return "text-red-400 bg-red-400/15";
  if (score >= 75) return "text-orange-400 bg-orange-400/15";
  if (score >= 60) return "text-primary bg-primary/15";
  return "text-muted-foreground bg-muted";
};

const TrendCard = ({ product }: { product: TrendProduct }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setRotation({ x: x * -8, y: y * 8 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const scoreClass = SCORE_COLOR(product.score);
  const circumference = 2 * Math.PI * 18;
  const strokeDash = circumference - (product.score / 100) * circumference;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-300 cursor-pointer"
      style={{
        transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? "scale(1.02)" : "scale(1)"}`,
        boxShadow: isHovered ? "var(--shadow-card-hover)" : undefined,
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Gradient hover overlay */}
      <div className={`absolute inset-0 bg-gradient-card-hover rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=0a0e1a&color=00f5ff&size=48`;
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="line-clamp-1 font-display text-sm font-bold leading-tight group-hover:text-primary transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">{product.category}</p>
            </div>
          </div>

          {/* Circular TrendScore */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width="44" height="44" className="rotate-[-90deg]">
              <circle cx="22" cy="22" r="18" strokeWidth="2.5" fill="none" stroke="hsl(var(--border))" />
              <circle
                cx="22" cy="22" r="18"
                strokeWidth="2.5"
                fill="none"
                stroke={product.score >= 90 ? "#f87171" : product.score >= 75 ? "#fb923c" : "hsl(183 100% 50%)"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <span className="absolute font-display text-[11px] font-bold">
              {product.score}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <TrendBadge level={product.trendLevel} />
          <div className="flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">
            <TrendingUp className="h-3 w-3" />
            +{product.growth}%
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-surface-1 border border-border/30 p-3">
          {[
            { icon: Eye, value: product.views, label: "Views" },
            { icon: MessageCircle, value: product.mentions, label: "Menções" },
            { icon: Share2, value: product.engagement, label: "Engaj." },
          ].map((metric, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <metric.icon className="mb-1 h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="font-display text-xs font-bold">{metric.value}</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover action */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 p-4 pt-6 bg-gradient-to-t from-card via-card/95 to-transparent">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-bold text-background shadow-glow hover:opacity-85 transition-opacity">
          <Star className="h-3.5 w-3.5 fill-current" />
          Ver análise completa
        </button>
      </div>
    </div>
  );
};

export default TrendCard;
