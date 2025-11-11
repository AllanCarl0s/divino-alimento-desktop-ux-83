import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatBRL } from '@/utils/currency';
import { RoleTitle } from '@/components/layout/RoleTitle';

interface ProdutoComercializavel {
  id: string;
  produto_base: string;
  unidade: string;
  peso_kg: number;
  preco_base: number;
  status: 'ativo' | 'inativo';
}

const AdminProdutosComercialivaveis = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Mock data
  const [produtos, setProdutos] = useState<ProdutoComercializavel[]>([
    { id: '1', produto_base: 'Tomate Orgânico', unidade: 'Unidade', peso_kg: 0.15, preco_base: 0.68, status: 'ativo' },
    { id: '2', produto_base: 'Tomate Orgânico', unidade: 'Cesta', peso_kg: 1.0, preco_base: 4.50, status: 'ativo' },
    { id: '3', produto_base: 'Ovos Caipiras', unidade: 'Dúzia', peso_kg: 0.7, preco_base: 15.00, status: 'ativo' },
    { id: '4', produto_base: 'Mel Orgânico', unidade: 'Litro', peso_kg: 1.4, preco_base: 28.90, status: 'ativo' },
    { id: '5', produto_base: 'Mel Orgânico', unidade: 'Lote (5L)', peso_kg: 7.0, preco_base: 135.00, status: 'inativo' },
  ]);

  const filteredProdutos = produtos.filter(p =>
    p.produto_base.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.unidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/produto-comercializavel/${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Remover o produto da lista
    setProdutos(prev => prev.filter(p => p.id !== selectedId));
    
    toast({
      title: "Alimento excluído",
      description: "O alimento comercializável foi removido com sucesso.",
    });
    setDeleteDialogOpen(false);
    setSelectedId(null);
  };

  const handleAddProduto = () => {
    navigate('/admin/produto-comercializavel');
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
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <RoleTitle page="Alimentos Comercializáveis" className="text-2xl md:text-3xl mb-2" />
          <p className="text-muted-foreground">
            Gerencie variações comerciais por unidade, peso e preço
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar alimento comercializável por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddProduto} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Alimento Comercializável
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alimento Base</TableHead>
                    <TableHead>Unidade de Comercialização</TableHead>
                    <TableHead>Peso em Kg</TableHead>
                    <TableHead>Preço Base (R$)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProdutos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.produto_base}</TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>{produto.peso_kg.toFixed(2)} kg</TableCell>
                      <TableCell>{formatBRL(produto.preco_base)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={produto.status === 'ativo' ? 'default' : 'secondary'}
                          className={produto.status === 'ativo' ? 'bg-success text-success-foreground' : 'bg-orange-500 text-white'}
                        >
                          {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(produto.id)}
                            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(produto.id)}
                            className="flex items-center gap-2 border-green-600 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{produto.produto_base}</h3>
                      <p className="text-sm text-muted-foreground">{produto.unidade}</p>
                    </div>
                    <Badge 
                      variant={produto.status === 'ativo' ? 'default' : 'secondary'}
                      className={produto.status === 'ativo' ? 'bg-success text-success-foreground' : 'bg-orange-500 text-white'}
                    >
                      {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Peso:</span>
                      <p className="font-medium">{produto.peso_kg.toFixed(2)} kg</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Preço:</span>
                      <p className="font-medium">{formatBRL(produto.preco_base)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(produto.id)}
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(produto.id)}
                      className="flex-1 border-primary text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProdutos.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Nenhum alimento comercializável encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este alimento comercializável? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
};

export default AdminProdutosComercialivaveis;
