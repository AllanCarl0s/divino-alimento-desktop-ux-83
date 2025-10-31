import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingBasket, Store, Shield, UserCheck, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'consumidor':
      return <ShoppingBasket className="w-4 h-4" />;
    case 'fornecedor':
      return <Store className="w-4 h-4" />;
    case 'admin':
      return <Shield className="w-4 h-4" />;
    case 'admin_mercado':
      return <UserCheck className="w-4 h-4" />;
  }
};

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'consumidor':
      return 'Consumidor';
    case 'fornecedor':
      return 'Fornecedor';
    case 'admin':
      return 'Administrador';
    case 'admin_mercado':
      return 'Admin Mercado';
  }
};

export const ProfileSwitcher: React.FC = () => {
  const { user, activeRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user || !activeRole || user.roles.length <= 1) {
    return null; // Não mostrar se usuário tem apenas um perfil
  }

  const handleSwitchRole = (role: UserRole) => {
    switchRole(role);
    const newRoute = getDefaultRoute(role);
    
    toast({
      title: "Perfil alterado",
      description: `Você está agora como ${getRoleLabel(role)}`,
    });
    
    navigate(newRoute);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getRoleIcon(activeRole)}
          <span>{getRoleLabel(activeRole)}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Trocar Perfil</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleSwitchRole(role)}
            disabled={role === activeRole}
            className="gap-2"
          >
            {getRoleIcon(role)}
            <span>{getRoleLabel(role)}</span>
            {role === activeRole && (
              <span className="ml-auto text-xs text-muted-foreground">Ativo</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
