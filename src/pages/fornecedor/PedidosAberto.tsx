import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, MapPin, Calendar, Clock, CheckCircle2, X, Edit, AlertCircle, Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import pedidosData from '@/mocks/fornecedor/pedidos_abertos.json';

// Load mock data and transform to match component structure
const transformOrderData = (data: any[]) => {
  return data.map(order => ({
    ...order,
    market: order.mercado,
    deliveryLocation: order.localEntrega,
    product: order.itens.length === 1 ? order.itens[0].produto : `${order.itens.length} itens`,
    quantity: order.itens.length === 1 ? order.itens[0].qtd : order.itens.reduce((sum: number, item: any) => sum + item.qtd, 0),
    unit: order.itens.length === 1 ? order.itens[0].unidade : 'itens',
    deliveryDate: order.dataEntrega,
    value: `R$ ${order.itens.reduce((sum: number, item: any) => sum + (item.qtd * item.preco), 0).toFixed(2).replace('.', ',')}`,
    orderDate: order.dataPedido,
    notes: order.observacao,
    accepted: order.aceito || false
  }));
};

const mockOrders = transformOrderData(pedidosData);

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: typeof mockOrders[0] | null;
  action: 'entregar' | 'recusar' | 'editar' | 'aceitar' | null;
}

const PedidosAberto = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [actionModal, setActionModal] = useState<ActionModalProps>({
    isOpen: false,
    onClose: () => {},
    order: null,
    action: null
  });
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterTab, setFilterTab] = useState('todos');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved filters
  useEffect(() => {
    const savedFilters = localStorage.getItem('da.fx.pedidos.filters');
    if (savedFilters) {
      const { filterTab, searchText } = JSON.parse(savedFilters);
      setFilterTab(filterTab || 'todos');
      setSearchText(searchText || '');
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('da.fx.pedidos.filters', JSON.stringify({
      filterTab,
      searchText
    }));
  }, [filterTab, searchText]);

  const openActionModal = (order: typeof mockOrders[0], action: 'entregar' | 'recusar' | 'editar' | 'aceitar') => {
    setActionModal({
      isOpen: true,
      onClose: () => setActionModal(prev => ({ ...prev, isOpen: false })),
      order,
      action
    });
    setReason('');
  };

  const handleAction = async () => {
    if (!actionModal.order || !actionModal.action) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (actionModal.action === 'aceitar') {
        setOrders(orders.map(order => 
          order.id === actionModal.order!.id 
            ? { ...order, accepted: true }
            : order
        ));
        toast({
          title: "Pedido aceito com sucesso",
          description: "O mercado será notificado sobre sua confirmação.",
        });
      } else if (actionModal.action === 'entregar') {
        setOrders(orders.filter(order => order.id !== actionModal.order!.id));
        toast({
          title: "Entrega confirmada.",
        });
      } else if (actionModal.action === 'recusar') {
        setOrders(orders.filter(order => order.id !== actionModal.order!.id));
        toast({
          title: "Pedido recusado.",
          variant: "destructive"
        });
      } else if (actionModal.action === 'editar') {
        toast({
          title: "Pedido atualizado.",
        });
      }
      
      actionModal.onClose();
    }, 1500);
  };

  const getUrgencyBadge = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      return <Badge variant="destructive" className="text-xs">Urgente</Badge>;
    } else if (diffDays <= 3) {
      return <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-700">Em breve</Badge>;
    }
    return null;
  };

  const getActionTitle = () => {
    switch (actionModal.action) {
      case 'aceitar':
        return 'Aceitar Pedido';
      case 'entregar':
        return 'Confirmar Entrega';
      case 'recusar':
        return 'Recusar Pedido';
      case 'editar':
        return 'Solicitar Alteração';
      default:
        return '';
    }
  };

  const getActionDescription = () => {
    switch (actionModal.action) {
      case 'aceitar':
        return 'Confirme que você visualizou e aceita produzir este pedido. O mercado será notificado.';
      case 'entregar':
        return 'Confirme que o pedido foi entregue conforme solicitado.';
      case 'recusar':
        return 'Informe o motivo da recusa do pedido. O mercado será notificado.';
      case 'editar':
        return 'Descreva as alterações necessárias. O mercado será notificado para aprovação.';
      default:
        return '';
    }
  };


  const filteredOrders = orders.filter(order => {
    const today = new Date();
    const deliveryDate = new Date(order.deliveryDate);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Apply date filter
    let dateMatch = true;
    switch (filterTab) {
      case 'hoje':
        dateMatch = diffDays <= 0;
        break;
      case 'semana':
        dateMatch = diffDays <= 7 && diffDays >= 0;
        break;
      case 'atrasados':
        dateMatch = diffDays < 0;
        break;
      default:
        dateMatch = true;
    }

    // Apply search filter
    const searchMatch = !searchText || 
      order.market.toLowerCase().includes(searchText.toLowerCase()) ||
      order.product.toLowerCase().includes(searchText.toLowerCase()) ||
      order.notes.toLowerCase().includes(searchText.toLowerCase());

    return dateMatch && searchMatch;
  });

  // Calculate counters
  const getOrderCount = (filter: string) => {
    const today = new Date();
    return orders.filter(order => {
      const deliveryDate = new Date(order.deliveryDate);
      const diffTime = deliveryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filter) {
        case 'hoje':
          return diffDays <= 0;
        case 'semana':
          return diffDays <= 7 && diffDays >= 0;
        case 'atrasados':
          return diffDays < 0;
        default:
          return true;
      }
    }).length;
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/fornecedor/loja')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Voltar</span>
        </Button>
      }
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header with counters */}
        <div className="lg:flex lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary">
              Pedidos em Aberto
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <div>
                <span className="font-medium text-foreground">{getOrderCount('todos')}</span>
                <span className="text-muted-foreground"> Total</span>
              </div>
              <div>
                <span className="font-medium text-foreground">{getOrderCount('hoje')}</span>
                <span className="text-muted-foreground"> Hoje</span>
              </div>
              <div>
                <span className="font-medium text-foreground">{getOrderCount('semana')}</span>
                <span className="text-muted-foreground"> Semana</span>
              </div>
              <div>
                <span className="font-medium text-destructive">{getOrderCount('atrasados')}</span>
                <span className="text-muted-foreground"> Atrasados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Filters Row */}
        <div className="md:flex md:items-center md:space-x-4">
          {/* Search Bar */}
          <div className="relative flex-1 mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por mercado, produto ou observação..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { key: 'todos', label: 'Todos', count: getOrderCount('todos') },
              { key: 'hoje', label: 'Hoje', count: getOrderCount('hoje') },
              { key: 'semana', label: 'Esta semana', count: getOrderCount('semana') },
              { key: 'atrasados', label: 'Atrasados', count: getOrderCount('atrasados') }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={filterTab === filter.key ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap relative"
                onClick={() => setFilterTab(filter.key)}
              >
                {filter.label}
                {filter.count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 h-5 px-1.5 text-xs bg-background text-foreground"
                  >
                    {filter.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders List - Responsive */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <div>
                <h3 className="font-medium text-foreground">
                  {orders.length === 0 ? 'Todos os pedidos foram processados!' : 'Nenhum pedido encontrado'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {orders.length === 0 
                    ? 'Não há pedidos pendentes no momento.'
                    : 'Tente selecionar outro filtro.'
                  }
                </p>
              </div>
              <Button onClick={() => navigate('/fornecedor/painel-gestao')}>
                Voltar ao Painel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{order.market}</span>
                        {order.accepted && (
                          <Badge variant="default" className="ml-auto bg-green-100 text-green-800 border-green-200">
                            <Check className="w-3 h-3 mr-1" />
                            Aceito
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1 flex-wrap">
                        {getUrgencyBadge(order.deliveryDate)}
                        <Badge variant="outline" className="text-xs">
                          #{order.id}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Local de Entrega */}
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-blue-800">Local de Entrega:</p>
                        <p className="text-xs text-blue-700">{order.deliveryLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-accent" />
                      <span className="font-medium text-sm">{order.product}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Qtd:</span>
                        <p className="font-medium">{order.quantity} {order.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-medium text-primary">{order.value}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entrega:</span>
                        <p className="font-medium flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pedido:</span>
                        <p className="font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(order.orderDate).toLocaleDateString('pt-BR')}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-yellow-800">Observações:</p>
                          <p className="text-xs text-yellow-700 line-clamp-2">{order.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {!order.accepted && (
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs col-span-2 bg-green-600 hover:bg-green-700"
                        onClick={() => openActionModal(order, 'aceitar')}
                      >
                        <Check className="w-3 h-3 md:mr-1" />
                        <span className="hidden md:inline">Aceitar Pedido</span>
                        <span className="md:hidden">Aceitar</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => openActionModal(order, 'recusar')}
                    >
                      <X className="w-3 h-3 md:mr-1" />
                      <span className="hidden md:inline">Recusar</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => openActionModal(order, 'editar')}
                    >
                      <Edit className="w-3 h-3 md:mr-1" />
                      <span className="hidden md:inline">Editar</span>
                    </Button>
                    
                    {order.accepted && (
                      <Button
                        size="sm"
                        className="text-xs col-span-2"
                        onClick={() => openActionModal(order, 'entregar')}
                      >
                        <CheckCircle2 className="w-3 h-3 md:mr-1" />
                        <span className="hidden md:inline">Marcar como Entregue</span>
                        <span className="md:hidden">Entregue</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Modal */}
        <Dialog open={actionModal.isOpen} onOpenChange={actionModal.onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{getActionTitle()}</DialogTitle>
              <DialogDescription>
                {getActionDescription()}
              </DialogDescription>
            </DialogHeader>

            {actionModal.order && (
              <div className="py-4">
                <div className="bg-muted/50 p-3 rounded-lg mb-4">
                  <p className="font-medium">{actionModal.order.market}</p>
                  <p className="text-sm text-muted-foreground">
                    {actionModal.order.product} - {actionModal.order.quantity} {actionModal.order.unit}
                  </p>
                </div>

                {(actionModal.action === 'recusar' || actionModal.action === 'editar') && (
                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      {actionModal.action === 'recusar' ? 'Motivo da recusa' : 'Alterações solicitadas'}
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder={
                        actionModal.action === 'recusar' 
                          ? "Descreva o motivo da recusa..."
                          : "Descreva as alterações necessárias..."
                      }
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={actionModal.onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAction}
                disabled={isLoading || ((actionModal.action === 'recusar' || actionModal.action === 'editar') && !reason.trim())}
                className="flex-1"
                variant={actionModal.action === 'recusar' ? 'destructive' : 'default'}
              >
                {isLoading ? "Processando..." : 
                 actionModal.action === 'aceitar' ? 'Aceitar' :
                 actionModal.action === 'entregar' ? 'Confirmar' :
                 actionModal.action === 'recusar' ? 'Recusar' : 'Solicitar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default PedidosAberto;