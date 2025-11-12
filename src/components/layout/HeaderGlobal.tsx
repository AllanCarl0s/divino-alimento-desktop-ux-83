import React, { useState } from 'react';
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
import { UserRoleModal } from './UserRoleModal';

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

export const HeaderGlobal: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className="header-wrap sticky top-0 w-full z-50">
        {isMobile ? (
          <>
            {/* Faixa laranja com logo */}
            <div 
              className="header-top flex items-center justify-center"
              style={{ 
                height: '60px',
                backgroundColor: '#F29B2C',
                borderBottom: '2px solid #1F6B2E',
                padding: '8px 12px',
                position: 'relative',
                zIndex: 2
              }}
            >
              <img 
                className="header-logo object-contain"
                src="/lovable-uploads/075f4442-f5fb-4f92-a192-635abe87b383.png"
                alt="DIVINO ALIMENTO"
                style={{ height: '40px', maxWidth: '80%' }}
              />
            </div>

            {/* Subfaixa branca com avatar + nome */}
            <div 
              className="header-user flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#FFF',
                padding: '6px 12px',
                borderBottom: '1px solid #E6E8EB',
                position: 'relative',
                zIndex: 1
              }}
            >
              <button 
                id="avatar-button"
                className="user-btn inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 hover:bg-accent transition-colors"
                aria-haspopup="dialog"
                aria-expanded={isModalOpen}
                aria-controls="user-role-modal"
                onClick={() => setIsModalOpen(true)}
              >
                <Avatar 
                  className="user-avatar flex-shrink-0"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    border: '2px solid #FFF',
                    backgroundColor: '#1F6B2E'
                  }}
                >
                  <AvatarImage src={user.email || ''} alt={user.name || ''} />
                  <AvatarFallback 
                    className="font-semibold text-white text-xs"
                    style={{ backgroundColor: '#1F6B2E' }}
                  >
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <span 
                  className="user-name"
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#2E2E2E',
                    fontFamily: 'Poppins'
                  }}
                >
                  {getDisplayName()}
                </span>
                
                <ChevronDown className="user-caret w-3 h-3" style={{ color: '#6B7280' }} />
              </button>
            </div>
          </>
        ) : (
          /* Desktop: avatar à direita dentro da faixa laranja */
          <div 
            className="header-top relative flex items-center justify-start"
            style={{
              height: '80px',
              backgroundColor: '#F29B2C',
              borderBottom: '2px solid #1F6B2E',
              padding: '0 24px'
            }}
          >
            <img 
              className="header-logo object-contain"
              src="/lovable-uploads/075f4442-f5fb-4f92-a192-635abe87b383.png"
              alt="DIVINO ALIMENTO"
              style={{ height: '48px' }}
            />

            <div 
              className="header-user absolute"
              style={{ right: '16px', top: '16px' }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="user-btn inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#F29B2C] rounded-lg p-2 hover:bg-white/10 transition-colors">
                    <Avatar 
                      className="user-avatar"
                      style={{ 
                        width: '44px', 
                        height: '44px',
                        border: '2px solid #FFF'
                      }}
                    >
                      <AvatarImage src={user.email || ''} alt={user.name || ''} />
                      <AvatarFallback 
                        className="font-semibold text-white"
                        style={{ backgroundColor: '#1F6B2E' }}
                      >
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col items-start">
                      <span 
                        className="user-name text-white leading-tight"
                        style={{ fontSize: '16px', fontWeight: 600 }}
                      >
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
                  className="user-menu w-56 bg-background border shadow-lg z-[60]"
                  style={{ borderRadius: '12px', top: '72px' }}
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
        )}
      </div>

      {/* Modal unificado para mobile */}
      {isMobile && <UserRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
