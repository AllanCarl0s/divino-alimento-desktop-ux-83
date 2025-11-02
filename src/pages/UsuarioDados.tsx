import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import InputMask from 'react-input-mask';
import { 
  validarCelular, 
  validarChavePix, 
  validarAgencia, 
  validarConta 
} from '@/utils/validation';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';

const UsuarioDados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeRole } = useAuth();

  const [formData, setFormData] = useState({
    nomeCompleto: 'João da Silva',
    nomeFantasia: 'João Silva',
    celular: '11987654321',
    banco: 'Itaú',
    agencia: '1234',
    conta: '56789-0',
    chavePix: 'joao@email.com',
    email: 'joao.silva@email.com',
    aceitePolitica: true,
    perfilFornecedor: true,
    perfilConsumidor: false,
    perfilAdministrador: true,
    perfilAdministradorMercado: false,
    situacao: 'Ativo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular é obrigatório';
    } else if (!validarCelular(formData.celular)) {
      newErrors.celular = 'Informe um celular válido no formato (11) 95555-9999.';
    }

    if (!formData.banco) {
      newErrors.banco = 'Banco é obrigatório';
    }

    if (!formData.agencia.trim()) {
      newErrors.agencia = 'Agência é obrigatória';
    } else if (!validarAgencia(formData.agencia)) {
      newErrors.agencia = 'Agência deve ter 4 ou 5 dígitos.';
    }

    if (!formData.conta.trim()) {
      newErrors.conta = 'Conta é obrigatória';
    } else if (!validarConta(formData.conta)) {
      newErrors.conta = 'Conta deve estar no formato 123456-7.';
    }

    if (!formData.chavePix.trim()) {
      newErrors.chavePix = 'Chave PIX é obrigatória';
    } else {
      const validacao = validarChavePix(formData.chavePix);
      if (!validacao.valido) {
        newErrors.chavePix = validacao.mensagem || 'Chave PIX inválida';
      }
    }

    if (!formData.aceitePolitica) {
      newErrors.aceitePolitica = 'É obrigatório aceitar a Política de Privacidade e Termos de Uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Simular salvamento
      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso",
      });
      
      // Redirecionar baseado no perfil ativo
      switch (activeRole) {
        case 'consumidor':
          navigate('/dashboard');
          break;
        case 'fornecedor':
          navigate('/fornecedor/loja');
          break;
        case 'admin_mercado':
          navigate('/adminmercado/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      toast({
        title: "Erro",
        description: "Corrija os dados antes de prosseguir",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Redirecionar baseado no perfil ativo
    switch (activeRole) {
      case 'consumidor':
        navigate('/dashboard');
        break;
      case 'fornecedor':
        navigate('/fornecedor/loja');
        break;
      case 'admin_mercado':
        navigate('/adminmercado/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <ResponsiveLayout
      headerContent={<UserMenuLarge />}
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            {activeRole === 'consumidor' ? 'Consumidor - ' : activeRole === 'fornecedor' ? 'Fornecedor - ' : activeRole === 'admin_mercado' ? 'Administrador de mercado - ' : ''}Dados Pessoais
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                className={errors.nomeCompleto ? 'border-destructive' : ''}
              />
              {errors.nomeCompleto && (
                <p className="text-sm text-destructive">{errors.nomeCompleto}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">
                Celular <span className="text-destructive">*</span>
              </Label>
              <InputMask
                mask="(99) 99999-9999"
                value={formData.celular}
                onChange={(e) => handleInputChange('celular', e.target.value.replace(/\D/g, ''))}
              >
                {/* @ts-ignore */}
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    id="celular"
                    type="tel"
                    placeholder="(11) 95555-9999"
                    className={errors.celular ? 'border-destructive' : ''}
                    inputMode="numeric"
                  />
                )}
              </InputMask>
              {errors.celular && (
                <p className="text-sm text-destructive">{errors.celular}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="email">E-mail</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Seu e-mail não pode ser alterado</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações para Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banco">
                  Banco <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.banco}
                  onValueChange={(value) => handleInputChange('banco', value)}
                >
                  <SelectTrigger 
                    id="banco"
                    className={errors.banco ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Itaú">Itaú</SelectItem>
                    <SelectItem value="Bradesco">Bradesco</SelectItem>
                    <SelectItem value="Santander">Santander</SelectItem>
                    <SelectItem value="Caixa">Caixa Econômica Federal</SelectItem>
                    <SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem>
                    <SelectItem value="Nubank">Nubank</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Sicredi">Sicredi</SelectItem>
                    <SelectItem value="Sicoob">Sicoob</SelectItem>
                    <SelectItem value="Outras">Outras</SelectItem>
                  </SelectContent>
                </Select>
                {errors.banco && (
                  <p className="text-sm text-destructive">{errors.banco}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencia">
                  Agência <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="agencia"
                  type="text"
                  inputMode="numeric"
                  value={formData.agencia}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    handleInputChange('agencia', value);
                  }}
                  placeholder="1234"
                  className={errors.agencia ? 'border-destructive' : ''}
                  maxLength={5}
                />
                {errors.agencia && (
                  <p className="text-sm text-destructive">{errors.agencia}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="conta">
                  Conta <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="conta"
                  type="text"
                  inputMode="numeric"
                  value={formData.conta}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d-]/g, '');
                    // Limitar a 12 dígitos + hífen + 1 dígito
                    const match = value.match(/^(\d{0,12})-?(\d?)$/);
                    if (match) {
                      value = match[1] + (match[2] ? '-' + match[2] : '');
                    }
                    handleInputChange('conta', value);
                  }}
                  placeholder="56789-0"
                  className={errors.conta ? 'border-destructive' : ''}
                  maxLength={14}
                />
                {errors.conta && (
                  <p className="text-sm text-destructive">{errors.conta}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chavePix">
                  Chave PIX <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="chavePix"
                  type="text"
                  value={formData.chavePix}
                  onChange={(e) => handleInputChange('chavePix', e.target.value)}
                  placeholder="joao@email.com"
                  className={errors.chavePix ? 'border-destructive' : ''}
                />
                {errors.chavePix && (
                  <p className="text-sm text-destructive">{errors.chavePix}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status e Termos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Input
                id="situacao"
                value={formData.situacao}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="aceitePolitica"
                checked={formData.aceitePolitica}
                onCheckedChange={(checked) => 
                  handleInputChange('aceitePolitica', checked as boolean)
                }
                className={errors.aceitePolitica ? 'border-destructive' : ''}
              />
              <Label htmlFor="aceitePolitica" className="cursor-pointer text-sm">
                Aceito a Política de Privacidade e os{' '}
                <a 
                  href="https://docs.google.com/document/d/1u69VUNkih50pM5IBT0ecp69JLR2SBIEc/edit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Termos de Uso
                </a>{' '}
                <span className="text-destructive">*</span>
              </Label>
            </div>
            {errors.aceitePolitica && (
              <p className="text-sm text-destructive">{errors.aceitePolitica}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilFornecedor"
                checked={formData.perfilFornecedor}
                disabled={activeRole !== 'admin'}
                onCheckedChange={(checked) => 
                  handleInputChange('perfilFornecedor', checked as boolean)
                }
              />
              <Label 
                htmlFor="perfilFornecedor" 
                className={activeRole !== 'admin' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              >
                Fornecedor{activeRole !== 'admin' ? ' (não editável)' : ''}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilConsumidor"
                checked={formData.perfilConsumidor}
                disabled={activeRole !== 'admin'}
                onCheckedChange={(checked) => 
                  handleInputChange('perfilConsumidor', checked as boolean)
                }
              />
              <Label 
                htmlFor="perfilConsumidor" 
                className={activeRole !== 'admin' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              >
                Consumidor{activeRole !== 'admin' ? ' (não editável)' : ''}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilAdministradorMercado"
                checked={formData.perfilAdministradorMercado || false}
                disabled={activeRole !== 'admin'}
                onCheckedChange={(checked) => 
                  handleInputChange('perfilAdministradorMercado', checked as boolean)
                }
              />
              <Label 
                htmlFor="perfilAdministradorMercado" 
                className={activeRole !== 'admin' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              >
                Administrador de Mercado{activeRole !== 'admin' ? ' (não editável)' : ''}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilAdministrador"
                checked={formData.perfilAdministrador}
                disabled
                onCheckedChange={(checked) => 
                  handleInputChange('perfilAdministrador', checked as boolean)
                }
              />
              <Label 
                htmlFor="perfilAdministrador" 
                className="cursor-not-allowed opacity-50"
              >
                Administrador (não editável)
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={
              !formData.nomeCompleto.trim() ||
              !validarCelular(formData.celular) ||
              !formData.banco ||
              !validarAgencia(formData.agencia) ||
              !validarConta(formData.conta) ||
              !validarChavePix(formData.chavePix).valido ||
              !formData.aceitePolitica
            }
          >
            Salvar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default UsuarioDados;
