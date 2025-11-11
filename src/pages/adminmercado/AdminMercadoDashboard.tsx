import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { 
  Store, 
  DollarSign, 
  RefreshCcw, 
  FileText, 
  Truck, 
  ShoppingBag, 
  Settings,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { roleLabel } from '@/utils/labels';


const AdminMercadoDashboard = () => {
  const navigate = useNavigate();
  const { activeRole, user } = useAuth();

  const roleText = activeRole ? roleLabel(activeRole, user?.gender) : '';
  const pageTitle = `Painel do ${roleText}`;

  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | Divino Alimento`;
    }
  }, [pageTitle]);

  const gestaoAlimentos = [
    {
      title: 'Cadastrar/Editar Mercados',
      description: 'Gerencie os dados do mercado que administra.',
      icon: Store,
      route: '/adminmercado/mercados'
    },
    {
      title: 'Gerenciar Preços por Mercado',
      description: 'Defina preços específicos por produto e mercado.',
      icon: DollarSign,
      route: '/adminmercado/precos'
    }
  ];

  return (
    <ResponsiveLayout 
      headerContent={<UserMenuLarge />}
    >
      {/* Desktop Layout */}
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              {pageTitle}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie ciclos, mercados, ofertas e relatórios do seu mercado.
            </p>
          </div>
          <div className="hidden md:block">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              Sistema Online
            </Badge>
          </div>
        </div>

        {/* Gestão de Ciclo */}
        <div>
          <h2 className="font-semibold mb-4 md:mb-6 flex items-center text-lg md:text-xl">
            <RefreshCcw className="w-5 h-5 mr-2 text-primary" />
            Gestão de Ciclo
          </h2>
          
          <Card 
            className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
            onClick={() => navigate('/adminmercado/ciclo-index')}
          >
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                  <RefreshCcw className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm md:text-base font-poppins">
                    Criar/Editar Ciclo
                  </CardTitle>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Configure e edite ciclos de vendas e ofertas.
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Gestão de Alimentos */}
        <div>
          <h2 className="font-semibold mb-4 md:mb-6 flex items-center text-lg md:text-xl">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Gestão de Alimentos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {gestaoAlimentos.map((item, index) => (
              <Card 
                key={index}
                className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] md:hover:scale-105"
                onClick={() => navigate(item.route)}
              >
                <CardHeader className="pb-3 md:pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm md:text-base font-poppins truncate">
                        {item.title}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Relatórios Section */}
        <div>
          <h2 className="font-semibold mb-4 md:mb-6 flex items-center text-lg md:text-xl">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Relatórios
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Card - Relatório Fornecedores por Ciclo */}
            <Card 
              className="shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => navigate('/adminmercado/relatorios/fornecedores-ciclo')}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full border-2 border-primary">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-base text-foreground mb-1">
                      Relatório Pedidos Fornecedores por Ciclo
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gere relatórios com as entregas e valores dos fornecedores em cada ciclo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card - Relatório Consumidores por Ciclo */}
            <Card 
              className="shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => navigate('/adminmercado/relatorios/consumidores-ciclo')}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full border-2 border-primary">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-base text-foreground mb-1">
                      Relatório Pedidos Consumidores por Ciclo
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gere relatórios com as compras e quantidades dos consumidores.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Administração Geral */}
        <div>
          <h2 className="font-semibold mb-4 md:mb-6 flex items-center text-lg md:text-xl">
            <Settings className="w-5 h-5 mr-2 text-primary" />
            Administração Geral
          </h2>
          
          <Card 
            className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
            onClick={() => navigate('/usuario/1')}
          >
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                  <Settings className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm md:text-base font-poppins">
                    Dados Pessoais
                  </CardTitle>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Atualize seus dados pessoais
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
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

export default AdminMercadoDashboard;
