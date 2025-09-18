import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ShoppingBasket, FileText, CreditCard, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';


const Dashboard = () => {
  const navigate = useNavigate();
  const { consumerType } = useConsumer();
  const { currentCycle } = useCycle();

  const getMenuDescription = () => {
    const cycleTypeName = currentCycle.type === 'semanal' ? 'semana' : 'quinzena';
    return consumerType === 'cesta' 
      ? `Ver produtos da ${cycleTypeName} e extras`
      : 'Ver produtos disponíveis para compra';
  };

  const menuItems = [
    {
      icon: ShoppingBasket,
      title: 'Meu Pedido',
      description: getMenuDescription(),
      path: '/cesta',
      badge: 'Nova'
    },
    {
      icon: FileText,
      title: 'Resumo',
      description: 'Total consolidado e pagamentos',
      path: '/resumo'
    },
    {
      icon: FileText,
      title: 'Relatórios',
      description: 'Histórico e status dos pedidos',
      path: '/relatorio'
    },
    {
      icon: CreditCard,
      title: 'Pagamentos',
      description: 'Gestão de assinaturas e extras',
      path: '/pagamentos',
      badge: 'Pendente'
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Perfil, notificações e preferências',
      path: '/configuracoes'
    }
  ];

  return (
    <ResponsiveLayout>
      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Welcome Section - Desktop 12 col */}
        <div className="lg:col-span-12 text-center py-6">
          <h1 className="font-poppins text-2xl lg:text-3xl font-bold text-gradient-primary mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-muted-foreground lg:text-lg">
            Gerencie suas cestas e pedidos
          </p>
        </div>

        {/* Quick Stats - Desktop 2 col responsive */}
        <div className="lg:col-span-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="text-center">
              <CardContent className="p-4 lg:p-6">
                <div className="text-2xl lg:text-3xl font-bold text-primary">4</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Cestas do ciclo</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 lg:p-6">
                <div className="text-2xl lg:text-3xl font-bold text-accent">R$ 156</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total extras</div>
              </CardContent>
            </Card>
            {/* Desktop additional stats */}
            <Card className="text-center hidden lg:block">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-secondary">12</div>
                <div className="text-sm text-muted-foreground">Produtos favoritos</div>
              </CardContent>
            </Card>
            <Card className="text-center hidden lg:block">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-warning">85%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Menu Items - Desktop 3 col grid */}
        <div className="lg:col-span-12">
          <h2 className="font-poppins text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">
            Menu Principal
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground lg:text-lg">{item.title}</h3>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'Pendente' ? 'destructive' : 'secondary'}
                            className="text-xs px-2 py-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm lg:text-base text-muted-foreground">{item.description}</p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Cycle Info - Desktop 8 col centered */}
        <div className="lg:col-start-3 lg:col-span-8">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base lg:text-lg font-poppins text-gradient-primary">
                {currentCycle.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm lg:text-base">
                <span className="text-muted-foreground">Período:</span>
                <span className="font-medium">
                  {currentCycle.startDate.toLocaleDateString('pt-BR')} - {currentCycle.endDate.toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm lg:text-base mt-2">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">
                  {currentCycle.type === 'semanal' ? 'Semanal (7 dias)' : 'Quinzenal (15 dias)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm lg:text-base mt-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default" className="bg-primary">
                  {currentCycle.status === 'active' ? 'Ativo' : 
                   currentCycle.status === 'upcoming' ? 'Em breve' : 'Encerrado'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Dashboard;