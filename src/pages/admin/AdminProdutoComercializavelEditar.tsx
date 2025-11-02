import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { produtosReferencia } from '@/data/produtos-referencia';
import { formatBRLInput, parseBRLToNumber } from '@/utils/currency';
import { ProductSearch } from '@/components/ui/product-search';

const AdminProdutoComercializavelEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock data - em produção, carregar dados do produto com base no ID
  const [formData, setFormData] = useState({
    produto_base: 'Tomate Orgânico',
    unidade: 'Unidade',
    peso_kg: '0.15',
    preco_base: '0.68',
    status: 'ativo' as 'ativo' | 'inativo',
  });

  const unidadesComercializacao = ['Unidade', 'Dúzia', 'Litro', 'Kg'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.produto_base || !formData.unidade || !formData.peso_kg || !formData.preco_base) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Converter preço para número antes de salvar
    const precoNumerico = parseBRLToNumber(formData.preco_base);
    console.log('Atualizando produto com preço:', precoNumerico);

    toast({
      title: "Sucesso",
      description: "Produto comercializável atualizado com sucesso!",
    });

    navigate('/admin/produtos-comercializaveis');
  };

  const handleCancel = () => {
    navigate('/admin/produtos-comercializaveis');
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: "Produto excluído",
      description: "O produto comercializável foi removido com sucesso.",
    });
    navigate('/admin/produtos-comercializaveis');
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/produtos-comercializaveis')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary mb-2">
            Administrador - Editar Produto Comercializável
          </h1>
          <p className="text-muted-foreground">
            Atualize as informações da variação comercial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProductSearch
                value={formData.produto_base}
                onSelect={(productName) => 
                  setFormData({ ...formData, produto_base: productName })
                }
                label="Buscar produto base *"
                placeholder="Digite para buscar produto base..."
              />

              <div className="space-y-2">
                <Label htmlFor="produto_base_select">
                  Produto Base <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.produto_base}
                  onValueChange={(value) =>
                    setFormData({ ...formData, produto_base: value })
                  }
                >
                  <SelectTrigger id="produto_base_select">
                    <SelectValue placeholder="Selecione o produto base" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtosReferencia.map((produto) => (
                      <SelectItem key={produto.id} value={produto.nome}>
                        {produto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">
                  Unidade de Comercialização <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="unidade"
                  type="text"
                  placeholder="Ex: Unidade, Dúzia, Litro, Kg"
                  value={formData.unidade}
                  onChange={(e) =>
                    setFormData({ ...formData, unidade: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso_kg">
                  Peso em Kg (para conversão) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="peso_kg"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 0.15"
                  value={formData.peso_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, peso_kg: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco_base">
                  Preço Base (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="preco_base"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 4,50"
                  value={formData.preco_base}
                  onChange={(e) =>
                    setFormData({ ...formData, preco_base: formatBRLInput(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'ativo' | 'inativo') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="flex-1 border-primary text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Excluir
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto comercializável? Esta ação não pode ser desfeita.
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

export default AdminProdutoComercializavelEditar;
