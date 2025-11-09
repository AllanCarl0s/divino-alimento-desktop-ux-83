import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Search, ArrowLeft, AlertTriangle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductGroupItem } from '@/components/admin/ProductGroupItem';
import { groupAndSortProducts, filterProducts, Oferta } from '@/utils/product-grouping';
import { useCompositionStore } from '@/stores/compositionStore';

export default function AdminMercadoComposicaoLote() {
  const { cicloId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');

  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const { initialize, getVariantComputed, setDraft, clearDraft } = useCompositionStore();

  // Mock data - produtos ofertados para este mercado
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
      pedidosAcumulados: 10,
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
      pedidosAcumulados: 5,
    },
    {
      id: '4',
      produto_base: 'Alface Crespa',
      nome: 'Alface Crespa (maço)',
      unidade: 'maço',
      valor: 2.00,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 50,
      certificacao: 'transicao',
      tipo_agricultura: 'familiar',
      pedidosAcumulados: 0,
    },
    {
      id: '5',
      produto_base: 'Alface Crespa',
      nome: 'Alface Crespa (kg)',
      unidade: 'kg',
      valor: 3.20,
      fornecedor: 'Maria Horta',
      quantidadeOfertada: 30,
      certificacao: 'transicao',
      tipo_agricultura: 'familiar',
      pedidosAcumulados: 6,
    },
    {
      id: '7',
      produto_base: 'Cenoura Orgânica',
      nome: 'Cenoura Orgânica (kg)',
      unidade: 'kg',
      valor: 3.80,
      fornecedor: 'Fazenda Santa Clara',
      quantidadeOfertada: 40,
      certificacao: 'convencional',
      tipo_agricultura: 'nao_familiar',
      pedidosAcumulados: 8,
    },
  ]);

  // Initialize store when ofertas change
  useEffect(() => {
    initialize(ofertas);
  }, [ofertas, initialize]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    valorMaximo: 500.00,
    tipo: 'Lote',
    mercado: 'Mercado Central'
  };

  const productGroups = useMemo(() => {
    const groups = groupAndSortProducts(ofertas);
    return filterProducts(groups, busca);
  }, [ofertas, busca]);

  const selectedItems = useMemo(() => {
    const items: Array<{ id: string; valor: number; quantidade: number }> = [];
    ofertas.forEach(oferta => {
      const computed = getVariantComputed(oferta.id);
      if (computed.draft > 0) {
        items.push({
          id: oferta.id,
          valor: oferta.valor,
          quantidade: computed.draft,
        });
      }
    });
    return items;
  }, [ofertas, getVariantComputed]);

  const valorAtual = selectedItems.reduce((acc, item) => {
    return acc + (item.valor * item.quantidade);
  }, 0);
  
  const saldo = ciclo.valorMaximo - valorAtual;
  const totalItens = selectedItems.reduce((acc, item) => acc + item.quantidade, 0);

  const handleQuantidadeChange = (variantId: string, quantidade: number) => {
    setDraft(variantId, quantidade);
  };

  const handleRemoveItem = (variantId: string) => {
    setDraft(variantId, 0);
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
    if (excedeuValor) {
      setShowConfirmModal(true);
    } else {
      executarPublicacao();
    }
  };

  const executarPublicacao = () => {
    const payload = {
      itens: selectedItems.map(item => {
        const oferta = ofertas.find(o => o.id === item.id);
        return {
          produtoComercializavelId: item.id,
          fornecedorId: oferta?.fornecedor || '',
          precoUnitario: item.valor,
          quantidadeOfertada: oferta?.quantidadeOfertada || 0,
          quantidadePedidos: item.quantidade,
        };
      }),
      valorAtual,
      valorMaximo: ciclo.valorMaximo,
      saldo,
    };

    setIsLoading(true);
    setShowConfirmModal(false);
    
    setTimeout(() => {
      setIsLoading(false);
      
      const mensagem = excedeuValor 
        ? 'Composição lote salva (acima do valor máximo)'
        : 'Composição lote salva com sucesso';
      
      toast({
        title: mensagem,
        description: `${selectedItems.length} produto(s), ${totalItens} itens, ${formatBRL(valorAtual)}`,
        className: excedeuValor ? 'bg-yellow-600 text-white border-yellow-700' : 'bg-green-600 text-white border-green-700',
        duration: 5000,
      });

      setTimeout(() => {
        navigate('/adminmercado/ciclo-index');
      }, 1000);
    }, 1000);
  };

  const podePublicar = selectedItems.length > 0;
  const excedeuValor = valorAtual > ciclo.valorMaximo;

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/adminmercado/ciclo-index')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Administrador de mercado - Composição de Ofertas – {ciclo.mercado}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Configure os produtos, quantidades e valores que serão oferecidos neste ciclo
          </p>
        </div>

        {/* Resumo Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {ciclo.tipo} • Mercado: {ciclo.mercado}
                </p>
              </div>
              <div className="flex gap-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Valor Máximo</p>
                        <p className="text-2xl font-bold">{formatBRL(ciclo.valorMaximo)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orçamento máximo aprovado para este mercado</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Valor Atual</p>
                        <p className="text-2xl font-bold">{formatBRL(valorAtual)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma dos produtos × quantidades selecionadas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Saldo</p>
                        <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatBRL(saldo)}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Valor Máximo – Valor Atual</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Alerta quando excede valor */}
        {excedeuValor && (
          <Alert variant="destructive" className="border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium">
              ⚠️ Valor atual excede o valor máximo permitido para este mercado.
            </AlertDescription>
          </Alert>
        )}

        {/* Produtos Selecionados */}
        {selectedItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Produtos Selecionados</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedItems.length} produto(s) · {totalItens} itens
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Medida</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Ofertados</TableHead>
                    <TableHead className="text-right">Pedidos</TableHead>
                    <TableHead className="text-right">Valor Acumulado</TableHead>
                    <TableHead className="text-right">Disponíveis</TableHead>
                    <TableHead className="text-center">Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => {
                    const oferta = ofertas.find(o => o.id === item.id);
                    if (!oferta) return null;
                    
                    const computed = getVariantComputed(item.id);
                    const valorAcumulado = computed.valorAcum;
                    const disponiveis = computed.disponivel;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{oferta.produto_base}</TableCell>
                        <TableCell>{oferta.unidade}</TableCell>
                        <TableCell className="text-right">{formatBRL(oferta.valor)}</TableCell>
                        <TableCell>{oferta.fornecedor}</TableCell>
                        <TableCell className="text-right">{oferta.quantidadeOfertada}</TableCell>
                        <TableCell className="text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatBRL(valorAcumulado)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={disponiveis < 0 ? 'text-red-600 font-bold' : ''}>
                            {disponiveis}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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

        {/* Busca e Filtros */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <CardTitle>Produtos Ofertados</CardTitle>
              
              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandedGroups.size === productGroups.length ? collapseAll : expandAll}
                  className="whitespace-nowrap h-9 border-primary text-primary hover:bg-primary/10"
                >
                  {expandedGroups.size === productGroups.length ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Recolher Tudo
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expandir Tudo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Lista de Produtos Agrupados */}
            <div className="space-y-4">
              {productGroups.map((group) => (
                <ProductGroupItem
                  key={group.produto_base}
                  group={group}
                  isExpanded={expandedGroups.has(group.produto_base)}
                  onToggleExpand={() => toggleGroupExpansion(group.produto_base)}
                  onQuantidadeChange={handleQuantidadeChange}
                />
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/adminmercado/ciclo-index')}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handlePublicarClick}
                disabled={!podePublicar || isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? 'Salvando...' : 'Salvar Composição'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Valor acima do máximo permitido</AlertDialogTitle>
            <AlertDialogDescription>
              O valor atual ({formatBRL(valorAtual)}) excede o valor máximo ({formatBRL(ciclo.valorMaximo)}).
              Deseja prosseguir mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executarPublicacao}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
