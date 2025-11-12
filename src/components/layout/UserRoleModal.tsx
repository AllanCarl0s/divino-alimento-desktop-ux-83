import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingBasket, Store, Shield, Building2, LogOut, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { roleLabel, type AppRole, type Gender } from '@/utils/labels';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'consumidor':
      return ShoppingBasket;
    case 'fornecedor':
      return Store;
    case 'admin':
      return Shield;
    case 'admin_mercado':
      return Building2;
  }
};

export const UserRoleModal: React.FC<UserRoleModalProps> = ({ isOpen, onClose }) => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!user || !activeRole || !isOpen) {
    return null;
  }

  // @ts-ignore - gender pode não existir ainda no tipo User
  const userGender: Gender = user.gender || 'unspecified';

  const handleSwitchRole = (role: UserRole) => {
    if (role === activeRole) return;
    
    switchRole(role);
    const newRoute = getDefaultRoute(role);
    
    toast({
      title: "Perfil alterado",
      description: `Você está agora como ${roleLabel(role as AppRole, userGender)}`,
    });
    
    onClose();
    navigate(newRoute);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (user.name) {
      const nameParts = user.name.trim().split(' ');
      return nameParts.slice(0, 2).join(' ');
    }
    return user.email?.split('@')[0] || 'Usuário';
  };

  const getInitials = () => {
    if (user.name) {
      const nameParts = user.name.trim().split(' ');
      return nameParts.slice(0, 2).map(n => n[0]).join('').toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const displayName = getDisplayName();

  if (!isOpen) return null;

  return createPortal(
    <div 
      id="user-role-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-role-modal-title"
      className="user-role-backdrop fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="user-role-card bg-white w-[92%] max-w-[420px] rounded-[14px] p-6 text-center shadow-2xl animate-in slide-in-from-top-4 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-11 w-11 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Fechar menu de perfil"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Large Avatar */}
        <Avatar className="h-20 w-20 border-3 border-primary mx-auto mb-2">
          <AvatarImage src={user.photoURL} alt={displayName} />
          <AvatarFallback className="bg-primary text-white font-semibold text-2xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <h3 
          id="user-role-modal-title" 
          className="text-lg font-semibold text-primary mb-1"
          tabIndex={0}
        >
          Olá, {displayName}!
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {user.email}
        </p>

        {/* Roles List */}
        {user.roles && user.roles.length > 0 && (
          <ul className="mb-3 border-t border-gray-200">
            {user.roles.map((role) => {
              const Icon = getRoleIcon(role);
              const isActive = role === activeRole;
              return (
                <li 
                  key={role}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isActive) {
                      handleSwitchRole(role);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 border-b border-gray-100 transition-colors",
                    isActive ? "bg-primary/5 font-medium cursor-default" : "hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none",
                    "min-h-[44px]"
                  )}
                  tabIndex={isActive ? -1 : 0}
                  role="button"
                  aria-pressed={isActive}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-600")} />
                  <span className={cn("text-sm text-left flex-1", isActive ? "text-primary" : "text-gray-700")}>
                    {roleLabel(role as AppRole, userGender)}
                  </span>
                  {isActive && (
                    <span className="text-xs text-primary font-semibold">Ativo</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>,
    document.body
  );
};
