import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ProfileSwitchModal from '@/components/ui/ProfileSwitchModal';
import { ArrowLeft, User, Bell, Shield, RefreshCw, Store, Phone, Mail, MapPin, CreditCard, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FornecedorConfiguracoes = () => {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    deliveryReminders: true,
    paymentUpdates: true,
    systemUpdates: false
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  // Mock user data
  const userData = {
    name: 'João da Silva',
    email: 'joao@fazendafeliz.com',
    phone: '(11) 99999-9999',
    storeName: 'Fazenda Feliz',
    address: 'Zona Rural, Cidade Verde - SP',
    bankData: {
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: '67890-1',
      pix: 'joao@fazendafeliz.com'
    }
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/fornecedor/loja')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary">Configurações</h1>
          <p className="text-sm lg:text-base text-muted-foreground">Gerencie suas preferências e dados</p>
        </div>

        {/* Profile Info */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Store className="w-5 h-5 text-primary" />
              <span>Informações do Fornecedor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-primary text-white p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{userData.storeName}</h3>
                  <p className="text-sm opacity-90">{userData.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{userData.email}</p>
                  <p className="text-xs text-muted-foreground">E-mail principal</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{userData.phone}</p>
                  <p className="text-xs text-muted-foreground">Telefone de contato</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{userData.address}</p>
                  <p className="text-xs text-muted-foreground">Localização</p>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-primary" />
                  Dados Bancários
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{userData.bankData.bank}</p>
                      <p className="text-xs text-muted-foreground">Banco</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{userData.bankData.agency}</p>
                        <p className="text-xs text-muted-foreground">Agência</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{userData.bankData.account}</p>
                        <p className="text-xs text-muted-foreground">Conta</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <CreditCard className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium">{userData.bankData.pix}</p>
                      <p className="text-xs text-muted-foreground">Chave PIX</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <User className="w-4 h-4 mr-2" />
              Editar Dados
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Bell className="w-5 h-5 text-accent" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Novos Pedidos</p>
                  <p className="text-xs text-muted-foreground">Receber notificações de novos pedidos</p>
                </div>
                <Switch
                  checked={notifications.newOrders}
                  onCheckedChange={(checked) => handleNotificationChange('newOrders', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lembretes de Entrega</p>
                  <p className="text-xs text-muted-foreground">Alertas sobre prazos de entrega</p>
                </div>
                <Switch
                  checked={notifications.deliveryReminders}
                  onCheckedChange={(checked) => handleNotificationChange('deliveryReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Atualizações de Pagamento</p>
                  <p className="text-xs text-muted-foreground">Status de pagamentos recebidos</p>
                </div>
                <Switch
                  checked={notifications.paymentUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('paymentUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Atualizações do Sistema</p>
                  <p className="text-xs text-muted-foreground">Novidades e melhorias do app</p>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Shield className="w-5 h-5 text-destructive" />
              <span>Privacidade e Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Gerenciar Permissões
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Profile Actions */}
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Trocar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Profile Switch Modal */}
        <ProfileSwitchModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentProfile="fornecedor"
        />
      </div>
    </ResponsiveLayout>
  );
};

export default FornecedorConfiguracoes;