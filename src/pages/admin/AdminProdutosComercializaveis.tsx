import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { FiltersBar } from '@/components/admin/FiltersBar';
import { FiltersPanel } from '@/components/admin/FiltersPanel';
import { useFilters } from '@/hooks/useFilters';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { StatusToggle } from '@/components/ui/status-toggle';
import { RoleTitle } from '@/components/layout/RoleTitle';

interface ProdutoComercializavel {
  id: string;
  produto_base: string;
  unidade: string;
  peso_kg: number;
  preco_base: number;
  status: 'Ativo' | 'Inativo';
}

const AdminProdutosComercializaveis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  } = useFilters('/admin/produtos-comercializaveis');

  const [produtos, setProdutos] = useState<ProdutoComercializavel[]>([
    { 
      id: '1', 
      produto_base: 'Tomate Orgânico', 
      unidade: 'kg', 
      peso_kg: 1,
      preco_base: 7.50,
      status: 'Ativo'
    },
    { 
      id: '2', 
      produto_base: 'Ovos Caipiras', 
      unidade: 'duzia', 
      peso_kg: 0.6,
      preco_base: 15.00,
      status: 'Ativo'
    },
    { 
      id: '3', 
      produto_base: 'Mel Orgânico', 
      unidade: 'litro', 
      peso_kg: 1.4,
      preco_base: 28.90,
      status: 'Inativo'
    }
  ]);

  // Lista de produtos base únicos para o filtro
  const produtosBase = useMemo(() => {
    return Array.from(new Set(produtos.map(p => p.produto_base)));
  }, [produtos]);

  const filteredProdutos = useMemo(() => {
    let result = [...produtos];

    // Aplicar busca com debounce
    if (debouncedSearch) {
      result = result.filter(produto =>
        produto.produto_base.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Aplicar filtro de status
    if (filters.status.length > 0) {
      result = result.filter(produto => 
        filters.status.includes(produto.status)
      );
    }

    // Aplicar filtro de produto base
    if (filters.produtoBase.length > 0) {
      result = result.filter(produto =>
        filters.produtoBase.includes(produto.produto_base)
      );
    }

    return result;
  }, [produtos, filters, debouncedSearch]);

  const handleEdit = (id: string) => {
    navigate(`/admin/produto-comercializavel/${id}`);
  };

  const handleDelete = (id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Alimento excluído",
      description: "O alimento comercializável foi removido com sucesso.",
    });
  };

  const handleAddProduto = () => {
    navigate('/admin/produto-comercializavel');
  };

  const handleStatusChange = async (id: string, newStatus: 'Ativo' | 'Inativo') => {
    // Aqui você faria a chamada PATCH /produtos-comercializaveis/{id} body { status: "ativo"|"inativo" }
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProdutos(prev => 
      prev.map(prod => prod.id === id ? { ...prod, status: newStatus } : prod)
    );
    
    toast({
      title: "Status atualizado",
      description: `Status do alimento alterado para ${newStatus}.`,
    });
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <RoleTitle page="Alimentos Comercializáveis" className="text-2xl md:text-3xl" />
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie alimentos comercializáveis com preços e unidades
            </p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex gap-4">
          <div className="flex-1">
            <FiltersBar
              searchValue={filters.search}
              onSearchChange={(value) => updateFilter('search', value)}
              onFiltersClick={() => setIsOpen(true)}
              activeChips={getActiveChips()}
              onRemoveChip={clearFilterGroup}
              resultCount={filteredProdutos.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
              searchPlaceholder="Buscar alimento comercializável por nome…"
            />
          </div>
          <Button onClick={handleAddProduto} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Alimento
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Alimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredProdutos.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  {hasActiveFilters() 
                    ? 'Sem resultados para os filtros selecionados.' 
                    : 'Nenhum alimento cadastrado.'}
                </p>
                {hasActiveFilters() && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alimento Base</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Preço Base</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">
                          {produto.produto_base}
                        </TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell>{produto.peso_kg} kg</TableCell>
                        <TableCell>R$ {produto.preco_base.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusToggle
                            currentStatus={produto.status}
                            onStatusChange={(newStatus) => handleStatusChange(produto.id, newStatus)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(produto.id)}
                              className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden md:inline">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Deseja realmente excluir este alimento comercializável? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(produto.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Painel de Filtros */}
      <FiltersPanel
        open={isOpen}
        onOpenChange={setIsOpen}
        onApply={() => {}}
        onClear={clearFilters}
      >
        <div className="space-y-4">
          <Label>Status</Label>
          <div className="space-y-2">
            {['Ativo', 'Inativo'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleArrayValue('status', status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Alimento Base</Label>
          <div className="space-y-2">
            {produtosBase.map((produtoBase) => (
              <div key={produtoBase} className="flex items-center space-x-2">
                <Checkbox
                  id={`produto-${produtoBase}`}
                  checked={filters.produtoBase.includes(produtoBase)}
                  onCheckedChange={() => toggleArrayValue('produtoBase', produtoBase)}
                />
                <label
                  htmlFor={`produto-${produtoBase}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {produtoBase}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
};

export default AdminProdutosComercializaveis;
