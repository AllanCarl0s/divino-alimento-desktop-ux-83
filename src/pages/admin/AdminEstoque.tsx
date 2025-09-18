import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, Plus, Minus, CheckCircle, X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockStock = [
  {
    id: 1,
    name: 'Tomate Orgânico',
    status: 'ativo',
    quantity: 150,
    unit: 'kg',
    suppliers: ['João da Silva', 'Maria Santos'],
    reserved: 45,
    available: 105
  },
  {
    id: 2,
    name: 'Alface Hidropônica',
    status: 'ativo',
    quantity: 200,
    unit: 'unidades',
    suppliers: ['Pedro Oliveira'],
    reserved: 80,
    available: 120
  },
  {
    id: 3,
    name: 'Cenoura Baby',
    status: 'inativo',
    quantity: 0,
    unit: 'kg',
    suppliers: [],
    reserved: 0,
    available: 0
  },
  {
    id: 4,
    name: 'Brócolis',
    status: 'aguardando',
    quantity: 75,
    unit: 'kg',
    suppliers: ['Ana Costa'],
    reserved: 0,
    available: 0
  }
];

const AdminEstoque = () => {
  const [stock, setStock] = useState(mockStock);
  const [activeTab, setActiveTab] = useState('ativo');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filterStock = (items: typeof mockStock) => {
    if (activeTab === 'todos') return items;
    return items.filter(item => item.status === activeTab);
  };

  const updateQuantity = (id: number, change: number) => {
    setStock(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change), available: Math.max(0, item.available + change) }
        : item
    ));
    
    toast({
      title: "Estoque atualizado",
      description: "Quantidade ajustada com sucesso",
    });
  };

  const approveProduct = (id: number) => {
    setStock(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: 'ativo', available: item.quantity }
        : item
    ));
    
    toast({
      title: "Produto aprovado",
      description: "Produto está agora disponível no estoque",
    });
  };

  const rejectProduct = (id: number) => {
    setStock(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Produto reprovado",
      description: "Produto removido da lista",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      ativo: { label: 'Ativo', variant: 'default' as const },
      inativo: { label: 'Inativo', variant: 'secondary' as const },
      aguardando: { label: 'Aguardando Aprovação', variant: 'outline' as const }
    };
    
    return <Badge variant={config[status as keyof typeof config]?.variant || 'secondary'}>
      {config[status as keyof typeof config]?.label || status}
    </Badge>;
  };

  const filteredStock = filterStock(stock);

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Controle de Estoque</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie disponibilidade e quantidades
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ativo" className="text-xs">Ativos</TabsTrigger>
            <TabsTrigger value="inativo" className="text-xs">Inativos</TabsTrigger>
            <TabsTrigger value="aguardando" className="text-xs">Aguardando</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredStock.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent className="space-y-4">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Nenhum produto encontrado</h3>
                    <p className="text-sm text-muted-foreground">
                      Não há produtos {activeTab} no momento
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredStock.map((item) => (
                  <Card key={item.id} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                            <Package className="w-4 h-4 text-primary" />
                            <span>{item.name}</span>
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {item.status === 'ativo' && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <span className="text-muted-foreground">Total</span>
                            <p className="font-bold text-lg">{item.quantity}</p>
                            <p className="text-xs text-muted-foreground">{item.unit}</p>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-foreground">Reservado</span>
                            <p className="font-bold text-lg text-yellow-600">{item.reserved}</p>
                            <p className="text-xs text-muted-foreground">{item.unit}</p>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-foreground">Disponível</span>
                            <p className="font-bold text-lg text-green-600">{item.available}</p>
                            <p className="text-xs text-muted-foreground">{item.unit}</p>
                          </div>
                        </div>
                      )}

                      {item.status === 'aguardando' && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-yellow-800">Aguardando Aprovação</p>
                              <p className="text-sm text-yellow-700">Quantidade: {item.quantity} {item.unit}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.suppliers.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium">Fornecedores:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.suppliers.map((supplier, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {supplier}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.status === 'ativo' && (
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Ajustar Quantidade:</span>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon-sm"
                                onClick={() => updateQuantity(item.id, -10)}
                                disabled={item.quantity <= 0}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center text-sm">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon-sm"
                                onClick={() => updateQuantity(item.id, 10)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.status === 'aguardando' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center space-x-1 border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => rejectProduct(item.id)}
                          >
                            <X className="w-4 h-4" />
                            <span>Reprovar</span>
                          </Button>
                          
                          <Button
                            size="sm"
                            className="flex-1 flex items-center space-x-1"
                            onClick={() => approveProduct(item.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Aprovar</span>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminEstoque;