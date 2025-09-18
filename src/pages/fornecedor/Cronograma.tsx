import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Calendar, Clock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockSchedule = [
  {
    id: 1,
    product: 'Tomate Orgânico',
    plantingDate: '2024-03-15',
    estimatedHarvest: '2024-06-15',
    status: 'crescimento',
    quantity: '150 kg',
    phase: 'Frutificação'
  },
  {
    id: 2,
    product: 'Alface Hidropônica',
    plantingDate: '2024-02-01',
    estimatedHarvest: '2024-03-01',
    status: 'colheita',
    quantity: '200 unidades',
    phase: 'Pronto para colheita'
  },
  {
    id: 3,
    product: 'Cenoura Baby',
    plantingDate: '2024-05-01',
    estimatedHarvest: '2024-08-01',
    status: 'plantio',
    quantity: '100 kg',
    phase: 'Germinação'
  }
];

const Cronograma = () => {
  const [view, setView] = useState('lista');
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      plantio: { label: 'Plantio', variant: 'secondary' as const },
      crescimento: { label: 'Crescimento', variant: 'default' as const },
      colheita: { label: 'Colheita', variant: 'outline' as const }
    };
    
    return <Badge variant={statusConfig[status as keyof typeof statusConfig]?.variant || 'secondary'}>
      {statusConfig[status as keyof typeof statusConfig]?.label || status}
    </Badge>;
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/fornecedor/loja')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary">Cronograma de Colheitas</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Acompanhe o desenvolvimento dos seus produtos
          </p>
        </div>

        {/* View Toggle */}
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4 mt-4">
            {mockSchedule.map((item) => (
              <Card key={item.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span>{item.product}</span>
                    </CardTitle>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Plantio:</span>
                      <p className="font-medium flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.plantingDate).toLocaleDateString('pt-BR')}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Estimativa:</span>
                      <p className="font-medium flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.estimatedHarvest).toLocaleDateString('pt-BR')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.phase}</p>
                        <p className="text-xs text-muted-foreground">Quantidade esperada: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="calendario" className="mt-4">
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground">Visão de Calendário</h3>
                  <p className="text-sm text-muted-foreground">
                    Em desenvolvimento. Use a visualização em lista por enquanto.
                  </p>
                </div>
                <Button onClick={() => setView('lista')}>
                  Ver Lista
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default Cronograma;