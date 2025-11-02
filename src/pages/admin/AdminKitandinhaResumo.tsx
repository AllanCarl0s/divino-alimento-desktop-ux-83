import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Users, Package, DollarSign, Edit, Send, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockCycleData = {
  name: 'Ciclo Setembro 2025',
  duration: '30 dias',
  offerPeriod: '7 dias',
  status: 'Em Preparação',
  suppliers: [
    { name: 'João Silva', products: 2, value: 450.00 },
    { name: 'Maria Santos', products: 1, value: 200.00 },
    { name: 'Pedro Costa', products: 1, value: 150.00 },
    { name: 'Ana Oliveira', products: 1, value: 180.00 },
    { name: 'Carlos Lima', products: 1, value: 120.00 }
  ],
  products: [
    { name: 'Tomate Orgânico', quantity: 50, unit: 'kg', supplier: 'João Silva', value: 425.00 },
    { name: 'Alface Hidropônica', quantity: 80, unit: 'unidade', supplier: 'Pedro Costa', value: 184.00 },
    { name: 'Cenoura Baby', quantity: 30, unit: 'kg', supplier: 'Ana Oliveira', value: 204.00 }
  ]
};

const AdminKitandinhaResumo = () => {
  const { id } = useParams();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getTotalValue = () => {
    return mockCycleData.suppliers.reduce((sum, supplier) => sum + supplier.value, 0);
  };

  const getTotalProducts = () => {
    return mockCycleData.suppliers.reduce((sum, supplier) => sum + supplier.products, 0);
  };

  const handlePublishCycle = () => {
    toast({
      title: "Ciclo publicado com sucesso!",
      description: "Os fornecedores foram notificados sobre o novo ciclo.",
    });
    setShowPublishModal(false);
    navigate('/admin/kitandinha/gestao/' + (id || 'novo'));
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate(`/admin/kitandinha/composicao/${id || 'novo'}`)}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resumo do Ciclo - Kitandinha</h1>
            <p className="text-muted-foreground mt-2">
              Revise todas as informações antes de publicar o ciclo
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {mockCycleData.status}
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{mockCycleData.duration}</p>
              <p className="text-sm text-muted-foreground">Duração do Ciclo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{mockCycleData.suppliers.length}</p>
              <p className="text-sm text-muted-foreground">Fornecedores</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-success">{getTotalProducts()}</p>
              <p className="text-sm text-muted-foreground">Produtos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-warning">R$ {getTotalValue().toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Cycle Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Suppliers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Fornecedores e Quantidades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCycleData.suppliers.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.products} produto{supplier.products > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">R$ {supplier.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-accent" />
                <span>Produtos Selecionados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCycleData.products.map((product, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} {product.unit}
                        </p>
                      </div>
                      <p className="font-bold text-primary">R$ {product.value.toFixed(2)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.supplier}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cycle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Nome do Ciclo</p>
                <p className="font-medium">{mockCycleData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
                <p className="font-medium">{mockCycleData.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Período de Oferta</p>
                <p className="font-medium">{mockCycleData.offerPeriod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/kitandinha/composicao/${id || 'novo'}`)}
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Editar Composição</span>
          </Button>

          <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Publicar Ciclo</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Publicação do Ciclo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Tem certeza que deseja publicar este ciclo? Os fornecedores serão notificados 
                  e poderão começar a fazer suas ofertas.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowPublishModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handlePublishCycle}>
                    Confirmar Publicação
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminKitandinhaResumo;