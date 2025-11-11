import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { roleLabel } from '@/utils/labels';
import { cn } from '@/lib/utils';

interface RoleTitleProps {
  /** Página/seção atual (ex: "Minha Cesta", "Dashboard") */
  page?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Tag HTML a ser usada (padrão: h1) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Se deve atualizar o document.title */
  updateDocumentTitle?: boolean;
}

/**
 * Componente que renderiza o título da página com o rótulo do papel
 * dinamicamente ajustado ao gênero do usuário.
 * 
 * @example
 * <RoleTitle page="Minha Cesta" />
 * // Renderiza: "Consumidora – Minha Cesta" (se gender === feminino)
 */
export const RoleTitle: React.FC<RoleTitleProps> = ({ 
  page, 
  className,
  as: Tag = 'h1',
  updateDocumentTitle = true 
}) => {
  const { activeRole, user } = useAuth();

  if (!activeRole) return null;

  const roleText = roleLabel(activeRole, user?.gender);
  const title = page ? `${roleText} – ${page}` : roleText;

  // Atualizar document.title para SEO
  useEffect(() => {
    if (updateDocumentTitle && title) {
      document.title = `${title} | Divino Alimento`;
    }
  }, [title, updateDocumentTitle]);

  return (
    <Tag className={cn("text-2xl lg:text-3xl font-bold text-gradient-primary", className)}>
      {title}
    </Tag>
  );
};

/**
 * Hook para obter o título da página sem renderizar componente
 */
export const useRoleTitle = (page?: string): string => {
  const { activeRole, user } = useAuth();
  
  if (!activeRole) return page || '';
  
  const roleText = roleLabel(activeRole, user?.gender);
  return page ? `${roleText} – ${page}` : roleText;
};
