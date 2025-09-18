import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import CoBrandAkarui from '@/components/layout/CoBrandAkarui';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FornecedorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para a loja do produtor...",
      });
      navigate('/fornecedor/loja');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Login com Google",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  return (
    <ResponsiveLayout 
      showHeader={false}
      headerContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/')}
          className="focus-ring"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      {/* Centered login form - responsive */}
      <div className="flex items-center justify-center min-h-screen py-6 lg:py-12">
        <div className="w-full max-w-sm lg:max-w-md px-4">
          {/* Co-brand AKARUI */}
          <CoBrandAkarui />
          
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <CardTitle className="font-poppins text-2xl lg:text-3xl text-gradient-primary">
                Produtor
              </CardTitle>
              <CardDescription className="lg:text-base">
                Acesse sua loja do produtor no Divino Alimento
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm lg:text-base font-medium">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 lg:pl-12 lg:h-12 lg:text-base focus-ring"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm lg:text-base font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 lg:pl-12 pr-10 lg:pr-12 lg:h-12 lg:text-base focus-ring"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-2 top-2 lg:right-3 lg:top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link 
                    to="/esqueci-senha" 
                    className="text-sm lg:text-base text-primary hover:underline focus-ring rounded px-1"
                  >
                    Esqueci a senha
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full lg:h-12 lg:text-base" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="relative">
                <Separator className="my-4" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs lg:text-sm text-muted-foreground">
                  ou
                </span>
              </div>

              <Button 
                variant="outline" 
                className="w-full lg:h-12 lg:text-base" 
                onClick={handleGoogleLogin}
                size="lg"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </Button>

              <div className="text-center">
                <p className="text-sm lg:text-base text-muted-foreground">
                  Não tem conta?{' '}
                  <Link 
                    to="/fornecedor/onboarding" 
                    className="text-primary hover:underline font-medium focus-ring rounded px-1"
                  >
                    Cadastre-se
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

export default FornecedorLogin;