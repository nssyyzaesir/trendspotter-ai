import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
            <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-semibold">TrendPulse</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 TrendPulse. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
