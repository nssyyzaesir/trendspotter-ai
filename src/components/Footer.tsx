import { Link } from "react-router-dom";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";

const LINKS = {
  product: [
    { label: "Recursos", href: "/#features" },
    { label: "Como Funciona", href: "/#how-it-works" },
    { label: "Preços", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  company: [
    { label: "Sobre Nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Afiliados", href: "#" },
    { label: "Contato", href: "#" },
  ],
  legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

const Footer = () => (
  <footer className="relative border-t border-border/40 py-16 overflow-hidden">
    <div className="absolute inset-0 dot-grid opacity-10" />

    <div className="container relative z-10 mx-auto px-4">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-4 w-4 text-background" fill="currentColor" />
            </div>
            <span className="font-display text-xl font-bold">
              Trend<span className="text-gradient">Spotter</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
            Inteligência de mercado em tempo real para vendedores do TikTok Shop.
          </p>
          <div className="mt-6 flex gap-3">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[["Produto", LINKS.product], ["Empresa", LINKS.company], ["Legal", LINKS.legal]].map(([title, links]) => (
          <div key={title as string}>
            <p className="mb-4 text-sm font-semibold text-foreground">{title as string}</p>
            <ul className="space-y-3">
              {(links as { label: string; href: string }[]).map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
        <p className="text-xs text-muted-foreground">© 2026 TrendSpotter. Todos os direitos reservados.</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          Pagamentos processados por{" "}
          <span className="font-semibold text-foreground/70">Stripe</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
