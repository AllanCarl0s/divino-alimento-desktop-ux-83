import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

// Rotas públicas que não requerem autenticação
const PUBLIC_ROUTES = ['/', '/login', '/registro', '/fornecedor/login'];

// Definição de rotas permitidas por perfil
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  consumidor: [
    '/dashboard',
    '/minhaCesta/1',
    '/consumidor/selecionar-ciclo',
    '/pedidoConsumidores/*',
    '/consumidor/pagamentos',
    '/consumidor/relatorio-pedidos',
    '/consumidor/relatorio-pedidos-resultado/*',
    '/usuario/1',
  ],
  fornecedor: [
    '/fornecedor/loja',
    '/fornecedor/selecionar-ciclo',
    '/fornecedor/selecionar-ciclo-entregas',
    '/oferta/*',
    '/fornecedor/entregas/*',
    '/usuario/1',
  ],
  admin: [
    '/admin/*',
    '/oferta/*',
    '/usuario-index',
    '/usuario/1',
    '/usuario',
  ],
  admin_mercado: [
    '/adminmercado/*',
    '/adminmercado/relatorios/fornecedores-ciclo',
    '/adminmercado/relatorios/consumidores-ciclo',
    '/oferta/*',
    '/usuario/*',
  ],
};

// Função para verificar se a rota é permitida para o role
const isRouteAllowed = (pathname: string, role: UserRole | null): boolean => {
  // Rotas públicas sempre permitidas
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  
  if (!role) return false;
  
  const allowedRoutes = ROUTE_PERMISSIONS[role] || [];
  
  // Verifica correspondência exata ou se a rota começa com um padrão permitido
  return allowedRoutes.some(route => {
    if (pathname === route) return true;
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    // Permite subrotas (ex: /oferta/123)
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });
};

// Função para obter a rota padrão de cada perfil
const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'consumidor':
      return '/dashboard';
    case 'fornecedor':
      return '/fornecedor/loja';
    case 'admin':
      return '/admin/dashboard';
    case 'admin_mercado':
      return '/adminmercado/dashboard';
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const { user, isAuthenticated, activeRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    // Se a rota requer autenticação e o usuário não está autenticado
    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      navigate('/login');
      return;
    }

    // Se o usuário está autenticado
    if (isAuthenticated && activeRole) {
      // Verifica se a rota é permitida para o activeRole do usuário
      if (!isRouteAllowed(location.pathname, activeRole)) {
        const defaultRoute = getDefaultRoute(activeRole);
        
        toast({
          title: "Acesso não autorizado",
          description: "Você não tem permissão para acessar esta página. Redirecionado para seu painel.",
          variant: "destructive",
        });

        navigate(defaultRoute, { replace: true });
        return;
      }

      // Se há roles específicos permitidos, verifica
      if (allowedRoles && !allowedRoles.includes(activeRole)) {
        const defaultRoute = getDefaultRoute(activeRole);
        navigate(defaultRoute, { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, activeRole, location.pathname, navigate, toast, allowedRoles, requireAuth]);

  return <>{children}</>;
};
