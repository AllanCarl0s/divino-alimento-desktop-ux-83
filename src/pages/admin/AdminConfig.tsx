import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminConfig = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
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

        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Configurações Gerais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure aqui as preferências gerais do sistema.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
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