import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MobileLayout>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-poppins text-4xl font-bold mb-4 text-gradient-primary">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Página não encontrada</p>
          <p className="text-sm text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => window.location.href = '/'}
            className="focus-ring"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
