import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

// Definição de rotas permitidas por perfil
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  consumidor: [
    '/',
    '/login',
    '/registro',
    '/dashboard',
    '/minhaCesta/1',
    '/pedidoConsumidores/1',
    '/consumidor/relatorio/1',
    '/consumidor/pagamentos',
    '/usuario/1',
  ],
  fornecedor: [
    '/',
    '/fornecedor/login',
    '/fornecedor/onboarding',
    '/fornecedor/loja',
    '/fornecedor/produtos',
    '/fornecedor/pedidos-aberto',
    '/fornecedor/painel-gestao',
    '/fornecedor/configuracoes',
    '/fornecedor/cronograma',
    '/fornecedor/produtos-vencidos',
    '/fornecedor/relatorio-entregas',
    '/fornecedor/entregas',
    '/fornecedor/pagamentos',
    '/oferta',
  ],
  admin: [
    '/',
    '/admin',
  ],
  admin_mercado: [
    '/',
    '/admin-mercado',
  ],
};

// Função para verificar se a rota é permitida para o role
const isRouteAllowed = (pathname: string, role: UserRole): boolean => {
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
      return '/admin-mercado/dashboard';
    default:
      return '/';
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/', '/login', '/registro', '/fornecedor/login'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    // Se a rota requer autenticação e o usuário não está autenticado
    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      navigate('/login');
      return;
    }

    // Se o usuário está autenticado
    if (isAuthenticated && user?.role) {
      // Verifica se a rota é permitida para o role do usuário
      if (!isRouteAllowed(location.pathname, user.role)) {
        const defaultRoute = getDefaultRoute(user.role);
        
        toast({
          title: "Acesso não autorizado",
          description: "Você não tem permissão para acessar esta página. Redirecionado para seu painel principal.",
          variant: "destructive",
        });

        navigate(defaultRoute, { replace: true });
        return;
      }

      // Se há roles específicos permitidos, verifica
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        const defaultRoute = getDefaultRoute(user.role);
        navigate(defaultRoute, { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate, toast, allowedRoles, requireAuth]);

  return <>{children}</>;
};
