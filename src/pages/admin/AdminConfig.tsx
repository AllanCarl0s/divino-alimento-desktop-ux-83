import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Settings, Bell, Shield, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminConfig = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoApproval: false,
    maintenanceMode: false,
    dataExport: true,
    userRegistration: true
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Dados salvos com sucesso",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const systemInfo = {
    version: '1.2.3',
    lastUpdate: '15/02/2024',
    database: 'PostgreSQL 14',
    environment: 'Produção'
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Configurações do Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Configure permissões e preferências do sistema
          </p>
        </div>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Informações do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Versão:</span>
                <p className="font-medium">{systemInfo.version}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Última Atualização:</span>
                <p className="font-medium">{systemInfo.lastUpdate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Banco de Dados:</span>
                <p className="font-medium">{systemInfo.database}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ambiente:</span>
                <p className="font-medium">{systemInfo.environment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                Notificações por E-mail
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleSettingChange('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-sm font-medium">
                Notificações Push
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleSettingChange('pushNotifications')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Permissões</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-approval" className="text-sm font-medium">
                  Aprovação Automática
                </Label>
                <p className="text-xs text-muted-foreground">Aprovar produtos automaticamente</p>
              </div>
              <Switch
                id="auto-approval"
                checked={settings.autoApproval}
                onCheckedChange={() => handleSettingChange('autoApproval')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="user-registration" className="text-sm font-medium">
                  Registro de Usuários
                </Label>
                <p className="text-xs text-muted-foreground">Permitir novos registros</p>
              </div>
              <Switch
                id="user-registration"
                checked={settings.userRegistration}
                onCheckedChange={() => handleSettingChange('userRegistration')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-export" className="text-sm font-medium">
                  Exportação de Dados
                </Label>
                <p className="text-xs text-muted-foreground">Permitir export de relatórios</p>
              </div>
              <Switch
                id="data-export"
                checked={settings.dataExport}
                onCheckedChange={() => handleSettingChange('dataExport')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode" className="text-sm font-medium">
                  Modo Manutenção
                </Label>
                <p className="text-xs text-muted-foreground">Bloquear acesso de usuários</p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleSettingChange('maintenanceMode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={saveSettings} 
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>

          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Painel Administrativo
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminConfig;