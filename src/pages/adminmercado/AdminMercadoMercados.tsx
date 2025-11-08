import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { FiltersBar } from '@/components/admin/FiltersBar';
import { FiltersPanel } from '@/components/admin/FiltersPanel';
import { useFilters } from '@/hooks/useFilters';
import { ArrowLeft, Plus, Store, MapPin, Trash2, Edit, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data - administrador atual (em produção viria do contexto de autenticação)
const CURRENT_ADMIN_ID = 1;
const CURRENT_ADMIN_NAME = 'João Silva';

const marketTypeOptions = [
  { value: 'cesta', label: 'Cesta' },
  { value: 'lote', label: 'Lote' },
  { value: 'venda_direta', label: 'Venda Direta' }
];

type MarketType = {
  id: number;
  name: string;
  deliveryPoints: string[];
  type: string;
  valorMaximoCesta?: number | null;
  administratorId: number;
  administratorName: string;
  administrativeFee: number | null;
  status: 'ativo' | 'inativo';
};

const mockMarkets: MarketType[] = [
  {
    id: 1,
    name: 'Mercado Central',
    deliveryPoints: ['Centro', 'Zona Norte'],
    type: 'cesta',
    valorMaximoCesta: 150.00,
    administratorId: 1,
    administratorName: 'João Silva',
    administrativeFee: 5,
    status: 'ativo'
  },
  {
    id: 2,
    name: 'Mercado Verde',
    deliveryPoints: ['Bairro Alto', 'Vila Nova'],
    type: 'venda_direta',
    administratorId: 1,
    administratorName: 'João Silva',
    administrativeFee: null,
    status: 'ativo'
  }
];

const AdminMercadoMercados = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    filters,
    debouncedSearch,
    updateFilter, 
    toggleArrayValue, 
    clearFilters, 
    clearFilterGroup,
    getActiveChips, 
    hasActiveFilters,
    isOpen,
    setIsOpen 
  } = useFilters('/adminmercado/mercados');

  // Filtrar apenas mercados do administrador atual
  const [markets, setMarkets] = useState<MarketType[]>(
    mockMarkets.filter(m => m.administratorId === CURRENT_ADMIN_ID)
  );
  const [selectedMarket, setSelectedMarket] = useState<MarketType | null>(null);
  const [isEditingMarket, setIsEditingMarket] = useState(false);
  const [editData, setEditData] = useState<MarketType | null>(null);
  const [newMarket, setNewMarket] = useState({ 
    name: '', 
    deliveryPoints: [''], 
    type: '',
    valorMaximoCesta: null as number | null,
    administrativeFee: null as number | null,
    status: 'ativo' as 'ativo' | 'inativo'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marketToDelete, setMarketToDelete] = useState<number | null>(null);

  const getMarketTypeLabel = (type: string) => {
    return marketTypeOptions.find(option => option.value === type)?.label || '';
  };

  const startEditMarket = (market: typeof markets[0]) => {
    setEditData({...market});
    setIsEditingMarket(true);
  };

  const saveEditMarket = () => {
    if (!editData) return;
    
    // Validação: não permitir alterar o administrador responsável
    if (editData.administratorId !== CURRENT_ADMIN_ID) {
      toast({
        title: "Erro",
        description: "Você só pode gerenciar os mercados sob sua responsabilidade.",
        variant: "destructive"
      });
      return;
    }
    
    setMarkets(prev => prev.map(m => m.id === editData.id ? editData : m));
    setSelectedMarket(editData);
    setIsEditingMarket(false);
    
    toast({
      title: "Sucesso",
      description: "Alterações salvas com sucesso",
    });
  };

  const cancelEditMarket = () => {
    setEditData(null);
    setIsEditingMarket(false);
  };

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    if (debouncedSearch) {
      result = result.filter(market =>
        market.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        market.deliveryPoints.some(point => point.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    if (filters.status.length > 0) {
      result = result.filter(market => filters.status.includes(market.status));
    }

    if (filters.tipo.length > 0) {
      result = result.filter(market => filters.tipo.includes(market.type));
    }

    return result;
  }, [markets, filters, debouncedSearch]);

  const saveMarket = () => {
    if (!newMarket.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do mercado não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    if (!newMarket.type) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de mercado",
        variant: "destructive"
      });
      return;
    }

    if (newMarket.type === 'cesta' && (!newMarket.valorMaximoCesta || newMarket.valorMaximoCesta <= 0)) {
      toast({
        title: "Erro",
        description: "Informe o valor máximo por cesta",
        variant: "destructive"
      });
      return;
    }

    const validDeliveryPoints = newMarket.deliveryPoints.filter(point => point.trim());
    if (validDeliveryPoints.length === 0) {
      toast({
        title: "Erro",
        description: "Ao menos um ponto de entrega deve estar vinculado",
        variant: "destructive"
      });
      return;
    }

    if (newMarket.administrativeFee !== null && (newMarket.administrativeFee < 0 || newMarket.administrativeFee > 100)) {
      toast({
        title: "Erro",
        description: "Taxa administrativa deve estar entre 0 e 100%",
        variant: "destructive"
      });
      return;
    }

    const market = {
      id: markets.length + 1,
      name: newMarket.name,
      deliveryPoints: validDeliveryPoints,
      type: newMarket.type,
      valorMaximoCesta: newMarket.type === 'cesta' ? newMarket.valorMaximoCesta : undefined,
      administratorId: CURRENT_ADMIN_ID,
      administratorName: CURRENT_ADMIN_NAME,
      administrativeFee: newMarket.administrativeFee,
      status: newMarket.status
    };

    setMarkets([...markets, market]);
    setNewMarket({ name: '', deliveryPoints: [''], type: '', valorMaximoCesta: null, administrativeFee: null, status: 'ativo' });
    setIsDialogOpen(false);
    setSelectedMarket(market);
    
    toast({
      title: "Sucesso",
      description: "Mercado criado com sucesso",
    });
  };

  const confirmDeleteMarket = (marketId: number) => {
    setMarketToDelete(marketId);
    setDeleteDialogOpen(true);
  };

  const deleteMarket = () => {
    if (marketToDelete === null) return;

    setMarkets(prev => prev.filter(m => m.id !== marketToDelete));
    
    if (selectedMarket?.id === marketToDelete) {
      setSelectedMarket(null);
      setIsEditingMarket(false);
    }

    toast({
      title: "Sucesso",
      description: "Mercado excluído com sucesso",
    });

    setDeleteDialogOpen(false);
    setMarketToDelete(null);
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/adminmercado/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Page Header - Desktop 12 col */}
        <div className="lg:col-span-12 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-left mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary">
                Administrador de mercado - Cadastro de Mercados
              </h1>
              <p className="text-sm lg:text-lg text-muted-foreground mt-2">
                Gerencie mercados e pontos de entrega
              </p>
            </div>

            {/* Desktop Stats */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
              <Card className="text-center bg-primary/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{markets.length}</div>
                  <div className="text-xs text-muted-foreground">Total Mercados</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-accent/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent">
                    {markets.reduce((acc, m) => acc + m.deliveryPoints.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Pontos de Entrega</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Left Panel - Markets List (Desktop 4 col) */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 space-y-4">
            
            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg">Lista de Mercados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Filtros e Busca */}
                <FiltersBar
                  searchValue={filters.search}
                  onSearchChange={(value) => updateFilter('search', value)}
                  onFiltersClick={() => setIsOpen(true)}
                  activeChips={getActiveChips()}
                  onRemoveChip={clearFilterGroup}
                  resultCount={filteredMarkets.length}
                  hasActiveFilters={hasActiveFilters()}
                  filtersOpen={isOpen}
                />

                {/* Add Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Mercado
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>

            {/* Markets List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredMarkets.map((market) => (
                <Card 
                  key={market.id} 
                  className={`transition-all hover:shadow-md ${
                    selectedMarket?.id === market.id 
                      ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                      : 'hover:border-primary/30'
                  }`}
                >
                  <CardContent className="p-4">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setSelectedMarket(market)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {market.name}
                          </h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {market.deliveryPoints.length} pontos
                            </span>
                          </div>
                          <div className="mt-2">
                            <Badge 
                              variant={market.status === 'ativo' ? 'default' : 'secondary'}
                              className={market.status === 'ativo' ? 'bg-success text-white' : ''}
                            >
                              {market.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                        
                        {selectedMarket?.id === market.id && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMarket(market);
                            startEditMarket(market);
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteMarket(market.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                  </CardContent>
                </Card>
              ))}

              {filteredMarkets.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center space-y-4">
                    <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {hasActiveFilters() 
                        ? 'Sem resultados para os filtros selecionados.' 
                        : 'Nenhum mercado cadastrado'}
                    </p>
                    {hasActiveFilters() && (
                      <Button variant="outline" onClick={clearFilters}>
                        Limpar filtros
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Market Details/Edit (Desktop 8 col) */}
        <div className="lg:col-span-8">
          {selectedMarket ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg lg:text-xl flex items-center space-x-3">
                    <Store className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    <span>{selectedMarket.name}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Detalhes e configurações do mercado
                  </p>
                </div>
                
                {!isEditingMarket ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => startEditMarket(selectedMarket)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => confirmDeleteMarket(selectedMarket.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={cancelEditMarket}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={saveEditMarket}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Market Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Informações Básicas</h4>
                    
                    <div>
                      <Label htmlFor="marketName">Nome do Mercado</Label>
                      <Input
                        id="marketName"
                        value={isEditingMarket ? editData?.name || '' : selectedMarket.name}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, name: e.target.value } : null)}
                        disabled={!isEditingMarket}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Tipo de Mercado</Label>
                      {isEditingMarket ? (
                        <div className="mt-2">
                          <RadioGroup
                            value={editData?.type || ''}
                            onValueChange={(value: string) => 
                              setEditData(prev => prev ? { ...prev, type: value } : null)
                            }
                          >
                            {marketTypeOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`edit-market-type-${option.value}`} />
                                <Label
                                  htmlFor={`edit-market-type-${option.value}`}
                                  className="cursor-pointer font-normal"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          
                          {editData?.type === 'cesta' && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="edit-valorMaximoCesta">Valor Máximo por Cesta *</Label>
                              <Input
                                id="edit-valorMaximoCesta"
                                type="text"
                                value={editData.valorMaximoCesta !== null && editData.valorMaximoCesta !== undefined ? String(editData.valorMaximoCesta).replace('.', ',') : ''}
                                onChange={(e) => {
                                  const value = e.target.value.replace(',', '.');
                                  setEditData(prev => prev ? { 
                                    ...prev, 
                                    valorMaximoCesta: value ? parseFloat(value) : null 
                                  } : null);
                                }}
                                placeholder="Ex: 150,00"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                          <span className="text-sm font-medium">{getMarketTypeLabel(selectedMarket.type)}</span>
                          {selectedMarket.type === 'cesta' && selectedMarket.valorMaximoCesta && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Valor Máximo por Cesta: R$ {selectedMarket.valorMaximoCesta.toFixed(2).replace('.', ',')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Administrador Responsável</Label>
                      <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                        <span className="text-sm font-medium">{CURRENT_ADMIN_NAME}</span>
                        <p className="text-xs text-muted-foreground mt-1">Este campo não pode ser alterado</p>
                      </div>
                    </div>

                    <div>
                      <Label>Taxa Administrativa (%)</Label>
                      {isEditingMarket ? (
                        <Input
                          type="number"
                          value={editData?.administrativeFee || ''}
                          onChange={(e) => setEditData(prev => prev ? { 
                            ...prev, 
                            administrativeFee: e.target.value ? parseFloat(e.target.value) : null 
                          } : null)}
                          placeholder="Ex: 5.0"
                          min="0"
                          max="100"
                          step="0.1"
                          className="mt-2"
                        />
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                          <span className="text-sm font-medium">
                            {selectedMarket.administrativeFee ? `${selectedMarket.administrativeFee}%` : 'Não aplicável'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Status</Label>
                      {isEditingMarket ? (
                        <RadioGroup
                          value={editData?.status || 'ativo'}
                          onValueChange={(value: 'ativo' | 'inativo') => 
                            setEditData(prev => prev ? { ...prev, status: value } : null)
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ativo" id="edit-status-ativo" />
                            <Label htmlFor="edit-status-ativo" className="cursor-pointer">Ativo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inativo" id="edit-status-inativo" />
                            <Label htmlFor="edit-status-inativo" className="cursor-pointer">Inativo</Label>
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className={`mt-2 p-3 rounded-lg border ${
                          selectedMarket.status === 'ativo' ? 'bg-success/10' : 'bg-muted/30'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedMarket.status === 'ativo' ? 'bg-success' : 'bg-muted-foreground'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                              selectedMarket.status === 'ativo' ? 'text-success' : 'text-muted-foreground'
                            }`}>
                              {selectedMarket.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Points */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Pontos de Entrega</h4>
                    
                    {isEditingMarket ? (
                      <div className="space-y-2">
                        {editData?.deliveryPoints.map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={point}
                              onChange={(e) => {
                                const newPoints = [...(editData?.deliveryPoints || [])];
                                newPoints[index] = e.target.value;
                                setEditData(prev => prev ? { ...prev, deliveryPoints: newPoints } : null);
                              }}
                              placeholder="Nome do ponto de entrega"
                            />
                            {editData?.deliveryPoints.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newPoints = editData?.deliveryPoints.filter((_, i) => i !== index) || [];
                                  setEditData(prev => prev ? { ...prev, deliveryPoints: newPoints } : null);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditData(prev => prev ? { 
                              ...prev, 
                              deliveryPoints: [...prev.deliveryPoints, '']
                            } : null);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Ponto
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedMarket.deliveryPoints.map((point, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics - Desktop Only */}
                <div className="hidden lg:block">
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Card className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-lg font-bold text-foreground">{selectedMarket.deliveryPoints.length}</div>
                        <div className="text-xs text-muted-foreground">Pontos de Entrega</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-lg font-bold text-foreground">100%</div>
                        <div className="text-xs text-muted-foreground">Disponibilidade</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 lg:p-16 text-center">
                <Store className="w-16 h-16 lg:w-24 lg:h-24 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-lg lg:text-xl font-medium text-foreground mb-2">
                  Selecione um Mercado
                </h3>
                <p className="text-muted-foreground lg:text-base">
                  Escolha um mercado na lista ao lado para ver os detalhes e fazer edições.
                </p>
                <div className="mt-6 lg:hidden">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Mercado
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Market Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[min(1280px,95vw)] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">Novo Mercado</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
              
              {/* Left Column - Basic Information */}
              <div className="space-y-4 min-w-0">
                <h4 className="font-semibold text-foreground border-b pb-2 mb-4">
                  Informações Básicas
                </h4>
                
                <div className="space-y-2">
                  <Label htmlFor="newMarketName" className="text-sm font-medium">
                    Nome do Mercado *
                  </Label>
                  <Input
                    id="newMarketName"
                    value={newMarket.name}
                    onChange={(e) => setNewMarket(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Mercado Central"
                    className="h-11"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Tipo de Mercado *
                  </Label>
                  <RadioGroup
                    value={newMarket.type}
                    onValueChange={(value: string) => 
                      setNewMarket(prev => ({ ...prev, type: value }))
                    }
                  >
                    {marketTypeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`market-type-${option.value}`} />
                        <Label
                          htmlFor={`market-type-${option.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {newMarket.type === 'cesta' && (
                  <div className="space-y-2">
                    <Label htmlFor="valorMaximoCesta" className="text-sm font-medium">
                      Valor Máximo por Cesta *
                    </Label>
                    <Input
                      id="valorMaximoCesta"
                      type="text"
                      value={newMarket.valorMaximoCesta !== null ? String(newMarket.valorMaximoCesta).replace('.', ',') : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(',', '.');
                        setNewMarket(prev => ({ 
                          ...prev, 
                          valorMaximoCesta: value ? parseFloat(value) : null 
                        }));
                      }}
                      placeholder="Ex: 150,00"
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Administrador Responsável *
                  </Label>
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <span className="text-sm font-medium">{CURRENT_ADMIN_NAME}</span>
                    <p className="text-xs text-muted-foreground mt-1">Você será automaticamente definido como administrador responsável</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="administrativeFee" className="text-sm font-medium">
                    Taxa Administrativa (%)
                  </Label>
                  <Input
                    id="administrativeFee"
                    type="text"
                    value={newMarket.administrativeFee !== null ? String(newMarket.administrativeFee).replace('.', ',') : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(',', '.');
                      setNewMarket(prev => ({ 
                        ...prev, 
                        administrativeFee: value ? parseFloat(value) : null 
                      }));
                    }}
                    placeholder="Ex: 5,0"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status *</Label>
                  <RadioGroup
                    value={newMarket.status}
                    onValueChange={(value: 'ativo' | 'inativo') => 
                      setNewMarket(prev => ({ ...prev, status: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ativo" id="status-ativo" />
                      <Label htmlFor="status-ativo" className="cursor-pointer">Ativo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inativo" id="status-inativo" />
                      <Label htmlFor="status-inativo" className="cursor-pointer">Inativo</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Right Column - Delivery Points */}
              <div className="space-y-4 min-w-0">
                <h4 className="font-semibold text-foreground border-b pb-2 mb-4">
                  Pontos de Entrega *
                </h4>
                
                <div className="space-y-3">
                  {newMarket.deliveryPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...newMarket.deliveryPoints];
                          newPoints[index] = e.target.value;
                          setNewMarket(prev => ({ ...prev, deliveryPoints: newPoints }));
                        }}
                        placeholder={`Ponto ${index + 1}`}
                        className="h-11"
                      />
                      {newMarket.deliveryPoints.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setNewMarket(prev => ({
                              ...prev,
                              deliveryPoints: prev.deliveryPoints.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewMarket(prev => ({
                        ...prev,
                        deliveryPoints: [...prev.deliveryPoints, '']
                      }));
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Ponto de Entrega
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-end space-x-3 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveMarket}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Mercado
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este mercado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMarket} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters Panel */}
      <FiltersPanel
        open={isOpen}
        onOpenChange={setIsOpen}
        onApply={() => {}}
        onClear={clearFilters}
      >
        <div className="space-y-4">
          <Label>Status</Label>
          <div className="space-y-2">
            {['ativo', 'inativo'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleArrayValue('status', status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium cursor-pointer capitalize"
                >
                  {status === 'ativo' ? 'Ativo' : 'Inativo'}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Tipo de Mercado</Label>
          <div className="space-y-2">
            {marketTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo-${option.value}`}
                  checked={filters.tipo.includes(option.value)}
                  onCheckedChange={() => toggleArrayValue('tipo', option.value)}
                />
                <label
                  htmlFor={`tipo-${option.value}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
};

export default AdminMercadoMercados;
