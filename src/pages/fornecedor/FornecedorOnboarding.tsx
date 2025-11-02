import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import LeafIcon from '@/components/ui/LeafIcon';
import { ArrowLeft, Store, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FornecedorOnboarding = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Nome da loja é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('fornecedor-onboarded', 'true');
      toast({
        title: "Configuração concluída!",
        description: "Bem-vindo ao perfil Fornecedor do Divino Alimento.",
      });
      navigate('/fornecedor/loja');
    }, 1500);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      return `${match[1] ? `(${match[1]}` : ''}${match[1] && match[1].length === 2 ? ') ' : ''}${match[2]}${match[2] && match[3] ? '-' : ''}${match[3]}`;
    }
    return value;
  };

  return (
    <ResponsiveLayout 
      headerContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/configuracoes')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex items-center justify-center min-h-screen py-6 lg:py-12">
        <Card className="w-full max-w-sm lg:max-w-md shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <LeafIcon size="lg" className="text-primary" />
              <CardTitle className="font-poppins text-xl text-gradient-primary">
                Configuração Inicial
              </CardTitle>
              <LeafIcon size="lg" className="text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">
              Complete os dados básicos para usar o perfil Fornecedor
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-sm font-medium">
                  Nome da Loja/Propriedade
                </Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Digite o nome da sua loja"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    className={`pl-10 focus-ring ${errors.storeName ? 'border-destructive' : ''}`}
                    required
                  />
                </div>
                {errors.storeName && (
                  <div className="flex items-center space-x-1 text-sm text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.storeName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefone de Contato
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                    className={`pl-10 focus-ring ${errors.phone ? 'border-destructive' : ''}`}
                    maxLength={15}
                    required
                  />
                </div>
                {errors.phone && (
                  <div className="flex items-center space-x-1 text-sm text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              <div className="bg-accent/10 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Perfil: Fornecedor</p>
                    <p className="text-muted-foreground text-xs">
                      Você poderá gerenciar produtos, pedidos e ter acesso ao painel administrativo.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Configurando..." : "Continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default FornecedorOnboarding;