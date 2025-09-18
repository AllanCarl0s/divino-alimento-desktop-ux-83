import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export const AppShell = ({ children, className }: AppShellProps) => {
  return (
    <div className={cn(
      // Responsive container
      'min-h-screen bg-gradient-surface',
      // Desktop constraints
      'lg:min-w-[1024px]',
      className
    )}>
      {/* Container with responsive constraints */}
      <div className={cn(
        // Responsive container
        'mx-auto',
        // Max width with responsive breakpoints
        'max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1280px] xl:max-w-[1440px]',
        // Responsive gutters
        'px-4 sm:px-6 lg:px-8',
        // Full height
        'min-h-screen'
      )}>
        {children}
      </div>
    </div>
  );
};

export default AppShell;