import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { roleLabel } from '@/utils/labels';

const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'consumidor':
      return '/dashboard';
    case 'fornecedor':
      return '/fornecedor/loja';
    case 'admin':
      return '/admin/dashboard';
    case 'admin_mercado':
      return '/adminmercado/dashboard';
  }
};


export const UserMenu: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user || !activeRole) {
    return null;
  }

  const handleSwitchRole = (role: UserRole) => {
    if (role === activeRole) return;
    
    switchRole(role);
    const newRoute = getDefaultRoute(role);
    
    toast({
      title: "Perfil alterado",
      description: `Você está agora como ${roleLabel(role, user.gender)}`,
    });
    
    navigate(newRoute);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Pegar primeiro nome ou nome completo
  const displayName = user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Usuário';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-primary">{displayName}</span>
          <ChevronDown className="h-4 w-4 text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background shadow-lg">
        {user.roles.length > 1 && (
          <>
            {user.roles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => handleSwitchRole(role)}
                disabled={role === activeRole}
                className="cursor-pointer hover:bg-accent"
              >
                <span className={role === activeRole ? 'text-muted-foreground' : ''}>
                  {roleLabel(role, user.gender)}
                </span>
                {role === activeRole && (
                  <span className="ml-auto text-xs text-muted-foreground">(Ativo)</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
