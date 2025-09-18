import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeLabels: Record<string, string> = {
  '/admin': 'Admin',
  '/admin/dashboard': 'Dashboard',
  '/admin/mercados': 'Mercados',
  '/admin/produtos': 'Produtos',
  '/admin/estoque': 'Estoque',
  '/admin/venda': 'Página de Venda',
  '/admin/cestas': 'Cestas',
  '/admin/cestas/composicao': 'Composição',
  '/admin/cestas/resumo': 'Resumo',
  '/admin/gestao': 'Gestão do Ciclo',
  '/admin/pnae': 'PNAE',
  '/admin/pnae/composicao': 'Composição de Compra',
  '/admin/relatorios': 'Relatórios',
  '/admin/config': 'Configurações',
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  if (!location.pathname.startsWith('/admin') || pathnames.length <= 1) {
    return null;
  }

  const breadcrumbs = pathnames.reduce((acc, pathname, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = routeLabels[path] || pathname;
    
    acc.push({
      path,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      isLast: index === pathnames.length - 1,
    });
    
    return acc;
  }, [] as Array<{ path: string; label: string; isLast: boolean }>);

  return (
    <nav className="px-6 py-3 bg-muted/30 border-b border-border" aria-label="Navegação">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link
            to="/admin/dashboard"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Admin</span>
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            {breadcrumb.isLast ? (
              <span className="font-medium text-foreground">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-colors',
                  'hover:underline'
                )}
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;