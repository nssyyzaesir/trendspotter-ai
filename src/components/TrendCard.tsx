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
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <TrendBadge level={product.trendLevel} />
        </div>
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm">
          <span className="font-display text-sm font-bold text-primary">{product.score}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{product.category}</p>
        <h3 className="mb-3 font-display text-sm font-semibold leading-tight">{product.name}</h3>

        {/* Growth */}
        <div className="mb-3 flex items-center gap-1.5 text-sm">
          <TrendingUp className="h-3.5 w-3.5 text-accent" />
          <span className="font-semibold text-accent">+{product.growth}%</span>
          <span className="text-xs text-muted-foreground">crescimento</span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
          {[
            { icon: Eye, value: product.views, label: "Views" },
            { icon: MessageCircle, value: product.mentions, label: "Menções" },
            { icon: Share2, value: product.engagement, label: "Engaj." },
          ].map((metric, i) => (
            <div key={i} className="text-center">
              <metric.icon className="mx-auto mb-0.5 h-3 w-3 text-muted-foreground" />
              <p className="text-xs font-semibold">{metric.value}</p>
              <p className="text-[10px] text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendCard;
