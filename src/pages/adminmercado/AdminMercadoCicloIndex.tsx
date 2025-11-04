import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiltersBar } from '@/components/admin/FiltersBar';
import { FiltersPanel } from '@/components/admin/FiltersPanel';
import { useFilters } from '@/hooks/useFilters';
import { toast } from '@/hooks/use-toast';
import { Plus, Settings, Trash2, Lock, ArrowLeft, ShoppingBasket, Package, Store, Megaphone, Truck, Users, RefreshCw, Tags } from 'lucide-react';
import { formatarDataBR } from '@/utils/ciclo';
import { Ciclo, CicloMercado, getNomeTipoVenda } from '@/types/ciclo-mercado';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';

// Constante para o administrador logado
const CURRENT_ADMIN_NAME = 'João Silva';

export default function AdminMercadoCicloIndex() {
  const navigate = useNavigate();
  const { 
    filters,
    debouncedSearch,
    updateFilter, 
    toggleArrayValue, 
    clearFilters, 
    clearFilterGroup,
    getActiveChips, 
    hasActiveFilters,
    isOpen,
    setIsOpen 
  } = useFilters('/adminmercado/ciclo-index');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cicloToDelete, setCicloToDelete] = useState<string | null>(null);
  const [mercadoSelecionado, setMercadoSelecionado] = useState<Record<string, string>>({
    '1': 'm2',
    '2': 'm4',
    '3': 'm6',
    '4': 'm10'
  });
  const [ciclos, setCiclos] = useState<Ciclo[]>([
    { 
      id: '1', 
      nome: '1º Ciclo de Novembro 2025', 
      inicio_ofertas: '2025-11-03', 
      fim_ofertas: '2025-11-18',
      status: 'ativo',
      admin_responsavel_id: '1',
      admin_responsavel_nome: 'João Silva',
      mercados: [
        { id: 'm1', ciclo_id: '1', mercado_id: '1', nome_mercado: 'Mercado Central', tipo_venda: 'cesta', ordem: 1, status_composicao: 'concluida' },
        { id: 'm2', ciclo_id: '1', mercado_id: '2', nome_mercado: 'Mercado Zona Norte', tipo_venda: 'lote', ordem: 2, status_composicao: 'em_andamento' },
        { id: 'm3', ciclo_id: '1', mercado_id: '3', nome_mercado: 'Feira Livre', tipo_venda: 'venda_direta', ordem: 3, status_composicao: 'pendente' }
      ]
    },
    { 
      id: '2', 
      nome: '2º Ciclo de Outubro 2025', 
      inicio_ofertas: '2025-10-22', 
      fim_ofertas: '2025-10-30',
      status: 'ativo',
      admin_responsavel_id: '2',
      admin_responsavel_nome: 'Anna Cardoso',
      mercados: [
        { id: 'm4', ciclo_id: '2', mercado_id: '1', nome_mercado: 'Mercado Central', tipo_venda: 'cesta', ordem: 1, status_composicao: 'concluida' },
        { id: 'm5', ciclo_id: '2', mercado_id: '2', nome_mercado: 'Mercado Zona Norte', tipo_venda: 'lote', ordem: 2, status_composicao: 'concluida' }
      ]
    },
    { 
      id: '4', 
      nome: '3º Ciclo de Setembro', 
      inicio_ofertas: '2025-09-09', 
      fim_ofertas: '2025-09-16',
      status: 'inativo',
      admin_responsavel_id: '4',
      admin_responsavel_nome: 'Pedro Almeida',
      mercados: [
        { id: 'm7', ciclo_id: '4', mercado_id: '1', nome_mercado: 'Mercado 1', tipo_venda: 'lote', ordem: 1, status_composicao: 'concluida' },
        { id: 'm8', ciclo_id: '4', mercado_id: '2', nome_mercado: 'Mercado 2', tipo_venda: 'venda_direta', ordem: 2, status_composicao: 'concluida' },
        { id: 'm9', ciclo_id: '4', mercado_id: '3', nome_mercado: 'Mercado 3', tipo_venda: 'cesta', ordem: 3, status_composicao: 'concluida' },
        { id: 'm10', ciclo_id: '4', mercado_id: '4', nome_mercado: 'Mercado 4', tipo_venda: 'cesta', ordem: 4, status_composicao: 'concluida' }
      ]
    },
    { 
      id: '3', 
      nome: '1º Ciclo de Outubro 2025', 
      inicio_ofertas: '2025-10-13', 
      fim_ofertas: '2025-10-20',
      status: 'ativo',
      admin_responsavel_id: '3',
      admin_responsavel_nome: 'Maria Santos',
      mercados: [
        { id: 'm6', ciclo_id: '3', mercado_id: '3', nome_mercado: 'Feira Livre', tipo_venda: 'venda_direta', ordem: 1, status_composicao: 'concluida' }
      ]
    }
  ]);

  // Filtrar apenas ciclos do administrador logado
  const ciclosDoAdmin = useMemo(() => {
    return ciclos.filter(ciclo => ciclo.admin_responsavel_nome === CURRENT_ADMIN_NAME);
  }, [ciclos]);

  const filteredCiclos = useMemo(() => {
    let result = [...ciclosDoAdmin];

    if (debouncedSearch) {
      result = result.filter(ciclo => ciclo.nome.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }

    if (filters.status.length > 0) {
      result = result.filter(ciclo => filters.status.includes(ciclo.status));
    }

    return result.sort((a, b) => new Date(b.inicio_ofertas).getTime() - new Date(a.inicio_ofertas).getTime());
  }, [ciclosDoAdmin, filters, debouncedSearch]);

  const handleDelete = (id: string) => {
    setCicloToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cicloToDelete) {
      setCiclos(ciclos.filter(c => c.id !== cicloToDelete));
      toast({ title: "Ciclo excluído", description: "O ciclo foi excluído com sucesso." });
      setDeleteDialogOpen(false);
      setCicloToDelete(null);
    }
  };

  const getMercadoAtual = (ciclo: Ciclo): CicloMercado | undefined => {
    const selecionadoId = mercadoSelecionado[ciclo.id];
    if (selecionadoId) {
      return ciclo.mercados.find(m => m.id === selecionadoId);
    }
    return ciclo.mercados.find(m => m.status_composicao === 'em_andamento') 
      || ciclo.mercados.find(m => m.status_composicao === 'pendente');
  };

  const handleMercadoChange = (ciclo: Ciclo, mercadoId: string) => {
    setMercadoSelecionado(prev => ({ ...prev, [ciclo.id]: mercadoId }));
  };

  const handleComposicao = (ciclo: Ciclo, mercado?: CicloMercado) => {
    const mercadoAlvo = mercado || getMercadoAtual(ciclo);
    
    if (!mercadoAlvo) {
      toast({ 
        title: "Nenhum mercado disponível", 
        description: "Todos os mercados já foram compostos.", 
        variant: "destructive" 
      });
      return;
    }

    const rotas = { 
      cesta: `/adminmercado/composicao-cesta/${ciclo.id}?mercado=${mercadoAlvo.id}`, 
      lote: `/adminmercado/composicao-lote/${ciclo.id}?mercado=${mercadoAlvo.id}`, 
      venda_direta: `/adminmercado/vendadireta-compor/${ciclo.id}?mercado=${mercadoAlvo.id}` 
    };
    navigate(rotas[mercadoAlvo.tipo_venda]);
  };

  const getComposicaoIcon = (tipo: 'cesta' | 'lote' | 'venda_direta') => {
    const icons = {
      cesta: ShoppingBasket,
      lote: Package,
      venda_direta: Store
    };
    return icons[tipo];
  };

  const getComposicaoTooltip = (tipo: 'cesta' | 'lote' | 'venda_direta') => {
    const tooltips = {
      cesta: 'Composição da Cesta',
      lote: 'Composição do Lote',
      venda_direta: 'Composição da Venda Direta'
    };
    return tooltips[tipo];
  };

  const isMercadoBloqueado = (ciclo: Ciclo, mercado: CicloMercado): boolean => {
    if (ciclo.status === 'inativo') return true;
    if (mercado.ordem === 1) return false;
    const mercadoAnterior = ciclo.mercados.find(m => m.ordem === mercado.ordem - 1);
    return mercadoAnterior ? mercadoAnterior.status_composicao !== 'concluida' : true;
  };

  const canPublishVendaDireta = (ciclo: Ciclo, mercado: CicloMercado): { can: boolean; reason?: string } => {
    if (mercado.tipo_venda !== 'venda_direta') {
      return { can: false, reason: 'Não é venda direta' };
    }
    if (ciclo.status !== 'ativo') {
      return { can: false, reason: 'Ciclo inativo' };
    }
    const hasItems = mercado.status_composicao !== 'pendente';
    if (!hasItems) {
      return { can: false, reason: 'Adicione pelo menos 1 item na composição para liberar' };
    }
    return { can: true };
  };

  const handlePublishClick = (ciclo: Ciclo, mercado: CicloMercado) => {
    navigate(`/adminmercado/vendadireta-liberar/${ciclo.id}?mercado=${mercado.id}`);
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={<Button variant="ghost" size="icon" onClick={() => navigate('/adminmercado/dashboard')} className="text-white hover:bg-white/20"><ArrowLeft className="h-5 w-5" /></Button>}
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Administrador de mercado - Gestão de Ciclos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Acompanhe, edite e crie novos ciclos operacionais.</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FiltersBar searchValue={filters.search} onSearchChange={(value) => updateFilter('search', value)} onFiltersClick={() => setIsOpen(true)} activeChips={getActiveChips()} onRemoveChip={clearFilterGroup} resultCount={filteredCiclos.length} hasActiveFilters={hasActiveFilters()} filtersOpen={isOpen} />
          </div>
          <Button onClick={() => navigate('/adminmercado/ciclo')} className="bg-primary hover:bg-primary/90 whitespace-nowrap"><Plus className="h-4 w-4 mr-2" />Novo Ciclo</Button>
        </div>

        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Ciclo</TableHead>
                  <TableHead>Administrador Responsável</TableHead>
                  <TableHead>Período de Ofertas</TableHead>
                  <TableHead>Mercado Atual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCiclos.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 space-y-4"><p className="text-muted-foreground">{hasActiveFilters() ? 'Sem resultados para os filtros selecionados.' : 'Nenhum ciclo encontrado.'}</p>{hasActiveFilters() && <Button variant="outline" onClick={clearFilters}>Limpar filtros</Button>}</TableCell></TableRow>
                ) : (
                  filteredCiclos.map((ciclo) => {
                    const mercadoAtual = getMercadoAtual(ciclo);
                    return (
                      <TableRow key={ciclo.id}>
                        <TableCell className="font-medium">{ciclo.nome}</TableCell>
                        <TableCell>{ciclo.admin_responsavel_nome}</TableCell>
                        <TableCell>{formatarDataBR(ciclo.inicio_ofertas)} – {formatarDataBR(ciclo.fim_ofertas)}</TableCell>
                        <TableCell>
                          <Select 
                            value={mercadoAtual?.id || ''} 
                            onValueChange={(value) => handleMercadoChange(ciclo, value)}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Selecione o mercado" />
                            </SelectTrigger>
                            <SelectContent>
                              {ciclo.mercados.map((mercado) => {
                                const bloqueado = isMercadoBloqueado(ciclo, mercado);
                                const isCurrent = mercado.id === mercadoAtual?.id;
                                return (
                                  <SelectItem 
                                    key={mercado.id} 
                                    value={mercado.id}
                                    disabled={bloqueado}
                                  >
                                  <div className="flex items-center gap-2">
                                    {bloqueado && <Lock className="h-3 w-3" />}
                                    <span className={isCurrent ? 'font-bold' : ''}>
                                      {mercado.ordem}. {mercado.nome_mercado} ({getNomeTipoVenda(mercado.tipo_venda)})
                                    </span>
                                  </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Badge variant={ciclo.status === 'ativo' ? 'success' : 'warning'}>{ciclo.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <div className="flex justify-end gap-2">
                              {/* 1. Construir Ciclo */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => navigate(`/adminmercado/ciclo/${ciclo.id}`)} 
                                    className="h-10 w-10 border-2 border-primary hover:bg-primary/10"
                                  >
                                    <Settings className="h-5 w-5 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Construir ciclo</p></TooltipContent>
                              </Tooltip>

                              {/* 2. Migrar Ofertas */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => navigate(`/adminmercado/migrar-ofertas/${ciclo.id}`)} 
                                    disabled={ciclo.status !== 'ativo'}
                                    className="h-10 w-10 border-2 border-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <RefreshCw className="h-5 w-5 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{ciclo.status === 'ativo' ? 'Migrar ofertas de outro ciclo' : 'Ciclo inativo'}</p>
                                </TooltipContent>
                              </Tooltip>

                              {/* 3. Inserir/Editar Ofertas */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => navigate(`/oferta/${ciclo.id}`)} 
                                    className="h-10 w-10 border-2 border-primary hover:bg-primary/10"
                                  >
                                    <Tags className="h-5 w-5 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Inserir/editar ofertas</p></TooltipContent>
                              </Tooltip>

                              {/* Botões específicos por tipo de mercado */}
                              {mercadoAtual && (
                                <>
                                  {/* 3. Liberar Venda Direta (apenas para Venda Direta) */}
                                  {mercadoAtual.tipo_venda === 'venda_direta' && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          onClick={() => handlePublishClick(ciclo, mercadoAtual)}
                                          disabled={!canPublishVendaDireta(ciclo, mercadoAtual).can}
                                          className="h-10 w-10 border-2 border-success hover:bg-success/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                          <Megaphone className="h-5 w-5 text-success" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {canPublishVendaDireta(ciclo, mercadoAtual).can 
                                            ? 'Liberar venda direta para consumidores' 
                                            : canPublishVendaDireta(ciclo, mercadoAtual).reason}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {/* 4. Compor Mercado (Cesta, Lote ou Venda Direta) */}
                                  {(mercadoAtual.tipo_venda === 'cesta' || mercadoAtual.tipo_venda === 'lote' || mercadoAtual.tipo_venda === 'venda_direta') && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          onClick={() => handleComposicao(ciclo, mercadoAtual)}
                                          disabled={isMercadoBloqueado(ciclo, mercadoAtual)}
                                          className="h-10 w-10 border-2 border-success hover:bg-success/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                          {(() => {
                                            const Icon = getComposicaoIcon(mercadoAtual.tipo_venda);
                                            return <Icon className="h-5 w-5 text-success" />;
                                          })()}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {ciclo.status === 'inativo' 
                                            ? 'Ciclo finalizado' 
                                            : isMercadoBloqueado(ciclo, mercadoAtual) 
                                              ? 'Esse mercado está bloqueado até compor o anterior' 
                                              : getComposicaoTooltip(mercadoAtual.tipo_venda)}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </>
                              )}

                              {/* 5. Relatório Fornecedores */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => {
                                      const mercadoId = mercadoAtual?.id || '';
                                      navigate(`/adminmercado/relatorio-fornecedores/${ciclo.id}?mercado=${mercadoId}`);
                                    }} 
                                    disabled={!mercadoAtual}
                                    className="h-10 w-10 border-2 border-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <Truck className="h-5 w-5 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{mercadoAtual ? 'Gerar Relatório Pedidos Fornecedores' : 'Selecione um mercado'}</p>
                                </TooltipContent>
                              </Tooltip>

                              {/* 6. Relatório Consumidores */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => {
                                      const mercadoId = mercadoAtual?.id || '';
                                      navigate(`/adminmercado/relatorio-consumidores/${ciclo.id}?mercado=${mercadoId}`);
                                    }} 
                                    disabled={!mercadoAtual}
                                    className="h-10 w-10 border-2 border-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <Users className="h-5 w-5 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{mercadoAtual ? 'Gerar Relatório Pedidos Consumidores' : 'Selecione um mercado'}</p>
                                </TooltipContent>
                              </Tooltip>

                              {/* 7. Excluir Ciclo */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => handleDelete(ciclo.id)} 
                                    className="h-10 w-10 border-2 border-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-5 w-5 text-destructive" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Excluir Ciclo</p></TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <FiltersPanel open={isOpen} onOpenChange={setIsOpen} onApply={() => {}} onClear={clearFilters}>
          <div className="text-sm text-muted-foreground">Filtros disponíveis em breve</div>
        </FiltersPanel>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ciclo</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza de que deseja excluir este ciclo? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
