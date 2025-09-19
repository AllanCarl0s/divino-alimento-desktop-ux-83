import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import CoBrandAkarui from '@/components/layout/CoBrandAkarui';
import LeafIcon from '@/components/ui/LeafIcon';
import { ArrowLeft, User, Mail, Phone, Lock, AlertCircle, CheckCircle2, Store, ShoppingBasket, Shield, UserCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useConsumer } from '@/contexts/ConsumerContext';

// Mock data for markets with types
const mockMarkets = [
  { id: '1', name: 'Mercado Central de São Paulo', type: 'cesta' as const },
  { id: '2', name: 'Mercado Municipal de Campinas', type: 'cesta' as const },
  { id: '3', name: 'Feira Orgânica de Santos', type: 'venda_direta' as const },
  { id: '4', name: 'Mercado Verde de Ribeirão Preto', type: 'venda_direta' as const },
];

const mockPriorityMarkets = [
  { id: '1', name: 'Mercado Central de São Paulo', priority: 'Alta' },
  { id: '2', name: 'Mercado Municipal de Campinas', priority: 'Média' },
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  profiles: {
    consumidor: boolean;
    fornecedor: boolean;
    adminGeral: boolean;
    adminMercado: boolean;
  };
  selectedMarket?: string;
  consumerType?: 'cesta' | 'venda_direta';
  priorityMarket?: string;
  managedMarket?: string;
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setConsumerType } = useConsumer();

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      profiles: {
        consumidor: false,
        fornecedor: false,
        adminGeral: false,
        adminMercado: false,
      },
      selectedMarket: '',
    },
  });

  const watchedValues = form.watch();
  const profiles = watchedValues.profiles || {
    consumidor: false,
    fornecedor: false,
    adminGeral: false,
    adminMercado: false,
  };
  const hasAnyProfile = Object.values(profiles).some(Boolean);

  const validateForm = (data: FormData) => {
    const errors: string[] = [];
    
    if (!data.name.trim()) errors.push('Nome é obrigatório');
    if (!data.phone.trim()) errors.push('Telefone é obrigatório');
    else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.phone)) errors.push('Telefone inválido');
    if (!data.email.trim()) errors.push('E-mail é obrigatório');
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.push('E-mail inválido');
    if (!data.confirmEmail.trim()) errors.push('Confirmação de e-mail é obrigatória');
    else if (data.email !== data.confirmEmail) errors.push('E-mails não coincidem');
    if (!data.password.trim()) errors.push('Senha é obrigatória');
    else if (data.password.length < 6) errors.push('Senha deve ter pelo menos 6 caracteres');
    if (!data.confirmPassword.trim()) errors.push('Confirmação de senha é obrigatória');
    else if (data.password !== data.confirmPassword) errors.push('Senhas não coincidem');
    if (!hasAnyProfile) errors.push('Selecione pelo menos um perfil');
    if (data.profiles.consumidor && !data.selectedMarket) errors.push('Selecione um mercado');

    return errors;
  };

  const onSubmit = async (data: FormData) => {
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
      toast({
        title: "Erro na validação",
        description: validationErrors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const selectedProfiles = Object.entries(data.profiles)
        .filter(([_, selected]) => selected)
        .map(([profile, _]) => profile);
      
      localStorage.setItem('da.profiles', JSON.stringify(selectedProfiles));
      
      // Save consumer market and type if selected
      if (data.profiles.consumidor && data.selectedMarket) {
        const selectedMarket = mockMarkets.find(m => m.id === data.selectedMarket);
        console.log('Selected market:', selectedMarket);
        const type = selectedMarket?.type || 'cesta';
        console.log('Consumer type being saved:', type);
        localStorage.setItem('da.marketId', data.selectedMarket);
        localStorage.setItem('da.consumerType', type);
        setConsumerType(type);
      }
      
      setIsLoading(false);
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu e-mail para ativar sua conta.",
      });
      navigate('/verificar-email', { state: { email: data.email, profiles: selectedProfiles } });
    }, 1500);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <ResponsiveLayout 
      showHeader={false}
      headerContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/login')}
          className="focus-ring"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      {/* Desktop centered registration with co-brand */}
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-2xl lg:max-w-4xl px-4">
          {/* Co-brand AKARUI */}
          <CoBrandAkarui />
          
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <LeafIcon size="lg" className="text-primary" />
                <CardTitle className="font-poppins text-2xl lg:text-3xl text-gradient-primary">
                  Novo Cadastro
                </CardTitle>
                <LeafIcon size="lg" className="text-accent" />
              </div>
              <p className="text-sm lg:text-base text-muted-foreground">
                Informe seus dados e clique em CRIAR
              </p>
            </CardHeader>
            
            <CardContent className="p-6 lg:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Desktop Two-Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    
                    {/* Left Column - Main Information */}
                    <div className="space-y-4">
                      <h3 className="font-poppins text-lg font-semibold text-foreground">
                        Informações Principais
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                                <Input
                                  placeholder="Digite seu nome completo"
                                  className="pl-10 lg:pl-12 lg:h-12 lg:text-base"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                                <Input
                                  placeholder="(11) 99999-9999"
                                  className="pl-10 lg:pl-12 lg:h-12 lg:text-base"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = formatPhone(e.target.value);
                                    field.onChange(formatted);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="seu@email.com"
                                  className="pl-10 lg:pl-12 lg:h-12 lg:text-base"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar E-mail</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="Digite novamente seu e-mail"
                                  className="pl-10 lg:pl-12 pr-10 lg:pr-12 lg:h-12 lg:text-base"
                                  {...field}
                                />
                                {watchedValues.confirmEmail && watchedValues.email === watchedValues.confirmEmail && (
                                  <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-success" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="Digite sua senha"
                                  className="pl-10 lg:pl-12 lg:h-12 lg:text-base"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="Digite novamente sua senha"
                                  className="pl-10 lg:pl-12 pr-10 lg:pr-12 lg:h-12 lg:text-base"
                                  {...field}
                                />
                                {watchedValues.confirmPassword && watchedValues.password === watchedValues.confirmPassword && (
                                  <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-success" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Column - Profile Selection & Markets */}
                    <div className="space-y-4">
                      <h3 className="font-poppins text-lg font-semibold text-foreground">
                        Seleção de Perfis
                      </h3>
                      
                      <div className="space-y-3">
                        <Label className="text-sm lg:text-base font-medium">Escolha seus perfis (múltipla seleção)</Label>
                        
                        {/* Consumidor/Consumidora */}
                        <div className="space-y-2">
                          <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors">
                            <FormField
                              control={form.control}
                              name="profiles.consumidor"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center space-x-3 cursor-pointer font-medium lg:text-base">
                                      <ShoppingBasket className="w-5 h-5 text-primary" />
                                      <span>Consumidor/Consumidora</span>
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      Acesso a cestas ou venda direta. Ideal para quem deseja receber produtos orgânicos.
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {profiles.consumidor && (
                              <div className="ml-6">
                                <FormField
                                  control={form.control}
                                  name="selectedMarket"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">Selecione um mercado *</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                        <FormControl>
                                          <SelectTrigger className="lg:h-10">
                                            <SelectValue placeholder="Escolha um mercado">
                                              {field.value && (() => {
                                                const selectedMarket = mockMarkets.find(m => m.id === field.value);
                                                if (selectedMarket) {
                                                  return (
                                                    <div className="flex items-center justify-between w-full">
                                                      <span>{selectedMarket.name}</span>
                                                      <Badge 
                                                        variant={selectedMarket.type === 'cesta' ? 'success' : 'warning'} 
                                                        className="ml-2 text-xs"
                                                      >
                                                        {selectedMarket.type === 'cesta' ? 'Cestas' : 'Venda Direta'}
                                                      </Badge>
                                                    </div>
                                                  );
                                                }
                                              })()}
                                            </SelectValue>
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {mockMarkets.map((market) => (
                                            <SelectItem key={market.id} value={market.id} className="cursor-pointer">
                                              <div className="flex items-center justify-between w-full">
                                                <span className="flex-1">{market.name}</span>
                                                <Badge 
                                                  variant={market.type === 'cesta' ? 'success' : 'warning'} 
                                                  className="ml-2 text-xs"
                                                >
                                                  {market.type === 'cesta' ? 'Cestas' : 'Venda Direta'}
                                                </Badge>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Há mercados de Cestas e de Venda Direta.
                                      </p>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                          )}
                        </div>

                         {/* Fornecedor/Fornecedora */}
                         <div className="space-y-2">
                           <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors">
                             <FormField
                               control={form.control}
                               name="profiles.fornecedor"
                               render={({ field }) => (
                                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                   <FormControl>
                                     <Checkbox
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                     />
                                   </FormControl>
                                   <div className="space-y-1 leading-none">
                                     <FormLabel className="flex items-center space-x-3 cursor-pointer font-medium lg:text-base">
                                       <Store className="w-5 h-5 text-accent" />
                                       <span>Fornecedor/Fornecedora</span>
                                     </FormLabel>
                                     <p className="text-sm text-muted-foreground">
                                       Gestão de produtos e vendas para estabelecimentos.
                                     </p>
                                   </div>
                                 </FormItem>
                               )}
                             />
                           </div>
                           
                           {profiles.fornecedor && (
                             <div className="ml-6">
                               <FormField
                                 control={form.control}
                                 name="priorityMarket"
                                 render={({ field }) => (
                                   <FormItem>
                                     <FormLabel className="text-sm">Mercados prioritários</FormLabel>
                                     <Select onValueChange={field.onChange} value={field.value}>
                                       <FormControl>
                                         <SelectTrigger className="lg:h-10">
                                           <SelectValue placeholder="Escolha um mercado prioritário" />
                                         </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                         {mockPriorityMarkets.map((market) => (
                                           <SelectItem key={market.id} value={market.id}>
                                             {market.name} - {market.priority}
                                           </SelectItem>
                                         ))}
                                       </SelectContent>
                                     </Select>
                                     <FormMessage />
                                   </FormItem>
                                 )}
                               />
                             </div>
                           )}
                         </div>

                         {/* Administrador Geral */}
                         <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors">
                           <FormField
                             control={form.control}
                             name="profiles.adminGeral"
                             render={({ field }) => (
                               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                 <FormControl>
                                   <Checkbox
                                     checked={field.value}
                                     onCheckedChange={field.onChange}
                                   />
                                 </FormControl>
                                 <div className="space-y-1 leading-none">
                                   <FormLabel className="flex items-center space-x-3 cursor-pointer font-medium lg:text-base">
                                     <Shield className="w-5 h-5 text-destructive" />
                                     <span>Administrador/Administradora Geral</span>
                                   </FormLabel>
                                   <p className="text-sm text-muted-foreground">
                                     Gestão completa da plataforma e todos os mercados.
                                   </p>
                                 </div>
                               </FormItem>
                             )}
                           />
                         </div>

                         {/* Administrador de Mercado */}
                        <div className="space-y-2">
                          <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors">
                            <FormField
                              control={form.control}
                              name="profiles.adminMercado"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center space-x-3 cursor-pointer font-medium lg:text-base">
                                      <UserCheck className="w-5 h-5 text-warning" />
                                      <span>Administrador/Administradora de Mercado</span>
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      Gestão específica de um mercado e seus fornecedores.
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {profiles.adminMercado && (
                            <div className="ml-6">
                              <FormField
                                control={form.control}
                                name="managedMarket"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Mercado para administrar</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="lg:h-10">
                                          <SelectValue placeholder="Escolha um mercado para administrar" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {mockMarkets.map((market) => (
                                          <SelectItem key={market.id} value={market.id}>
                                            {market.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Validation Status */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-foreground mb-3">Status da Validação:</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {watchedValues.name?.trim() ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">Nome completo informado</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {watchedValues.phone && /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(watchedValues.phone) ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">Telefone válido</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {watchedValues.email && /\S+@\S+\.\S+/.test(watchedValues.email) ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">E-mail válido</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {watchedValues.email === watchedValues.confirmEmail && watchedValues.email ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">E-mails coincidem</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {watchedValues.password && watchedValues.password.length >= 6 ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">Senha criada</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {watchedValues.password === watchedValues.confirmPassword && watchedValues.password ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">Senhas coincidem</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasAnyProfile ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className="text-sm">Perfil selecionado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Full Width */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="success"
                      className="w-full lg:h-12 lg:text-base font-semibold" 
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-sm lg:text-base text-muted-foreground">
                  Já tem conta?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline font-medium focus-ring rounded px-1"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Register;