import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Search, ArrowLeft, ShoppingCart, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { groupAndSortProducts, filterProducts, Oferta } from '@/utils/product-grouping';
import { useCompositionFilters } from '@/hooks/useCompositionFilters';
import { CompositionFilters } from '@/components/admin/CompositionFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RoleTitle } from '@/components/layout/RoleTitle';

export default function AdminComposicaoVendaDireta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');
  
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fornecedorFilter, setFornecedorFilter] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<'mais-vendidos' | 'menos-vendidos' | 'nenhum'>('nenhum');
  
  const {
    certificacoes,
    tiposAgricultura,
    toggleCertificacao,
    toggleTipoAgricultura,
    clearFilters,
    hasActiveFilters
  } = useCompositionFilters();
  
  // quantidadesVendidas: produtoId -> quantidade vendida
  const [quantidadesVendidas, setQuantidadesVendidas] = useState<Map<string, number>>(new Map());
  
  // Dados mock representando produtos já ofertados no ciclo
  const [ofertas] = useState<Oferta[]>([
    {
      id: '1',
      produto_base: 'Tomate Orgânico',
      nome: 'Tomate Orgânico (kg)',
      unidade: 'kg',
      valor: 4.50,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 50,
      certificacao: 'organico',
      tipo_agricultura: 'familiar',
    },
    {
      id: '2',
      produto_base: 'Tomate Orgânico',
      nome: 'Tomate Orgânico (cx)',
      unidade: 'cx',
      valor: 20.00,
      fornecedor: 'Maria Horta',
      quantidadeOfertada: 15,
      certificacao: 'organico',
      tipo_agricultura: 'familiar',
    },
    {
      id: '3',
      produto_base: 'Alface Crespa',
      nome: 'Alface Crespa (kg)',
      unidade: 'kg',
      valor: 3.20,
      fornecedor: 'Maria Horta',
      quantidadeOfertada: 30,
      certificacao: 'organico',
      tipo_agricultura: 'familiar',
    },
    {
      id: '4',
      produto_base: 'Alface Crespa',
      nome: 'Alface Crespa (maço)',
      unidade: 'maço',
      valor: 2.00,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 50,
      certificacao: 'convencional',
      tipo_agricultura: 'nao_familiar',
    },
    {
      id: '5',
      produto_base: 'Ovos Caipiras',
      nome: 'Ovos Caipiras (dúzia)',
      unidade: 'dúzia',
      valor: 15.00,
      fornecedor: 'Sítio Boa Vista',
      quantidadeOfertada: 100,
      certificacao: 'convencional',
      tipo_agricultura: 'familiar',
    },
  ]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    mercado: 'Feira do Produtor',
  };

  // Filtrar por fornecedor
  const ofertasFiltradas = useMemo(() => {
    if (fornecedorFilter === 'todos') return ofertas;
    return ofertas.filter(o => o.fornecedor === fornecedorFilter);
  }, [ofertas, fornecedorFilter]);

  // Ordenar por vendas
  const ofertasOrdenadas = useMemo(() => {
    if (sortOrder === 'nenhum') return ofertasFiltradas;
    
    const sorted = [...ofertasFiltradas].sort((a, b) => {
      const vendidosA = quantidadesVendidas.get(a.id) || 0;
      const vendidosB = quantidadesVendidas.get(b.id) || 0;
      
      return sortOrder === 'mais-vendidos' 
        ? vendidosB - vendidosA 
        : vendidosA - vendidosB;
    });
    
    return sorted;
  }, [ofertasFiltradas, sortOrder, quantidadesVendidas]);

  // Aplicar filtros de composição e busca
  const productGroups = useMemo(() => {
    const groups = groupAndSortProducts(ofertasOrdenadas);
    return filterProducts(groups, busca, {
      certificacoes,
      tiposAgricultura,
    });
  }, [ofertasOrdenadas, busca, certificacoes, tiposAgricultura]);

  // Lista de fornecedores únicos
  const fornecedores = useMemo(() => {
    const uniqueFornecedores = Array.from(new Set(ofertas.map(o => o.fornecedor)));
    return uniqueFornecedores;
  }, [ofertas]);

  // Calcular totais
  const totais = useMemo(() => {
    let valorTotalOfertado = 0;
    let valorTotalVendido = 0;
    let quantidadeTotalOfertada = 0;
    let quantidadeTotalVendida = 0;
    let saldoTotal = 0;
    
    ofertas.forEach(oferta => {
      const qtdVendida = quantidadesVendidas.get(oferta.id) || 0;
      const saldo = oferta.quantidadeOfertada - qtdVendida;
      
      valorTotalOfertado += oferta.valor * oferta.quantidadeOfertada;
      valorTotalVendido += oferta.valor * qtdVendida;
      quantidadeTotalOfertada += oferta.quantidadeOfertada;
      quantidadeTotalVendida += qtdVendida;
      saldoTotal += saldo;
    });
    
    const percentualVendido = quantidadeTotalOfertada > 0 
      ? (quantidadeTotalVendida / quantidadeTotalOfertada) * 100 
      : 0;
    
    return {
      valorTotalOfertado,
      valorTotalVendido,
      quantidadeTotalOfertada,
      quantidadeTotalVendida,
      saldoTotal,
      percentualVendido,
    };
  }, [ofertas, quantidadesVendidas]);

  // Produto mais vendido
  const produtoMaisVendido = useMemo(() => {
    let maxVendido = 0;
    let produtoMax = '';
    
    ofertas.forEach(oferta => {
      const qtdVendida = quantidadesVendidas.get(oferta.id) || 0;
      if (qtdVendida > maxVendido) {
        maxVendido = qtdVendida;
        produtoMax = oferta.produto_base;
      }
    });
    
    return produtoMax || 'N/A';
  }, [ofertas, quantidadesVendidas]);

  // Produto com maior saldo
  const produtoMaiorSaldo = useMemo(() => {
    let maxSaldo = 0;
    let produtoMax = '';
    
    ofertas.forEach(oferta => {
      const qtdVendida = quantidadesVendidas.get(oferta.id) || 0;
      const saldo = oferta.quantidadeOfertada - qtdVendida;
      if (saldo > maxSaldo) {
        maxSaldo = saldo;
        produtoMax = oferta.produto_base;
      }
    });
    
    return produtoMax || 'N/A';
  }, [ofertas, quantidadesVendidas]);

  const handleQuantidadeVendidaChange = (produtoId: string, quantidade: number) => {
    const oferta = ofertas.find(o => o.id === produtoId);
    if (!oferta) return;
    
    const validQuantity = Math.max(0, Math.min(quantidade, oferta.quantidadeOfertada));
    
    setQuantidadesVendidas(prev => {
      const newMap = new Map(prev);
      if (validQuantity === 0) {
        newMap.delete(produtoId);
      } else {
        newMap.set(produtoId, validQuantity);
      }
      return newMap;
    });
  };

  const handleSalvarClick = () => {
    setShowConfirmModal(true);
  };

  const executarConsolidacao = () => {
    const payload = ofertas.map(oferta => ({
      produto_id: oferta.id,
      quantidade_ofertada: oferta.quantidadeOfertada,
      quantidade_vendida: quantidadesVendidas.get(oferta.id) || 0,
      valor_unitario: oferta.valor,
      valor_total: oferta.valor * (quantidadesVendidas.get(oferta.id) || 0),
    }));

    setIsLoading(true);
    setShowConfirmModal(false);
    
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "✅ Composição de vendas salva com sucesso!",
        description: `O ciclo foi consolidado e encerrado. Valor total: ${formatBRL(totais.valorTotalVendido)} • ${totais.quantidadeTotalVendida} unidades vendidas`,
        className: "bg-green-600 text-white border-green-700",
        duration: 5000,
      });
      
      console.log('Dados consolidados:', payload);

      setTimeout(() => {
        navigate('/admin/ciclo-index');
      }, 1000);
    }, 1000);
  };

  const handleLimparFiltros = () => {
    clearFilters();
    setFornecedorFilter('todos');
    setSortOrder('nenhum');
    setBusca('');
  };

  const temFiltrosAtivos = hasActiveFilters || fornecedorFilter !== 'todos' || sortOrder !== 'nenhum' || busca !== '';

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
        {/* Cabeçalho */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <RoleTitle page={`Composição de Venda Direta – ${ciclo.nome}`} className="text-3xl" />
          </div>
          <p className="text-lg text-muted-foreground">
            Fechamento do ciclo – consolidação das vendas realizadas
          </p>
          <p className="text-sm text-muted-foreground">
            {ciclo.nome} • {ciclo.mercado}
          </p>
        </div>

        {/* Card de Resumo Principal */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#006C35]">Resumo do Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Valor Total Vendido</p>
                <p className="text-3xl font-bold text-[#006C35]">{formatBRL(totais.valorTotalVendido)}</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Produtos Comercializados</p>
                <p className="text-3xl font-bold text-[#006C35]">{ofertas.length} produtos</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Saldo Total Remanescente</p>
                <p className="text-3xl font-bold text-amber-600">{totais.saldoTotal} unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro do Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Valor Total Ofertado</p>
                <p className="text-lg font-semibold">{formatBRL(totais.valorTotalOfertado)}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Valor Total Vendido</p>
                <p className="text-lg font-semibold text-green-600">{formatBRL(totais.valorTotalVendido)}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Percentual de Venda</p>
                <p className="text-lg font-semibold">{totais.percentualVendido.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Produto Mais Vendido</p>
                <p className="text-sm font-semibold truncate" title={produtoMaisVendido}>{produtoMaisVendido}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Produto com Maior Saldo</p>
                <p className="text-sm font-semibold truncate" title={produtoMaiorSaldo}>{produtoMaiorSaldo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela Principal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <CardTitle>Resumo de Produtos Vendidos</CardTitle>
            </div>
            
            {/* Filtros */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={fornecedorFilter} onValueChange={setFornecedorFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Fornecedores</SelectItem>
                    {fornecedores.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={sortOrder === 'mais-vendidos' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'mais-vendidos' ? 'nenhum' : 'mais-vendidos')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Mais Vendidos
                </Button>

                <Button
                  variant={sortOrder === 'menos-vendidos' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'menos-vendidos' ? 'nenhum' : 'menos-vendidos')}
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Menos Vendidos
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* TODO: filtrar apenas produtos com saldo */}}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Com Estoque
                </Button>

                {temFiltrosAtivos && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLimparFiltros}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>

              <CompositionFilters
                certificacoes={certificacoes}
                tiposAgricultura={tiposAgricultura}
                onToggleCertificacao={toggleCertificacao}
                onToggleTipoAgricultura={toggleTipoAgricultura}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : productGroups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto encontrado com os filtros aplicados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Produto</TableHead>
                      <TableHead className="min-w-[80px]">Unidade</TableHead>
                      <TableHead className="min-w-[150px]">Fornecedor(a)</TableHead>
                      <TableHead className="text-right min-w-[120px]">Valor Unitário</TableHead>
                      <TableHead className="text-center min-w-[120px]">Qtd. Ofertada</TableHead>
                      <TableHead className="text-center min-w-[140px]">Vendidos</TableHead>
                      <TableHead className="text-right min-w-[140px]">Valor Final</TableHead>
                      <TableHead className="text-center min-w-[100px]">Saldo Restante</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productGroups.flatMap(group => 
                      group.variantes.map((variant) => {
                        const qtdVendida = quantidadesVendidas.get(variant.id) || 0;
                        const valorFinal = variant.valor * qtdVendida;
                        const disponivel = variant.quantidadeOfertada - qtdVendida;
                        
                        return (
                          <TableRow key={variant.id}>
                            <TableCell className="font-medium">{variant.produto_base}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{variant.unidade}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{variant.fornecedor}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatBRL(variant.valor)}</TableCell>
                            <TableCell className="text-center tabular-nums">{variant.quantidadeOfertada}</TableCell>
                            <TableCell className="text-center tabular-nums font-semibold">
                              {qtdVendida}
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums text-green-600">
                              {formatBRL(valorFinal)}
                            </TableCell>
                            <TableCell className="text-center tabular-nums">
                              <span className={disponivel < 0 ? 'text-red-600 font-semibold' : ''}>
                                {disponivel}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="font-bold">TOTAIS</TableCell>
                      <TableCell className="text-center font-bold tabular-nums">
                        {totais.quantidadeTotalOfertada}
                      </TableCell>
                      <TableCell className="text-center font-bold tabular-nums">
                        {totais.quantidadeTotalVendida}
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums text-green-600">
                        {formatBRL(totais.valorTotalVendido)}
                      </TableCell>
                      <TableCell className="text-center font-bold tabular-nums">
                        {totais.saldoTotal}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/ciclo-index')}
                disabled={isLoading}
                className="border-[#006C35] text-[#006C35] hover:bg-[#006C35]/10"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSalvarClick}
                disabled={isLoading}
                className="bg-[#006C35] hover:bg-[#005028] text-white"
              >
                {isLoading ? 'Salvando...' : 'Salvar Composição de Vendas'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-[#006C35]" />
              Confirmar Consolidação de Vendas
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="font-semibold text-amber-600">
                Ao confirmar, os dados serão consolidados e o mercado será encerrado.
              </p>
              <p>
                Essa ação não poderá ser desfeita.
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4 space-y-2">
                <p className="text-sm"><span className="font-semibold">Valor Total Vendido:</span> {formatBRL(totais.valorTotalVendido)}</p>
                <p className="text-sm"><span className="font-semibold">Unidades Vendidas:</span> {totais.quantidadeTotalVendida}</p>
                <p className="text-sm"><span className="font-semibold">Saldo Remanescente:</span> {totais.saldoTotal} unidades</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executarConsolidacao}
              className="bg-[#006C35] hover:bg-[#005028]"
            >
              Confirmar Consolidação ✅
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
