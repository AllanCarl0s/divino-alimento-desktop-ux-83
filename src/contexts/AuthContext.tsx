import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'consumidor' | 'fornecedor' | 'admin' | 'admin_mercado' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('da.user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string, role: UserRole) => {
    // Simular login - substituir por chamada real de API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role,
    };
    
    setUser(mockUser);
    localStorage.setItem('da.user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('da.user');
    localStorage.removeItem('da.consumerType');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
