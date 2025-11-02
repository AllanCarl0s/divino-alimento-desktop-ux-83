import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ProfileSwitchModal from '@/components/ui/ProfileSwitchModal';
import { ArrowLeft, User, Bell, Shield, RefreshCw, ShoppingBasket, Mail, Phone, Edit, Save, Lock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Configuracoes = () => {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    deliveryReminders: true,
    paymentUpdates: true,
    systemUpdates: false
  });
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Maria da Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999'
  });
  
  const navigate = useNavigate();

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // Save logic here
  };

  // Navigation menu items
  const navigationItems = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      description: 'Informações pessoais e dados da conta'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      description: 'Preferências de alertas e comunicação'
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: Shield,
      description: 'Senha e configurações de privacidade'
    },
    {
      id: 'account',
      label: 'Conta',
      icon: RefreshCw,
      description: 'Gerenciamento da conta e perfil'
    }
  ];

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        
        {/* Page Header - Desktop 12 col */}
        <div className="lg:col-span-12 mb-4 lg:mb-6">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gradient-primary mb-2">
              Configurações
            </h1>
            <p className="text-sm lg:text-lg text-muted-foreground">
              Gerencie suas preferências e dados
            </p>
          </div>
        </div>

        {/* Navigation Sidebar - Desktop 4 col */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Menu de Configurações</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-start space-x-3 p-4 text-left hover:bg-muted/50 transition-colors ${
                        activeSection === item.id 
                          ? 'bg-primary/10 border-r-2 border-primary text-primary' 
                          : 'text-foreground'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground hidden lg:block">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Actions - Desktop Only */}
            <Card className="hidden lg:block mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Trocar Perfil
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Modo Escuro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Desktop 8 col */}
        <div className="lg:col-span-8">
          <div className="space-y-6">
            
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                      <ShoppingBasket className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                      <span>Informações do Consumidor</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gerencie seus dados pessoais e informações de contato
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingProfile ? 'Cancelar' : 'Editar'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Profile Header */}
                  <div className="bg-gradient-primary text-white p-4 lg:p-6 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 lg:w-10 lg:h-10" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg lg:text-xl">{profileData.name}</h3>
                        <p className="text-sm lg:text-base opacity-90">Perfil Consumidor</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm">Conta Ativa</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nome Completo
                        </Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditingProfile}
                            className="pl-10 lg:h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          E-mail Principal
                        </Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditingProfile}
                            className="pl-10 lg:h-12"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Telefone de Contato
                        </Label>
                        <div className="relative mt-2">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditingProfile}
                            className="pl-10 lg:h-12"
                          />
                        </div>
                      </div>

                      {/* Additional Fields for Desktop */}
                      <div className="hidden lg:block">
                        <Label className="text-sm font-medium">
                          Membro desde
                        </Label>
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">Janeiro de 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <Button onClick={handleSaveProfile} className="flex-1 lg:flex-none">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                    <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
                    <span>Preferências de Notificação</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure como e quando você deseja receber alertas
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Notificações de Pedidos</h4>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Novos Pedidos</p>
                          <p className="text-xs text-muted-foreground">Receber notificações de cestas disponíveis</p>
                        </div>
                        <Switch
                          checked={notifications.newOrders}
                          onCheckedChange={(checked) => handleNotificationChange('newOrders', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Lembretes de Entrega</p>
                          <p className="text-xs text-muted-foreground">Alertas sobre entregas programadas</p>
                        </div>
                        <Switch
                          checked={notifications.deliveryReminders}
                          onCheckedChange={(checked) => handleNotificationChange('deliveryReminders', checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Notificações do Sistema</h4>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Atualizações de Pagamento</p>
                          <p className="text-xs text-muted-foreground">Status de pagamentos e cobranças</p>
                        </div>
                        <Switch
                          checked={notifications.paymentUpdates}
                          onCheckedChange={(checked) => handleNotificationChange('paymentUpdates', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
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
                  </div>

                  {/* Desktop Notification Preview */}
                  <div className="hidden lg:block bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Preview de Notificação</h4>
                    <div className="bg-background p-3 rounded border shadow-sm max-w-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <Bell className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nova cesta disponível!</p>
                          <p className="text-xs text-muted-foreground">Sua cesta de agosto está pronta para retirada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                    <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-destructive" />
                    <span>Privacidade e Segurança</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gerencie suas configurações de segurança e privacidade
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Segurança da Conta</h4>
                      
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Lock className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Alterar Senha</div>
                          <div className="text-xs text-muted-foreground">Última alteração: 15 dias atrás</div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Shield className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Autenticação em Duas Etapas</div>
                          <div className="text-xs text-muted-foreground">Não configurada</div>
                        </div>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Privacidade</h4>
                      
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Eye className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Gerenciar Permissões</div>
                          <div className="text-xs text-muted-foreground">Controle o acesso aos seus dados</div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Shield className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Histórico de Atividades</div>
                          <div className="text-xs text-muted-foreground">Ver acessos recentes</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Section */}
            {activeSection === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                    <RefreshCw className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    <span>Gerenciamento da Conta</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Troque de perfil, exporte dados ou gerencie sua conta
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Perfil e Conta</h4>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12"
                        onClick={() => setIsProfileModalOpen(true)}
                      >
                        <RefreshCw className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Trocar Perfil</div>
                          <div className="text-xs text-muted-foreground">Alternar entre consumidor e fornecedor</div>
                        </div>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Dados e Exportação</h4>
                      
                      <Button variant="outline" className="w-full justify-start h-12">
                        <ArrowLeft className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Exportar Dados</div>
                          <div className="text-xs text-muted-foreground">Download dos seus dados em PDF</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mobile Actions - Visible only on mobile */}
            <div className="lg:hidden">
              <Card>
                <CardContent className="p-4">
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
            </div>
          </div>
        </div>
      </div>

      {/* Profile Switch Modal */}
      <ProfileSwitchModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile="consumidor"
      />
    </ResponsiveLayout>
  );
};

export default Configuracoes;