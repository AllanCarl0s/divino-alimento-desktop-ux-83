import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductGroupItem } from '@/components/admin/ProductGroupItem';
import { groupAndSortProducts, filterProducts, type ProductGroup } from '@/utils/product-grouping';
import type { Oferta } from '@/utils/product-grouping';
import { Skeleton } from '@/components/ui/skeleton';

interface PedidoItem {
  produto_id: string;
  nome_produto: string;
  unidade: string;
  fornecedor: string;
  valor_unit: number;
  quantidade: number;
}

export default function AdminComposicaoVendaDiretaCompor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');
  
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedByGroup, setSelectedByGroup] = useState<Map<string, string>>(new Map());
  const [composicao, setComposicao] = useState<Map<string, number>>(new Map());

  // Pedidos finalizados (base para composição)
  const [pedidos] = useState<PedidoItem[]>([
    {
      produto_id: 'p1',
      nome_produto: 'Ovos Caipiras',
      unidade: 'dúzia',
      fornecedor: 'Sítio Boa Vista',
      valor_unit: 15.00,
      quantidade: 20,
    },
    {
      produto_id: 'p2',
      nome_produto: 'Banana Prata',
      unidade: 'kg',
      fornecedor: 'João Produtor',
      valor_unit: 5.00,
      quantidade: 30,
    },
  ]);

  // Ofertas disponíveis para composição
  const [ofertas] = useState<Oferta[]>([
    {
      id: 'o1',
      produto_base: 'Tomate Orgânico',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      fornecedor: 'João Produtor',
      valor: 4.50,
      quantidadeOfertada: 100,
    },
    {
      id: 'o2',
      produto_base: 'Tomate Orgânico',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      fornecedor: 'Maria Horta',
      valor: 4.20,
      quantidadeOfertada: 80,
    },
    {
      id: 'o3',
      produto_base: 'Tomate Orgânico',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      fornecedor: 'Sítio Verde',
      valor: 4.80,
      quantidadeOfertada: 60,
    },
    {
      id: 'o4',
      produto_base: 'Alface Crespa',
      nome: 'Alface Crespa',
      unidade: 'maço',
      fornecedor: 'João Produtor',
      valor: 2.00,
      quantidadeOfertada: 50,
    },
    {
      id: 'o5',
      produto_base: 'Alface Crespa',
      nome: 'Alface Crespa',
      unidade: 'maço',
      fornecedor: 'Maria Horta',
      valor: 1.80,
      quantidadeOfertada: 40,
    },
  ]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    mercado: 'Feira do Produtor',
    valorMaximo: 500.00,
    tipo: 'Venda Direta'
  };

  // Agrupar e filtrar ofertas
  const grupos = useMemo(() => groupAndSortProducts(ofertas), [ofertas]);
  const gruposFiltrados = useMemo(() => filterProducts(grupos, busca), [grupos, busca]);

  // Calcular valores
  const valorTotalPedidos = pedidos.reduce((acc, p) => 
    acc + (p.valor_unit * p.quantidade), 0
  );

  const valorTotalSelecionados = useMemo(() => {
    let total = 0;
    composicao.forEach((quantidade, ofertaId) => {
      const oferta = ofertas.find(o => o.id === ofertaId);
      if (oferta) {
        total += oferta.valor * quantidade;
      }
    });
    return total;
  }, [composicao, ofertas]);

  const valorTotal = valorTotalPedidos + valorTotalSelecionados;
  const saldo = ciclo.valorMaximo - valorTotal;

  const handleToggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    setExpandedGroups(new Set(gruposFiltrados.map(g => g.produto_base)));
  };

  const handleCollapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleSelectVariant = (groupKey: string, variantId: string) => {
    setSelectedByGroup(prev => {
      const newMap = new Map(prev);
      newMap.set(groupKey, variantId);
      return newMap;
    });
  };

  const handleQuantityChange = (variantId: string, quantidade: number) => {
    setComposicao(prev => {
      const newMap = new Map(prev);
      if (quantidade > 0) {
        newMap.set(variantId, quantidade);
      } else {
        newMap.delete(variantId);
      }
      return newMap;
    });
  };

  const handleClearSelection = (groupKey: string) => {
    const variantId = selectedByGroup.get(groupKey);
    if (variantId) {
      setComposicao(prev => {
        const newMap = new Map(prev);
        newMap.delete(variantId);
        return newMap;
      });
      setSelectedByGroup(prev => {
        const newMap = new Map(prev);
        newMap.delete(groupKey);
        return newMap;
      });
    }
  };

  const handleRemoveItem = (ofertaId: string) => {
    setComposicao(prev => {
      const newMap = new Map(prev);
      newMap.delete(ofertaId);
      return newMap;
    });
  };

  const handleSalvar = () => {
    setIsLoading(true);
    
    const composicaoArray = Array.from(composicao.entries()).map(([ofertaId, quantidade]) => {
      const oferta = ofertas.find(o => o.id === ofertaId);
      return {
        produto_id: oferta?.id,
        quantidade,
        valor_unit: oferta?.valor,
      };
    });

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Composição de vendas atualizada com sucesso!",
        className: "bg-green-600 text-white border-green-700",
      });
      
      console.log('Composição salva:', {
        cicloId: id,
        mercadoId,
        pedidos,
        composicao: composicaoArray,
      });
    }, 1000);
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/ciclo-index')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Resumo fixo (sticky) */}
        <Card className="sticky top-16 z-40 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {ciclo.tipo} • {ciclo.mercado}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Máximo</p>
                  <p className="text-2xl font-bold">{formatBRL(ciclo.valorMaximo)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Atual</p>
                  <p className="text-2xl font-bold">{formatBRL(valorTotal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Pedidos</p>
                  <p className="text-2xl font-bold">{formatBRL(valorTotalPedidos)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatBRL(saldo)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Pedidos Finalizados */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Finalizados (Base da Composição)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="td-texto">Produto</TableHead>
                  <TableHead className="td-texto">Medida</TableHead>
                  <TableHead className="td-valor">Valor Unit.</TableHead>
                  <TableHead className="td-texto">Fornecedor</TableHead>
                  <TableHead className="td-numero">Quantidade</TableHead>
                  <TableHead className="td-valor">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => {
                  const valorTotal = pedido.valor_unit * pedido.quantidade;
                  
                  return (
                    <TableRow key={pedido.produto_id} className="opacity-70">
                      <TableCell className="td-texto font-medium">{pedido.nome_produto}</TableCell>
                      <TableCell className="td-texto">{pedido.unidade}</TableCell>
                      <TableCell className="td-valor">{formatBRL(pedido.valor_unit)}</TableCell>
                      <TableCell className="td-texto">{pedido.fornecedor}</TableCell>
                      <TableCell className="td-numero">{pedido.quantidade}</TableCell>
                      <TableCell className="td-valor font-medium">
                        {formatBRL(valorTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Produtos Ofertados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Produtos Ofertados</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExpandAll}
                  className="h-8"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expandir tudo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCollapseAll}
                  className="h-8"
                >
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Colapsar tudo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por produto, fornecedor ou unidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : gruposFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado
              </div>
            ) : (
              <div className="space-y-2">
                {gruposFiltrados.map((group) => {
                  const selectedId = selectedByGroup.get(group.produto_base);
                  return (
                    <ProductGroupItem
                      key={group.produto_base}
                      group={group}
                      isExpanded={expandedGroups.has(group.produto_base)}
                      onToggleExpand={() => handleToggleGroup(group.produto_base)}
                      selectedVariantId={selectedId || null}
                      onSelectVariant={(variantId) => handleSelectVariant(group.produto_base, variantId)}
                      quantidadePedida={composicao.get(selectedId || '') || 0}
                      onQuantidadeChange={handleQuantityChange}
                      onClear={() => handleClearSelection(group.produto_base)}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos Selecionados */}
        {composicao.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Produtos Selecionados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="td-texto">Produto</TableHead>
                    <TableHead className="td-texto">Fornecedor</TableHead>
                    <TableHead className="td-texto">Medida</TableHead>
                    <TableHead className="td-valor">Valor Unit.</TableHead>
                    <TableHead className="td-numero">Quantidade</TableHead>
                    <TableHead className="td-valor">Total</TableHead>
                    <TableHead className="td-icone"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(composicao.entries()).map(([ofertaId, quantidade]) => {
                    const oferta = ofertas.find(o => o.id === ofertaId);
                    if (!oferta) return null;

                    return (
                      <TableRow key={ofertaId}>
                        <TableCell className="td-texto font-medium">{oferta.nome}</TableCell>
                        <TableCell className="td-texto">{oferta.fornecedor}</TableCell>
                        <TableCell className="td-texto">{oferta.unidade}</TableCell>
                        <TableCell className="td-valor">{formatBRL(oferta.valor)}</TableCell>
                        <TableCell className="td-numero">
                          <Input
                            type="number"
                            min="0"
                            max={oferta.quantidadeOfertada}
                            value={quantidade}
                            onChange={(e) => handleQuantityChange(ofertaId, parseInt(e.target.value) || 0)}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="td-valor font-medium">
                          {formatBRL(oferta.valor * quantidade)}
                        </TableCell>
                        <TableCell className="td-icone">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(ofertaId)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => navigate('/admin/ciclo-index')}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleSalvar}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Composição'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
}
