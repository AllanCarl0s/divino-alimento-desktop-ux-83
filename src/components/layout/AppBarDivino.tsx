import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logoDivino from '@/assets/logo-divino-alimentos.png';

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
    // Se estiver nas páginas home de cada perfil, não faz nada
    const homePages = ['/dashboard', '/fornecedor/loja'];
    if (homePages.includes(location.pathname)) {
      return;
    }
    
    // Páginas que devem voltar para /dashboard
    const dashboardPages = ['/relatorio', '/cesta', '/resumo', '/pagamentos', '/configuracoes'];
    if (dashboardPages.includes(location.pathname)) {
      navigate('/dashboard');
      return;
    }
    
    // Detecta se está em rota de fornecedor e navega para a home apropriada
    if (location.pathname.startsWith('/fornecedor')) {
      navigate('/fornecedor/loja');
    } else if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/usuario')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Faixa branca superior */}
      <div className="h-12 lg:h-16 bg-white" />
      
      {/* Header laranja com logo sobreposto - igual à Home */}
      <header 
        className={cn(
          "relative h-20 lg:h-28 flex items-center justify-center transition-shadow duration-300",
          hasScrolled && "shadow-[0_2px_10px_rgba(0,0,0,0.08)]",
          className
        )}
        style={{
          backgroundColor: "#F29B2C",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          paddingLeft: "max(16px, env(safe-area-inset-left))",
          paddingRight: "max(16px, env(safe-area-inset-right))",
        }}
      >
        {/* Botões à esquerda (se houver) */}
        {leftContent && (
          <div className="absolute left-4 md:left-5 z-10 touch-target">
            {leftContent}
          </div>
        )}
        
        {/* Logo centralizado e sobreposto - igual à Home */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 lg:mt-14">
          {['/dashboard', '/fornecedor/loja'].includes(location.pathname) ? (
            <img 
              src={logoDivino}
              alt="Divino Alimento - Alimento de Todo Mundo"
              className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <button
              onClick={handleLogoClick}
              className="focus-ring rounded-lg transition-transform hover:scale-105 active:scale-95"
            >
              <img 
                src={logoDivino}
                alt="Divino Alimento - Alimento de Todo Mundo"
                className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain cursor-pointer"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </button>
          )}
        </div>
        
        {/* Avatar à direita */}
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
      </header>
    </>
  );
};

export default AppBarDivino;