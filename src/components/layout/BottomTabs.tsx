import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBasket, Package, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const consumerTabs: TabItem[] = [
  { title: 'Início', url: '/', icon: Home },
  { title: 'Cesta', url: '/cesta', icon: ShoppingBasket },
  { title: 'Resumo', url: '/resumo', icon: BarChart3 },
  { title: 'Perfil', url: '/configuracoes', icon: User },
];

const fornecedorTabs: TabItem[] = [
  { title: 'Loja', url: '/fornecedor/loja', icon: Home },
  { title: 'Pedidos', url: '/fornecedor/pedidos-aberto', icon: ShoppingBasket },
  { title: 'Produtos', url: '/fornecedor/pre-cadastro-produtos', icon: Package },
  { title: 'Perfil', url: '/fornecedor/configuracoes', icon: User },
];

interface BottomTabsProps {
  variant?: 'consumer' | 'fornecedor';
}

export const BottomTabs = ({ variant = 'consumer' }: BottomTabsProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const tabs = variant === 'fornecedor' ? fornecedorTabs : consumerTabs;
  
  const isRouteActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.url}
            to={tab.url}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg',
              'transition-all duration-200 min-h-[64px] min-w-[60px]',
              'touch-target flex-1 max-w-[80px]',
              isActive || isRouteActive(tab.url)
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs font-medium leading-tight">{tab.title}</span>
          </NavLink>
        ))}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </nav>
  );
};

export default BottomTabs;