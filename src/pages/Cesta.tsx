import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ShoppingBasket, Plus, Minus, ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: 'cesta' | 'extra';
  image?: string;
}

const Cesta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { consumerType } = useConsumer();
  const { currentCycle } = useCycle();
  
  const [marketName, setMarketName] = useState('Mercado Central de São Paulo');
  
  useEffect(() => {
    const storedMarketId = localStorage.getItem('da.marketId');
    
    // Mock market names based on ID
    const marketNames = {
      '1': 'Mercado Central de São Paulo',
      '2': 'Mercado Municipal de Campinas', 
      '3': 'Feira Orgânica de Santos',
      '4': 'Mercado Verde de Ribeirão Preto'
    };
    
    if (storedMarketId && marketNames[storedMarketId as keyof typeof marketNames]) {
      setMarketName(marketNames[storedMarketId as keyof typeof marketNames]);
    }
  }, []);
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Alface Orgânica',
      description: 'Folhas verdes frescas da estação',
      price: 0,
      quantity: 1,
      category: 'cesta'
    },
    {
      id: '2',
      name: 'Tomate Cereja',
      description: 'Tomates doces e suculentos',
      price: 0,
      quantity: 1,
      category: 'cesta'
    },
    {
      id: '3',
      name: 'Cenoura Baby',
      description: 'Cenouras pequenas e doces',
      price: 0,
      quantity: 1,
      category: 'cesta'
    },
    {
      id: '4',
      name: 'Abacate Premium',
      description: 'Abacates maduros selecionados',
      price: 12.50,
      quantity: 0,
      category: 'extra'
    },
    {
      id: '5',
      name: 'Mel Orgânico 250g',
      description: 'Mel puro de flores silvestres',
      price: 28.90,
      quantity: 0,
      category: 'extra'
    }
  ]);

  const updateQuantity = (productId: string, delta: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newQuantity = Math.max(0, product.quantity + delta);
        return { ...product, quantity: newQuantity };
      }
      return product;
    }));
  };

  const cestaProducts = products.filter(p => p.category === 'cesta');
  const extraProducts = products.filter(p => p.category === 'extra');
  const totalExtras = extraProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  // Calculate totals for venda_direta mode
  const selectedProducts = extraProducts.filter(p => p.quantity > 0);
  const hasSelectedProducts = selectedProducts.length > 0;
  
  // Dynamic titles and button text
  const pageTitle = consumerType === 'cesta' ? 'Minha Cesta' : 'Meu Pedido';
  const buttonText = consumerType === 'cesta' ? 'Confirmar Pedido' : 'Finalizar Pedido';
  const cycleTypeName = currentCycle.type === 'semanal' ? 'Semana' : 'Quinzena';
  const periodText = consumerType === 'cesta' 
    ? `${cycleTypeName} de ${currentCycle.startDate.toLocaleDateString('pt-BR')} - ${currentCycle.endDate.toLocaleDateString('pt-BR')}`
    : `${marketName} - Ciclo ${currentCycle.type === 'semanal' ? 'Semanal' : 'Quinzenal'}`;

  const handleConfirmOrder = () => {
    if (consumerType === 'venda_direta' && !hasSelectedProducts) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao seu carrinho antes de finalizar.",
        variant: "destructive",
      });
      return;
    }
    
    const hasExtras = extraProducts.some(p => p.quantity > 0);
    if (consumerType === 'cesta') {
      if (hasExtras) {
        toast({
          title: "Pedido confirmado!",
          description: `Extras adicionados: R$ ${totalExtras.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Cesta confirmada!",
          description: `Sua cesta da ${cycleTypeName.toLowerCase()} está confirmada.`,
        });
      }
    } else {
      toast({
        title: "Pedido finalizado!",
        description: `Total: R$ ${totalExtras.toFixed(2)}`,
      });
    }
    navigate('/resumo');
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Header - 12 col */}
        <div className="lg:col-span-12 text-center py-6">
          <h1 className="font-poppins text-2xl lg:text-3xl font-bold text-gradient-primary mb-2 flex items-center justify-center">
            {consumerType === 'cesta' ? (
              <ShoppingBasket className="w-6 h-6 lg:w-8 lg:h-8 mr-2" />
            ) : (
              <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 mr-2" />
            )}
            {pageTitle}
          </h1>
          <p className="text-muted-foreground lg:text-lg">{periodText}</p>
        </div>

        {/* Cesta da Semana/Quinzena - Only show for cesta type */}
        {consumerType === 'cesta' && (
          <div className="lg:col-start-3 lg:col-span-8">
            <h2 className="font-poppins text-lg lg:text-xl font-semibold mb-4 text-foreground">
              Cesta da {cycleTypeName}
            </h2>
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base lg:text-lg text-primary">Produtos Inclusos</CardTitle>
                  <Badge className="bg-primary text-primary-foreground">Grátis</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cestaProducts.map(product => (
                  <div key={product.id} className="flex items-center space-x-4 p-3 lg:p-4 rounded-lg bg-background/50">
                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground lg:text-lg">{product.name}</h3>
                      <p className="text-sm lg:text-base text-muted-foreground">{product.description}</p>
                    </div>
                    <Badge variant="outline" className="text-sm lg:text-base">
                      {product.quantity}x
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Section - Desktop 8 col centered */}
        <div className="lg:col-start-3 lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins text-lg lg:text-xl font-semibold text-foreground">
              {consumerType === 'cesta' ? 'Produtos Extras' : 'Produtos'}
            </h2>
            {consumerType === 'venda_direta' && (
              <Badge variant="outline" className="text-xs">
                Ciclo {currentCycle.type === 'semanal' ? 'Semanal' : 'Quinzenal'}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {extraProducts.map(product => (
              <Card key={product.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground lg:text-lg">{product.name}</h3>
                      <p className="text-sm lg:text-base text-muted-foreground mb-2">{product.description}</p>
                      <p className="font-semibold text-secondary lg:text-lg">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={product.quantity === 0}
                        className="h-10 w-10"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-medium lg:text-lg">
                        {product.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, 1)}
                        className="h-10 w-10"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary - Desktop 6 col centered */}
        {totalExtras > 0 && (
          <div className="lg:col-start-4 lg:col-span-6">
            <Card className="bg-gradient-to-br from-secondary/10 to-warning/10 border-secondary/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground lg:text-lg">Total de Extras:</span>
                  <span className="text-xl lg:text-2xl font-bold text-secondary">
                    R$ {totalExtras.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Button - Desktop 6 col centered */}  
        <div className="lg:col-start-4 lg:col-span-6 pb-4">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full lg:h-14 lg:text-lg"
            onClick={handleConfirmOrder}
            disabled={consumerType === 'venda_direta' && !hasSelectedProducts}
          >
            <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
            {buttonText}
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Cesta;