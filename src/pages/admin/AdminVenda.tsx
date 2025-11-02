import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Store, Package, Users, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Tomate Orgânico',
    unit: 'kg',
    factor: 1,
    totalStock: 200,
    reserved: 50,
    available: 150,
    suppliers: ['João Silva', 'Maria Santos'],
    offered: 0
  },
  {
    id: 2,
    name: 'Alface Hidropônica',
    unit: 'unidade',
    factor: 0.15,
    totalStock: 400,
    reserved: 100,
    available: 300,
    suppliers: ['Pedro Costa'],
    offered: 0
  },
  {
    id: 3,
    name: 'Cenoura Baby',
    unit: 'kg',
    factor: 1,
    totalStock: 120,
    reserved: 20,
    available: 100,
    suppliers: ['Ana Oliveira', 'Carlos Lima'],
    offered: 0
  }
];

const AdminVenda = () => {
  const [products, setProducts] = useState(mockProducts);
  const [activeMarket, setActiveMarket] = useState('cesta');
  const [selectedMarketLocation, setSelectedMarketLocation] = useState('central');
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateProductQuantity = (productId: number, change: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            offered: Math.max(0, Math.min(product.available, product.offered + change))
          }
        : product
    ));
  };

  const handleProceedWithConfiguration = () => {
    if (activeMarket === 'cesta') {
      navigate('/admin/cestas');
    } else if (activeMarket === 'pnae') {
      navigate('/admin/pnae');
    } else if (activeMarket === 'kitandinha') {
      navigate('/admin/kitandinha/novo-ciclo');
    }
  };

  const getTotalOffered = () => {
    return products.reduce((sum, product) => sum + product.offered, 0);
  };

  const getTotalValue = () => {
    // Mock calculation - R$ 7.50 per kg average
    const total = products.reduce((sum, product) => sum + (product.offered * 7.5), 0);
    return total.toFixed(2);
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Página de Venda</h1>
          <p className="text-sm text-muted-foreground">
            Configure ofertas por mercado e período
          </p>
        </div>

        {/* Market Selection */}
        <Tabs value={activeMarket} onValueChange={setActiveMarket}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cesta">Cesta</TabsTrigger>
            <TabsTrigger value="pnae">PNAE</TabsTrigger>
            <TabsTrigger value="kitandinha">Kitandinha</TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            {/* Market Location Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Store className="w-4 h-4 text-primary" />
                  <span>Mercado Ativo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedMarketLocation} onValueChange={setSelectedMarketLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Mercado Central</SelectItem>
                    <SelectItem value="feira">Feira Livre</SelectItem>
                    <SelectItem value="verde">Supermercado Verde</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Período: Ciclo Agosto/25 (somente leitura)
                </p>
              </CardContent>
            </Card>

            <TabsContent value={activeMarket} className="space-y-4">
              {/* Products List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Package className="w-4 h-4 text-accent" />
                    <span>Produtos Disponíveis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.unit} {product.factor !== 1 && `(fator: ${product.factor}kg)`}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.suppliers.map((supplier, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {supplier}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <p className="font-medium">{product.totalStock}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reservado:</span>
                          <p className="font-medium text-yellow-600">{product.reserved}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Disponível:</span>
                          <p className="font-medium text-green-600">{product.available}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Quantidade a ofertar:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProductQuantity(product.id, -1)}
                            disabled={product.offered === 0}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {product.offered}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProductQuantity(product.id, 1)}
                            disabled={product.offered >= product.available}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Summary */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Resumo da Oferta</h3>
              <Badge variant="secondary">{activeMarket.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Itens selecionados:</span>
                <p className="font-medium">{getTotalOffered()} unidades</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor estimado:</span>
                <p className="font-medium text-primary">R$ {getTotalValue()}</p>
              </div>
            </div>
            <Button 
              className="w-full mt-3" 
              onClick={handleProceedWithConfiguration}
              disabled={getTotalOffered() === 0}
            >
              Prosseguir com a Configuração da Oferta
            </Button>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminVenda;