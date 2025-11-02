import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, ShoppingCart, AlertCircle } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';
import { groupAndSortProducts, type Oferta } from '@/utils/product-grouping';

// Mock data - produtos disponíveis para venda direta
const mockProdutos: Oferta[] = [
  {
    id: '1',
    produto_base: 'Alface',
    nome: 'Alface Crespa',
    unidade: 'Maço',
    fornecedor: 'Sítio Verde',
    valor: 3.50,
    quantidadeOfertada: 50,
  },
  {
    id: '2',
    produto_base: 'Tomate',
    nome: 'Tomate Orgânico',
    unidade: 'Kg',
    fornecedor: 'Fazenda Boa Vista',
    valor: 8.90,
    quantidadeOfertada: 30,
  },
  {
    id: '3',
    produto_base: 'Cenoura',
    nome: 'Cenoura',
    unidade: 'Kg',
    fornecedor: 'Horta da Serra',
    valor: 4.50,
    quantidadeOfertada: 40,
  },
  {
    id: '4',
    produto_base: 'Banana',
    nome: 'Banana Prata',
    unidade: 'Dúzia',
    fornecedor: 'Sítio Frutas',
    valor: 6.00,
    quantidadeOfertada: 0,
  },
  {
    id: '5',
    produto_base: 'Laranja',
    nome: 'Laranja Pera',
    unidade: 'Kg',
    fornecedor: 'Pomar do Vale',
    valor: 5.50,
    quantidadeOfertada: 25,
  },
];

const PedidoConsumidores = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idMercado = searchParams.get('cst');
  const idUsuario = searchParams.get('usr');

  const [busca, setBusca] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const TAXA_SERVICO = 5.00;

  // Agrupar e filtrar produtos
  const productGroups = useMemo(() => {
    const groups = groupAndSortProducts(mockProdutos);
    if (!busca) return groups;

    const searchLower = busca.toLowerCase();
    return groups
      .map(group => ({
        ...group,
        variantes: group.variantes.filter(v =>
          v.produto_base.toLowerCase().includes(searchLower) ||
          v.fornecedor.toLowerCase().includes(searchLower)
        ),
      }))
      .filter(group => group.variantes.length > 0);
  }, [busca]);

  // Calcular totais
  const valorProdutos = useMemo(() => {
    return Array.from(selectedProducts).reduce((sum, id) => {
      const produto = mockProdutos.find(p => p.id === id);
      const quantidade = quantities[id] || 0;
      return sum + (produto ? produto.valor * quantidade : 0);
    }, 0);
  }, [selectedProducts, quantities]);

  const valorTotal = valorProdutos + TAXA_SERVICO;

  const handleToggleProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      const newQuantities = { ...quantities };
      delete newQuantities[id];
      setQuantities(newQuantities);
    } else {
      newSelected.add(id);
      setQuantities({ ...quantities, [id]: 1 });
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (id: string, value: number) => {
    const produto = mockProdutos.find(p => p.id === id);
    if (!produto) return;

    if (value > produto.quantidadeOfertada) {
      toast({
        title: 'Quantidade indisponível',
        description: 'Reduza a quantidade ou selecione outro produto.',
        variant: 'destructive',
      });
      return;
    }

    if (value <= 0) {
      handleToggleProduct(id);
    } else {
      setQuantities({ ...quantities, [id]: value });
    }
  };

  const handleLimparSelecao = () => {
    setSelectedProducts(new Set());
    setQuantities({});
  };

  const handleConfirmarPedido = () => {
    if (selectedProducts.size === 0) {
      toast({
        title: 'Nenhum produto selecionado',
        description: 'Selecione pelo menos um produto para continuar.',
        variant: 'destructive',
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmarFinal = () => {
    toast({
      title: 'Pedido registrado com sucesso!',
      description: 'Seu pedido de venda direta foi registrado.',
    });
    setShowConfirmModal(false);
    navigate('/dashboard');
  };

  const selectedItems = useMemo(() => {
    return Array.from(selectedProducts)
      .map(id => {
        const produto = mockProdutos.find(p => p.id === id);
        if (!produto) return null;
        return {
          ...produto,
          quantidade: quantities[id] || 0,
          subtotal: produto.valor * (quantities[id] || 0),
        };
      })
      .filter(item => item !== null);
  }, [selectedProducts, quantities]);

  return (
    <AuthenticatedLayout
      pageTitle="Consumidor - Comprar Produtos Venda Direta"
      pageSubtitle="Selecione produtos da feira direta com os produtores"
    >
      <div className="p-4 space-y-6">
        {/* Ciclo Ativo */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-primary">
                Ativo
              </Badge>
              <span className="font-medium">
                1º Ciclo de Novembro 2025 – Feira do Produtor
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resumo do Pedido */}
        <Card className="sticky top-4 z-10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Resumo do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Total</span>
              <span className="font-medium">{formatBRL(valorProdutos)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxas</span>
              <span className="font-medium">{formatBRL(TAXA_SERVICO)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Final</span>
              <span className="text-primary">{formatBRL(valorTotal)}</span>
            </div>
            <div className="pt-2">
              <Badge
                variant={selectedProducts.size > 0 ? 'default' : 'secondary'}
                className="w-full justify-center"
              >
                {selectedProducts.size > 0
                  ? `${selectedProducts.size} ${selectedProducts.size === 1 ? 'produto selecionado' : 'produtos selecionados'}`
                  : 'Aguardando seleção'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Produtos Selecionados */}
        {selectedProducts.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Produtos Selecionados ({selectedProducts.size})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-center w-32">Quantidade</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.nome}</div>
                          <div className="text-sm text-muted-foreground">{item.unidade}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatBRL(item.valor)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          max={item.quantidadeOfertada}
                          value={item.quantidade}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20 mx-auto text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatBRL(item.subtotal)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleProduct(item.id)}
                          aria-label="Remover produto"
                        >
                          ✕
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Lista de Produtos Disponíveis */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Produtos Disponíveis</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar produto ou fornecedor"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {selectedProducts.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLimparSelecao}
                  >
                    Limpar seleção
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Medida</TableHead>
                  <TableHead className="text-right">Valor Unitário</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Disponível</TableHead>
                  <TableHead className="text-center w-32">Quantidade</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productGroups.flatMap(group =>
                  group.variantes.map(produto => {
                    const isSelected = selectedProducts.has(produto.id);
                    const quantidade = quantities[produto.id] || 0;
                    const subtotal = produto.valor * quantidade;
                    const isEsgotado = produto.quantidadeOfertada === 0;

                    return (
                      <TableRow
                        key={produto.id}
                        className={isEsgotado ? 'opacity-50' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleProduct(produto.id)}
                            disabled={isEsgotado}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{produto.nome}</div>
                              {isEsgotado && (
                                <Badge variant="secondary" className="mt-1">
                                  Esgotado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatBRL(produto.valor)}
                        </TableCell>
                        <TableCell>{produto.fornecedor}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {produto.quantidadeOfertada}
                        </TableCell>
                        <TableCell>
                          {isSelected && (
                            <Input
                              type="number"
                              min="1"
                              max={produto.quantidadeOfertada}
                              value={quantidade}
                              onChange={(e) =>
                                handleQuantityChange(produto.id, parseInt(e.target.value) || 0)
                              }
                              className="w-20 mx-auto text-center"
                              disabled={isEsgotado}
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {isSelected ? formatBRL(subtotal) : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {productGroups.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 pb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarPedido}
            disabled={selectedProducts.size === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Confirmar Pedido
          </Button>
        </div>

        {/* Modal de Confirmação */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Confirmar Pedido de Venda Direta</DialogTitle>
              <DialogDescription>
                Revise os produtos selecionados antes de confirmar o pedido.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Produtos Selecionados:</h4>
                <div className="border rounded-lg divide-y">
                  {selectedItems.map(item => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantidade} {item.unidade} × {formatBRL(item.valor)}
                        </div>
                      </div>
                      <div className="font-medium">{formatBRL(item.subtotal)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Produtos:</span>
                  <span>{formatBRL(valorProdutos)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxas:</span>
                  <span>{formatBRL(TAXA_SERVICO)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Final:</span>
                  <span className="text-primary">{formatBRL(valorTotal)}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Deseja confirmar o pedido? Após confirmação, ele será enviado ao sistema de vendas.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmarFinal}
                className="bg-primary hover:bg-primary/90"
              >
                Confirmar Pedido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
};

export default PedidoConsumidores;
