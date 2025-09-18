import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CycleType } from '@/types/cycle';

interface CycleCardProps {
  title: string;
  startDate: string;
  endDate: string;
  cycleType: CycleType;
  status: 'active' | 'upcoming' | 'ended';
  description?: string;
  offerWindowActive?: boolean;
  extrasWindowActive?: boolean;
  timeRemaining?: string;
  className?: string;
}

const statusConfig = {
  active: {
    badge: 'Ativo',
    bgColor: 'bg-gradient-to-br from-primary/10 to-accent/10',
    borderColor: 'border-primary/20'
  },
  upcoming: {
    badge: 'Em breve',
    bgColor: 'bg-gradient-to-br from-warning/10 to-secondary/10',
    borderColor: 'border-warning/20'
  },
  ended: {
    badge: 'Encerrado',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
};

export const CycleCard = ({ 
  title, 
  startDate, 
  endDate, 
  cycleType,
  status, 
  description, 
  offerWindowActive = false,
  extrasWindowActive = false,
  timeRemaining,
  className 
}: CycleCardProps) => {
  const config = statusConfig[status];

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      config.bgColor,
      config.borderColor,
      'border-2',
      className
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-lg text-foreground mb-1">
              {title}
            </h3>
            <Badge variant="outline" className="text-xs mb-2">
              Ciclo {cycleType === 'semanal' ? 'Semanal' : 'Quinzenal'}
            </Badge>
          </div>
          <Badge 
            variant={status === 'active' ? 'default' : 'secondary'}
            className={cn(
              'text-xs',
              status === 'active' && 'bg-primary text-primary-foreground'
            )}
          >
            {config.badge}
          </Badge>
        </div>

        {/* Cycle Windows */}
        {status === 'active' && (
          <div className="flex flex-wrap gap-2 mb-2">
            {offerWindowActive && (
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                Ofertas (3 dias)
              </Badge>
            )}
            {extrasWindowActive && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground text-xs">
                Extras
              </Badge>
            )}
          </div>
        )}

        {/* Countdown Timer */}
        {timeRemaining && status === 'active' && (
          <div className="flex items-center space-x-2 mb-2 p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-md">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Termina em: {timeRemaining}
            </span>
          </div>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Início: {startDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Fim: {endDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CycleCard;