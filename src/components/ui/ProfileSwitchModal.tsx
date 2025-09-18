import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShoppingBasket, Store, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProfileSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: 'consumidor' | 'fornecedor';
}

export const ProfileSwitchModal = ({ isOpen, onClose, currentProfile }: ProfileSwitchModalProps) => {
  const [selectedProfile, setSelectedProfile] = useState<'consumidor' | 'fornecedor'>(currentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSwitch = async () => {
    if (selectedProfile === currentProfile) {
      onClose();
      return;
    }

    setIsLoading(true);
    
    // Simulate profile switch
    setTimeout(() => {
      // Update profile in localStorage
      localStorage.setItem('da.profile', selectedProfile);
      
      setIsLoading(false);
      toast({
        title: "Perfil salvo.",
        description: `Você será redirecionado para a Home de ${selectedProfile === 'consumidor' ? 'Consumidor' : 'Fornecedor'}.`,
      });
      
      // Navigate to the appropriate dashboard
      if (selectedProfile === 'consumidor') {
        navigate('/cesta');
      } else {
        // Check if it's first time as fornecedor (simulate check)
        const isFirstTimeFornecedor = localStorage.getItem('fornecedor-onboarded') !== 'true';
        if (isFirstTimeFornecedor) {
          navigate('/fornecedor/onboarding');
        } else {
          navigate('/fornecedor/loja');
        }
      }
      
      onClose();
    }, 1000);
  };

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <span>Trocar Perfil</span>
          </DialogTitle>
          <DialogDescription>
            Escolha como deseja continuar no aplicativo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Selecionar Perfil</Label>
            <RadioGroup 
              value={selectedProfile} 
              onValueChange={(value: 'consumidor' | 'fornecedor') => setSelectedProfile(value)}
              className="space-y-3"
            >
              <div className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors ${
                selectedProfile === 'consumidor' ? 'bg-primary/5 border-primary' : ''
              }`}>
                <RadioGroupItem value="consumidor" id="modal-consumidor" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="modal-consumidor" className="flex items-center space-x-2 cursor-pointer">
                    <ShoppingBasket className="w-4 h-4 text-primary" />
                    <span className="font-medium">Consumidor</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Acesso a cestas, relatórios e gestão de pedidos
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors ${
                selectedProfile === 'fornecedor' ? 'bg-accent/5 border-accent' : ''
              }`}>
                <RadioGroupItem value="fornecedor" id="modal-fornecedor" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="modal-fornecedor" className="flex items-center space-x-2 cursor-pointer">
                    <Store className="w-4 h-4 text-accent" />
                    <span className="font-medium">Fornecedor</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gestão de produtos, pedidos e painel administrativo
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0">
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSwitch}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Trocando..." : "Trocar Perfil"}
            </Button>
          </div>
          
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full flex items-center space-x-2"
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Aplicativo</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSwitchModal;