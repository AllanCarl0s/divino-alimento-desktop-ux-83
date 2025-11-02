import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { FiltersPanel } from "@/components/admin/FiltersPanel";
import { useFilters } from "@/hooks/useFilters";
import { mercadosLocais } from "@/data/mercados-locais";

export default function AdminPrecosLista() {
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
  } = useFilters('/admin/precos');

  const filteredMercados = useMemo(() => {
    let result = [...mercadosLocais];

    // Aplicar busca com debounce
    if (debouncedSearch) {
      result = result.filter(m =>
        m.nome.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Aplicar filtro de status
    if (filters.status.length > 0) {
      result = result.filter(m => filters.status.includes(m.status));
    }

    // Aplicar filtro de tipo
    if (filters.tipo.length > 0) {
      result = result.filter(m => filters.tipo.includes(m.tipo));
    }

    return result;
  }, [filters, debouncedSearch]);

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
    >
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">Lista de Mercados – Gestão de Preços</h1>
            <p className="text-muted-foreground">
              Selecione um mercado para definir preços específicos
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <FiltersBar
          searchValue={filters.search}
          onSearchChange={(value) => updateFilter('search', value)}
          onFiltersClick={() => setIsOpen(true)}
          activeChips={getActiveChips()}
          onRemoveChip={clearFilterGroup}
          resultCount={filteredMercados.length}
          hasActiveFilters={hasActiveFilters()}
          filtersOpen={isOpen}
        />

        {/* Desktop Table */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Mercados Cadastrados</CardTitle>
            <CardDescription>
              {filteredMercados.length} mercado(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Mercado</TableHead>
                  <TableHead>Tipo de Mercado</TableHead>
                  <TableHead>Administrador Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMercados.map((mercado) => (
                  <TableRow key={mercado.id}>
                    <TableCell className="font-medium">{mercado.nome}</TableCell>
                    <TableCell>{mercado.tipo}</TableCell>
                    <TableCell>{mercado.administrador || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={mercado.status === 'ativo' ? "default" : "secondary"}>
                        {mercado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90"
                        onClick={() => navigate(`/admin/precos/${mercado.id}`)}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Gerenciar Preços
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredMercados.map((mercado) => (
            <Card key={mercado.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{mercado.nome}</CardTitle>
                    <CardDescription>{mercado.tipo}</CardDescription>
                  </div>
                  <Badge variant={mercado.status === 'ativo' ? "default" : "secondary"}>
                    {mercado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Administrador Responsável</p>
                  <p className="text-sm font-medium">{mercado.administrador || '—'}</p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-success hover:bg-success/90"
                  onClick={() => navigate(`/admin/precos/${mercado.id}`)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Gerenciar Preços
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMercados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground">
                {hasActiveFilters() 
                  ? 'Sem resultados para os filtros selecionados.' 
                  : 'Nenhum mercado encontrado'}
              </p>
              {hasActiveFilters() && (
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
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
            {['ativo', 'inativo'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleArrayValue('status', status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium cursor-pointer capitalize"
                >
                  {status === 'ativo' ? 'Ativo' : 'Inativo'}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Tipo de Mercado</Label>
          <div className="space-y-2">
            {['Cestas', 'Lote', 'Venda Direta'].map((tipo) => (
              <div key={tipo} className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo-${tipo}`}
                  checked={filters.tipo.includes(tipo)}
                  onCheckedChange={() => toggleArrayValue('tipo', tipo)}
                />
                <label
                  htmlFor={`tipo-${tipo}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {tipo}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
}
