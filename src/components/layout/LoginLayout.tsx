import React from 'react';
import { cn } from '@/lib/utils';
import AppBarDivino from './AppBarDivino';
import logoAkarui from '@/assets/LOGO_AKARUI.png';

interface LoginLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const LoginLayout = ({ children, className, title }: LoginLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-surface flex flex-col",
      "max-w-md mx-auto md:max-w-none md:mx-0 bg-background md:shadow-none",
      className
    )}>
      {/* Header */}
      <AppBarDivino />
      
      {/* Akarui Co-brand Logo */}
      <div className="flex justify-center py-6 md:py-8">
        <img 
          src={logoAkarui}
          alt="Akarui - Parceiro Tecnológico"
          className="h-12 md:h-16 object-contain"
          decoding="async"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-6 pb-8">
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-foreground">
            {title}
          </h1>
        )}
        
        <div className="w-full max-w-sm md:max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LoginLayout;