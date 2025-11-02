import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, MapPin, Calendar, Upload, FileImage, CheckCircle2, AlertCircle, DollarSign, FileText, Bell, Filter, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import vendasData from '@/mocks/fornecedor/vendas.json';

// Transform mock data
const transformVendasData = (data: any[]) => {
  return data.map(venda => ({
    ...venda,
    product: venda.produto,
    market: venda.mercado,
    quantity: venda.qtd,
    unit: 'kg',
    price: `R$ ${venda.precoUnit.toFixed(2).replace('.', ',')}/kg`,
    totalValue: `R$ ${(venda.qtd * venda.precoUnit).toFixed(2).replace('.', ',')}`,
    deliveryDate: venda.data,
    status: venda.temComprovante ? 'comprovante_enviado' : 'entregue_sem_comprovante',
    orderDate: venda.data
  }));
};

const mockDeliveries = transformVendasData(vendasData);

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: typeof mockDeliveries[0] | null;
}

interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: typeof mockDeliveries[0] | null;
}

const PainelGestao = () => {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [uploadModal, setUploadModal] = useState<UploadModalProps>({
    isOpen: false,
    onClose: () => {},
    delivery: null
  });
  const [notifyModal, setNotifyModal] = useState<NotifyModalProps>({
    isOpen: false,
    onClose: () => {},
    delivery: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    period: 'current_month',
    customDateFrom: null as Date | null,
    customDateTo: null as Date | null,
    market: 'all',
    product: 'all',
    status: 'all'
  });
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved filters
  useEffect(() => {
    const savedFilters = localStorage.getItem('da.fx.gestao.filters');
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      setFilters(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('da.fx.gestao.filters', JSON.stringify(filters));
  }, [filters]);

  const handleNotifyBuyer = (delivery: typeof mockDeliveries[0]) => {
    setNotifyModal({
      isOpen: true,
      onClose: () => setNotifyModal(prev => ({ ...prev, isOpen: false })),
      delivery
    });
    setPaymentDate(null);
  };

  const confirmNotifyBuyer = () => {
    if (!paymentDate) {
      toast({
        title: "Data obrigatória",
        description: "Selecione a data limite para pagamento.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Comprador avisado.",
    });
    setNotifyModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleExportCSV = () => {
    // Mock export functionality with current filters
    toast({
      title: "Arquivo gerado.",
      description: "CSV exportado com filtros aplicados.",
    });
  };

  const openUploadModal = (delivery: typeof mockDeliveries[0]) => {
    setUploadModal({
      isOpen: true,
      onClose: () => setUploadModal(prev => ({ ...prev, isOpen: false })),
      delivery
    });
  };

  const handleUpload = async () => {
    if (!uploadModal.delivery) return;

    setIsLoading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsLoading(false);
      
      setDeliveries(deliveries.map(delivery => 
        delivery.id === uploadModal.delivery!.id 
          ? { ...delivery, status: 'comprovante_enviado' }
          : delivery
      ));
      
      toast({
        title: "Comprovante enviado!",
        description: "O comprovante foi enviado com sucesso.",
      });
      
      uploadModal.onClose();
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      entregue_sem_comprovante: { 
        label: 'Aguardando Comprovante', 
        variant: 'outline' as const,
        color: 'border-yellow-400 text-yellow-700'
      },
      comprovante_enviado: { 
        label: 'Comprovante Enviado', 
        variant: 'default' as const,
        color: ''
      },
      pago: { 
        label: 'Pago', 
        variant: 'default' as const,
        color: 'bg-green-100 text-green-800 border-green-300'
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.entregue_sem_comprovante;
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  // Filter deliveries based on current filters
  const filteredDeliveries = deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.deliveryDate);
    const today = new Date();
    
    // Period filter
    let periodMatch = true;
    switch (filters.period) {
      case 'current_month':
        periodMatch = deliveryDate.getMonth() === today.getMonth() && 
                     deliveryDate.getFullYear() === today.getFullYear();
        break;
      case 'last_3_months':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        periodMatch = deliveryDate >= threeMonthsAgo;
        break;
      case 'custom':
        if (filters.customDateFrom && filters.customDateTo) {
          periodMatch = deliveryDate >= filters.customDateFrom && 
                       deliveryDate <= filters.customDateTo;
        }
        break;
    }

    // Market filter
    const marketMatch = filters.market === 'all' || delivery.market === filters.market;

    // Product filter
    const productMatch = filters.product === 'all' || delivery.product === filters.product;

    // Status filter
    const statusMatch = filters.status === 'all' || delivery.status === filters.status;

    return periodMatch && marketMatch && productMatch && statusMatch;
  });

  const totalValue = filteredDeliveries.reduce((sum, delivery) => {
    const value = parseFloat(delivery.totalValue.replace('R$ ', '').replace(',', '.'));
    return sum + value;
  }, 0);

  const pendingUploads = filteredDeliveries.filter(d => d.status === 'entregue_sem_comprovante').length;
  const deliveredCount = filteredDeliveries.filter(d => d.status === 'comprovante_enviado').length;

  // Get unique markets and products for filter options
  const uniqueMarkets = [...new Set(deliveries.map(d => d.market))];
  const uniqueProducts = [...new Set(deliveries.map(d => d.product))];

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/fornecedor/loja')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header with Export Button */}
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary">Painel de Gestão</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Histórico de entregas e comprovantes</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 self-start lg:self-auto"
            onClick={handleExportCSV}
          >
            <FileText className="w-4 h-4" />
            <span>Exportar .CSV</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-3">
              <div className="text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs opacity-90">Vendas</p>
                <p className="text-lg font-bold">R$ {totalValue.toFixed(2).replace('.', ',')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-green-800">Entregues</p>
                <p className="text-lg font-bold text-green-900">{deliveredCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-3">
              <div className="text-center">
                <Upload className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                <p className="text-xs text-yellow-800">Pendentes</p>
                <p className="text-lg font-bold text-yellow-900">{pendingUploads}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Período</Label>
                <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_month">Ciclo atual</SelectItem>
                    <SelectItem value="last_3_months">Últimos 3 ciclos</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Mercado</Label>
                <Select value={filters.market} onValueChange={(value) => setFilters(prev => ({ ...prev, market: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueMarkets.map(market => (
                      <SelectItem key={market} value={market}>{market}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Produto</Label>
                <Select value={filters.product} onValueChange={(value) => setFilters(prev => ({ ...prev, product: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueProducts.map(product => (
                      <SelectItem key={product} value={product}>{product}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="entregue_sem_comprovante">Pendente</SelectItem>
                    <SelectItem value="comprovante_enviado">Enviado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filters.period === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Data inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.customDateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.customDateFrom ? format(filters.customDateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.customDateFrom}
                        onSelect={(date) => setFilters(prev => ({ ...prev, customDateFrom: date || null }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-xs">Data final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.customDateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.customDateTo ? format(filters.customDateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.customDateTo}
                        onSelect={(date) => setFilters(prev => ({ ...prev, customDateTo: date || null }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deliveries List */}
        <div className="space-y-4">
          {filteredDeliveries.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <Package className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground">Não encontramos registros no período selecionado</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros para ver mais resultados.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredDeliveries.length} {filteredDeliveries.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </p>
              </div>
              {filteredDeliveries.map((delivery) => (
                <Card key={delivery.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{delivery.market}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(delivery.status)}
                          <Badge variant="outline" className="text-xs">
                            Entrega #{delivery.id}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-4 h-4 text-accent" />
                        <span className="font-medium">{delivery.product}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Quantidade:</span>
                          <p className="font-medium">{delivery.quantity} {delivery.unit}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Preço unitário:</span>
                          <p className="font-medium">{delivery.price}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valor total:</span>
                          <p className="font-medium text-primary">{delivery.totalValue}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data entrega:</span>
                          <p className="font-medium flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {delivery.status === 'entregue_sem_comprovante' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUploadModal(delivery)}
                          className="flex-1 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Enviar arquivo
                        </Button>
                      )}

                      {delivery.status === 'comprovante_enviado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotifyBuyer(delivery)}
                          className="flex-1 border-blue-400 text-blue-700 hover:bg-blue-50"
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Notificar
                        </Button>
                      )}

                      {delivery.status === 'comprovante_enviado' && (
                        <div className="flex-1 bg-green-50 border border-green-200 p-2 rounded text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Enviado</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Upload Modal */}
        <Dialog open={uploadModal.isOpen} onOpenChange={uploadModal.onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-primary" />
                <span>Enviar Comprovante</span>
              </DialogTitle>
              <DialogDescription>
                Faça upload do comprovante de entrega para este pedido.
              </DialogDescription>
            </DialogHeader>

            {uploadModal.delivery && (
              <div className="py-4 space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium">{uploadModal.delivery.market}</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadModal.delivery.product} - {uploadModal.delivery.quantity} {uploadModal.delivery.unit}
                  </p>
                  <p className="text-sm font-medium text-primary mt-1">{uploadModal.delivery.totalValue}</p>
                </div>

                <div className="space-y-2">
                  <Label>Comprovante de Entrega</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <FileImage className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Clique para selecionar ou arraste o arquivo
                    </p>
                    <Button variant="outline" size="sm" type="button">
                      Escolher Arquivo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium">Dica:</p>
                      <p>
                        Inclua fotos da mercadoria entregue, recibo assinado ou 
                        qualquer documento que comprove a entrega realizada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={uploadModal.onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Enviando..." : "Enviar Comprovante"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notify Buyer Modal */}
        <Dialog open={notifyModal.isOpen} onOpenChange={notifyModal.onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Avisar Comprador</span>
              </DialogTitle>
              <DialogDescription>
                Defina a data limite para pagamento e notifique o comprador.
              </DialogDescription>
            </DialogHeader>

            {notifyModal.delivery && (
              <div className="py-4 space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium">{notifyModal.delivery.market}</p>
                  <p className="text-sm text-muted-foreground">
                    {notifyModal.delivery.product} - {notifyModal.delivery.quantity} {notifyModal.delivery.unit}
                  </p>
                  <p className="text-sm font-medium text-primary mt-1">{notifyModal.delivery.totalValue}</p>
                </div>

                <div>
                  <Label>Data limite para pagamento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={paymentDate}
                        onSelect={setPaymentDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium">Informação:</p>
                      <p>
                        O comprador receberá uma notificação por email com os dados da entrega 
                        e a data limite para efetuar o pagamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={notifyModal.onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmNotifyBuyer}
                className="flex-1"
              >
                Enviar Aviso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default PainelGestao;