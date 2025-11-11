import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleTitle } from '@/components/layout/RoleTitle';
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
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { produtosReferencia } from '@/data/produtos-referencia';
import { formatBRLInput, parseBRLToNumber } from '@/utils/currency';
import { ProductSearch } from '@/components/ui/product-search';

const AdminProdutoComercializavelNovo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    produto_base: '',
    unidade: '',
    peso_kg: '',
    preco_base: '',
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
    console.log('Salvando produto com preço:', precoNumerico);

    toast({
      title: "Sucesso",
      description: "Alimento comercializável criado com sucesso!",
    });

    navigate('/admin/produtos-comercializaveis');
  };

  const handleCancel = () => {
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
          <RoleTitle page="Adicionar Alimento Comercializável" className="text-2xl md:text-3xl mb-2" />
          <p className="text-muted-foreground">
            Cadastre uma nova variação comercial de alimento
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Alimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProductSearch
                value={formData.produto_base}
                onSelect={(productName) => 
                  setFormData({ ...formData, produto_base: productName })
                }
                label="Buscar alimento base *"
                placeholder="Digite para buscar alimento base..."
              />

              <div className="space-y-2">
                <Label htmlFor="produto_base_select">
                  Alimento Base <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.produto_base}
                  onValueChange={(value) =>
                    setFormData({ ...formData, produto_base: value })
                  }
                >
                  <SelectTrigger id="produto_base_select">
                    <SelectValue placeholder="Selecione o alimento base" />
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

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoComercializavelNovo;
