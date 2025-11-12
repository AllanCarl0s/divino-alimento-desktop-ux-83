import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logoDivino from '@/assets/LOGO_DIVINO_ALIMENTOS.png';

interface AppBarDivinoProps {
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  className?: string;
  showLoginButton?: boolean;
}

export const AppBarDivino = ({ children, leftContent, className, showLoginButton = false }: AppBarDivinoProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // Detecta se está em rota de consumidor ou fornecedor
    const isConsumerRoute = location.pathname === '/dashboard' || 
                           location.pathname.startsWith('/minhaCesta') || 
                           location.pathname.startsWith('/pedidoConsumidores');
    const isSupplierRoute = location.pathname.startsWith('/fornecedor');
    
    // Para rotas de consumidor, não faz nada ao clicar no logo
    if (isConsumerRoute) {
      return;
    }
    
    // Para rotas de fornecedor, volta para a loja
    if (isSupplierRoute) {
      navigate('/fornecedor/loja');
      return;
    }
    
    // Para rotas de admin
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/usuario')) {
      navigate('/admin/dashboard');
      return;
    }
    
    // Para outras rotas, volta para home
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "relative transition-shadow duration-300",
        "h-24 md:h-28", // 96px mobile / 112px tablet
        hasScrolled && "shadow-[0_2px_10px_rgba(0,0,0,0.08)]",
        className
      )}
      style={{
        backgroundColor: "#f7a418",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
      }}
    >
      {/* Trilho verde superior */}
      <div className="absolute top-0 left-0 w-full" style={{ height: '6px', backgroundColor: '#0d4622' }} />
      
      {/* Container principal */}
      <div className="relative h-full flex items-center justify-center px-4 md:px-5">
        {/* Botões à esquerda */}
        {leftContent && (
          <div className="absolute left-4 md:left-5 z-10 touch-target">
            {leftContent}
          </div>
        )}
        
        {/* Logo centralizado - Sempre perfeitamente no centro */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Verifica se está em rota de consumidor ou fornecedor para exibir logo circular */}
          {(location.pathname === '/dashboard' || 
            location.pathname.startsWith('/minhaCesta') || 
            location.pathname.startsWith('/pedidoConsumidores') ||
            location.pathname.startsWith('/fornecedor')) ? (
            <img 
              src="/assets/logo-divino-circular.png"
              alt="Divino Alimento"
              className="h-[72px] w-[72px] md:h-[84px] md:w-[84px] object-contain"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <button
              onClick={handleLogoClick}
              className="focus-ring rounded-lg transition-transform hover:scale-105 active:scale-95 pointer-events-auto"
            >
              <img 
                src="/lovable-uploads/075f4442-f5fb-4f92-a192-635abe87b383.png"
                alt="Divino Alimento - Alimento de Todo Mundo"
                className="h-auto max-w-[180px] md:max-w-[280px] lg:max-w-[340px] object-contain cursor-pointer"
                style={{ maxHeight: 'calc(100% - 16px)' }}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </button>
          )}
        </div>
        
        {/* Botões à direita */}
        {showLoginButton && (
          <div className="absolute right-4 md:right-5 z-10 touch-target">
            <Button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all duration-300"
            >
              Entrar / Cadastrar
            </Button>
          </div>
        )}
        {children && !showLoginButton && (
          <div className="absolute right-4 md:right-5 z-10 touch-target">
            {children}
          </div>
        )}
      </div>
      
      {/* Trilho verde inferior */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: '6px', backgroundColor: '#0d4622' }} />
    </header>
  );
};

export default AppBarDivino;