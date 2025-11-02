import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, CheckCircle2, Edit, Package, Users, Target, Calendar, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockCycleData = {
  name: 'Ciclo Agosto/25',
  status: 'Rascunho',
  period: '01/08/25 - 31/08/25',
  supplierPeriod: '15/07/25 - 25/07/25',
  extrasPeriod: '20/08/25 - 28/08/25',
  targetValue: 15000,
  currentValue: 14200,
  totalItems: 75,
  suppliers: [
    { name: 'João Silva', products: 3, value: 4200 },
    { name: 'Pedro Costa', products: 2, value: 3600 },
    { name: 'Ana Oliveira', products: 1, value: 2400 },
    { name: 'Maria Santos', products: 2, value: 4000 }
  ],
  products: [
    { name: 'Tomate Orgânico', quantity: 25, unit: 'kg', supplier: 'João Silva', value: 212.50 },
    { name: 'Alface Hidropônica', quantity: 30, unit: 'unidades', supplier: 'Pedro Costa', value: 36.00 },
    { name: 'Cenoura Baby', quantity: 20, unit: 'kg', supplier: 'Ana Oliveira', value: 240.00 }
  ]
};

const AdminResumo = () => {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePublishCycle = () => {
    toast({
      title: "Ciclo publicado.",
      description: "O ciclo está disponível para os consumidores.",
    });
    setShowPublishModal(false);
    navigate('/admin/cestas');
  };

  const getDifference = () => {
    return mockCycleData.currentValue - mockCycleData.targetValue;
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/cestas')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Resumo do Ciclo</h1>
            <p className="text-sm text-muted-foreground">
              {mockCycleData.name} • {mockCycleData.period}
            </p>
          </div>
          <Badge variant={mockCycleData.status === 'Publicado' ? 'default' : 'outline'}>
            {mockCycleData.status}
          </Badge>
        </div>

        {/* General Summary */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Resumo Geral</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Meta:</span>
                <p className="text-xl font-bold text-primary">R$ {mockCycleData.targetValue.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Realizado:</span>
                <p className="text-xl font-bold text-green-600">R$ {mockCycleData.currentValue.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="font-medium">Diferença:</span>
              <Badge variant={getDifference() >= 0 ? "default" : "destructive"}>
                {getDifference() >= 0 ? '+' : ''}R$ {getDifference().toFixed(2)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de itens:</span>
                <p className="font-medium">{mockCycleData.totalItems}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fornecedores:</span>
                <p className="font-medium">{mockCycleData.suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <span>Cards por Fornecedor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCycleData.suppliers.map((supplier, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{supplier.name}</h4>
                  <Badge variant="outline">{supplier.products} produtos</Badge>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">R$ {supplier.value.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-primary" />
              <span>Lista de Itens da Cesta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCycleData.products.map((product, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.supplier}</p>
                    <p className="text-sm">
                      {product.quantity} {product.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {product.value.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 flex items-center space-x-2"
            onClick={() => navigate(`/admin/cestas/composicao/${id}`)}
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </Button>
          
          {mockCycleData.status === 'Rascunho' && (
            <Button
              className="flex-1 flex items-center space-x-2"
              onClick={() => setShowPublishModal(true)}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publicar Ciclo</span>
            </Button>
          )}
        </div>

        {/* Publish Confirmation Modal */}
        <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publicar Ciclo</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja publicar este ciclo? Ele ficará disponível para todos os consumidores.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">{mockCycleData.name}</p>
                <p className="text-sm text-muted-foreground">{mockCycleData.period}</p>
                <p className="text-sm">
                  <span className="font-medium">Valor: </span>
                  R$ {mockCycleData.currentValue.toFixed(2)}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPublishModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handlePublishCycle}>
                Confirmar Publicação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminResumo;