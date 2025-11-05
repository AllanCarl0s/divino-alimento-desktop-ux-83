import React, { useState, useEffect } from 'react';
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
import { useAuth, UserRole } from '@/contexts/AuthContext';

const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'consumidor':
      return '/dashboard';
    case 'fornecedor':
      return '/fornecedor/loja';
    case 'admin':
      return '/admin/dashboard';
    case 'admin_mercado':
      return '/admin-mercado/dashboard';
  }
};

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
  const { register: registerUser, activeRole, isAuthenticated } = useAuth();

  // Redirecionar após registro bem-sucedido
  useEffect(() => {
    if (isAuthenticated && activeRole) {
      const defaultRoute = getDefaultRoute(activeRole);
      navigate(defaultRoute);
    }
  }, [isAuthenticated, activeRole, navigate]);

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
    if (!data.phone.trim()) errors.push('Celular é obrigatório');
    else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.phone)) errors.push('Celular inválido');
    if (!data.email.trim()) errors.push('E-mail é obrigatório');
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.push('E-mail inválido');
    if (!data.confirmEmail.trim()) errors.push('Confirmação de e-mail é obrigatória');
    else if (data.email !== data.confirmEmail) errors.push('E-mails não coincidem');
    if (!data.password.trim()) errors.push('Senha é obrigatória');
    else if (data.password.length < 6) errors.push('Senha deve ter pelo menos 6 caracteres');
    if (!data.confirmPassword.trim()) errors.push('Confirmação de senha é obrigatória');
    else if (data.password !== data.confirmPassword) errors.push('Senhas não coincidem');
    if (!hasAnyProfile) errors.push('Selecione pelo menos um perfil');

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
    
    try {
      // Mapear perfis selecionados para UserRole[]
      const selectedRoles: UserRole[] = [];
      if (data.profiles.consumidor) selectedRoles.push('consumidor');
      if (data.profiles.fornecedor) selectedRoles.push('fornecedor');
      if (data.profiles.adminGeral) selectedRoles.push('admin');
      if (data.profiles.adminMercado) selectedRoles.push('admin_mercado');
      
      // Registrar usuário com roles
      await registerUser(data.email, data.password, data.name, selectedRoles);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para seu painel...",
      });
      
      // O redirecionamento será feito pelo useEffect
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex items-center justify-center min-h-screen py-12 max-[767px]:pb-24">
        <div className="w-full max-w-[1140px] mx-auto px-6">
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
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-[7fr_5fr] md:gap-8 min-[1200px]:grid-cols-2 min-[1200px]:gap-6">
                    
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
                            <FormLabel>Celular</FormLabel>
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
                      <div>
                        <h3 className="font-poppins text-lg font-semibold text-foreground mb-2 max-[767px]:mb-2.5 min-[1200px]:mb-4">
                          Seleção de Perfis
                        </h3>
                        <Label className="text-sm lg:text-base font-medium text-muted-foreground">Escolha seus perfis (múltipla seleção)</Label>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Grid responsivo para cards de perfil */}
                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 min-[1200px]:gap-3">
                          {/* Consumidor/Consumidora */}
                          <label 
                            className="flex flex-col gap-2.5 p-4 max-[767px]:p-3.5 min-[1200px]:p-[18px] border rounded-[14px] transition-all duration-150 cursor-pointer min-h-[112px] min-[1200px]:min-h-[120px] bg-white shadow-sm data-[selected=true]:border-[#239B56] data-[selected=true]:bg-[#EDF8F1] hover:border-[#BFE8CF] hover:shadow-md focus-within:outline focus-within:outline-2 focus-within:outline-[#239B56] focus-within:outline-offset-2"
                            data-selected={form.watch('profiles.consumidor')}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                form.setValue('profiles.consumidor', !form.getValues('profiles.consumidor'));
                              }
                            }}
                          >
                            <FormField
                              control={form.control}
                              name="profiles.consumidor"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center gap-2.5">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="pointer-events-none"
                                      />
                                    </FormControl>
                                    <ShoppingBasket className="w-5 h-5 max-[767px]:w-[20px] max-[767px]:h-[20px] min-[1200px]:w-[22px] min-[1200px]:h-[22px] text-primary flex-shrink-0" />
                                    <FormLabel className="cursor-pointer font-semibold text-base max-[767px]:text-[15px] min-[1200px]:text-[17px] leading-[1.25] whitespace-normal break-words hyphens-auto m-0">
                                      Consumidor(@)
                                    </FormLabel>
                                  </div>
                                  <p className="text-[14px] max-[767px]:text-[13px] min-[1200px]:text-[15px] text-[#606C76] leading-[1.45] whitespace-normal break-words hyphens-auto line-clamp-2 min-[1200px]:line-clamp-3 ml-[34px] max-[767px]:ml-[30px]">
                                    Acesso a cestas ou venda direta. Ideal para quem deseja receber produtos orgânicos.
                                  </p>
                                </FormItem>
                              )}
                            />
                          </label>

                          {/* Fornecedor/Fornecedora */}
                          <label 
                            className="flex flex-col gap-2.5 p-4 max-[767px]:p-3.5 min-[1200px]:p-[18px] border rounded-[14px] transition-all duration-150 cursor-pointer min-h-[112px] min-[1200px]:min-h-[120px] bg-white shadow-sm data-[selected=true]:border-[#239B56] data-[selected=true]:bg-[#EDF8F1] hover:border-[#BFE8CF] hover:shadow-md focus-within:outline focus-within:outline-2 focus-within:outline-[#239B56] focus-within:outline-offset-2"
                            data-selected={form.watch('profiles.fornecedor')}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                form.setValue('profiles.fornecedor', !form.getValues('profiles.fornecedor'));
                              }
                            }}
                          >
                            <FormField
                              control={form.control}
                              name="profiles.fornecedor"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center gap-2.5">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="pointer-events-none"
                                      />
                                    </FormControl>
                                    <Store className="w-5 h-5 max-[767px]:w-[20px] max-[767px]:h-[20px] min-[1200px]:w-[22px] min-[1200px]:h-[22px] text-accent flex-shrink-0" />
                                    <FormLabel className="cursor-pointer font-semibold text-base max-[767px]:text-[15px] min-[1200px]:text-[17px] leading-[1.25] whitespace-normal break-words hyphens-auto m-0">
                                      Fornecedor(@)
                                    </FormLabel>
                                  </div>
                                  <p className="text-[14px] max-[767px]:text-[13px] min-[1200px]:text-[15px] text-[#606C76] leading-[1.45] whitespace-normal break-words hyphens-auto line-clamp-2 min-[1200px]:line-clamp-3 ml-[34px] max-[767px]:ml-[30px]">
                                    Gestão de produtos e vendas para estabelecimentos.
                                  </p>
                                </FormItem>
                              )}
                            />
                          </label>

                          {/* Administrador Geral */}
                          <label 
                            className="flex flex-col gap-2.5 p-4 max-[767px]:p-3.5 min-[1200px]:p-[18px] border rounded-[14px] transition-all duration-150 cursor-pointer min-h-[112px] min-[1200px]:min-h-[120px] bg-white shadow-sm data-[selected=true]:border-[#239B56] data-[selected=true]:bg-[#EDF8F1] hover:border-[#BFE8CF] hover:shadow-md focus-within:outline focus-within:outline-2 focus-within:outline-[#239B56] focus-within:outline-offset-2"
                            data-selected={form.watch('profiles.adminGeral')}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                form.setValue('profiles.adminGeral', !form.getValues('profiles.adminGeral'));
                              }
                            }}
                          >
                            <FormField
                              control={form.control}
                              name="profiles.adminGeral"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center gap-2.5">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="pointer-events-none"
                                      />
                                    </FormControl>
                                    <Shield className="w-5 h-5 max-[767px]:w-[20px] max-[767px]:h-[20px] min-[1200px]:w-[22px] min-[1200px]:h-[22px] text-destructive flex-shrink-0" />
                                    <FormLabel className="cursor-pointer font-semibold text-base max-[767px]:text-[15px] min-[1200px]:text-[17px] leading-[1.25] whitespace-normal break-words hyphens-auto m-0">
                                      Administrador(@)
                                    </FormLabel>
                                  </div>
                                  <p className="text-[14px] max-[767px]:text-[13px] min-[1200px]:text-[15px] text-[#606C76] leading-[1.45] whitespace-normal break-words hyphens-auto line-clamp-2 min-[1200px]:line-clamp-3 ml-[34px] max-[767px]:ml-[30px]">
                                    Gestão completa da plataforma e todos os mercados.
                                  </p>
                                </FormItem>
                              )}
                            />
                          </label>

                          {/* Administrador de Mercado */}
                          <label 
                            className="flex flex-col gap-2.5 p-4 max-[767px]:p-3.5 min-[1200px]:p-[18px] border rounded-[14px] transition-all duration-150 cursor-pointer min-h-[112px] min-[1200px]:min-h-[120px] bg-white shadow-sm data-[selected=true]:border-[#239B56] data-[selected=true]:bg-[#EDF8F1] hover:border-[#BFE8CF] hover:shadow-md focus-within:outline focus-within:outline-2 focus-within:outline-[#239B56] focus-within:outline-offset-2"
                            data-selected={form.watch('profiles.adminMercado')}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                form.setValue('profiles.adminMercado', !form.getValues('profiles.adminMercado'));
                              }
                            }}
                          >
                            <FormField
                              control={form.control}
                              name="profiles.adminMercado"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center gap-2.5">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="pointer-events-none"
                                      />
                                    </FormControl>
                                    <UserCheck className="w-5 h-5 max-[767px]:w-[20px] max-[767px]:h-[20px] min-[1200px]:w-[22px] min-[1200px]:h-[22px] text-warning flex-shrink-0" />
                                    <FormLabel className="cursor-pointer font-semibold text-base max-[767px]:text-[15px] min-[1200px]:text-[17px] leading-[1.25] whitespace-normal break-words hyphens-auto m-0">
                                      Administrador(@) de mercado
                                    </FormLabel>
                                  </div>
                                  <p className="text-[14px] max-[767px]:text-[13px] min-[1200px]:text-[15px] text-[#606C76] leading-[1.45] whitespace-normal break-words hyphens-auto line-clamp-2 min-[1200px]:line-clamp-3 ml-[34px] max-[767px]:ml-[30px]">
                                    Gestão específica de um mercado e seus fornecedores.
                                  </p>
                                </FormItem>
                              )}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Validation Status */}
                      <div className="p-4 border rounded-[14px] bg-white shadow-sm mt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Status da Validação:</h4>
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
                            <span className="text-sm">Celular válido</span>
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
                  <div className="pt-4 max-[767px]:fixed max-[767px]:bottom-3 max-[767px]:left-1/2 max-[767px]:-translate-x-1/2 max-[767px]:w-[94%] max-[767px]:z-50">
                    <Button 
                      type="submit" 
                      variant="success"
                      className="w-full lg:h-12 lg:text-base font-semibold max-[767px]:rounded-[10px] max-[767px]:shadow-lg" 
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