import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, ShoppingBasket, CreditCard, CheckCircle2, Clock, Download, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';

const Resumo = () => {
  const navigate = useNavigate();
  const { consumerType } = useConsumer();
  const { currentCycle } = useCycle();

  const orderSummary = {
    cesta: {
      total: 0,
      items: ['Alface Orgânica', 'Tomate Cereja', 'Cenoura Baby']
    },
    extras: {
      total: 41.40,
      items: [
        { name: 'Abacate Premium', quantity: 1, price: 12.50 },
        { name: 'Mel Orgânico 250g', quantity: 1, price: 28.90 }
      ]
    },
    payment: {
      cestaStatus: 'paid',
      extrasStatus: 'pending'
    }
  };

  const totalValue = orderSummary.cesta.total + orderSummary.extras.total;

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Page Header - Desktop 12 col */}
        <div className="lg:col-span-12">
          <div className="text-center lg:text-left">
            <h1 className="font-poppins text-2xl lg:text-3xl font-bold text-gradient-primary mb-2">
              Resumo do Pedido
            </h1>
            <p className="text-muted-foreground lg:text-lg">
              Consolidado do ciclo {currentCycle.type === 'semanal' ? 'semanal' : 'quinzenal'} atual
            </p>
          </div>
        </div>

        {/* Main Content - Desktop 8 col */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Cesta Section - Detailed - Only for cesta consumers */}
          {consumerType === 'cesta' && (
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg lg:text-xl flex items-center text-primary">
                  <ShoppingBasket className="w-5 h-5 lg:w-6 lg:h-6 mr-3" />
                  Cesta da {currentCycle.type === 'semanal' ? 'Semana' : 'Quinzena'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <Badge className="bg-success text-success-foreground">Pago</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Products List - Desktop Enhanced */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-3 lg:text-base">Produtos Incluídos:</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {orderSummary.cesta.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground lg:text-base font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center lg:text-lg">
                <span className="font-semibold text-foreground">Subtotal Cesta:</span>
                <span className="font-bold text-primary">
                  {orderSummary.cesta.total === 0 ? 'Incluído na assinatura' : `R$ ${orderSummary.cesta.total.toFixed(2)}`}
                </span>
              </div>

              {/* Cycle Information */}
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-sm lg:text-base">
                  <div>
                    <span className="text-muted-foreground">Ciclo:</span>
                    <p className="font-medium">{currentCycle.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Período:</span>
                    <p className="font-medium">
                      {currentCycle.startDate.toLocaleDateString('pt-BR')} - {currentCycle.endDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="font-medium">
                      {currentCycle.type === 'semanal' ? 'Semanal (7 dias)' : 'Quinzenal (15 dias)'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            </Card>
          )}

          {/* Orders Section - for venda_direta or Extras Section for cesta */}
          {orderSummary.extras.items.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg lg:text-xl flex items-center">
                    <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 mr-3" />
                    {consumerType === 'cesta' ? 'Produtos Extras' : 'Pedidos de Varejo'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-warning" />
                    <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                      Pendente
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Extras List - Desktop Table Style */}
                <div className="bg-muted/30 rounded-lg overflow-hidden">
                  <div className="hidden lg:grid lg:grid-cols-4 gap-4 p-3 bg-muted/60 font-medium text-sm">
                    <span>Produto</span>
                    <span className="text-center">Quantidade</span>
                    <span className="text-center">Preço Unitário</span>
                    <span className="text-right">Total</span>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {orderSummary.extras.items.map((item, index) => (
                      <div key={index} className="p-3 lg:grid lg:grid-cols-4 lg:gap-4 lg:items-center">
                        <div className="font-medium text-foreground lg:text-base">
                          {item.name}
                        </div>
                        <div className="text-muted-foreground lg:text-center text-sm lg:text-base">
                          x{item.quantity}
                        </div>
                        <div className="text-muted-foreground lg:text-center text-sm lg:text-base">
                          R$ {item.price.toFixed(2)}
                        </div>
                        <div className="font-semibold lg:text-right text-sm lg:text-base">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center lg:text-lg">
                  <span className="font-semibold text-foreground">Subtotal Extras:</span>
                  <span className="font-bold text-secondary">R$ {orderSummary.extras.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps - Desktop Enhanced */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base lg:text-lg">Próximos Passos:</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 text-sm lg:text-base">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Complete o pagamento dos extras até <strong>{currentCycle.endDate.toLocaleDateString('pt-BR')}</strong>
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Confirme o recebimento dos produtos no relatório</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Próximo ciclo {currentCycle.type} inicia após este período
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Desktop 4 col Sticky */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 space-y-4">
            
            {/* Total Summary - Sticky */}
            <Card className="bg-gradient-to-br from-secondary/10 to-warning/10 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg lg:text-xl text-center">Resumo Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cesta (assinatura):</span>
                    <span className="text-success font-medium">✓ Pago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Extras:</span>
                    <span className="text-warning font-medium">⏳ R$ {orderSummary.extras.total.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg lg:text-xl">
                    <span className="font-bold text-foreground">Total Geral:</span>
                    <span className="font-bold text-2xl text-secondary">
                      R$ {totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Actions - Sticky */}
            <div className="space-y-3">
              <Button 
                variant="default" 
                size="lg" 
                className="w-full lg:h-12"
                onClick={() => navigate('/pagamentos')}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pagar Extras - R$ {orderSummary.extras.total.toFixed(2)}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full lg:h-12"
                onClick={() => navigate('/relatorio')}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Ver Histórico Completo
              </Button>

              {/* Desktop Additional Actions */}
              <div className="hidden lg:block space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Comprovante
                </Button>
              </div>
            </div>

            {/* Quick Stats - Sidebar */}
            <Card className="hidden lg:block">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produtos na cesta:</span>
                  <span className="font-medium">{orderSummary.cesta.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produtos extras:</span>
                  <span className="font-medium">{orderSummary.extras.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Economia:</span>
                  <span className="font-medium text-success">R$ 23,50</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Resumo;