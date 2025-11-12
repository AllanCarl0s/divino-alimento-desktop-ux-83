import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppBarDivino from './AppBarDivino';
import AdminSidebar from './AdminSidebar';
import AppShell from './AppShell';
import Breadcrumb from './Breadcrumb';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  leftHeaderContent?: React.ReactNode;
  showHeader?: boolean;
}

export const ResponsiveLayout = ({ 
  children, 
  className, 
  headerContent,
  leftHeaderContent, 
  showHeader = true 
}: ResponsiveLayoutProps) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFornecedorRoute = location.pathname.startsWith('/fornecedor');
  const isLoginRoute = location.pathname.includes('/login') || 
                       location.pathname.includes('/register') || 
                       location.pathname.includes('/verify-email') ||
                       location.pathname.includes('/onboarding');

  // Mobile-First Fornecedor Login/Onboarding Layout
  if (isFornecedorRoute && isLoginRoute) {
    return (
      <div className="min-h-screen bg-gradient-surface overflow-x-hidden">
        {/* Mobile container for login/onboarding */}
        <div className="lg:hidden min-h-screen flex flex-col overflow-x-hidden">
          {showHeader && (
            <AppBarDivino leftContent={leftHeaderContent}>
              {headerContent}
            </AppBarDivino>
          )}
          <main className="flex-1 flex flex-col px-4 py-6">
            {children}
          </main>
        </div>

        {/* Desktop container for login/onboarding */}
        <div className="hidden lg:flex min-h-screen">
          <AppShell className={className}>
            {showHeader && (
              <AppBarDivino leftContent={leftHeaderContent}>
                {headerContent}
              </AppBarDivino>
            )}
            <main className="flex-1 flex items-center justify-center px-8 py-12">
              <div className="w-full max-w-md">
                {children}
              </div>
            </main>
          </AppShell>
        </div>
      </div>
    );
  }

  // Desktop Admin Layout - Without Sidebar (same as consumer/supplier)
  if (isAdminRoute && !isLoginRoute) {
    return (
      <AppShell className={className}>
        {/* Header */}
        {showHeader && (
          <AppBarDivino leftContent={leftHeaderContent}>
            {headerContent}
          </AppBarDivino>
        )}

        {/* Main Content with 12 column grid */}
        <main className={cn(
          'flex-1 py-6 lg:py-8',
          // Grid system for desktop
          'grid grid-cols-1 lg:grid-cols-12 gap-6',
          className
        )}>
          <div className="lg:col-span-12">
            {children}
          </div>
        </main>
      </AppShell>
    );
  }

  // Responsive layout for fornecedor and consumer pages
  return (
    <div className="min-h-screen bg-gradient-surface overflow-x-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col overflow-x-hidden">
        {showHeader && (
          <AppBarDivino leftContent={leftHeaderContent}>
            {headerContent}
          </AppBarDivino>
        )}
        <main className="flex-1 px-4 pt-8 pb-6">
          {children}
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <AppShell className={className}>
          {/* Header */}
          {showHeader && (
            <AppBarDivino leftContent={leftHeaderContent}>
              {headerContent}
            </AppBarDivino>
          )}

          {/* Main Content with 12 column grid */}
          <main className={cn(
            'flex-1 py-8',
            // Grid system for desktop
            'grid grid-cols-1 lg:grid-cols-12 gap-8',
            className
          )}>
            <div className="lg:col-span-12">
              {children}
            </div>
          </main>
        </AppShell>
      </div>
    </div>
  );
};

export default ResponsiveLayout;