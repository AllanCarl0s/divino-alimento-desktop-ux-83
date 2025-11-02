import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminCategoriaDados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - em produção viria do backend
  const [formData, setFormData] = useState({
    nome: 'Frutas',
    situacao: 'Ativo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da categoria é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso",
      });
      navigate('/admin/categorias');
    } else {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    toast({
      title: "Sucesso",
      description: "Categoria excluída com sucesso",
    });
    navigate('/admin/categorias');
  };

  const handleCancel = () => {
    navigate('/admin/categorias');
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/categorias')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            Administrador - Editar Categoria de Produto
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Atualize as informações da categoria
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome da Categoria de Produto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Frutas, Verduras, Legumes..."
                className={errors.nome ? 'border-destructive' : ''}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Situação <span className="text-destructive">*</span></Label>
              <RadioGroup 
                value={formData.situacao} 
                onValueChange={(value) => handleInputChange('situacao', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ativo" id="ativo" />
                  <Label htmlFor="ativo" className="cursor-pointer">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inativo" id="inativo" />
                  <Label htmlFor="inativo" className="cursor-pointer">Inativo</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a categoria "{formData.nome}"?
                  Esta ação não pode ser desfeita.
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

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
              disabled={!formData.nome.trim()}
            >
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminCategoriaDados;
