import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Hash, PlaySquare, Heart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: TrendingUp, label: "Produtos em Tendência", path: "/trends" },
  { icon: Hash, label: "Nichos em Alta", path: "/niches" },
  { icon: PlaySquare, label: "Vídeos Virais", path: "/videos" },
  { icon: Heart, label: "Favoritos", path: "/favorites" },
];

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight">TrendPulse</span>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Menu Principal
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 px-4 mt-8">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Sistema
          </p>
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Configurações
          </Link>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
