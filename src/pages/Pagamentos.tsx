import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, CreditCard, Receipt, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useConsumer } from '@/contexts/ConsumerContext';

interface Subscription {
  id: string;
  plan: string;
  price: number;
  status: 'active' | 'pending' | 'cancelled';
  nextPayment: string;
  paymentMethod: string;
}

interface ExtraPayment {
  id: string;
  date: string;
  items: string[];
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  receipt?: string;
}

const Pagamentos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { consumerType } = useConsumer();

  const [subscription] = useState<Subscription>({
    id: '1',
    plan: 'Cesta Semanal',
    price: 45.00,
    status: 'active',
    nextPayment: '01/09/2025',
    paymentMethod: 'Cartão ****1234'
  });

  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([
    {
      id: '1',
      date: '12/08/2025',
      items: ['Abacate Premium', 'Mel Orgânico 250g'],
      amount: 41.40,
      status: 'pending',
      dueDate: '25/08/2025'
    },
    {
      id: '2',
      date: '05/08/2025',
      items: ['Abacate Premium'],
      amount: 12.50,
      status: 'paid',
      dueDate: '18/08/2025',
      receipt: 'REC-20250805-001'
    },
    {
      id: '3',
      date: '22/07/2025',
      items: ['Mel Orgânico 250g'],
      amount: 28.90,
      status: 'overdue',
      dueDate: '05/08/2025'
    }
  ]);

  const handlePayExtra = (paymentId: string) => {
    setExtraPayments(prev => prev.map(payment => {
      if (payment.id === paymentId) {
        toast({
          title: "Pagamento processado!",
          description: `R$ ${payment.amount.toFixed(2)} pago com sucesso.`,
        });
        return { 
          ...payment, 
          status: 'paid',
          receipt: `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3)}`
        };
      }
      return payment;
    }));
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
      case 'active':
        return { color: 'bg-success text-success-foreground', label: status === 'active' ? 'Ativo' : 'Pago' };
      case 'pending':
        return { color: 'bg-warning text-warning-foreground', label: 'Pendente' };
      case 'overdue':
        return { color: 'bg-destructive text-destructive-foreground', label: 'Vencido' };
      case 'cancelled':
        return { color: 'bg-gray-500 text-white', label: 'Cancelado' };
      default:
        return { color: 'bg-gray-500 text-white', label: status };
    }
  };

  const pendingTotal = extraPayments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

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
      <div className="container mx-auto max-w-4xl px-4 space-y-6">
        <div className="text-center">
          <h1 className="font-poppins text-2xl font-bold text-gradient-primary mb-2 flex items-center justify-center">
            <CreditCard className="w-6 h-6 mr-2" />
            Pagamentos
          </h1>
          <p className="text-muted-foreground">Gerencie suas assinaturas e compras</p>
        </div>

        {/* Pending Payments Alert */}
        {pendingTotal > 0 && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Pagamentos Pendentes</p>
                  <p className="text-sm text-destructive/80">
                    Você tem R$ {pendingTotal.toFixed(2)} em pagamentos pendentes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={consumerType === 'cesta' ? "subscription" : "extras"} className="space-y-4">
          {consumerType === 'cesta' ? (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
              <TabsTrigger value="extras">Extras</TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="extras">Histórico de Compras</TabsTrigger>
            </TabsList>
          )}

          {consumerType === 'cesta' && (
            <TabsContent value="subscription" className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Cesta Semanal</CardTitle>
                  <Badge className={getStatusConfig(subscription.status).color}>
                    {getStatusConfig(subscription.status).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor do ciclo:</span>
                    <span className="font-medium">R$ {subscription.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Método de pagamento:</span>
                    <span className="font-medium">{subscription.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Próximo pagamento:</span>
                    <span className="font-medium">{subscription.nextPayment}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Alterar Método
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Pausar Assinatura
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">Informações da Assinatura:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Renovação automática a cada ciclo</p>
                  <p>• Pausar até 25 dias antes do próximo ciclo</p>
                  <p>• Cancelar a qualquer momento</p>
                  <p>• Suporte: contato@divinoalimento.com</p>
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          )}

          <TabsContent value="extras" className="space-y-4">
            <div className="space-y-3">
              {extraPayments.map(payment => {
                const statusConfig = getStatusConfig(payment.status);
                
                return (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{payment.date}</p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento: {payment.dueDate}
                          </p>
                        </div>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <p className="text-sm font-medium">Itens:</p>
                        <ul className="text-sm text-muted-foreground">
                          {payment.items.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold text-secondary">
                          R$ {payment.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        {payment.status === 'pending' || payment.status === 'overdue' ? (
                          <Button
                            variant={payment.status === 'overdue' ? 'destructive' : 'default'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handlePayExtra(payment.id)}
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            {payment.status === 'overdue' ? 'Pagar Vencido' : 'Pagar Agora'}
                          </Button>
                        ) : payment.receipt && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Baixar Recibo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default Pagamentos;