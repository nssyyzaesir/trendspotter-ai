import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Hash, PlaySquare, Heart, Settings, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: TrendingUp, label: "Produtos em Tendência", path: "/trends" },
  { icon: Hash, label: "Nichos em Alta", path: "/niches" },
  { icon: PlaySquare, label: "Vídeos Virais", path: "/videos" },
  { icon: Heart, label: "Favoritos", path: "/favorites" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, role } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleNav = (path: string) => {
    onClose?.();
    navigate(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:z-40 flex md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
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
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="space-y-1 px-4 mt-8">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Sistema
            </p>
            {role === "admin" && (
              <button
                onClick={() => handleNav("/admin")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  location.pathname === "/admin"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Painel Admin
              </button>
            )}
            <button
              onClick={() => handleNav("/settings")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                location.pathname === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </button>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
