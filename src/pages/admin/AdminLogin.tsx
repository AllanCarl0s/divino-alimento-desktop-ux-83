import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import CoBrandAkarui from '@/components/layout/CoBrandAkarui';
import { ArrowLeft, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) return;

    setIsLoading(true);
    
    // Mock authentication - accept adm / adm@123
    setTimeout(() => {
      if (credentials.username === 'adm' && credentials.password === 'adm@123') {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha inválidos",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ResponsiveLayout showHeader={false}>
      {/* Desktop centered login with co-brand */}
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md lg:max-w-lg px-4">
          {/* Co-brand AKARUI */}
          <CoBrandAkarui />
          
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <CardTitle className="text-xl lg:text-2xl font-bold text-gradient-primary">
                Acesso Administrativo
              </CardTitle>
              <CardDescription className="lg:text-base">
                Digite suas credenciais para acessar o painel
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="lg:text-base">Usuário</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Digite seu usuário"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10 lg:pl-12 lg:h-12 lg:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="lg:text-base">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 lg:pl-12 lg:h-12 lg:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full lg:h-12 lg:text-base" 
                  disabled={isLoading || !credentials.username || !credentials.password}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Credenciais de teste: adm / adm@123
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mt-4 text-muted-foreground hover:text-foreground lg:text-base"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar ao início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminLogin;