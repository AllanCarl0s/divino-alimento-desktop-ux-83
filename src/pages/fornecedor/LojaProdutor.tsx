import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Plus, Package, MapPin, Calendar, Edit, Eye, Trash2, Settings, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Tomate Orgânico',
    unit: 'kg',
    conversionFactor: 1,
    status: 'ativo',
    certified: true,
    familyFarming: true,
    harvestPeriod: 'Março a Junho',
    markets: ['Mercado Central', 'Feira Livre'],
    phase: 'colheita',
    lastUpdate: '2024-01-15',
    valor: 4.50,
    previsaoKg: 120
  },
  {
    id: 2,
    name: 'Alface Hidropônica',
    unit: 'unidade',
    conversionFactor: 0.3,
    status: 'aguardando',
    certified: false,
    familyFarming: true,
    harvestPeriod: 'Todo ano',
    markets: [],
    phase: 'plantio',
    lastUpdate: '2024-01-20',
    valor: 2.80,
    previsaoKg: 45
  },
  {
    id: 3,
    name: 'Cenoura Baby',
    unit: 'kg',
    conversionFactor: 1,
    status: 'inativo',
    certified: true,
    familyFarming: false,
    harvestPeriod: 'Maio a Agosto',
    markets: ['Supermercado Verde'],
    phase: 'preparacao',
    lastUpdate: '2024-01-10',
    valor: 6.20,
    previsaoKg: 80
  }
];

const mockSchedule = [
  {
    id: 1,
    product: 'Tomate Orgânico',
    plantingDate: '2024-02-15',
    harvestDate: '2024-03-20',
    estimatedKg: 120,
    status: 'Em crescimento',
    phase: 'colheita'
  },
  {
    id: 2,
    product: 'Alface Hidropônica',
    plantingDate: '2024-01-10',
    harvestDate: '2024-02-25',
    estimatedKg: 45,
    status: 'Aguardando plantio',
    phase: 'plantio'
  },
  {
    id: 3,
    product: 'Cenoura Baby',
    plantingDate: '2024-03-01',
    harvestDate: '2024-05-15',
    estimatedKg: 80,
    status: 'Planejado',
    phase: 'preparacao'
  }
];

const LojaProdutor = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [viewMode, setViewMode] = useState('lista');
  const [products, setProducts] = useState(mockProducts);
  const [editModal, setEditModal] = useState({ isOpen: false, product: null as typeof mockProducts[0] | null });
  const [editForm, setEditForm] = useState({
    name: '',
    unit: 'kg',
    conversionFactor: 1,
    certified: false,
    familyFarming: false,
    harvestPeriod: '',
    characteristics: '',
    image: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const openEditModal = (product: typeof mockProducts[0]) => {
    setEditForm({
      name: product.name,
      unit: product.unit,
      conversionFactor: product.conversionFactor,
      certified: product.certified,
      familyFarming: product.familyFarming,
      harvestPeriod: product.harvestPeriod,
      characteristics: '',
      image: ''
    });
    setEditModal({ isOpen: true, product });
  };

  const saveProduct = () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === editModal.product?.id 
        ? { ...p, ...editForm, lastUpdate: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    setEditModal({ isOpen: false, product: null });
    
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: 'Ativo', variant: 'default' as const },
      inativo: { label: 'Inativo', variant: 'secondary' as const },
      aguardando: { label: 'Aguardando Aprovação', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aguardando;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPhaseBadge = (phase: string) => {
    const phaseConfig = {
      preparacao: { label: 'Preparação', color: 'bg-gray-100 text-gray-800' },
      plantio: { label: 'Plantio', color: 'bg-yellow-100 text-yellow-800' },
      crescimento: { label: 'Crescimento', color: 'bg-blue-100 text-blue-800' },
      colheita: { label: 'Colheita', color: 'bg-green-100 text-green-800' }
    };
    
    const config = phaseConfig[phase as keyof typeof phaseConfig] || phaseConfig.preparacao;
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filterProducts = (products: typeof mockProducts) => {
    if (activeTab === 'todos') return products;
    return products.filter(product => product.status === activeTab);
  };

  const filteredProducts = filterProducts(products);

  return (
    <ResponsiveLayout 
      headerContent={null}
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header with Settings */}
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary">Loja do Produtor</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus produtos e ofertas</p>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Button 
              onClick={() => navigate('/fornecedor/pre-cadastro-produtos')}
              size="sm"
              className="flex items-center space-x-1 flex-1 lg:flex-none"
            >
              <Plus className="w-4 h-4" />
              <span className="lg:inline">Produto</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/fornecedor/configuracoes')}
              size="sm"
              className="flex items-center space-x-1 lg:space-x-2 flex-1 lg:flex-none lg:px-4 lg:py-2 lg:h-10"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <span className="font-medium hidden lg:inline">Configurações</span>
            </Button>
          </div>
        </div>

        {/* Quick Access Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/fornecedor/pedidos-aberto')}
            className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:border-primary/40"
          >
            <Package className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-center">Pedidos em Aberto</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/fornecedor/painel-gestao')}
            className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-secondary/5 to-warning/5 border-secondary/20 hover:border-secondary/40"
          >
            <Calendar className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium text-center">Painel de Gestão</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/fornecedor/cronograma')}
            className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:border-accent/40 lg:col-span-1"
          >
            <Calendar className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium text-center">Cronograma</span>
          </Button>
        </div>

        {/* Cronograma de Colheitas */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-poppins text-xl text-gradient-primary flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Cronograma de Colheitas</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Acompanhe o planejamento de produção dos seus produtos
                </p>
              </div>
              <div className="flex rounded-lg bg-muted p-1">
                <Button
                  variant={viewMode === 'lista' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('lista')}
                  className="flex items-center space-x-1"
                >
                  <List className="w-4 h-4" />
                  <span>Lista</span>
                </Button>
                <Button
                  variant={viewMode === 'cronograma' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cronograma')}
                  className="flex items-center space-x-1"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Cronograma</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {viewMode === 'lista' ? (
              <div className="space-y-3">
                {mockSchedule.map((item) => (
                  <Card key={item.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.product}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Plantio:</span>
                          <p className="font-medium">
                            {new Date(item.plantingDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Colheita:</span>
                          <p className="font-medium">
                            {new Date(item.harvestDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Previsão:</span>
                          <p className="font-medium text-primary">
                            {item.estimatedKg}kg
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Calendário por Meses */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                  ].map((month, index) => {
                    const monthNumber = index + 1;
                    const monthActivities = mockSchedule.filter(item => {
                      const plantingMonth = new Date(item.plantingDate).getMonth() + 1;
                      const harvestMonth = new Date(item.harvestDate).getMonth() + 1;
                      return plantingMonth === monthNumber || harvestMonth === monthNumber;
                    });

                    return (
                      <Card key={month} className={`border ${monthActivities.length > 0 ? 'border-primary/30 bg-primary/5' : 'border-border/50'}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-center">
                            {month}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {monthActivities.length > 0 ? (
                            monthActivities.map((activity) => {
                              const plantingMonth = new Date(activity.plantingDate).getMonth() + 1;
                              const harvestMonth = new Date(activity.harvestDate).getMonth() + 1;
                              const isPlanting = plantingMonth === monthNumber;
                              const isHarvest = harvestMonth === monthNumber;
                              
                              return (
                                <div key={activity.id} className="bg-background rounded-lg p-3 border border-border/50">
                                  <h4 className="font-medium text-xs mb-2">{activity.product}</h4>
                                  <div className="space-y-1">
                                    {isPlanting && (
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="text-xs text-muted-foreground">Plantio</span>
                                      </div>
                                    )}
                                    {isHarvest && (
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-muted-foreground">Colheita</span>
                                      </div>
                                    )}
                                    <p className="text-xs font-medium text-primary">
                                      {activity.estimatedKg}kg
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-4">
                              <span className="text-xs text-muted-foreground">Sem atividades</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Legenda */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-3">Legenda:</h4>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Período de Plantio</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Período de Colheita</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-primary/30 rounded-full"></div>
                        <span>Período com Atividades</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline Anual */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Timeline Anual de Produção</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSchedule.map((item) => (
                        <div key={item.id} className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{item.product}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.estimatedKg}kg
                            </Badge>
                          </div>
                          
                          {/* Barra de Timeline */}
                          <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                            {(() => {
                              const plantingMonth = new Date(item.plantingDate).getMonth();
                              const harvestMonth = new Date(item.harvestDate).getMonth();
                              const startPercent = (plantingMonth / 12) * 100;
                              const endPercent = ((harvestMonth + 1) / 12) * 100;
                              const width = endPercent - startPercent;
                              
                              return (
                                <div
                                  className="absolute h-full bg-gradient-to-r from-yellow-200 via-blue-200 to-green-200 rounded-full"
                                  style={{
                                    left: `${startPercent}%`,
                                    width: `${width}%`
                                  }}
                                />
                              );
                            })()}
                            
                            {/* Marcadores de período */}
                            <div className="absolute inset-0 flex">
                              {Array.from({ length: 12 }, (_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 border-r border-border/20 last:border-r-0"
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>
                              Plantio: {new Date(item.plantingDate).toLocaleDateString('pt-BR', { month: 'short' })}
                            </span>
                            <span>
                              Colheita: {new Date(item.harvestDate).toLocaleDateString('pt-BR', { month: 'short' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="ativo" className="text-xs">Ativos</TabsTrigger>
            <TabsTrigger value="inativo" className="text-xs">Inativos</TabsTrigger>
            <TabsTrigger value="aguardando" className="text-xs">Aguardando</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredProducts.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent className="space-y-4">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Nenhum produto encontrado</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'todos' 
                        ? 'Cadastre seu primeiro produto para começar'
                        : `Não há produtos ${activeTab === 'ativo' ? 'ativos' : activeTab === 'inativo' ? 'inativos' : 'aguardando aprovação'}`
                      }
                    </p>
                  </div>
                  <Button onClick={() => navigate('/fornecedor/pre-cadastro')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Produto
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-poppins">
                            {product.name} / Previsão: {product.previsaoKg}kg
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(product.status)}
                            {getPhaseBadge(product.phase)}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="focus-ring"
                            onClick={() => openEditModal(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="focus-ring"
                            onClick={() => navigate('/fornecedor/cronograma')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Unidade:</span>
                          <p className="font-medium">{product.unit} (fator: {product.conversionFactor})</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Período:</span>
                          <p className="font-medium">{product.harvestPeriod}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <p className="font-medium text-primary">R$ {product.valor.toFixed(2)}/kg</p>
                        </div>
                      </div>

                      {product.markets.length > 0 && (
                        <div>
                          <span className="text-muted-foreground text-sm">Mercados Ofertados:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.markets.map((market, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {market}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          {product.certified && (
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Certificado</span>
                            </span>
                          )}
                          {product.familyFarming && (
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span>Agricultura Familiar</span>
                            </span>
                          )}
                        </div>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Atualizado em {new Date(product.lastUpdate).toLocaleDateString('pt-BR')}</span>
                        </span>
                      </div>

                      {product.status === 'ativo' && (
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-primary">Cronograma de Colheitas</p>
                              <p className="text-xs text-muted-foreground">Próxima colheita estimada</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate('/fornecedor/cronograma')}>
                              <Calendar className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Product Modal */}
        <Dialog open={editModal.isOpen} onOpenChange={(open) => setEditModal(prev => ({ ...prev, isOpen: open }))}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Tomate Orgânico"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <select
                    id="unit"
                    value={editForm.unit}
                    onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm bg-background"
                  >
                    <option value="kg">Quilograma (kg)</option>
                    <option value="litro">Litro</option>
                    <option value="unidade">Unidade</option>
                    <option value="duzia">Dúzia</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="factor">Fator (→ kg)</Label>
                  <Input
                    id="factor"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={editForm.conversionFactor}
                    onChange={(e) => setEditForm(prev => ({ ...prev, conversionFactor: parseFloat(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="harvest">Expectativa de Colheita</Label>
                <Input
                  id="harvest"
                  value={editForm.harvestPeriod}
                  onChange={(e) => setEditForm(prev => ({ ...prev, harvestPeriod: e.target.value }))}
                  placeholder="Ex: Março a Junho"
                />
              </div>

              <div>
                <Label htmlFor="valor">Valor por kg</Label>
                <Input
                  id="valor"
                  type="text"
                  value={editModal.product ? `R$ ${editModal.product.valor.toFixed(2)}` : ''}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este valor é definido pelo administrador do sistema
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="certified"
                    checked={editForm.certified}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, certified: !!checked }))}
                  />
                  <Label htmlFor="certified" className="text-sm">Produto Certificado</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="familyFarming"
                    checked={editForm.familyFarming}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, familyFarming: !!checked }))}
                  />
                  <Label htmlFor="familyFarming" className="text-sm">Agricultura Familiar</Label>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEditModal({ isOpen: false, product: null })}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={saveProduct} className="flex-1">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default LojaProdutor;