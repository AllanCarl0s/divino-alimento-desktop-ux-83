import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Usuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nomeUsuario: '',
    email: '',
    perfilFornecedor: false,
    perfilConsumidor: false,
    perfilAdministrador: false,
    perfilAdministradorMercado: false,
    situacao: 'Ativo' as 'Ativo' | 'Inativo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      // Simular carregamento dos dados do usuário para edição
      const mockUser = {
        nomeUsuario: 'João Silva',
        email: 'joao@email.com',
        perfilFornecedor: true,
        perfilConsumidor: false,
        perfilAdministrador: true,
        perfilAdministradorMercado: false,
        situacao: 'Ativo' as 'Ativo' | 'Inativo'
      };
      setFormData(mockUser);
    }
  }, [id, isEdit]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeUsuario.trim()) {
      newErrors.nomeUsuario = 'Nome não pode estar vazio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail deve estar em formato válido';
    }

    if (!formData.perfilFornecedor && !formData.perfilConsumidor && !formData.perfilAdministrador && !formData.perfilAdministradorMercado) {
      newErrors.perfis = 'Pelo menos um perfil deve ser selecionado';
    }

    if (!formData.situacao) {
      newErrors.situacao = 'Situação deve estar definida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const action = isEdit ? 'atualizado' : 'criado';
      toast({
        title: "Sucesso",
        description: `Usuário ${action} com sucesso`,
      });
      navigate('/usuario-index');
    } else {
      toast({
        title: "Erro",
        description: "Corrija os dados antes de prosseguir",
        variant: "destructive",
      });
      
      // Focar no primeiro campo com erro
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
    }
  };

  const handleCancel = () => {
    navigate('/usuario-index');
  };

  const handleDelete = () => {
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido com sucesso.",
    });
    navigate('/usuario-index');
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={handleCancel}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {isEdit ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeUsuario">
                Nome do Usuário <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nomeUsuario"
                value={formData.nomeUsuario}
                onChange={(e) => handleInputChange('nomeUsuario', e.target.value)}
                className={errors.nomeUsuario ? 'border-destructive' : ''}
                placeholder="Digite o nome completo"
              />
              {errors.nomeUsuario && (
                <p className="text-sm text-destructive">{errors.nomeUsuario}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="usuario@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfis de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="perfilFornecedor"
                  checked={formData.perfilFornecedor}
                  onCheckedChange={(checked) => 
                    handleInputChange('perfilFornecedor', checked as boolean)
                  }
                />
                <Label htmlFor="perfilFornecedor" className="cursor-pointer">
                  Fornecedor
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="perfilConsumidor"
                  checked={formData.perfilConsumidor}
                  onCheckedChange={(checked) => 
                    handleInputChange('perfilConsumidor', checked as boolean)
                  }
                />
                <Label htmlFor="perfilConsumidor" className="cursor-pointer">
                  Consumidor
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="perfilAdministrador"
                  checked={formData.perfilAdministrador}
                  onCheckedChange={(checked) => 
                    handleInputChange('perfilAdministrador', checked as boolean)
                  }
                />
                <Label htmlFor="perfilAdministrador" className="cursor-pointer">
                  Administrador
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="perfilAdministradorMercado"
                  checked={formData.perfilAdministradorMercado}
                  onCheckedChange={(checked) => 
                    handleInputChange('perfilAdministradorMercado', checked as boolean)
                  }
                />
                <Label htmlFor="perfilAdministradorMercado" className="cursor-pointer">
                  Administrador de Mercado
                </Label>
              </div>
            </div>
            {errors.perfis && (
              <p className="text-sm text-destructive">{errors.perfis}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Situação</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.situacao} 
              onValueChange={(value) => handleInputChange('situacao', value)}
              className="flex gap-6"
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
            {errors.situacao && (
              <p className="text-sm text-destructive mt-2">{errors.situacao}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pb-6">
          <div>
            {isEdit && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
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
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
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
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Usuario;