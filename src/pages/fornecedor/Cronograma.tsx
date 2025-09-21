import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockSchedule = [
  {
    id: 1,
    product: 'Tomate Orgânico',
    plantingDate: '2024-02-15',
    harvestDate: '2024-03-20',
    estimatedKg: 120,
    status: 'Em crescimento',
    phase: 'colheita'
  },
  {
    id: 2,
    product: 'Alface Hidropônica',
    plantingDate: '2024-01-10',
    harvestDate: '2024-02-25',
    estimatedKg: 45,
    status: 'Aguardando plantio',
    phase: 'plantio'
  },
  {
    id: 3,
    product: 'Cenoura Baby',
    plantingDate: '2024-03-01',
    harvestDate: '2024-05-15',
    estimatedKg: 80,
    status: 'Planejado',
    phase: 'preparacao'
  }
];

const Cronograma = () => {
  const navigate = useNavigate();

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

        {/* Cronograma Content */}
        <div className="space-y-6">
          {/* Calendário por Meses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ].map((month, index) => {
              const monthNumber = index + 1;
              const monthActivities = mockSchedule.filter(item => {
                const plantingMonth = new Date(item.plantingDate).getMonth() + 1;
                const harvestMonth = new Date(item.harvestDate).getMonth() + 1;
                return plantingMonth === monthNumber || harvestMonth === monthNumber;
              });

              return (
                <Card key={month} className={`border ${monthActivities.length > 0 ? 'border-primary/30 bg-primary/5' : 'border-border/50'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-center">
                      {month}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {monthActivities.length > 0 ? (
                      monthActivities.map((activity) => {
                        const plantingMonth = new Date(activity.plantingDate).getMonth() + 1;
                        const harvestMonth = new Date(activity.harvestDate).getMonth() + 1;
                        const isPlanting = plantingMonth === monthNumber;
                        const isHarvest = harvestMonth === monthNumber;
                        
                        return (
                          <div key={activity.id} className="bg-background rounded-lg p-3 border border-border/50">
                            <h4 className="font-medium text-xs mb-2">{activity.product}</h4>
                            <div className="space-y-1">
                              {isPlanting && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  <span className="text-xs text-muted-foreground">Plantio</span>
                                </div>
                              )}
                              {isHarvest && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-xs text-muted-foreground">Colheita</span>
                                </div>
                              )}
                              <p className="text-xs font-medium text-primary">
                                {activity.estimatedKg}kg
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <span className="text-xs text-muted-foreground">Sem atividades</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Legenda */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-3">Legenda:</h4>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Período de Plantio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Período de Colheita</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-primary/30 rounded-full"></div>
                  <span>Período com Atividades</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Anual */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Timeline Anual de Produção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchedule.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{item.product}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.estimatedKg}kg
                      </Badge>
                    </div>
                    
                    {/* Barra de Timeline */}
                    <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                      {(() => {
                        const plantingMonth = new Date(item.plantingDate).getMonth();
                        const harvestMonth = new Date(item.harvestDate).getMonth();
                        const startPercent = (plantingMonth / 12) * 100;
                        const endPercent = ((harvestMonth + 1) / 12) * 100;
                        const width = endPercent - startPercent;
                        
                        return (
                          <div
                            className="absolute h-full bg-gradient-to-r from-yellow-200 via-blue-200 to-green-200 rounded-full"
                            style={{
                              left: `${startPercent}%`,
                              width: `${width}%`
                            }}
                          />
                        );
                      })()}
                      
                      {/* Marcadores de período */}
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: 12 }, (_, i) => (
                          <div
                            key={i}
                            className="flex-1 border-r border-border/20 last:border-r-0"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        Plantio: {new Date(item.plantingDate).toLocaleDateString('pt-BR', { month: 'short' })}
                      </span>
                      <span>
                        Colheita: {new Date(item.harvestDate).toLocaleDateString('pt-BR', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Cronograma;