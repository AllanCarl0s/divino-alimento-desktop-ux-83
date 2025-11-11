import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'consumidor' | 'fornecedor' | 'admin' | 'admin_mercado';
export type Gender = 'male' | 'female' | 'nonbinary' | 'unspecified';

interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  defaultRole: UserRole;
  gender?: Gender;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  register: (email: string, password: string, name: string, roles: UserRole[], gender?: Gender) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Função para obter a rota padrão de cada perfil
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('da.user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    const stored = localStorage.getItem('da.activeRole');
    return stored ? (stored as UserRole) : null;
  });

  // Sincronizar activeRole com defaultRole do usuário se não estiver definido
  useEffect(() => {
    if (user && !activeRole) {
      setActiveRole(user.defaultRole);
      localStorage.setItem('da.activeRole', user.defaultRole);
    }
  }, [user, activeRole]);

  const register = async (email: string, password: string, name: string, roles: UserRole[], gender: Gender = 'unspecified') => {
    // Definir defaultRole como o primeiro role selecionado
    const defaultRole = roles[0];
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      roles,
      defaultRole,
      gender,
    };
    
    setUser(newUser);
    setActiveRole(defaultRole);
    localStorage.setItem('da.user', JSON.stringify(newUser));
    localStorage.setItem('da.activeRole', defaultRole);
  };

  const login = async (email: string, password: string) => {
    // Simular login - buscar usuário existente
    const storedUser = localStorage.getItem('da.user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      
      // Usar activeRole salvo ou defaultRole
      const savedActiveRole = localStorage.getItem('da.activeRole') as UserRole;
      const roleToUse = savedActiveRole && user.roles.includes(savedActiveRole) 
        ? savedActiveRole 
        : user.defaultRole;
      
      setActiveRole(roleToUse);
      localStorage.setItem('da.activeRole', roleToUse);
    } else {
      // Criar usuário mock para teste (em produção, isso viria da API)
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        roles: ['consumidor'],
        defaultRole: 'consumidor',
        gender: 'unspecified',
      };
      
      setUser(mockUser);
      setActiveRole(mockUser.defaultRole);
      localStorage.setItem('da.user', JSON.stringify(mockUser));
      localStorage.setItem('da.activeRole', mockUser.defaultRole);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem('da.user');
    localStorage.removeItem('da.activeRole');
    localStorage.removeItem('da.consumerType');
  };

  const switchRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setActiveRole(role);
      localStorage.setItem('da.activeRole', role);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      activeRole,
      login, 
      logout,
      switchRole,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
