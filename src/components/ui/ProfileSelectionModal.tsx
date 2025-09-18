import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShoppingBasket, Store, Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSelectionModalProps {
  isOpen: boolean;
  profiles: string[];
  onProfileSelected: (profileType: string) => void;
}

const profileConfigs = {
  consumidor: {
    icon: ShoppingBasket,
    title: 'Consumidor/Consumidora',
    description: 'Acesso a cestas e gestão de pedidos',
    color: 'text-primary',
    route: '/dashboard'
  },
  fornecedor: {
    icon: Store,
    title: 'Fornecedor/Fornecedora',
    description: 'Gestão de produtos e vendas',
    color: 'text-accent',
    route: '/fornecedor/loja'
  },
  produtor: {
    icon: Store,
    title: 'Produtor/Produtora',
    description: 'Gestão de produção e vendas',
    color: 'text-accent',
    route: '/fornecedor/loja'
  },
  adminGeral: {
    icon: Shield,
    title: 'Administrador/Administradora Geral',
    description: 'Gestão completa da plataforma',
    color: 'text-destructive',
    route: '/admin/dashboard'
  },
  adminMercado: {
    icon: UserCheck,
    title: 'Administrador/Administradora de Mercado',
    description: 'Gestão específica de mercado',
    color: 'text-warning',
    route: '/admin/dashboard'
  }
};

export const ProfileSelectionModal = ({ isOpen, profiles, onProfileSelected }: ProfileSelectionModalProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const { toast } = useToast();

  const handleContinue = () => {
    if (!selectedProfile) {
      toast({
        title: "Selecione um perfil",
        description: "Você precisa escolher um perfil para continuar.",
        variant: "destructive",
      });
      return;
    }

    onProfileSelected(selectedProfile);
  };

  const filteredProfiles = profiles.filter(profile => profileConfigs[profile as keyof typeof profileConfigs]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center font-poppins text-xl">
            Selecione seu Perfil
          </DialogTitle>
          <DialogDescription className="text-center">
            Você possui múltiplos perfis. Escolha como deseja acessar o aplicativo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup 
            value={selectedProfile} 
            onValueChange={setSelectedProfile}
            className="space-y-3"
          >
            {filteredProfiles.map((profile) => {
              const config = profileConfigs[profile as keyof typeof profileConfigs];
              const IconComponent = config.icon;
              
              return (
                <div 
                  key={profile}
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedProfile === profile ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <RadioGroupItem value={profile} id={`profile-${profile}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`profile-${profile}`} className="flex items-center space-x-3 cursor-pointer">
                      <IconComponent className={`w-5 h-5 ${config.color}`} />
                      <span className="font-medium">{config.title}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleContinue}
            className="w-full lg:h-12 lg:text-base"
            size="lg"
            disabled={!selectedProfile}
          >
            Continuar para o App
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSelectionModal;