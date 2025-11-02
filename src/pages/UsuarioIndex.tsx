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
import { useAuth } from '@/contexts/AuthContext';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';

interface Usuario {
  id: string;
  nomeCompleto: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  perfis: string[];
}

const UsuarioIndex = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeRole } = useAuth();
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
  } = useFilters('/usuario-index');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const [usuarios] = useState<Usuario[]>([
    { id: '1', nomeCompleto: 'João Silva', email: 'joao@email.com', status: 'Ativo', perfis: ['Fornecedor', 'Administrador'] },
    { id: '2', nomeCompleto: 'Maria Santos', email: 'maria@email.com', status: 'Ativo', perfis: ['Consumidor'] },
    { id: '3', nomeCompleto: 'Pedro Costa', email: 'pedro@email.com', status: 'Inativo', perfis: ['Fornecedor'] },
    { id: '4', nomeCompleto: 'Ana Oliveira', email: 'ana@email.com', status: 'Ativo', perfis: ['Consumidor', 'Fornecedor'] },
    { id: '5', nomeCompleto: 'Carlos Pereira', email: 'carlos@email.com', status: 'Ativo', perfis: ['Administrador'] },
    { id: '6', nomeCompleto: 'Fernanda Lima', email: 'fernanda@email.com', status: 'Ativo', perfis: ['Administrador de Mercado'] },
  ]);

  const perfisDisponiveis = ['Administrador', 'Administrador de Mercado', 'Fornecedor', 'Consumidor'];

  const filteredUsers = useMemo(() => {
    let result = [...usuarios];

    if (debouncedSearch) {
      result = result.filter(usuario =>
        usuario.nomeCompleto.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        usuario.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      result = result.filter(usuario => 
        filters.status.includes(usuario.status)
      );
    }

    if (filters.perfis.length > 0) {
      result = result.filter(usuario =>
        usuario.perfis.some(perfil => filters.perfis.includes(perfil))
      );
    }

    return result;
  }, [usuarios, filters, debouncedSearch]);

  const handleEdit = (id: string) => {
    navigate(`/usuario/${id}`);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido com sucesso.",
    });
  };

  const handleAddUser = () => {
    navigate('/usuario');
  };

  const handleStatusChange = async (id: string, newStatus: 'Ativo' | 'Inativo') => {
    // Aqui você faria a chamada PATCH /{recurso}/{id} body { status: "ativo"|"inativo" }
    // Simulando uma chamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Status atualizado",
      description: `Status do usuário alterado para ${newStatus}.`,
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
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              {activeRole === 'admin_mercado' ? 'Administrador de mercado - ' : ''}Usuários
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerenciar perfis e acessos do sistema
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FiltersBar
              searchValue={filters.search}
              onSearchChange={(value) => updateFilter('search', value)}
              onFiltersClick={() => setIsOpen(true)}
              activeChips={getActiveChips()}
              onRemoveChip={clearFilterGroup}
              resultCount={filteredUsers.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
            />
          </div>
          <Button onClick={handleAddUser} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  {hasActiveFilters() 
                    ? 'Sem resultados para os filtros selecionados.' 
                    : 'Nenhum usuário cadastrado.'}
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
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Perfis</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nomeCompleto}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <StatusToggle
                            currentStatus={usuario.status}
                            onStatusChange={(newStatus) => handleStatusChange(usuario.id, newStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {usuario.perfis.map((perfil, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {perfil}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(usuario.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden md:inline">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(usuario.id)}
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
                <label htmlFor={`status-${status}`} className="text-sm font-medium cursor-pointer">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Perfis</Label>
          <div className="space-y-2">
            {perfisDisponiveis.map((perfil) => (
              <div key={perfil} className="flex items-center space-x-2">
                <Checkbox
                  id={`perfil-${perfil}`}
                  checked={filters.perfis.includes(perfil)}
                  onCheckedChange={() => toggleArrayValue('perfis', perfil)}
                />
                <label htmlFor={`perfil-${perfil}`} className="text-sm font-medium cursor-pointer">
                  {perfil}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
};

export default UsuarioIndex;
