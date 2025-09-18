import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ShoppingCart, Percent, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import { useCycle } from '@/hooks/useCycle';
import { CycleType, formatTimeRemaining } from '@/types/cycle';

interface CycleBanner {
  id: string;
  title: string;
  cycleType: CycleType;
  startDate: Date;
  endDate: Date;
  offerStart?: Date;
  offerEnd?: Date;
  extrasStart?: Date;
  extrasEnd?: Date;
  discount?: string;
  products: string[];
  backgroundColor: string;
  textColor: string;
  badgeType: 'current' | 'offers' | 'extras' | 'upcoming';
}

const createCycleBanners = (): CycleBanner[] => {
  const now = new Date();
  const banners: CycleBanner[] = [];

  // Current Weekly Cycle - Start from today
  const currentStart = new Date();
  const currentEnd = new Date();
  currentEnd.setDate(currentStart.getDate() + 6); // 7 days total
  
  banners.push({
    id: 'current-week',
    title: 'Ciclo da Semana',
    cycleType: 'semanal',
    startDate: currentStart,
    endDate: currentEnd,
    products: ['Tomates Orgânicos', 'Alface Hidropônica', 'Cenoura Baby'],
    backgroundColor: 'bg-gradient-to-r from-primary to-accent',
    textColor: 'text-white',
    badgeType: 'current'
  });

  // Offers Window (3 days from start of current cycle)
  const offerStart = new Date(currentStart);
  const offerEnd = new Date(currentStart);
  offerEnd.setDate(offerEnd.getDate() + 2); // 3 days total
  
  if (offerEnd > now) {
    banners.push({
      id: 'offers-3days',
      title: 'Ofertas Especiais',
      cycleType: 'semanal',
      startDate: currentStart,
      endDate: currentEnd,
      offerStart,
      offerEnd,
      discount: '25% OFF',
      products: ['Frutas da Estação', 'Verduras Orgânicas', 'Legumes Frescos'],
      backgroundColor: 'bg-gradient-to-r from-secondary to-warning',
      textColor: 'text-dark-text',
      badgeType: 'offers'
    });
  }

  // Extras Window (entire current cycle)
  banners.push({
    id: 'extras',
    title: 'Produtos Extras',
    cycleType: 'semanal',
    startDate: currentStart,
    endDate: currentEnd,
    extrasStart: currentStart,
    extrasEnd: currentEnd,
    discount: '15% OFF',
    products: ['Mel Orgânico', 'Ovos Caipiras', 'Pães Artesanais'],
    backgroundColor: 'bg-gradient-to-r from-accent to-primary',
    textColor: 'text-white',
    badgeType: 'extras'
  });

  // Next Cycle (Biweekly) - starts after current cycle ends
  const nextStart = new Date(currentEnd);
  nextStart.setDate(nextStart.getDate() + 1);
  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextEnd.getDate() + 14); // 15 days total
  
  banners.push({
    id: 'next-biweekly',
    title: 'Próximo Ciclo',
    cycleType: 'quinzenal',
    startDate: nextStart,
    endDate: nextEnd,
    products: ['Produtos Sazonais', 'Novidades', 'Especialidades'],
    backgroundColor: 'bg-gradient-to-r from-muted to-secondary',
    textColor: 'text-foreground',
    badgeType: 'upcoming'
  });

  return banners.filter(banner => {
    // Validate cycle duration
    const diffTime = banner.endDate.getTime() - banner.startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const expectedDays = banner.cycleType === 'semanal' ? 7 : 15;
    
    return diffDays === expectedDays;
  });
};

interface CountdownProps {
  endDate: Date;
  textColor: string;
  label?: string;
}

const Countdown: React.FC<CountdownProps> = ({ endDate, textColor }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center space-x-4">
      <Clock className={cn("w-5 h-5", textColor)} />
      <div className="flex space-x-2">
        {[
          { label: 'Dias', value: timeLeft.days },
          { label: 'Horas', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Seg', value: timeLeft.seconds }
        ].map(({ label, value }, index) => (
          <div key={label} className="text-center">
            <div className={cn(
              "bg-black/20 rounded-lg px-2 py-1 min-w-[40px]",
              textColor
            )}>
              <span className="font-bold text-lg">
                {value.toString().padStart(2, '0')}
              </span>
            </div>
            <p className={cn("text-xs mt-1", textColor)}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BannerCarouselProps {
  className?: string;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ className }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const banners = createCycleBanners();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getBadgeText = (banner: CycleBanner): string => {
    switch (banner.badgeType) {
      case 'current':
        return banner.cycleType === 'semanal' ? 'Semanal (7 dias)' : 'Quinzenal (15 dias)';
      case 'offers':
        return '3 dias';
      case 'extras':
        return 'Extras';
      case 'upcoming':
        return 'Agendado';
      default:
        return '';
    }
  };

  const getCountdownTarget = (banner: CycleBanner): Date => {
    if (banner.offerEnd && banner.badgeType === 'offers') return banner.offerEnd;
    if (banner.extrasEnd && banner.badgeType === 'extras') return banner.extrasEnd;
    return banner.endDate;
  };

  const getCountdownLabel = (banner: CycleBanner): string => {
    if (banner.badgeType === 'offers') return 'Ofertas terminam em:';
    if (banner.badgeType === 'extras') return 'Extras terminam em:';
    if (banner.badgeType === 'upcoming') return 'Inicia em:';
    return 'Termina em:';
  };

  if (banners.length === 0) return null;

  return (
    <section className={cn("relative", className)}>
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className={cn(
                  "p-0 relative min-h-[200px] md:min-h-[250px]",
                  banner.backgroundColor
                )}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/20 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full" />
                  </div>
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      {/* Left Section - Cycle Info */}
                      <div className="space-y-4">
                         <div>
                           <h2 className={cn(
                             "text-2xl md:text-3xl font-bold font-poppins mb-2",
                             banner.textColor
                           )}>
                             {banner.title}
                           </h2>
                           <p className={cn("text-lg", banner.textColor)}>
                             {formatDate(banner.startDate)} – {formatDate(banner.endDate)}
                           </p>
                         </div>
                         
                         <div className="flex flex-wrap gap-2">
                           <Badge 
                             className={cn(
                               "bg-white/20 text-current border-white/30 px-3 py-1",
                               banner.textColor
                             )}
                           >
                             <Calendar className="w-4 h-4 mr-2" />
                             {getBadgeText(banner)}
                           </Badge>
                           
                           {banner.discount && (
                             <Badge 
                               className={cn(
                                 "bg-white/20 text-current border-white/30 px-3 py-1",
                                 banner.textColor
                               )}
                             >
                               <Percent className="w-4 h-4 mr-2" />
                               {banner.discount}
                             </Badge>
                           )}
                         </div>
                      </div>
                      
                      {/* Center Section - Products */}
                      <div className="space-y-4">
                        <h3 className={cn(
                          "text-lg font-semibold",
                          banner.textColor
                        )}>
                          Produtos em Destaque:
                        </h3>
                        <div className="space-y-2">
                          {banner.products.map((product, index) => (
                            <div key={index} className={cn(
                              "flex items-center",
                              banner.textColor
                            )}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              <span className="text-sm">{product}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          className="bg-white/20 border-white/30 hover:bg-white/30 text-current"
                        >
                          Ver Produtos
                        </Button>
                      </div>
                      
                       {/* Right Section - Countdown */}
                       <div className="space-y-4">
                         <h3 className={cn(
                           "text-lg font-semibold",
                           banner.textColor
                         )}>
                           {getCountdownLabel(banner)}
                         </h3>
                         <Countdown 
                           endDate={getCountdownTarget(banner)} 
                           textColor={banner.textColor}
                           label={getCountdownLabel(banner)}
                         />
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border-white/30" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border-white/30" />
      </Carousel>
    </section>
  );
};

export default BannerCarousel;