import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingBasket, Store, Shield, UserCheck, ChevronDown, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type UserRole = 'consumidor' | 'fornecedor' | 'admin' | 'admin_mercado';

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
      return 'Administrador de Mercado';
  }
};

export const AuthenticatedHeader: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  if (!user || !activeRole) {
    return null;
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (!user.name) return user.email?.split('@')[0] || 'Usuário';
    const names = user.name.split(' ');
    return names.length >= 2 ? `${names[0]} ${names[1]}` : names[0];
  };

  const getInitials = () => {
    if (!user.name) return user.email?.charAt(0).toUpperCase() || 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  const avatarSize = isMobile ? 'w-9 h-9' : 'w-12 h-12';

  return (
    <>
      {isMobile ? (
        /* Mobile Layout: Logo na faixa laranja, avatar + nome em faixa branca abaixo */
        <>
          {/* Faixa laranja com logo centralizada */}
          <header 
            className="sticky top-0 z-50 w-full"
            style={{ backgroundColor: '#F29B2C' }}
          >
            <div className="flex justify-center items-center" style={{ height: '60px', paddingTop: '8px', paddingBottom: '8px' }}>
              <img 
                src="/lovable-uploads/075f4442-f5fb-4f92-a192-635abe87b383.png"
                alt="Divino Alimento"
                className="object-contain"
                style={{ height: '40px', maxWidth: '160px' }}
              />
            </div>
          </header>

          {/* Faixa branca com avatar + nome centralizado */}
          <div className="sticky z-40 w-full bg-white border-b border-border" style={{ top: '60px', paddingTop: '6px', paddingBottom: '6px' }}>
            <div className="flex justify-center items-center px-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 hover:bg-accent transition-colors">
                    <Avatar className={cn(avatarSize, "border-2 border-white shadow-sm")} style={{ backgroundColor: '#2E7D32' }}>
                      <AvatarImage src={user.email || ''} alt={user.name || ''} />
                      <AvatarFallback 
                        className="font-semibold text-white text-sm"
                        style={{ backgroundColor: '#2E7D32' }}
                      >
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <span className="font-medium text-sm" style={{ fontFamily: 'Poppins', color: '#374151' }}>
                      {getDisplayName()}
                    </span>
                    
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="center" 
                  className="w-56 bg-background border shadow-lg z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-foreground">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {user.roles.length > 1 && (
                    <>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Trocar Perfil
                      </DropdownMenuLabel>
                      {user.roles.map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => handleSwitchRole(role)}
                          disabled={role === activeRole}
                          className="gap-2 cursor-pointer"
                        >
                          {getRoleIcon(role)}
                          <span>{getRoleLabel(role)}</span>
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
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </>
      ) : (
        /* Desktop Layout: Logo à esquerda, avatar + nome à direita na mesma linha */
        <header 
          className="sticky top-0 z-50 w-full transition-shadow duration-300"
          style={{
            backgroundColor: '#F29B2C',
            borderBottom: '4px solid #2E7D32',
          }}
        >
          <div className="flex items-center justify-between px-6 lg:px-8 min-h-[72px]">
            {/* Logo à esquerda */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/075f4442-f5fb-4f92-a192-635abe87b383.png"
                alt="Divino Alimento"
                className="h-auto object-contain max-w-[200px] md:max-w-[240px]"
                style={{ maxHeight: '56px' }}
              />
            </div>

            {/* Avatar + Nome + Menu à direita */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#F29B2C] rounded-lg p-2 hover:bg-white/10 transition-colors">
                    <Avatar className={cn(avatarSize, "border-2 border-white shadow-md")}>
                      <AvatarImage src={user.email || ''} alt={user.name || ''} />
                      <AvatarFallback 
                        className="font-semibold text-white"
                        style={{ backgroundColor: '#2E7D32' }}
                      >
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col items-start">
                      <span className="text-white font-semibold text-sm leading-tight">
                        {getDisplayName()}
                      </span>
                      <span className="text-white/80 text-xs leading-tight">
                        {getRoleLabel(activeRole)}
                      </span>
                    </div>
                    
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-background border shadow-lg z-[100]"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-foreground">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {user.roles.length > 1 && (
                    <>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Trocar Perfil
                      </DropdownMenuLabel>
                      {user.roles.map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => handleSwitchRole(role)}
                          disabled={role === activeRole}
                          className="gap-2 cursor-pointer"
                        >
                          {getRoleIcon(role)}
                          <span>{getRoleLabel(role)}</span>
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
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      )}
    </>
  );
};
