import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type UserRole = 'consumidor' | 'fornecedor' | 'admin' | 'admin_mercado';

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

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, className }) => {
  const { activeRole } = useAuth();
  const isMobile = useIsMobile();

  if (!activeRole) return null;

  const fullTitle = `${getRoleLabel(activeRole)} - ${title}`;

  return (
    <div 
      className={cn(
        "border-b border-gray-200 bg-white",
        isMobile ? "py-4 px-4" : "py-6 px-6 lg:px-8",
        className
      )}
    >
      <div className={cn(isMobile && "text-center")}>
        <h1 
          className={cn(
            "font-bold font-poppins",
            isMobile ? "text-[22px]" : "text-[26px]"
          )}
          style={{ color: '#2E7D32' }}
        >
          {fullTitle}
        </h1>
        {subtitle && (
          <p 
            className={cn(
              "font-poppins mt-1",
              isMobile ? "text-sm" : "text-[15px]"
            )}
            style={{ color: '#4B5563' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
