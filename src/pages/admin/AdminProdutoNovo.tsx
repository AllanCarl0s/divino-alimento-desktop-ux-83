import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RoleTitle } from '@/components/layout/RoleTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminProdutoNovo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    certificacoes: {
      organico: false,
      agriculturaFamiliar: false,
      certificadoMunicipal: false
    }
  });

  const categorias = ['Hortaliças', 'Frutas', 'Derivados', 'Grãos', 'Legumes'];

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
      title: "Alimento criado",
        description: "O alimento foi cadastrado com sucesso.",
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
        <div>
          <RoleTitle page="Novo Alimento Base" className="text-2xl md:text-3xl" />
          <p className="text-sm md:text-base text-muted-foreground">
            Cadastre um alimento para o catálogo padrão
          </p>
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
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="w-full md:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full md:w-auto"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoNovo;
