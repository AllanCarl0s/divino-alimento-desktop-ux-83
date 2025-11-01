import React, { useState, useRef, useEffect } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

export const UserMenuLarge: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!user || !activeRole) {
    return null;
  }

  const handleSwitchRole = (role: UserRole) => {
    if (role === activeRole) return;
    
    switchRole(role);
    const newRoute = getDefaultRoute(role);
    
    toast({
      title: "Perfil alterado",
      description: `Você está agora como ${getRoleLabel(role)}`,
    });
    
    setIsOpen(false);
    navigate(newRoute);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const displayName = user.name || user.email?.split('@')[0] || 'Usuário';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative flex items-center gap-3">
      {/* Avatar */}
      <Avatar className="h-14 w-14 md:h-16 md:w-16 border-3 border-white shadow-md">
        <AvatarImage src={user.photoURL} alt={displayName} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-7 w-7 md:h-8 md:w-8" />
        </AvatarFallback>
      </Avatar>

      {/* Name and Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded-md transition-all hover:opacity-80"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-semibold text-base md:text-lg text-white">
          {displayName}
        </span>
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-white transition-transform",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          role="menu"
          className="absolute right-0 top-full mt-2 w-[280px] bg-background rounded-xl shadow-lg border border-border z-50 overflow-hidden"
        >
          <div className="py-2">
            {/* Role switching options */}
            {user.roles.length > 1 && user.roles.map((role) => {
              const isActive = role === activeRole;
              return (
                <button
                  key={role}
                  role="menuitem"
                  onClick={() => handleSwitchRole(role)}
                  disabled={isActive}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors",
                    "hover:bg-accent focus:bg-accent focus:outline-none",
                    isActive && "bg-muted/50 cursor-default hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {getRoleLabel(role)}
                    </span>
                    {isActive && (
                      <span className="text-xs text-muted-foreground">(Ativo)</span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Separator if multiple roles */}
            {user.roles.length > 1 && (
              <div className="my-2 border-t border-border" />
            )}

            {/* Logout option */}
            <button
              role="menuitem"
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Sair</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
