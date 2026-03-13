import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/10 py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-sm">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">TrendPulse</span>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Termos</a>
          <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Contato</a>
        </div>

        <p className="text-sm text-muted-foreground/80">
          © {new Date().getFullYear()} TrendPulse. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
