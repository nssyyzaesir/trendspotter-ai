import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const Topbar = () => {
  const { user, role } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden items-center md:flex">
          <div className="relative w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar produtos, nichos..."
              className="h-9 w-full rounded-full bg-muted/50 pl-9 text-sm focus-visible:bg-background"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {role === "admin" && (
          <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary md:inline-flex">
            Admin Area
          </span>
        )}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <ThemeToggle />
        <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-border bg-muted">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}`} 
            alt="User avatar" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
