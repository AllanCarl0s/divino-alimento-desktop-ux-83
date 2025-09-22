import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, AlertTriangle, FileText, Calendar, CalendarIcon, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Mock data for expired products
const mockExpiredProducts = [
  {
    id: 1,
    product: 'Tomate Orgânico',
    quantity: 12,
    unit: 'kg',
    expiryDate: '2024-01-15',
    cycle: 'Semanal',
    cycleRef: 'Semana 3 - Janeiro',
    actionTaken: 'Retirado do estoque',
    reason: 'Vencimento próximo',
    supplier: 'João Silva',
    originalValue: 54.00
  },
  {
    id: 2,
    product: 'Alface Hidropônica',
    quantity: 8,
    unit: 'unidades',
    expiryDate: '2024-01-12',
    cycle: 'Quinzenal',
    cycleRef: 'Quinzena 1 - Janeiro',
    actionTaken: 'Descartado',
    reason: 'Deterioração',
    supplier: 'Maria Santos',
    originalValue: 22.40
  },
  {
    id: 3,
    product: 'Cenoura Baby',
    quantity: 5,
    unit: 'kg',
    expiryDate: '2024-01-10',
    cycle: 'Semanal',
    cycleRef: 'Semana 2 - Janeiro',
    actionTaken: 'Doado',
    reason: 'Aparência comprometida',
    supplier: 'Fazenda Verde',
    originalValue: 31.00
  },
  {
    id: 4,
    product: 'Rúcula Orgânica',
    quantity: 15,
    unit: 'maços',
    expiryDate: '2024-01-08',
    cycle: 'Semanal',
    cycleRef: 'Semana 1 - Janeiro',
    actionTaken: 'Compostagem',
    reason: 'Vencimento',
    supplier: 'Cooperativa Rural',
    originalValue: 42.00
  }
];

const ProdutosVencidos = () => {
  const [expiredProducts, setExpiredProducts] = useState(mockExpiredProducts);
  const [filters, setFilters] = useState({
    cycle: 'all',
    period: 'current_month',
    customDateFrom: null as Date | null,
    customDateTo: null as Date | null,
    product: 'all',
    action: 'all'
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved filters
  useEffect(() => {
    const savedFilters = localStorage.getItem('da.fx.vencidos.filters');
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      setFilters(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('da.fx.vencidos.filters', JSON.stringify(filters));
  }, [filters]);

  const handleExportCSV = () => {
    // Mock CSV export with filtered data
    const csvData = filteredProducts.map(product => ({
      'Produto': product.product,
      'Quantidade': `${product.quantity} ${product.unit}`,
      'Data de Validade': new Date(product.expiryDate).toLocaleDateString('pt-BR'),
      'Ciclo': product.cycle,
      'Referência': product.cycleRef,
      'Ação Tomada': product.actionTaken,
      'Motivo': product.reason,
      'Valor Original': `R$ ${product.originalValue.toFixed(2).replace('.', ',')}`
    }));

    // In a real implementation, this would generate and download a CSV file
    toast({
      title: "Arquivo CSV gerado",
      description: `Relatório com ${csvData.length} produtos vencidos exportado.`,
    });
  };

  const getActionBadge = (action: string) => {
    const actionConfig = {
      'Retirado do estoque': { 
        label: 'Retirado', 
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      'Descartado': { 
        label: 'Descartado', 
        className: 'bg-red-100 text-red-800 border-red-200'
      },
      'Doado': { 
        label: 'Doado', 
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      'Compostagem': { 
        label: 'Compostagem', 
        className: 'bg-green-100 text-green-800 border-green-200'
      }
    };
    
    const config = actionConfig[action as keyof typeof actionConfig] || actionConfig['Retirado do estoque'];
    return (
      <Badge variant="outline" className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getCycleBadge = (cycle: string) => {
    const cycleConfig = {
      'Semanal': 'bg-purple-100 text-purple-800 border-purple-200',
      'Quinzenal': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Mensal': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    
    const className = cycleConfig[cycle as keyof typeof cycleConfig] || cycleConfig['Semanal'];
    return (
      <Badge variant="outline" className={`text-xs ${className}`}>
        {cycle}
      </Badge>
    );
  };

  // Filter products based on current filters
  const filteredProducts = expiredProducts.filter(product => {
    const expiryDate = new Date(product.expiryDate);
    const today = new Date();
    
    // Period filter
    let periodMatch = true;
    switch (filters.period) {
      case 'current_month':
        periodMatch = expiryDate.getMonth() === today.getMonth() && 
                     expiryDate.getFullYear() === today.getFullYear();
        break;
      case 'last_3_months':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        periodMatch = expiryDate >= threeMonthsAgo;
        break;
      case 'custom':
        if (filters.customDateFrom && filters.customDateTo) {
          periodMatch = expiryDate >= filters.customDateFrom && 
                       expiryDate <= filters.customDateTo;
        }
        break;
    }

    // Cycle filter
    const cycleMatch = filters.cycle === 'all' || product.cycle === filters.cycle;

    // Product filter
    const productMatch = filters.product === 'all' || product.product === filters.product;

    // Action filter
    const actionMatch = filters.action === 'all' || product.actionTaken === filters.action;

    return periodMatch && cycleMatch && productMatch && actionMatch;
  });

  const totalQuantity = filteredProducts.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = filteredProducts.reduce((sum, product) => sum + product.originalValue, 0);

  // Get unique values for filter options
  const uniqueCycles = [...new Set(expiredProducts.map(p => p.cycle))];
  const uniqueProducts = [...new Set(expiredProducts.map(p => p.product))];
  const uniqueActions = [...new Set(expiredProducts.map(p => p.actionTaken))];

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
            <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary flex items-center space-x-2">
              <AlertTriangle className="w-7 h-7 text-red-500" />
              <span>Produtos com Validade Vencida</span>
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Controle de produtos retirados por vencimento
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 self-start lg:self-auto"
            onClick={handleExportCSV}
          >
            <FileText className="w-4 h-4" />
            <span>Exportar CSV</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-3">
              <div className="text-center">
                <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs opacity-90">Total Vencidos</p>
                <p className="text-lg font-bold">{filteredProducts.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-3">
              <div className="text-center">
                <Package className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs opacity-90">Quantidade</p>
                <p className="text-lg font-bold">{totalQuantity}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-3">
              <div className="text-center">
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs opacity-90">Valor Perdido</p>
                <p className="text-lg font-bold">R$ {totalValue.toFixed(2).replace('.', ',')}</p>
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
                <Label className="text-xs">Tipo de Ciclo</Label>
                <Select value={filters.cycle} onValueChange={(value) => setFilters(prev => ({ ...prev, cycle: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueCycles.map(cycle => (
                      <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
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
                <Label className="text-xs">Ação Tomada</Label>
                <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
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

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <Package className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground">Nenhum produto vencido encontrado</h3>
                  <p className="text-sm text-muted-foreground">
                    Não há registros de produtos vencidos no período selecionado.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
              </div>
              {filteredProducts.map((product) => (
                <Card key={product.id} className="shadow-sm border-l-4 border-l-red-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span>{product.product}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                          {getActionBadge(product.actionTaken)}
                          {getCycleBadge(product.cycle)}
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {product.cycleRef}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {product.quantity} {product.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          R$ {product.originalValue.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Data de Validade:</span>
                        <p className="font-medium text-red-700">
                          {new Date(product.expiryDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Motivo:</span>
                        <p className="font-medium">{product.reason}</p>
                      </div>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-800">Ação Tomada</p>
                          <p className="text-xs text-red-600">{product.actionTaken}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-red-600">Fornecedor</p>
                          <p className="text-sm font-medium text-red-800">{product.supplier}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default ProdutosVencidos;