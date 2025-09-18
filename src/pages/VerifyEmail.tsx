import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import CoBrandAkarui from '@/components/layout/CoBrandAkarui';
import ProfileSelectionModal from '@/components/ui/ProfileSelectionModal';
import { Mail, CheckCircle2, RotateCcw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);
  const [showProfileSelection, setShowProfileSelection] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = location.state?.email || 'seu@email.com';
  const userProfiles = location.state?.profiles || JSON.parse(localStorage.getItem('da.profiles') || '[]');

  const handleResendEmail = async () => {
    setIsResending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      toast({
        title: "Link reenviado. Verifique sua caixa de entrada.",
      });
    }, 1500);
  };

  const handleVerified = () => {
    toast({
      title: "E-mail verificado!",
      description: "Sua conta foi ativada com sucesso.",
    });

    // Check if user has multiple profiles
    if (userProfiles.length > 1) {
      setShowProfileSelection(true);
      return;
    }

    // Single profile - redirect directly
    const profile = userProfiles[0] || 'consumidor';
    redirectToProfile(profile);
  };

  const redirectToProfile = (profile: string) => {
    localStorage.setItem('da.profile', profile);
    
    switch (profile) {
      case 'consumidor':
        // Check consumer type for appropriate redirect
        const consumerType = localStorage.getItem('da.consumerType');
        console.log('Consumer type from localStorage:', consumerType);
        if (consumerType === 'venda_direta') {
          console.log('Redirecting to venda_direta dashboard');
          navigate('/dashboard'); // Retail dashboard
        } else {
          console.log('Redirecting to cesta dashboard');
          navigate('/dashboard'); // Basket dashboard
        }
        break;
      case 'fornecedor':
      case 'produtor':
        navigate('/fornecedor/loja');
        break;
      case 'adminGeral':
      case 'adminMercado':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  const handleProfileSelected = (selectedProfile: string) => {
    setShowProfileSelection(false);
    redirectToProfile(selectedProfile);
  };

  return (
    <ResponsiveLayout showHeader={false}>
      {/* Desktop centered email verification */}
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-lg px-4">
          {/* Co-brand AKARUI */}
          <CoBrandAkarui />
          
          <Card className="w-full shadow-lg text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
              </div>
              <CardTitle className="font-poppins text-2xl lg:text-3xl text-gradient-primary">
                Verifique seu E-mail
              </CardTitle>
              <p className="text-sm lg:text-base text-muted-foreground mt-2">
                Enviamos um link de verificação para
              </p>
              <p className="text-sm lg:text-base font-medium text-foreground break-all mt-1 px-4">
                {email}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6 p-6 lg:p-8">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-4 lg:p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-foreground mb-1 lg:text-base">
                      Clique no link do e-mail
                    </p>
                    <p className="text-muted-foreground text-sm lg:text-base">
                      Verifique também sua pasta de spam. O link é válido por 24 horas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full lg:h-12 lg:text-base" 
                  onClick={handleResendEmail}
                  disabled={isResending}
                  size="lg"
                >
                  <RotateCcw className={`w-4 h-4 lg:w-5 lg:h-5 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? "Reenviando..." : "Reenviar E-mail"}
                </Button>

                <div className="border-t pt-4">
                  <p className="text-xs lg:text-sm text-muted-foreground mb-3">
                    Já verificou seu e-mail?
                  </p>
                  <Button 
                    variant="default" 
                    className="w-full lg:h-12 lg:text-base" 
                    onClick={handleVerified}
                    size="lg"
                  >
                    <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Continuar para o App
                  </Button>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Problemas com o e-mail?{' '}
                  <button className="text-primary hover:underline font-medium focus-ring rounded px-1">
                    Entre em contato
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Selection Modal */}
      <ProfileSelectionModal
        isOpen={showProfileSelection}
        profiles={userProfiles}
        onProfileSelected={handleProfileSelected}
      />
    </ResponsiveLayout>
  );
};

export default VerifyEmail;