import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, Users, Target, TrendingUp, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Tomate Orgânico',
    unit: 'kg',
    available: 150,
    ordered: 0,
    supplier: 'João Silva',
    pricePerKg: 8.50
  },
  {
    id: 2,
    name: 'Alface Hidropônica',
    unit: 'unidade',
    available: 300,
    ordered: 0,
    supplier: 'Pedro Costa',
    pricePerKg: 1.20
  },
  {
    id: 3,
    name: 'Cenoura Baby',
    unit: 'kg', 
    available: 100,
    ordered: 0,
    supplier: 'Ana Oliveira',
    pricePerKg: 12.00
  }
];

const AdminComposicao = () => {
  const [products, setProducts] = useState(mockProducts);
  const [targetValue, setTargetValue] = useState(15000);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const updateProductQuantity = (productId: number, change: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            ordered: Math.max(0, Math.min(product.available, product.ordered + change))
          }
        : product
    ));
  };

  const addToComposition = (productId: number) => {
    updateProductQuantity(productId, 1);
    toast({
      title: "Item adicionado",
      description: "Produto adicionado à composição da cesta.",
    });
  };

  const removeFromComposition = (productId: number) => {
    updateProductQuantity(productId, -1);
    toast({
      title: "Item removido", 
      description: "Produto removido da composição da cesta.",
    });
  };

  const getCurrentValue = () => {
    return products.reduce((sum, product) => sum + (product.ordered * product.pricePerKg), 0);
  };

  const getDifference = () => {
    return getCurrentValue() - targetValue;
  };

  const getSupplierTotal = (supplier: string) => {
    return products
      .filter(product => product.supplier === supplier && product.ordered > 0)
      .reduce((sum, product) => sum + (product.ordered * product.pricePerKg), 0);
  };

  const getUniqueSuppliers = () => {
    return [...new Set(products.filter(p => p.ordered > 0).map(p => p.supplier))];
  };

  const handleSaveComposition = () => {
    navigate(`/admin/cestas/resumo/${id}`);
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
      <div className="flex-1 p-4 space-y-4">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-background z-10 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Composição de Cestas</h1>
            <p className="text-sm text-muted-foreground">
              Ciclo {id === 'novo' ? 'Novo' : `#${id}`}
            </p>
          </div>

          {/* Value Target vs Realized - Always Visible */}
          <Card className="mt-4 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">Valor-alvo vs. Realizado</span>
                </div>
                <Badge variant={getDifference() >= 0 ? "default" : "destructive"}>
                  {getDifference() >= 0 ? '+' : ''}R$ {getDifference().toFixed(2)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Meta:</span>
                  <p className="font-medium text-primary">R$ {targetValue.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Atual:</span>
                  <p className="font-medium text-green-600">R$ {getCurrentValue().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Side - Available Products (Stock Manager) */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Package className="w-5 h-5 text-accent" />
                  <span>Gestor de Estoque</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.unit}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.supplier}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ {product.pricePerKg.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">por {product.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disponível: {product.available}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToComposition(product.id)}
                        disabled={product.ordered >= product.available}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Composition Manager */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Gestor de Composição</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.filter(p => p.ordered > 0).length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum produto selecionado</p>
                    <p className="text-xs text-muted-foreground">
                      Adicione produtos do estoque para compor a cesta
                    </p>
                  </div>
                ) : (
                  <>
                    {products.filter(p => p.ordered > 0).map((product) => (
                      <div key={product.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.supplier}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              R$ {(product.ordered * product.pricePerKg).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromComposition(product.id)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium">{product.ordered}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToComposition(product.id)}
                              disabled={product.ordered >= product.available}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            de {product.available} disponíveis
                          </span>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    {/* Suppliers Summary */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Valor por Fornecedor</h4>
                      {getUniqueSuppliers().map((supplier) => (
                        <div key={supplier} className="flex justify-between text-sm">
                          <span>{supplier}</span>
                          <span className="font-medium">R$ {getSupplierTotal(supplier).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-4 pt-4">
          <Button 
            className="w-full" 
            onClick={handleSaveComposition}
            disabled={products.filter(p => p.ordered > 0).length === 0}
          >
            Finalizar Composição
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminComposicao;