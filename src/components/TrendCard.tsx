import { TrendingUp, Eye, MessageCircle, Share2 } from "lucide-react";
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

const TrendCard = ({ product }: { product: TrendProduct }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/50 hover:z-10 bg-opacity-80 backdrop-blur-sm">
      {/* Top Section */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/50">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div>
            <h3 className="line-clamp-1 font-display text-base font-bold leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-display font-bold">
            {product.score}
          </div>
          <span className="mt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Score</span>
        </div>
      </div>

      {/* Tags / Status */}
      <div className="mb-4 flex items-center gap-2">
        <TrendBadge level={product.trendLevel} />
        <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
          <TrendingUp className="h-3 w-3" />
          +{product.growth}%
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-auto grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3">
        {[
          { icon: Eye, value: product.views, label: "Views" },
          { icon: MessageCircle, value: product.mentions, label: "Menções" },
          { icon: Share2, value: product.engagement, label: "Engaj." },
        ].map((metric, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center">
            <metric.icon className="mb-1 h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="font-display text-xs font-bold text-foreground">{metric.value}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{metric.label}</span>
          </div>
        ))}
      </div>

      {/* Action Hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background via-background/95 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-glow">
          Ver análise completa
        </button>
      </div>
    </div>
  );
};

export default TrendCard;
