import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, Warehouse, Calculator, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Tomate Orgânico',
    unit: 'kg',
    totalStock: 200,
    available: 150,
    price: 8.50,
    suppliers: ['João Silva', 'Maria Santos'],
    selected: 0
  },
  {
    id: 2,
    name: 'Alface Hidropônica',
    unit: 'unidade',
    totalStock: 400,
    available: 300,
    price: 2.30,
    suppliers: ['Pedro Costa'],
    selected: 0
  },
  {
    id: 3,
    name: 'Cenoura Baby',
    unit: 'kg',
    totalStock: 120,
    available: 100,
    price: 6.80,
    suppliers: ['Ana Oliveira', 'Carlos Lima'],
    selected: 0
  }
];

const AdminKitandinhaComposicao = () => {
  const { id } = useParams();
  const [products, setProducts] = useState(mockProducts);
  const [activeTab, setActiveTab] = useState('estoque');
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateProductQuantity = (productId: number, change: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            selected: Math.max(0, Math.min(product.available, product.selected + change))
          }
        : product
    ));
  };

  const getTotalValue = () => {
    return products.reduce((sum, product) => sum + (product.selected * product.price), 0);
  };

  const getTotalItems = () => {
    return products.reduce((sum, product) => sum + product.selected, 0);
  };

  const handleSaveCycle = () => {
    navigate(`/admin/kitandinha/resumo/${id || 'novo'}`);
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/kitandinha/novo-ciclo')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Composição de Compra - Kitandinha</h1>
          <p className="text-muted-foreground mt-2">
            Configure produtos e quantidades para o ciclo de venda direta
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="estoque">Gestor de Estoque</TabsTrigger>
            <TabsTrigger value="composicao">Composição</TabsTrigger>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
          </TabsList>

          {/* Gestor de Estoque */}
          <TabsContent value="estoque" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Warehouse className="w-5 h-5 text-primary" />
                  <span>Produtos Disponíveis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.unit}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.suppliers.map((supplier, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {supplier}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <p className="font-medium">{product.totalStock}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Disponível:</span>
                          <p className="font-medium text-success">{product.available}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Preço:</span>
                          <p className="font-medium">R$ {product.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Selecionado:</span>
                          <p className="font-medium text-primary">{product.selected}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Quantidade a ofertar:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProductQuantity(product.id, -1)}
                            disabled={product.selected === 0}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {product.selected}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProductQuantity(product.id, 1)}
                            disabled={product.selected >= product.available}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Composição */}
          <TabsContent value="composicao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-accent" />
                    <span>Produtos vs Pedidos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.filter(p => p.selected > 0).map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.selected} {product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {(product.selected * product.price).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {product.price.toFixed(2)}/{product.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => p.selected > 0).length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum produto selecionado ainda
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <span>Valor Acumulado por Fornecedor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(products.flatMap(p => p.suppliers))).map((supplier) => {
                      const supplierValue = products
                        .filter(p => p.suppliers.includes(supplier) && p.selected > 0)
                        .reduce((sum, p) => sum + (p.selected * p.price), 0);
                      
                      return (
                        <div key={supplier} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span className="font-medium">{supplier}</span>
                          <span className="text-primary font-bold">
                            R$ {supplierValue.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resumo */}
          <TabsContent value="resumo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Ciclo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{getTotalItems()}</p>
                    <p className="text-sm text-muted-foreground">Total de Itens</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-2xl font-bold text-accent">
                      {products.filter(p => p.selected > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Produtos Selecionados</p>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      R$ {getTotalValue().toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/kitandinha/novo-ciclo')}
          >
            Voltar
          </Button>
          <Button onClick={handleSaveCycle}>
            Salvar e Continuar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminKitandinhaComposicao;