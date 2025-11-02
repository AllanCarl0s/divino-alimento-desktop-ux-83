import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, FileText, Filter, Calendar, CheckCircle2, XCircle, Clock, Download, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';

interface OrderItem {
  id: string;
  date: string;
  cycle: string;
  products: string[];
  status: 'received' | 'not-received' | 'pending';
  value: number;
  canMarkReceived: boolean;
}

const Relatorio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { consumerType } = useConsumer();
  const { currentCycle } = useCycle();
  
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const getOrdersForConsumerType = () => {
    if (consumerType === 'cesta') {
      return [
        {
          id: '1',
          date: '01/09/2025',
          cycle: 'Ciclo Setembro 2025 (Semanal)',
          products: ['Alface Orgânica', 'Tomate Cereja', 'Cenoura Baby'],
          status: 'pending' as const,
          value: 0,
          canMarkReceived: true
        },
        {
          id: '2',
          date: '25/08/2025',
          cycle: 'Ciclo Agosto 2025 (Quinzenal)', 
          products: ['Rúcula', 'Beterraba', 'Abacate Premium (extra)'],
          status: 'received' as const,
          value: 12.50,
          canMarkReceived: false
        },
        {
          id: '3',
          date: '15/08/2025',
          cycle: 'Ciclo Agosto 2025 (Semanal)',
          products: ['Couve', 'Cenoura', 'Tomate'],
          status: 'received' as const,
          value: 0,
          canMarkReceived: false
        },
        {
          id: '4',
          date: '08/08/2025',
          cycle: 'Ciclo Agosto 2025 (Semanal)',
          products: ['Alface', 'Pepino', 'Mel Orgânico (extra)'],
          status: 'not-received' as const,
          value: 28.90,
          canMarkReceived: false
        }
      ];
    } else {
      // venda_direta orders
      return [
        {
          id: '1',
          date: '01/09/2025',
          cycle: 'Ciclo Setembro 2025 (Semanal)',
          products: ['Abacate Premium', 'Mel Orgânico 500g', 'Banana Orgânica'],
          status: 'pending' as const,
          value: 45.80,
          canMarkReceived: true
        },
        {
          id: '2',
          date: '25/08/2025', 
          cycle: 'Ciclo Agosto 2025 (Quinzenal)',
          products: ['Tomate Orgânico 1kg', 'Cenoura Baby'],
          status: 'received' as const,
          value: 32.50,
          canMarkReceived: false
        },
        {
          id: '3',
          date: '15/08/2025',
          cycle: 'Ciclo Agosto 2025 (Semanal)',
          products: ['Mix de Verduras'],
          status: 'not-received' as const,
          value: 28.90,
          canMarkReceived: false
        }
      ];
    }
  };

  const [orders, setOrders] = useState<OrderItem[]>(getOrdersForConsumerType());

  // Update orders when consumer type changes
  useEffect(() => {
    setOrders(getOrdersForConsumerType());
  }, [consumerType]);

  const markAsReceived = (orderId: string, received: boolean) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.canMarkReceived) {
        const newStatus = received ? 'received' : 'not-received';
        toast({
          title: received ? "Pedido marcado como recebido" : "Pedido marcado como não recebido",
          description: `Pedido de ${order.date} atualizado.`,
        });
        return { ...order, status: newStatus, canMarkReceived: false };
      }
      return order;
    }));
  };

  const getStatusConfig = (status: OrderItem['status']) => {
    switch (status) {
      case 'received':
        return {
          icon: CheckCircle2,
          label: 'Recebido',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20'
        };
      case 'not-received':
        return {
          icon: XCircle,
          label: 'Não Recebido',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20'
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pendente',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20'
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    const cycleMatch = selectedCycle === 'all' || order.cycle === selectedCycle;
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    return cycleMatch && statusMatch;
  });

  const cycles = Array.from(new Set(orders.map(order => order.cycle)));

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
      headerContent={
        <div className="flex items-center space-x-3">
          {/* Desktop Toolbar Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-hover">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-hover">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Page Header - Desktop 12 col */}
        <div className="lg:col-span-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h1 className="font-poppins text-2xl lg:text-3xl font-bold text-gradient-primary mb-2 flex items-center justify-center lg:justify-start">
                <FileText className="w-6 h-6 lg:w-8 lg:h-8 mr-3" />
                Relatórios
              </h1>
              <p className="text-muted-foreground lg:text-lg">
                {consumerType === 'cesta' ? 'Histórico de cestas por ciclo' : 'Histórico de pedidos por ciclo'}
              </p>
            </div>

            {/* Desktop Stats */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4">
              <Card className="text-center bg-success/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">
                    {filteredOrders.filter(o => o.status === 'received').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Recebidos</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-warning/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">
                    {filteredOrders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-destructive/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-destructive">
                    {filteredOrders.filter(o => o.status === 'not-received').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Não Recebidos</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Sticky Toolbar with Filters - Desktop 12 col */}
        <div className="lg:col-span-12 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b pb-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base lg:text-lg flex items-center">
                <Filter className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Filtros e Controles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {/* Filters Row */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium">
                    {consumerType === 'cesta' ? 'Ciclo' : 'Período'}
                  </label>
                  <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {consumerType === 'cesta' ? 'Todos os ciclos' : 'Todos os períodos'}
                      </SelectItem>
                      {cycles.map(cycle => (
                        <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="received">Recebido</SelectItem>
                      <SelectItem value="not-received">Não Recebido</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions Row */}
                <div className="lg:col-span-2 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    <Search className="w-4 h-4 mr-1" />
                    Buscar
                  </Button>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table - Desktop 12 col */}
        <div className="lg:col-span-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg lg:text-xl">
                  {consumerType === 'cesta' ? 'Histórico de Cestas' : 'Histórico de Pedidos'} ({filteredOrders.length})
                </CardTitle>
                
                {/* Desktop View Toggle */}
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Visualização:</span>
                  <Button variant="outline" size="sm">Tabela</Button>
                  <Button variant="ghost" size="sm">Cards</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="p-8 lg:p-16 text-center">
                  <FileText className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground lg:text-lg">
                    Nenhum pedido encontrado com os filtros selecionados.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Desktop Table Header */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/50 font-medium text-sm">
                    <div className="lg:col-span-2">Data</div>
                    <div className="lg:col-span-2">{consumerType === 'cesta' ? 'Ciclo' : 'Período'}</div>
                    <div className="lg:col-span-4">Produtos</div>
                    <div className="lg:col-span-2">Valor</div>
                    <div className="lg:col-span-1">Status</div>
                    <div className="lg:col-span-1">Ações</div>
                  </div>

                  {/* Orders List */}
                  <div className="divide-y divide-border">
                    {filteredOrders.map(order => {
                      const statusConfig = getStatusConfig(order.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <div key={order.id}>
                          {/* Desktop Row */}
                          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors items-center">
                            
                            {/* Date Column */}
                            <div className="lg:col-span-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{order.date}</div>
                                </div>
                              </div>
                            </div>

                            {/* Cycle Column */}
                            <div className="lg:col-span-2">
                              <span className="text-sm text-muted-foreground">{order.cycle}</span>
                            </div>

                            {/* Products Column */}
                            <div className="lg:col-span-4">
                              <div className="space-y-1">
                                {order.products.slice(0, 2).map((product, index) => (
                                  <div key={index} className="text-sm">
                                    • {product}
                                  </div>
                                ))}
                                {order.products.length > 2 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{order.products.length - 2} outros
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Value Column */}
                            <div className="lg:col-span-2">
                              {order.value > 0 ? (
                                <span className="font-medium">R$ {order.value.toFixed(2)}</span>
                              ) : (
                                <span className="text-muted-foreground text-sm">Incluído</span>
                              )}
                            </div>

                            {/* Status Column */}
                            <div className="lg:col-span-1">
                              <div className="flex items-center space-x-1">
                                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                <Badge 
                                  variant="outline" 
                                  className={`${statusConfig.color} border-current text-xs`}
                                >
                                  {statusConfig.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Actions Column */}
                            <div className="lg:col-span-1">
                              {order.canMarkReceived && (
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsReceived(order.id, true)}
                                    className="w-8 h-8 p-0"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-success" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsReceived(order.id, false)}
                                    className="w-8 h-8 p-0"
                                  >
                                    <XCircle className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Mobile Card - Fallback */}
                          <div className="lg:hidden">
                            <Card className={`m-4 ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Calendar className="w-4 h-4 text-muted-foreground" />
                                      <span className="font-medium">{order.date}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{order.cycle}</p>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                    <Badge 
                                      variant="outline" 
                                      className={`${statusConfig.color} border-current`}
                                    >
                                      {statusConfig.label}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                  <p className="text-sm font-medium">Produtos:</p>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {order.products.map((product, index) => (
                                      <li key={index} className="flex items-center space-x-2">
                                        <span>• {product}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {order.value > 0 && (
                                  <div className="mb-3">
                                    <span className="text-sm font-medium">
                                      Valor extras: R$ {order.value.toFixed(2)}
                                    </span>
                                  </div>
                                )}

                                {order.canMarkReceived && (
                                  <div className="space-y-2 pt-2 border-t">
                                    <p className="text-sm font-medium">Marcar como:</p>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAsReceived(order.id, true)}
                                        className="flex-1"
                                      >
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Recebido
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAsReceived(order.id, false)}
                                        className="flex-1"
                                      >
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Não Recebido
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Relatorio;