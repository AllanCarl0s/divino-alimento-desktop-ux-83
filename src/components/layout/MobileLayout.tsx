import React from 'react';
import { cn } from '@/lib/utils';
import AppBarDivino from './AppBarDivino';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  showHeader?: boolean;
}

export const MobileLayout = ({ 
  children, 
  className, 
  headerContent, 
  showHeader = true 
}: MobileLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-surface flex flex-col",
      "max-w-md mx-auto bg-background shadow-lg",
      className
    )}>
      {showHeader && (
        <AppBarDivino>
          {headerContent}
        </AppBarDivino>
      )}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;