import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Favorites = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Favoritos</h1>
        <p className="text-muted-foreground mt-1">Seus produtos salvos para acompanhamento.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Heart className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="mb-2 font-display text-xl font-bold">Nenhum favorito ainda</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Explore os produtos em tendência e salve os que mais te interessam para acompanhar de perto.
        </p>
        <Link to="/trends">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Explorar Produtos
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default Favorites;
