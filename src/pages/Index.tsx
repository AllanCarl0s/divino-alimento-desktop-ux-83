import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CycleCard from '@/components/ui/CycleCard';
import BannerCarousel from '@/components/ui/BannerCarousel';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import AppBarDivino from '@/components/layout/AppBarDivino';
import LeafIcon from '@/components/ui/LeafIcon';
import { Calendar, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCycle } from '@/hooks/useCycle';
import { formatTimeRemaining } from '@/types/cycle';
import { cn } from '@/lib/utils';
import heroBasket from '@/assets/hero-basket.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { currentCycle, timeRemaining } = useCycle();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      {/* Header */}
      <AppBarDivino showLoginButton={true} />
      
      <ResponsiveLayout className="pt-0" showHeader={false}>
        {/* Dynamic Banner Carousel */}
        <BannerCarousel className="mb-8" />
        
        {/* Hero Section - Desktop centered 8-10 columns */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 lg:py-12">
        <div className="lg:col-start-2 lg:col-span-10 xl:col-start-3 xl:col-span-8 text-center">
          <div className="mb-8">
            <img 
              src={heroBasket} 
              alt="Cesta de alimentos orgânicos frescos" 
              className="w-full max-w-md lg:max-w-lg mx-auto rounded-xl shadow-lg"
            />
          </div>
          
          <div className="mb-8">
            <h1 className="font-poppins text-3xl lg:text-4xl font-bold text-gradient-primary mb-4">
              {currentCycle.name}
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <LeafIcon className="text-accent" />
              <p className="text-muted-foreground lg:text-lg">
                Alimento sustentável para todo mundo
              </p>
              <LeafIcon className="text-primary" />
            </div>
            
            {/* Cycle Info and Badges */}
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 text-base lg:text-lg">
                {currentCycle.startDate.toLocaleDateString('pt-BR')} - {currentCycle.endDate.toLocaleDateString('pt-BR')}
              </Badge>
              
              {/* Active Windows and Countdown */}
              {currentCycle.status === 'active' && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {currentCycle.offerWindow.isActive && (
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground px-4 py-2">
                      Ofertas Ativas (3 dias)
                    </Badge>
                  )}
                  {currentCycle.extrasWindow.isActive && (
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground px-4 py-2">
                      Extras Disponíveis
                    </Badge>
                  )}
                  {timeRemaining > 0 && (
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Termina em: {formatTimeRemaining(timeRemaining)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Current Cycle Card - Desktop 8 columns centered */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="px-4 lg:px-0 lg:col-start-3 lg:col-span-8">
          <CycleCard
            title={currentCycle.name}
            startDate={currentCycle.startDate.toLocaleDateString('pt-BR')}
            endDate={currentCycle.endDate.toLocaleDateString('pt-BR')}
            cycleType={currentCycle.type}
            status={currentCycle.status}
            description={`Ciclo ${currentCycle.type} com produtos frescos da estação.`}
            offerWindowActive={currentCycle.offerWindow.isActive}
            extrasWindowActive={currentCycle.extrasWindow.isActive}
            timeRemaining={timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : undefined}
          />
        </div>
      </section>

      {/* Date Windows - Desktop 3-4 columns per row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="px-4 lg:px-0 lg:col-start-2 lg:col-span-10">
          <h2 className="font-poppins text-lg lg:text-xl font-semibold mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Janelas do Ciclo
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-base lg:text-lg">Janela de Ofertas</h3>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      {currentCycle.offerWindow.start.toLocaleDateString('pt-BR')} - {currentCycle.offerWindow.end.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn(
                    currentCycle.offerWindow.isActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                  )}>
                    {currentCycle.offerWindow.isActive ? 'Ativo' : 'Encerrado'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-base lg:text-lg">Pedidos Extras</h3>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      {currentCycle.extrasWindow.start.toLocaleDateString('pt-BR')} - {currentCycle.extrasWindow.end.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn(
                    currentCycle.extrasWindow.isActive ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                  )}>
                    {currentCycle.extrasWindow.isActive ? 'Disponível' : 'Encerrado'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      </ResponsiveLayout>
    </div>
  );
};

export default Index;