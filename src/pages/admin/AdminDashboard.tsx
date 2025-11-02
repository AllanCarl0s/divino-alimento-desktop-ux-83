import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { LayoutDashboard, Users, Package, ShoppingCart, TrendingUp, Calendar, FileText, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Gestão de Mercados',
      icon: LayoutDashboard,
      description: 'Gerenciar mercados locais',
      path: '/admin/mercados',
      color: 'text-blue-600'
    },
    {
      title: 'Usuários',
      icon: Users,
      description: 'Gerenciar usuários do sistema',
      path: '/usuarios',
      color: 'text-green-600'
    },
    {
      title: 'Produtos',
      icon: Package,
      description: 'Cadastrar e gerenciar produtos',
      path: '/admin/alimentos',
      color: 'text-orange-600'
    },
    {
      title: 'Categorias',
      icon: ShoppingCart,
      description: 'Gerenciar categorias de produtos',
      path: '/admin/categorias',
      color: 'text-purple-600'
    },
    {
      title: 'Ciclos',
      icon: Calendar,
      description: 'Gerenciar ciclos de venda',
      path: '/admin/ciclo-index',
      color: 'text-cyan-600'
    },
    {
      title: 'Preços',
      icon: TrendingUp,
      description: 'Gerenciar preços dos produtos',
      path: '/admin/precos',
      color: 'text-pink-600'
    },
    {
      title: 'Relatórios',
      icon: FileText,
      description: 'Visualizar relatórios',
      path: '/admin/relatorio-consumidores',
      color: 'text-indigo-600'
    },
    {
      title: 'Pagamentos',
      icon: Settings,
      description: 'Gerenciar pagamentos',
      path: '/admin/pagamentos-gerir',
      color: 'text-red-600'
    }
  ];

  return (
    <ResponsiveLayout showHeader={true}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground lg:text-lg">
            Gerencie todo o sistema através do menu abaixo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                      <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Bem-vindo ao Sistema Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Este é o painel de controle administrativo. Aqui você pode gerenciar todos os aspectos da plataforma, 
                incluindo usuários, produtos, mercados, ciclos de venda e muito mais.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">--</div>
                  <div className="text-sm text-muted-foreground">Usuários Ativos</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-accent mb-1">--</div>
                  <div className="text-sm text-muted-foreground">Ciclos Ativos</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="text-3xl font-bold text-secondary mb-1">--</div>
                  <div className="text-sm text-muted-foreground">Produtos Cadastrados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboard;
