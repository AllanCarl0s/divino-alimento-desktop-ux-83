import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ReuseOfferModal from '@/components/fornecedor/ReuseOfferModal';
import ProductAnalysisModal from '@/components/fornecedor/ProductAnalysisModal';
import ProductCycleCard from '@/components/fornecedor/ProductCycleCard';
import { Plus, Package, Calendar, Settings, LogOut, AlertTriangle, CheckCircle, Clock, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProductInCycle, PreviousCycleData } from '@/types/product-cycle';

// Mock data - Products in current cycle
const mockCycleProducts: ProductInCycle[] = [
  {
    id: '1',
    productId: 'prod-1',
    name: 'Tomate Orgânico',
    unit: 'kg',
    conversionFactor: 1,
    pricePerUnit: 4.50,
    expiryDate: new Date('2024-02-15'),
    availableQuantity: 120,
    status: 'approved',
    certified: true,
    familyFarming: true,
    description: 'Tomate orgânico cultivado sem agrotóxicos',
    lastUpdated: new Date('2024-01-15'),
    updatedBy: 'João da Silva'
  },
  {
    id: '2',
    productId: 'prod-2',
    name: 'Alface Hidropônica',
    unit: 'unidade',
    conversionFactor: 0.3,
    pricePerUnit: 2.80,
    expiryDate: new Date('2024-02-10'),
    availableQuantity: 45,
    status: 'draft',
    certified: false,
    familyFarming: true,
    description: 'Alface hidropônica fresca',
    lastUpdated: new Date('2024-01-20'),
    updatedBy: 'João da Silva'
  },
  {
    id: '3',
    productId: 'prod-3',
    name: 'Cenoura Baby',
    unit: 'kg',
    conversionFactor: 1,
    status: 'draft',
    certified: true,
    familyFarming: false,
    description: 'Cenoura baby orgânica',
    lastUpdated: new Date('2024-01-10'),
    updatedBy: 'João da Silva'
  }
];

// Mock previous cycle data
const mockPreviousCycle: PreviousCycleData = {
  cycleId: 'cycle-prev',
  totalProducts: 3,
  products: [
    {
      id: 'prev-1',
      productId: 'prod-1',
      name: 'Tomate Orgânico',
      unit: 'kg',
      conversionFactor: 1,
      pricePerUnit: 4.20,
      expiryDate: new Date('2024-01-30'),
      availableQuantity: 100,
      status: 'approved',
      certified: true,
      familyFarming: true,
      lastUpdated: new Date('2024-01-01'),
      updatedBy: 'João da Silva'
    },
    {
      id: 'prev-2',
      productId: 'prod-4',
      name: 'Pepino Japonês',
      unit: 'kg',
      conversionFactor: 1,
      pricePerUnit: 3.80,
      status: 'approved',
      certified: false,
      familyFarming: true,
      lastUpdated: new Date('2024-01-01'),
      updatedBy: 'João da Silva'
    }
  ]
};

const LojaProdutor = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [cycleProducts, setCycleProducts] = useState<ProductInCycle[]>(mockCycleProducts);
  const [showReuseModal, setShowReuseModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInCycle | null>(null);
  const [hasPreviousCycle] = useState(true);
  const [isFirstAccess] = useState(true); // Simulate first access to cycle
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for previous cycle on component mount
  useEffect(() => {
    if (isFirstAccess && hasPreviousCycle && cycleProducts.length === 0) {
      setShowReuseModal(true);
    }
  }, [isFirstAccess, hasPreviousCycle, cycleProducts.length]);

  const handleLogout = () => {
    localStorage.removeItem('fornecedorAuth');
    navigate('/');
  };

  const handleReuseOffers = () => {
    // Add previous cycle products as drafts
    const reusedProducts = mockPreviousCycle.products.map(product => ({
      ...product,
      id: `reused-${Date.now()}-${product.id}`,
      status: 'draft' as const,
      lastUpdated: new Date(),
      expiryDate: undefined, // Clear expiry date for review
      pricePerUnit: product.pricePerUnit // Keep previous price for reference
    }));
    
    setCycleProducts(prev => [...prev, ...reusedProducts]);
    setShowReuseModal(false);
    
    toast({
      title: "Ofertas reutilizadas",
      description: `${reusedProducts.length} produtos foram adicionados como rascunho para revisão`,
    });
  };

  const handleStartFresh = () => {
    setShowReuseModal(false);
    toast({
      title: "Novo ciclo iniciado",
      description: "Você pode começar a adicionar produtos para este ciclo",
    });
  };

  const handleUpdateProduct = (updatedProduct: ProductInCycle) => {
    setCycleProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas",
    });
  };

  const handleEditProduct = (product: ProductInCycle) => {
    setSelectedProduct(product);
    setShowAnalysisModal(true);
  };

  const handleRemoveProduct = (productId: string) => {
    setCycleProducts(prev => prev.filter(p => p.id !== productId));
    
    toast({
      title: "Produto removido",
      description: "O produto foi removido do ciclo atual",
    });
  };

  const handleSaveDraft = (product: ProductInCycle) => {
    setCycleProducts(prev => 
      prev.map(p => p.id === product.id ? { ...product, lastUpdated: new Date(), updatedBy: 'João da Silva' } : p)
    );
    
    toast({
      title: "Rascunho salvo",
      description: "As alterações foram salvas como rascunho",
    });
  };

  const handleApproveProduct = (product: ProductInCycle) => {
    setCycleProducts(prev => 
      prev.map(p => p.id === product.id ? { ...product, status: 'approved', lastUpdated: new Date(), updatedBy: 'João da Silva' } : p)
    );
    
    toast({
      title: "Produto aprovado",
      description: "O produto foi aprovado e está disponível para oferta",
    });
  };

  const filterProducts = (products: ProductInCycle[]) => {
    if (activeTab === 'todos') return products;
    return products.filter(product => product.status === activeTab);
  };

  const filteredProducts = filterProducts(cycleProducts);
  const approvedCount = cycleProducts.filter(p => p.status === 'approved').length;
  const draftCount = cycleProducts.filter(p => p.status === 'draft').length;

  return (
    <ResponsiveLayout 
      headerContent={
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      }
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
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
            className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:border-accent/40"
          >
            <Calendar className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium text-center">Cronograma</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/fornecedor/produtos-vencidos')}
            className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-400/30 hover:border-red-500/50"
          >
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span className="text-sm font-medium text-center">Produtos Vencidos</span>
          </Button>
        </div>


        {/* Cycle Status Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
              <p className="text-sm text-green-600">Aprovados</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{draftCount}</p>
              <p className="text-sm text-yellow-600">Rascunhos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{cycleProducts.length}</p>
              <p className="text-sm text-blue-600">Total</p>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Button
              variant="outline"
              className="w-full h-full flex flex-col items-center justify-center space-y-1 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300"
              onClick={() => {
                // Export cycle report
                toast({ title: "Exportando relatório", description: "O download será iniciado em breve" });
              }}
            >
              <FileDown className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Exportar Ciclo</span>
            </Button>
          </div>
        </div>

        {/* Meus Produtos no Ciclo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Meus Produtos no Ciclo</h2>
            <Button 
              onClick={() => navigate('/fornecedor/pre-cadastro-produtos')}
              size="sm"
              className="flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Produto</span>
            </Button>
          </div>

          {/* Tabs for filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos" className="text-xs">
                Todos ({cycleProducts.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs">
                Aprovados ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="draft" className="text-xs">
                Rascunhos ({draftCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredProducts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent className="space-y-4">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {activeTab === 'todos' 
                          ? 'Nenhum produto no ciclo'
                          : `Nenhum produto ${activeTab === 'approved' ? 'aprovado' : 'em rascunho'}`
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {activeTab === 'todos' 
                          ? 'Adicione produtos para começar a ofertar neste ciclo'
                          : `Não há produtos ${activeTab === 'approved' ? 'aprovados' : 'salvos como rascunho'} ainda`
                        }
                      </p>
                    </div>
                    <Button onClick={() => navigate('/fornecedor/pre-cadastro-produtos')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Produto
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductCycleCard
                      key={product.id}
                      product={product}
                      onUpdate={handleUpdateProduct}
                      onEdit={handleEditProduct}
                      onRemove={handleRemoveProduct}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Publish Cycle Button */}
        {approvedCount > 0 && (
          <div className="flex justify-center pt-6">
            <Button 
              size="lg"
              className="px-8 py-3 text-base font-medium"
              onClick={() => {
                toast({
                  title: "Ciclo publicado",
                  description: `${approvedCount} produtos foram publicados para oferta`,
                });
              }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Publicar Ciclo ({approvedCount} produtos)
            </Button>
          </div>
        )}

        {/* Reuse Previous Cycle Modal */}
        <ReuseOfferModal
          isOpen={showReuseModal}
          onClose={() => setShowReuseModal(false)}
          previousCycleData={hasPreviousCycle ? mockPreviousCycle : null}
          onReuseOffers={handleReuseOffers}
          onStartFresh={handleStartFresh}
        />

        {/* Product Analysis Modal */}
        <ProductAnalysisModal
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          product={selectedProduct}
          onSaveDraft={handleSaveDraft}
          onApprove={handleApproveProduct}
        />

      </div>
    </ResponsiveLayout>
  );
};

export default LojaProdutor;