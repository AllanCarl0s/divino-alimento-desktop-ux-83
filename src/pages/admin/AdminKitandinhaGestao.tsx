import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, CheckCircle, AlertTriangle, Package, Users, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockDeliveries = [
  {
    id: 1,
    supplier: 'João Silva',
    product: 'Tomate Orgânico',
    expected: 50,
    delivered: 45,
    unit: 'kg',
    status: 'Parcial',
    date: '2025-01-15'
  },
  {
    id: 2,
    supplier: 'Pedro Costa',
    product: 'Alface Hidropônica', 
    expected: 80,
    delivered: 80,
    unit: 'unidade',
    status: 'Completo',
    date: '2025-01-15'
  },
  {
    id: 3,
    supplier: 'Ana Oliveira',
    product: 'Cenoura Baby',
    expected: 30,
    delivered: 28,
    unit: 'kg',
    status: 'Parcial',
    date: '2025-01-16'
  }
];

const AdminKitandinhaGestao = () => {
  const { id } = useParams();
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [activeTab, setActiveTab] = useState('adjustments');
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateDeliveredQuantity = (deliveryId: number, newQuantity: number) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            delivered: Math.max(0, newQuantity),
            status: newQuantity >= delivery.expected ? 'Completo' : 
                   newQuantity > 0 ? 'Parcial' : 'Pendente'
          }
        : delivery
    ));
  };

  const getTotalExpected = () => {
    return deliveries.reduce((sum, delivery) => sum + delivery.expected, 0);
  };

  const getTotalDelivered = () => {
    return deliveries.reduce((sum, delivery) => sum + delivery.delivered, 0);
  };

  const getDeliveryRate = () => {
    const rate = (getTotalDelivered() / getTotalExpected()) * 100;
    return rate.toFixed(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completo':
        return <Badge className="bg-success text-success-foreground">Completo</Badge>;
      case 'Parcial':
        return <Badge className="bg-warning text-warning-foreground">Parcial</Badge>;
      case 'Pendente':
        return <Badge variant="destructive">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSaveAdjustments = () => {
    toast({
      title: "Ajustes salvos com sucesso!",
      description: "As quantidades entregues foram atualizadas.",
    });
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate(`/admin/kitandinha/resumo/${id}`)}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão do Ciclo - Kitandinha</h1>
          <p className="text-muted-foreground mt-2">
            Ajuste as quantidades realmente entregues pelos fornecedores
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{getTotalExpected()}</p>
              <p className="text-sm text-muted-foreground">Total Esperado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-success">{getTotalDelivered()}</p>
              <p className="text-sm text-muted-foreground">Total Entregue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{getDeliveryRate()}%</p>
              <p className="text-sm text-muted-foreground">Taxa de Entrega</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-warning">
                {deliveries.filter(d => d.status === 'Parcial' || d.status === 'Pendente').length}
              </p>
              <p className="text-sm text-muted-foreground">Ajustes Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="adjustments">Ajustar Ofertas</TabsTrigger>
            <TabsTrigger value="summary">Resumo Final</TabsTrigger>
          </TabsList>

          {/* Adjustments Tab */}
          <TabsContent value="adjustments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span>Ajuste de Entregas por Fornecedor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{delivery.product}</h4>
                          <p className="text-sm text-muted-foreground">
                            Fornecedor: {delivery.supplier}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Data de entrega: {new Date(delivery.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Quantidade Esperada</Label>
                          <p className="font-medium text-lg">
                            {delivery.expected} {delivery.unit}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor={`delivered-${delivery.id}`} className="text-sm text-muted-foreground">
                            Quantidade Entregue
                          </Label>
                          <Input
                            id={`delivered-${delivery.id}`}
                            type="number"
                            value={delivery.delivered}
                            onChange={(e) => updateDeliveredQuantity(delivery.id, parseInt(e.target.value) || 0)}
                            className="mt-1"
                            max={delivery.expected}
                            min={0}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Diferença</Label>
                          <p className={`font-medium text-lg ${
                            delivery.delivered >= delivery.expected 
                              ? 'text-success' 
                              : 'text-warning'
                          }`}>
                            {delivery.delivered - delivery.expected > 0 ? '+' : ''}
                            {delivery.delivered - delivery.expected} {delivery.unit}
                          </p>
                        </div>
                      </div>

                      {delivery.delivered < delivery.expected && (
                        <div className="mt-3 p-3 bg-warning/10 border-l-4 border-warning rounded">
                          <p className="text-sm text-warning-foreground">
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            Entrega incompleta. Diferença de {delivery.expected - delivery.delivered} {delivery.unit}.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Resumo por Fornecedor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(deliveries.map(d => d.supplier))).map((supplier) => {
                      const supplierDeliveries = deliveries.filter(d => d.supplier === supplier);
                      const totalExpected = supplierDeliveries.reduce((sum, d) => sum + d.expected, 0);
                      const totalDelivered = supplierDeliveries.reduce((sum, d) => sum + d.delivered, 0);
                      const rate = ((totalDelivered / totalExpected) * 100).toFixed(1);
                      
                      return (
                        <div key={supplier} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{supplier}</p>
                            <p className="text-sm text-muted-foreground">
                              {supplierDeliveries.length} produto{supplierDeliveries.length > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{rate}%</p>
                            <p className="text-sm text-muted-foreground">
                              {totalDelivered}/{totalExpected}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span>Performance do Ciclo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{getDeliveryRate()}%</p>
                      <p className="text-sm text-muted-foreground">Taxa Geral de Entrega</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entregas Completas:</p>
                        <p className="font-medium text-success">
                          {deliveries.filter(d => d.status === 'Completo').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Entregas Parciais:</p>
                        <p className="font-medium text-warning">
                          {deliveries.filter(d => d.status === 'Parcial').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/kitandinha/resumo/${id}`)}
          >
            Voltar ao Resumo
          </Button>
          <Button onClick={handleSaveAdjustments}>
            Salvar Ajustes
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminKitandinhaGestao;