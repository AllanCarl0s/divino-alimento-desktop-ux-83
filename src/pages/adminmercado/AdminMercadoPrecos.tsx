import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { RoleTitle } from '@/components/layout/RoleTitle';

// Mock data - administrador atual
const CURRENT_ADMIN_ID = 1;
const CURRENT_ADMIN_NAME = 'João Silva';

// Simulação de dados de mercados com administrador
const mercadosComAdmin = mercadosLocais.map(m => ({
  ...m,
  administrador: m.administrador || 'Sem administrador'
}));

export default function AdminMercadoPrecos() {
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
  } = useFilters('/adminmercado/precos');

  // Filtrar apenas mercados onde o usuário atual é administrador
  const userMercados = mercadosComAdmin.filter(m => 
    m.administrador === CURRENT_ADMIN_NAME
  );

  const filteredMercados = useMemo(() => {
    let result = [...userMercados];

    if (debouncedSearch) {
      result = result.filter(m =>
        m.nome.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      result = result.filter(m => filters.status.includes(m.status));
    }

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
          onClick={() => navigate('/adminmercado/dashboard')}
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
            <RoleTitle page="Lista de Mercados – Gestão de Preços" className="text-2xl md:text-3xl" />
            <p className="text-muted-foreground">
              Selecione um mercado para definir preços específicos
            </p>
          </div>
        </div>

        {/* Info Alert */}
        {userMercados.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você ainda não possui mercados cadastrados. Cadastre um mercado primeiro para gerenciar seus preços.
            </AlertDescription>
          </Alert>
        )}

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
                    <TableCell>{mercado.administrador}</TableCell>
                    <TableCell>
                      <Badge variant={mercado.status === 'ativo' ? "default" : "secondary"}>
                        {mercado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90"
                        onClick={() => navigate(`/adminmercado/precos/${mercado.id}`)}
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
                  <p className="text-sm font-medium">{mercado.administrador}</p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-success hover:bg-success/90"
                  onClick={() => navigate(`/adminmercado/precos/${mercado.id}`)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Gerenciar Preços
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMercados.length === 0 && userMercados.length > 0 && (
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
