import { Flame, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type TrendLevel = "hot" | "rising" | "new" | "saturated";

const config: Record<TrendLevel, { label: string; icon: typeof Flame; className: string }> = {
  hot: {
    label: "Em Alta",
    icon: Flame,
    className: "bg-destructive/15 text-destructive border-destructive/20",
  },
  rising: {
    label: "Crescendo",
    icon: TrendingUp,
    className: "bg-accent/15 text-accent border-accent/20",
  },
  new: {
    label: "Novo",
    icon: Zap,
    className: "bg-primary/15 text-primary border-primary/20",
  },
  saturated: {
    label: "Saturado",
    icon: AlertTriangle,
    className: "bg-muted text-muted-foreground border-border",
  },
};

interface TrendBadgeProps {
  level: TrendLevel;
}

const TrendBadge = ({ level }: TrendBadgeProps) => {
  const entry = config[level] || config.new;
  const { label, icon: Icon, className } = entry;

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

export default TrendBadge;
