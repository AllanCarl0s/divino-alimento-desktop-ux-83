import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { 
  ArrowLeft, 
  Package, 
  Users, 
  Plus, 
  Minus, 
  Search,
  Filter,
  Save
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockVenda = {
  id: '1',
  nome: 'PNAE Janeiro 2024',
  valorAlvo: 12500,
  valorRealizado: 11750
};

const mockEstoque = [
  {
    id: 1,
    produto: 'Tomate Orgânico',
    fornecedor: 'João Silva',
    disponivel: 50,
    preco: 7.50,
    unidade: 'kg'
  },
  {
    id: 2,
    produto: 'Alface Hidropônica',
    fornecedor: 'Maria Santos',
    disponivel: 100,
    preco: 1.50,
    unidade: 'un'
  },
  {
    id: 3,
    produto: 'Cenoura Baby',
    fornecedor: 'Carlos Oliveira',
    disponivel: 30,
    preco: 8.00,
    unidade: 'kg'
  }
];

const mockComposicao = [
  {
    id: 1,
    produto: 'Tomate Orgânico',
    fornecedor: 'João Silva',
    quantidade: 25,
    preco: 7.50,
    unidade: 'kg'
  }
];

const AdminPnaeComposicao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [composicao, setComposicao] = useState(mockComposicao);

  const filteredEstoque = mockEstoque.filter(item =>
    item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adicionarItem = (item: typeof mockEstoque[0]) => {
    const existing = composicao.find(c => c.id === item.id);
    if (existing) {
      setComposicao(composicao.map(c => 
        c.id === item.id ? { ...c, quantidade: c.quantidade + 1 } : c
      ));
    } else {
      setComposicao([...composicao, { ...item, quantidade: 1 }]);
    }
    toast({
      title: "Item adicionado.",
    });
  };

  const removerItem = (itemId: number) => {
    setComposicao(composicao.filter(c => c.id !== itemId));
    toast({
      title: "Item removido.",
    });
  };

  const ajustarQuantidade = (itemId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(itemId);
      return;
    }
    setComposicao(composicao.map(c => 
      c.id === itemId ? { ...c, quantidade } : c
    ));
  };

  const calcularTotal = () => {
    return composicao.reduce((total, item) => total + (item.quantidade * item.preco), 0);
  };

  const salvarComposicao = () => {
    toast({
      title: "Dados salvos com sucesso.",
    });
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/pnae')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-4">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 -m-4 p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">Composição PNAE</h1>
              <p className="text-sm text-muted-foreground">{mockVenda.nome}</p>
            </div>
          </div>
          
          {/* Value Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Valor-alvo</p>
              <p className="font-bold text-primary">R$ {mockVenda.valorAlvo.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Realizado</p>  
              <p className="font-bold text-accent">R$ {calcularTotal().toFixed(2).replace('.', ',')}</p>
              <Badge 
                variant={calcularTotal() <= mockVenda.valorAlvo ? 'default' : 'destructive'}
                className="text-xs mt-1"
              >
                {calcularTotal() <= mockVenda.valorAlvo ? 'Dentro do orçamento' : 'Acima do orçamento'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gestor de Estoque */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Estoque Disponível</h2>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredEstoque.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.produto}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{item.fornecedor}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Disponível: {item.disponivel} {item.unidade}</span>
                          <span className="text-primary">R$ {item.preco.toFixed(2).replace('.', ',')}/{item.unidade}</span>
                        </div>
                      </div>
                      <Button
                        size="icon-sm"
                        onClick={() => adicionarItem(item)}
                        className="ml-2"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gestor de Composição */}
          <div className="space-y-3">
            <h2 className="font-semibold">Composição da Venda</h2>
            
            {composicao.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum item selecionado
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use o gestor de estoque para adicionar itens
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {composicao.map((item) => (
                  <Card key={item.id} className="shadow-sm">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.produto}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{item.fornecedor}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removerItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => ajustarQuantidade(item.id, item.quantidade - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantidade}
                              onChange={(e) => ajustarQuantidade(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                              min="0"
                            />
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => ajustarQuantidade(item.id, item.quantidade + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              R$ {item.preco.toFixed(2).replace('.', ',')} x {item.quantidade}
                            </p>
                            <p className="font-medium text-primary">
                              R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Total e Ações */}
            {composicao.length > 0 && (
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">Total da Composição</p>
                      <p className="text-2xl font-bold text-accent">
                        R$ {calcularTotal().toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={salvarComposicao}
                    className="w-full flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Composição</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminPnaeComposicao;