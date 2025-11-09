import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Search, ArrowLeft, AlertTriangle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductGroupItem } from '@/components/admin/ProductGroupItem';
import { groupAndSortProducts, filterProducts, Oferta } from '@/utils/product-grouping';
import { useCompositionFilters } from '@/hooks/useCompositionFilters';
import { CompositionFilters } from '@/components/admin/CompositionFilters';

export default function AdminComposicaoVendaDiretaLiberar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');
  
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const {
    certificacoes,
    tiposAgricultura,
    toggleCertificacao,
    toggleTipoAgricultura,
    clearFilters,
    hasActiveFilters
  } = useCompositionFilters();
  
  // selectedByGroup: groupKey -> Set of variantIds
  const [selectedByGroup, setSelectedByGroup] = useState<Map<string, Set<string>>>(new Map());
  // composicao: variantId -> quantidade
  const [composicao, setComposicao] = useState<Map<string, number>>(new Map());
  
  // Dados mock com produto_base
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
      produto_base: 'Tomate Orgânico',
      nome: 'Tomate Orgânico (kg)',
      unidade: 'kg',
      valor: 4.20,
      fornecedor: 'Sítio Verde',
      quantidadeOfertada: 30,
      certificacao: 'transicao',
      tipo_agricultura: 'familiar',
    },
    {
      id: '4',
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
      id: '5',
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
      id: '6',
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
    valorMaximo: 500.00,
    tipo: 'Venda Direta'
  };

  // Agrupar e filtrar produtos
  const productGroups = useMemo(() => {
    const groups = groupAndSortProducts(ofertas);
    return filterProducts(groups, busca, {
      certificacoes,
      tiposAgricultura,
    });
  }, [ofertas, busca, certificacoes, tiposAgricultura]);

  // Calcular itens selecionados
  const selectedItems = useMemo(() => {
    const items: Array<{ id: string; valor: number; quantidade: number }> = [];
    selectedByGroup.forEach((variantIds) => {
      variantIds.forEach(variantId => {
        const quantidade = composicao.get(variantId) || 0;
        if (quantidade > 0) {
          const oferta = ofertas.find(o => o.id === variantId);
          if (oferta) {
            items.push({
              id: variantId,
              valor: oferta.valor,
              quantidade,
            });
          }
        }
      });
    });
    return items;
  }, [selectedByGroup, composicao, ofertas]);

  // Cálculos reativos
  const valorTotal = selectedItems.reduce((acc, item) => {
    return acc + (item.valor * item.quantidade);
  }, 0);
  
  const saldo = ciclo.valorMaximo - valorTotal;
  const excedeuValor = valorTotal > ciclo.valorMaximo;

  const handleToggleVariant = (groupKey: string, variantId: string) => {
    setSelectedByGroup(prev => {
      const newMap = new Map(prev);
      const currentSet = newMap.get(groupKey) || new Set();
      const newSet = new Set(currentSet);
      
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
        // Remove quantidade também
        setComposicao(prevComp => {
          const newComp = new Map(prevComp);
          newComp.delete(variantId);
          return newComp;
        });
      } else {
        newSet.add(variantId);
      }
      
      if (newSet.size === 0) {
        newMap.delete(groupKey);
      } else {
        newMap.set(groupKey, newSet);
      }
      return newMap;
    });
  };

  const handleClearGroup = (groupKey: string) => {
    const variantIds = selectedByGroup.get(groupKey);
    if (variantIds) {
      setSelectedByGroup(prev => {
        const newMap = new Map(prev);
        newMap.delete(groupKey);
        return newMap;
      });
      setComposicao(prev => {
        const newMap = new Map(prev);
        variantIds.forEach(id => newMap.delete(id));
        return newMap;
      });
    }
  };

  const handleQuantidadeChange = (variantId: string, quantidade: number) => {
    const oferta = ofertas.find(o => o.id === variantId);
    if (!oferta) return;
    
    const validQuantity = Math.max(0, Math.min(quantidade, oferta.quantidadeOfertada));
    
    setComposicao(prev => {
      const newMap = new Map(prev);
      if (validQuantity === 0) {
        newMap.delete(variantId);
      } else {
        newMap.set(variantId, validQuantity);
      }
      return newMap;
    });
  };

  const toggleGroupExpansion = (groupKey: string) => {
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

  const expandAll = () => {
    setExpandedGroups(new Set(productGroups.map(g => g.produto_base)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handlePublicarClick = () => {
    executarPublicacao();
  };

  const executarPublicacao = () => {
    const payload = selectedItems.map(item => ({
      produto_id: item.id,
      valor_unit: item.valor,
      pedidos: item.quantidade,
    }));

    setIsLoading(true);
    setShowConfirmModal(false);
    
    setTimeout(() => {
      setIsLoading(false);
      
      const totalItens = selectedItems.reduce((acc, item) => acc + item.quantidade, 0);
      
      toast({
        title: "Venda direta publicada com sucesso",
        description: `${selectedItems.length} produto(s), ${totalItens} itens, ${formatBRL(valorTotal)}`,
        className: "bg-green-600 text-white border-green-700",
        duration: 5000,
      });
      
      // Telemetria: logar se publicou acima do limite
      if (excedeuValor) {
        console.log('Evento: venda_direta_publicada_acima_do_limite', payload);
      } else {
        console.log('Dados enviados:', payload);
      }

      setTimeout(() => {
        navigate('/admin/ciclo-index');
      }, 1000);
    }, 1000);
  };

  // Pode publicar se houver pelo menos 1 item selecionado (independente do valor)
  const podePublicar = selectedItems.length > 0;

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
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Valor Total</p>
                        <p className="text-2xl font-bold">{formatBRL(valorTotal)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma dos produtos × quantidades oferecidas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Produtos Selecionados */}
        {selectedItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Produtos Selecionados para Venda Direta</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedItems.length} produto(s)
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table className="tabela-produtos-selecionados">
                <TableHeader>
                  <TableRow>
                    <TableHead className="td-texto">Produto</TableHead>
                    <TableHead className="td-texto">Medida</TableHead>
                    <TableHead className="td-valor">Valor Unit.</TableHead>
                    <TableHead className="td-texto">Fornecedor</TableHead>
                    <TableHead className="td-numero">Ofertados</TableHead>
                    <TableHead className="td-numero">Pedidos</TableHead>
                    <TableHead className="td-valor">Valor Acumulado</TableHead>
                    <TableHead className="td-numero">Disponíveis</TableHead>
                    <TableHead className="td-icone">Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => {
                    const oferta = ofertas.find(o => o.id === item.id);
                    if (!oferta) return null;
                    
                    const valorAcumulado = item.valor * item.quantidade;
                    const disponiveis = oferta.quantidadeOfertada - item.quantidade;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="td-texto font-medium">{oferta.produto_base}</TableCell>
                        <TableCell className="td-texto">{oferta.unidade}</TableCell>
                        <TableCell className="td-valor">{formatBRL(oferta.valor)}</TableCell>
                        <TableCell className="td-texto">{oferta.fornecedor}</TableCell>
                        <TableCell className="td-numero tabular-nums">{oferta.quantidadeOfertada}</TableCell>
                        <TableCell className="td-numero tabular-nums">
                          <Input
                            type="number"
                            min={0}
                            max={oferta.quantidadeOfertada}
                            value={item.quantidade}
                            onChange={(e) => handleQuantidadeChange(item.id, Number(e.target.value))}
                            className="w-[60px] text-center tabular-nums mx-auto"
                          />
                        </TableCell>
                        <TableCell className="td-valor font-medium tabular-nums">
                          {formatBRL(valorAcumulado)}
                        </TableCell>
                        <TableCell className="td-numero tabular-nums">
                          <span className={disponiveis < 0 ? 'text-red-600' : ''}>
                            {disponiveis}
                          </span>
                        </TableCell>
                        <TableCell className="td-icone">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const groupKey = oferta.produto_base;
                              handleClearGroup(groupKey);
                            }}
                            className="h-8 w-8 mx-auto transition-opacity hover:opacity-70"
                            aria-label={`Remover ${oferta.produto_base}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Produtos Agrupados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>Produtos Ofertados</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto, fornecedor ou unidade..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandedGroups.size === productGroups.length ? collapseAll : expandAll}
                  className="whitespace-nowrap"
                >
                  {expandedGroups.size === productGroups.length ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Colapsar tudo
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expandir tudo
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4">
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
                <p>Nenhuma oferta disponível para este ciclo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {productGroups.map((group) => {
                  const selectedVariantIds = selectedByGroup.get(group.produto_base) || new Set();

                  return (
                    <ProductGroupItem
                      key={group.produto_base}
                      group={group}
                      selectedVariantIds={selectedVariantIds}
                      quantidades={composicao}
                      onToggleVariant={(variantId) => handleToggleVariant(group.produto_base, variantId)}
                      onQuantidadeChange={handleQuantidadeChange}
                      onClear={() => handleClearGroup(group.produto_base)}
                      isExpanded={expandedGroups.has(group.produto_base)}
                      onToggleExpand={() => toggleGroupExpansion(group.produto_base)}
                    />
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/ciclo-index')}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button 
                        onClick={handlePublicarClick}
                        disabled={!podePublicar || isLoading}
                      >
                        {isLoading ? 'Publicando...' : 'Publicar Venda Direta'}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!podePublicar && (
                    <TooltipContent>
                      <p>Selecione pelo menos um produto para publicar</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>

    </ResponsiveLayout>
  );
}
