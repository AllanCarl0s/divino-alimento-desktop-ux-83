import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { activeRole } = useAuth();

  const handleLogoClick = () => {
    // Usa o perfil ativo para determinar para onde navegar
    switch (activeRole) {
      case 'consumidor':
        navigate('/dashboard');
        break;
      case 'fornecedor':
        navigate('/fornecedor/loja');
        break;
      case 'admin_mercado':
        navigate('/adminmercado/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleVoltar = () => {
    // Redirecionar baseado no perfil ativo
    switch (activeRole) {
      case 'consumidor':
        navigate('/dashboard');
        break;
      case 'fornecedor':
        navigate('/fornecedor/loja');
        break;
      case 'admin_mercado':
        navigate('/adminmercado/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Identifica rotas de consumidor/fornecedor que devem usar layout da home
  const isHomeStyleRoute = 
    location.pathname === '/dashboard' || 
    location.pathname.startsWith('/minhaCesta') ||
    location.pathname.startsWith('/pedidoConsumidores') ||
    location.pathname.startsWith('/fornecedor') ||
    location.pathname.startsWith('/usuario/') ||
    location.pathname.startsWith('/oferta/') ||
    location.pathname.startsWith('/consumidor/selecionar-ciclo') ||
    location.pathname.startsWith('/consumidor/relatorio-pedidos');

  // Layout idêntico à página inicial (/) para consumidor e fornecedor
  if (isHomeStyleRoute) {
    return (
      <>
        {/* Faixa branca superior - EXATAMENTE igual à home */}
        <div className="h-12 lg:h-16 bg-white" />
        
        {/* Header laranja com logo sobreposto - EXATAMENTE igual à home */}
        <header 
          className="relative h-20 lg:h-28 bg-[#F29B2C] flex items-center justify-center"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {/* Logo circular sobreposto - mesma posição, tamanho e sombra da home */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 lg:mt-14 z-20">
            <button
              onClick={handleLogoClick}
              className="hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
              aria-label="Voltar para o início"
            >
              <img 
                src="/assets/logo-divino-circular.png"
                alt="Divino Alimento"
                className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </button>
          </div>

          {/* Botão de voltar - canto superior esquerdo */}
          {leftContent ? (
            <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10">
              {leftContent}
            </div>
          ) : location.pathname !== '/dashboard' && !location.pathname.startsWith('/fornecedor/loja') && (
            <button
              onClick={handleVoltar}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 text-white hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded-full p-2"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          {/* Avatar do usuário - centralizado verticalmente na faixa laranja */}
          {children && (
            <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 touch-target">
              {children}
            </div>
          )}
        </header>
      </>
    );
  }

  // Header padrão para admin, admin de mercado e outras rotas
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
        
        {/* Logo centralizado */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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