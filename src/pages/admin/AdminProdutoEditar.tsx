import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminProdutoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  // Mock data - em produção viria do backend
  const [formData, setFormData] = useState({
    nome: 'Tomate Orgânico',
    categoria: 'Hortaliças',
    unidade: 'kg',
    valorReferencia: '4.50',
    descricao: 'Tomate orgânico cultivado sem agrotóxicos',
    status: 'Ativo',
    certificacoes: {
      organico: true,
      agriculturaFamiliar: true,
      certificadoMunicipal: false
    }
  });

  const categorias = ['Hortaliças', 'Frutas', 'Derivados', 'Grãos', 'Legumes'];
  const unidades = ['kg', 'unidade', 'maço', 'litro', 'dúzia', 'grama'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Alimento atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    
    navigate('/admin/alimentos');
  };

  const handleDelete = () => {
    toast({
      title: "Alimento excluído",
      description: "O alimento foi removido com sucesso.",
    });
    navigate('/admin/alimentos');
  };

  const handleCancel = () => {
    navigate('/admin/alimentos');
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate(-1)}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              Administrador - Editar Alimento Base
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Atualize as informações do alimento
            </p>
          </div>
          <Badge variant={formData.status === 'Ativo' ? 'success' : 'warning'}>
            {formData.status}
          </Badge>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Alimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome do Alimento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Tomate Orgânico"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  required
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Alimento</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o alimento..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-6 md:justify-between">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="w-full md:w-auto"
              >
                Cancelar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full md:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                   <AlertDialogDescription>
                                     Deseja realmente excluir este alimento? Esta ação não pode ser desfeita.
                                   </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button 
              type="submit"
              className="w-full md:w-auto"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoEditar;
