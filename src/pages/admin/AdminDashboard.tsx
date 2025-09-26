import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { 
  LogOut, 
  Store, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  FileText, 
  Settings,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const kpis = [
    { label: 'Produtos Aguardando', value: '8', trend: '+2', route: '/admin/produtos' },
    { label: 'Ciclos Ativos', value: '3', trend: '0', route: '/admin/cestas' },
    { label: 'Fornecedores', value: '24', trend: '+4', route: '/admin/estoque' },
    { label: 'Mercados', value: '12', trend: '+1', route: '/admin/mercados' }
  ];

  const shortcuts = [
    {
      title: 'Cadastro de Mercado',
      description: 'Gerenciar mercados e pontos de venda',
      icon: Store,
      route: '/admin/mercados',
      badge: null
    },
    {
      title: 'Produtos (Submissões)',
      description: 'Aprovar produtos enviados por fornecedores',
      icon: Package,
      route: '/admin/produtos',
      badge: '8 pendentes'
    },
    {
      title: 'Estoque',
      description: 'Controle de estoque e disponibilidade',
      icon: Warehouse,
      route: '/admin/estoque',
      badge: null
    },
    {
      title: 'Usuários',
      description: 'Gerenciar perfis e acessos',
      icon: Users,
      route: '/usuarios',
      badge: null
    },
    {
      title: 'Página de Venda',
      description: 'Configurar ofertas e cestas',
      icon: ShoppingCart,
      route: '/admin/venda',
      badge: null
    },
    {
      title: 'Relatórios',
      description: 'Relatórios gerenciais e analytics',
      icon: FileText,
      route: '/admin/relatorios',
      badge: null
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema',
      icon: Settings,
      route: '/admin/config',
      badge: null
    }
  ];

  return (
    <ResponsiveLayout 
      headerContent={
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      }
    >
      {/* Desktop Layout */}
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              Painel Administrativo
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie o ecossistema Divino Alimento
            </p>
          </div>
          <div className="hidden md:block">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              Sistema Online
            </Badge>
          </div>
        </div>

        {/* KPIs - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {kpis.map((kpi, index) => (
            <Card 
              key={index} 
              className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] md:hover:scale-105"
              onClick={() => navigate(kpi.route)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-2 md:mb-0">
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-primary">{kpi.value}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500">{kpi.trend}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions - Desktop Grid, Mobile List */}
        <div>
          <h2 className="font-semibold mb-4 md:mb-6 flex items-center text-lg md:text-xl">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Ações Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="relative">
                {shortcut.badge && (
                  <Badge variant="outline" className="absolute -top-2 -right-2 z-10 text-xs bg-background border-destructive text-destructive">
                    {shortcut.badge}
                  </Badge>
                )}
                <Card 
                  className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] md:hover:scale-105"
                  onClick={() => navigate(shortcut.route)}
                >
                  <CardHeader className="pb-3 md:pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                        <shortcut.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm md:text-base font-poppins truncate">
                          {shortcut.title}
                        </CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {shortcut.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-sm md:text-base">Sistema Operacional</p>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Última sincronização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboard;