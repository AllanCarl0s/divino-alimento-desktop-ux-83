import React from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // Se estiver na página dashboard, não faz nada
    if (location.pathname === '/dashboard') {
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

  return (
    <header 
      className={cn(
        "relative w-full bg-[#F29B2C] flex items-center justify-center",
        "h-20 lg:h-28", // Same as Home
        className
      )}
    >
      {/* Logo sobreposto - centralizado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 lg:mt-14">
        {location.pathname === '/dashboard' || location.pathname === '/fornecedor/loja' ? (
          <img 
            src={logoDivino}
            alt="Divino Alimento"
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
              alt="Divino Alimento"
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

      {/* Botões à esquerda */}
      {leftContent && (
        <div className="absolute left-4 md:left-5 z-10">
          {leftContent}
        </div>
      )}
      
      {/* Botões à direita */}
      {showLoginButton && (
        <div className="absolute right-4 md:right-5 z-10">
          <Button
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            Entrar / Cadastrar
          </Button>
        </div>
      )}
      {children && !showLoginButton && (
        <div className="absolute right-4 md:right-5 z-10">
          {children}
        </div>
      )}
    </header>
  );
};

export default AppBarDivino;