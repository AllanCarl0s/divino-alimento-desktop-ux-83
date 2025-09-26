import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Plus, Store, MapPin, Package, Trash2, Edit, Save, Search, Filter, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProducts = [
  { id: 1, name: 'Tomate Orgânico', price: 7.50 },
  { id: 2, name: 'Alface Hidropônica', price: 1.50 },
  { id: 3, name: 'Cenoura Baby', price: 8.00 },
  { id: 4, name: 'Brócolis', price: 6.00 }
];

const mockMarketAdministrators = [
  { id: 1, name: 'João Silva', email: 'joao.silva@admin.com' },
  { id: 2, name: 'Maria Santos', email: 'maria.santos@admin.com' },
  { id: 3, name: 'Pedro Costa', email: 'pedro.costa@admin.com' },
  { id: 4, name: 'Ana Paula', email: 'ana.paula@admin.com' }
];

const marketTypeOptions = [
  { value: 'cesta', label: 'Cesta' },
  { value: 'lote', label: 'Lote' },
  { value: 'venda_direta', label: 'Venda Direta' }
];

const mockMarkets = [
  {
    id: 1,
    name: 'Mercado Central',
    deliveryPoints: ['Centro', 'Zona Norte'],
    products: [1, 2, 3],
    totalProducts: 3,
    type: 'cesta',
    administratorId: 1,
    administrativeFee: 5
  },
  {
    id: 2,
    name: 'Feira Livre',
    deliveryPoints: ['Bairro Alto', 'Vila Nova'],
    products: [2, 4],
    totalProducts: 2,
    type: 'venda_direta',
    administratorId: 2,
    administrativeFee: null
  }
];

const AdminMercados = () => {
  const [markets, setMarkets] = useState(mockMarkets);
  const [selectedMarket, setSelectedMarket] = useState<typeof mockMarkets[0] | null>(null);
  const [isEditingMarket, setIsEditingMarket] = useState(false);
  const [editData, setEditData] = useState<typeof mockMarkets[0] | null>(null);
  const [newMarket, setNewMarket] = useState({ 
    name: '', 
    deliveryPoints: [''], 
    products: [] as number[],
    type: '',
    administratorId: null as number | null,
    administrativeFee: null as number | null
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const addDeliveryPoint = () => {
    setNewMarket(prev => ({
      ...prev,
      deliveryPoints: [...prev.deliveryPoints, '']
    }));
  };

  const updateDeliveryPoint = (index: number, value: string) => {
    setNewMarket(prev => ({
      ...prev,
      deliveryPoints: prev.deliveryPoints.map((point, i) => i === index ? value : point)
    }));
  };

  const removeDeliveryPoint = (index: number) => {
    setNewMarket(prev => ({
      ...prev,
      deliveryPoints: prev.deliveryPoints.filter((_, i) => i !== index)
    }));
  };

  const toggleProduct = (productId: number) => {
    setNewMarket(prev => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId]
    }));
  };

  const toggleAllProducts = () => {
    setNewMarket(prev => ({
      ...prev,
      products: prev.products.length === mockProducts.length 
        ? [] 
        : mockProducts.map(p => p.id)
    }));
  };

  const toggleAllEditProducts = () => {
    if (!editData) return;
    
    setEditData(prev => {
      if (!prev) return prev;
      
      const newProducts = prev.products.length === mockProducts.length 
        ? [] 
        : mockProducts.map(p => p.id);
        
      return {
        ...prev,
        products: newProducts,
        totalProducts: newProducts.length
      };
    });
  };

  const getProductName = (id: number) => {
    return mockProducts.find(p => p.id === id)?.name || '';
  };

  const getAdministratorName = (id: number | null) => {
    if (!id) return '';
    return mockMarketAdministrators.find(admin => admin.id === id)?.name || '';
  };

  const getMarketTypeLabel = (type: string) => {
    return marketTypeOptions.find(option => option.value === type)?.label || '';
  };

  const startEditMarket = (market: typeof mockMarkets[0]) => {
    setEditData({...market});
    setIsEditingMarket(true);
  };

  const saveEditMarket = () => {
    if (!editData) return;
    
    setMarkets(prev => prev.map(m => m.id === editData.id ? editData : m));
    setSelectedMarket(editData);
    setIsEditingMarket(false);
    
    toast({
      title: "Sucesso",
      description: "Mercado atualizado com sucesso",
    });
  };

  const cancelEditMarket = () => {
    setEditData(null);
    setIsEditingMarket(false);
  };

  const filteredMarkets = markets.filter(market =>
    market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.deliveryPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const saveMarket = () => {
    if (!newMarket.name || newMarket.deliveryPoints.some(point => !point.trim()) || !newMarket.type || !newMarket.administratorId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const market = {
      id: markets.length + 1,
      name: newMarket.name,
      deliveryPoints: newMarket.deliveryPoints.filter(point => point.trim()),
      products: newMarket.products,
      totalProducts: newMarket.products.length,
      type: newMarket.type,
      administratorId: newMarket.administratorId,
      administrativeFee: newMarket.administrativeFee
    };

    setMarkets([...markets, market]);
    setNewMarket({ name: '', deliveryPoints: [''], products: [], type: '', administratorId: null, administrativeFee: null });
    setIsDialogOpen(false);
    setSelectedMarket(market); // Auto-select new market
    
    toast({
      title: "Sucesso",
      description: "Mercado criado com sucesso",
    });
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Page Header - Desktop 12 col */}
        <div className="lg:col-span-12 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary flex items-center justify-center lg:justify-start">
                <Store className="w-6 h-6 lg:w-8 lg:h-8 mr-3" />
                Cadastro de Mercados
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
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar mercados..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Add Button for Desktop and Mobile */}
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
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedMarket?.id === market.id 
                      ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                      : 'hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedMarket(market)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
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
                        <div className="flex items-center space-x-1 mt-1">
                          <Package className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {market.totalProducts} produtos
                          </span>
                        </div>
                      </div>
                      
                      {selectedMarket?.id === market.id && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredMarkets.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Nenhum mercado encontrado' : 'Nenhum mercado cadastrado'}
                    </p>
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
                  <Button 
                    variant="outline" 
                    onClick={() => startEditMarket(selectedMarket)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
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
                        <Select
                          value={editData?.type || ''}
                          onValueChange={(value) => setEditData(prev => prev ? { ...prev, type: value } : null)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {marketTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                          <span className="text-sm font-medium">{getMarketTypeLabel(selectedMarket.type)}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Administrador Responsável</Label>
                      {isEditingMarket ? (
                        <Select
                          value={editData?.administratorId?.toString() || ''}
                          onValueChange={(value) => setEditData(prev => prev ? { ...prev, administratorId: parseInt(value) } : null)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecione o administrador" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockMarketAdministrators.map((admin) => (
                              <SelectItem key={admin.id} value={admin.id.toString()}>
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4" />
                                  <span>{admin.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{getAdministratorName(selectedMarket.administratorId)}</span>
                          </div>
                        </div>
                      )}
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
                      <div className="mt-2 p-3 bg-success/10 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-sm font-medium text-success">Ativo</span>
                        </div>
                      </div>
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

                <Separator />

                {/* Products */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">Produtos Ofertados</h4>
                    {isEditingMarket && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleAllEditProducts}
                      >
                        {editData?.products.length === mockProducts.length 
                          ? "Desmarcar Todos" 
                          : "Todos os produtos"
                        }
                      </Button>
                    )}
                  </div>
                  
                  {isEditingMarket ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {mockProducts.map((product) => (
                        <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={`edit-product-${product.id}`}
                            checked={editData?.products.includes(product.id) || false}
                            onCheckedChange={(checked) => {
                              const currentProducts = editData?.products || [];
                              const newProducts = checked
                                ? [...currentProducts, product.id]
                                : currentProducts.filter(id => id !== product.id);
                              setEditData(prev => prev ? { 
                                ...prev, 
                                products: newProducts, 
                                totalProducts: newProducts.length 
                              } : null);
                            }}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`edit-product-${product.id}`} className="text-sm font-medium">
                              {product.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              R$ {product.price.toFixed(2)}/kg
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {selectedMarket.products.map((productId) => {
                        const product = mockProducts.find(p => p.id === productId);
                        return product ? (
                          <div key={productId} className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <Package className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                R$ {product.price.toFixed(2)}/kg
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Statistics - Desktop Only */}
                <div className="hidden lg:block">
                  <Separator />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <Card className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-lg font-bold text-foreground">{selectedMarket.deliveryPoints.length}</div>
                        <div className="text-xs text-muted-foreground">Pontos de Entrega</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-lg font-bold text-foreground">{selectedMarket.totalProducts}</div>
                        <div className="text-xs text-muted-foreground">Produtos Ofertados</div>
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
        <DialogContent className="sm:max-w-[600px] lg:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Novo Mercado</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Informações Básicas</h4>
                
                <div>
                  <Label htmlFor="newMarketName">Nome do Mercado *</Label>
                  <Input
                    id="newMarketName"
                    value={newMarket.name}
                    onChange={(e) => setNewMarket(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Mercado Central"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="marketType">Tipo de Mercado *</Label>
                  <Select
                    value={newMarket.type}
                    onValueChange={(value) => setNewMarket(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {marketTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="administrator">Administrador Responsável *</Label>
                  <Select
                    value={newMarket.administratorId?.toString() || ''}
                    onValueChange={(value) => setNewMarket(prev => ({ ...prev, administratorId: parseInt(value) }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o administrador" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMarketAdministrators.map((admin) => (
                        <SelectItem key={admin.id} value={admin.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{admin.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="administrativeFee">Taxa Administrativa (%)</Label>
                  <Input
                    id="administrativeFee"
                    type="number"
                    value={newMarket.administrativeFee || ''}
                    onChange={(e) => setNewMarket(prev => ({ 
                      ...prev, 
                      administrativeFee: e.target.value ? parseFloat(e.target.value) : null 
                    }))}
                    placeholder="Ex: 5.0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Delivery Points */}
              <div className="space-y-4">
                <h4 className="font-medium">Locais de Entrega</h4>
                
                {newMarket.deliveryPoints.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={point}
                      onChange={(e) => updateDeliveryPoint(index, e.target.value)}
                      placeholder="Ex: Centro, Zona Norte"
                    />
                    {newMarket.deliveryPoints.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliveryPoint(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDeliveryPoint}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Ponto
                </Button>
              </div>
            </div>

            {/* Products Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Produtos Ofertados</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAllProducts}
                >
                  {newMarket.products.length === mockProducts.length 
                    ? "Desmarcar Todos" 
                    : "Todos os produtos"
                  }
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={newMarket.products.includes(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`product-${product.id}`} className="text-sm font-medium">
                        {product.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        R$ {product.price.toFixed(2)}/kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={saveMarket} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Criar Mercado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default AdminMercados;