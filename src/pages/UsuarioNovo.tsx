import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import InputMask from 'react-input-mask';
import { roleLabel } from '@/utils/labels';
import { 
  validarCelular, 
  validarChavePix, 
  validarAgencia, 
  validarConta 
} from '@/utils/validation';

const UsuarioNovo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeRole, user } = useAuth();

  const roleText = activeRole ? roleLabel(activeRole, user?.gender) : '';
  const pageTitle = `${roleText} - Novo Usuário`;

  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | Divino Alimento`;
    }
  }, [pageTitle]);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeFantasia: '',
    celular: '',
    banco: '',
    agencia: '',
    conta: '',
    chavePix: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitePolitica: false,
    perfilFornecedor: false,
    perfilConsumidor: false,
    perfilAdministradorMercado: false,
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

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme a senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
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

    if (!formData.perfilFornecedor && !formData.perfilConsumidor && !formData.perfilAdministradorMercado) {
      newErrors.perfil = 'Selecione pelo menos um perfil de acesso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Simular criação de usuário
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });
      navigate('/usuario-index');
    } else {
      toast({
        title: "Erro",
        description: "Corrija os dados antes de prosseguir",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/usuario-index');
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            {pageTitle}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Cadastre um novo usuário no sistema
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
                placeholder="Digite o nome completo"
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
                placeholder="Digite o nome fantasia (opcional)"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  className={errors.senha ? 'border-destructive' : ''}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.senha && (
                  <p className="text-sm text-destructive">{errors.senha}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">
                  Confirmar Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                  className={errors.confirmarSenha ? 'border-destructive' : ''}
                  placeholder="Digite a senha novamente"
                />
                {errors.confirmarSenha && (
                  <p className="text-sm text-destructive">{errors.confirmarSenha}</p>
                )}
              </div>
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
            <CardTitle>Perfil de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {errors.perfil && (
              <p className="text-sm text-destructive">{errors.perfil}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Termos de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        <div className="flex justify-end space-x-4 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default UsuarioNovo;
