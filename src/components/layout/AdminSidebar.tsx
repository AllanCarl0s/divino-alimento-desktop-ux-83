import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  Store, 
  ShoppingBasket, 
  School, 
  FileText, 
  Settings,
  Menu,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
  { title: 'Mercados', url: '/admin/mercados', icon: Store },
  { title: 'Produtos', url: '/admin/produtos', icon: Package },
  { title: 'Estoque', url: '/admin/estoque', icon: Warehouse },
  { title: 'Página de Venda', url: '/admin/venda', icon: ShoppingCart },
  { title: 'Cestas', url: '/admin/cestas', icon: ShoppingBasket },
  { title: 'PNAE', url: '/admin/pnae', icon: School },
  { title: 'Relatórios', url: '/admin/relatorios', icon: FileText },
  { title: 'Configurações', url: '/admin/config', icon: Settings },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isRouteActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  
  const getNavCls = (active: boolean) =>
    active 
      ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
      : 'hover:bg-accent hover:text-accent-foreground transition-colors';

  return (
    <Sidebar
      className="transition-all duration-300 border-r border-border bg-sidebar"
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            'px-3 mb-2 text-sm font-semibold text-muted-foreground',
            isCollapsed && 'sr-only'
          )}>
            Administração
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium',
                        'transition-all duration-200 min-h-[44px]',
                        getNavCls(isActive || isRouteActive(item.url))
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;