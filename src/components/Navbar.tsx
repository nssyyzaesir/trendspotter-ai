import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Recursos", href: "/#features" },
  { label: "Como Funciona", href: "/#how-it-works" },
  { label: "Preços", href: "/pricing" },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Scroll-aware blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        ref={navRef}
        className={`w-full max-w-5xl rounded-2xl transition-all duration-500 ${
          scrolled
            ? "glass-panel shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="flex h-[60px] items-center justify-between px-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Zap className="h-4 w-4 text-background" fill="currentColor" />
              <div className="absolute inset-0 rounded-lg bg-primary/30 blur-md group-hover:blur-lg transition-all" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Trend<span className="text-gradient">Spotter</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="sm"
                  className="bg-gradient-primary text-background font-bold rounded-xl h-9 px-5 hover:opacity-85 transition-opacity"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/8 rounded-xl h-9 px-4"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button
                    size="sm"
                    className="bg-gradient-primary text-background font-bold rounded-xl h-9 px-5 hover:opacity-85 transition-opacity relative overflow-hidden group"
                  >
                    <span className="relative z-10">Começar Grátis</span>
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-5 pb-5 pt-2 space-y-2 border-t border-border/40">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-gradient-primary text-background font-bold rounded-xl">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl border-border/50">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-primary text-background font-bold rounded-xl">
                      Começar Grátis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
