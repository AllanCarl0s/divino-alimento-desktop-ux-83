import React, { useState, useRef, useEffect } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ChevronDown, LogOut, ShoppingBasket, Store, Shield, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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

export const UserMenuLarge: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  // Get first and second name only
  const getDisplayName = () => {
    if (user.name) {
      const nameParts = user.name.trim().split(' ');
      return nameParts.slice(0, 2).join(' ');
    }
    return user.email?.split('@')[0] || 'Usuário';
  };
  
  const displayName = getDisplayName();

  const getInitials = () => {
    if (user.name) {
      const nameParts = user.name.trim().split(' ');
      return nameParts.slice(0, 2).map(n => n[0]).join('').toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

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

  // Mobile version - Modal style Google
  if (isMobile) {
    return (
      <>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <Avatar className="h-11 w-11 border-2 border-white">
              <AvatarImage src={user.photoURL} alt={displayName} />
              <AvatarFallback className="bg-primary text-white font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>

        {/* Mobile Modal */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="bg-white w-[90%] max-w-[340px] rounded-2xl p-6 text-center shadow-2xl animate-in slide-in-from-top-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Large Avatar */}
              <Avatar className="h-20 w-20 border-3 border-primary mx-auto mb-2">
                <AvatarImage src={user.photoURL} alt={displayName} />
                <AvatarFallback className="bg-primary text-white font-semibold text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <h3 className="text-lg font-semibold text-primary mb-1">
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
                        onClick={() => !isActive && handleSwitchRole(role)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors",
                          isActive ? "bg-primary/5 font-medium" : "hover:bg-gray-50"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-gray-600")} />
                        <span className={cn("text-sm text-left flex-1", isActive ? "text-primary" : "text-gray-700")}>
                          {getRoleLabel(role)}
                        </span>
                        {isActive && (
                          <span className="text-xs text-primary">Ativo</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop version - Original dropdown
  return (
    <div ref={menuRef} className="relative">
      <div className="flex flex-col items-center pt-14">
        {/* Avatar - inside orange header */}
        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
          <AvatarImage src={user.photoURL} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Name and Dropdown - in white area below */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mt-8 flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md transition-all hover:opacity-80"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-semibold text-lg text-foreground">
          {displayName}
        </span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
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
