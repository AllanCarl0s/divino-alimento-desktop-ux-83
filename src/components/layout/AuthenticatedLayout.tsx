import React from 'react';
import { HeaderGlobal } from './HeaderGlobal';
import { PageTitle } from './PageTitle';
import { cn } from '@/lib/utils';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  className?: string;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
  className
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderGlobal />
      <PageTitle title={pageTitle} subtitle={pageSubtitle} />
      
      <main 
        className={cn(
          "flex-1 pt-2",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};
