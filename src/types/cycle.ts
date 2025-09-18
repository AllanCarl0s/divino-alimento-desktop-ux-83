export type CycleType = 'semanal' | 'quinzenal';

export interface CycleWindow {
  start: Date;
  end: Date;
  isActive: boolean;
}

export interface Cycle {
  id: string;
  name: string;
  type: CycleType;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upcoming' | 'ended';
  
  // Cycle windows
  offerWindow: CycleWindow;
  extrasWindow: CycleWindow;
  flashExtrasWindow?: CycleWindow; // Optional "Extras Relâmpago"
}

export interface CycleValidation {
  isValid: boolean;
  errors: string[];
}

// Cycle validation utilities
export const validateCycleDuration = (startDate: Date, endDate: Date, type: CycleType): CycleValidation => {
  const expectedDays = type === 'semanal' ? 7 : 15;
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  
  const errors: string[] = [];
  
  if (diffDays !== expectedDays) {
    errors.push(`Ciclo ${type} deve ter exatamente ${expectedDays} dias. Atual: ${diffDays} dias.`);
  }
  
  if (endDate <= startDate) {
    errors.push('Data de fim deve ser posterior à data de início.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createCycleWindows = (startDate: Date, endDate: Date): { 
  offerWindow: CycleWindow; 
  extrasWindow: CycleWindow; 
} => {
  const now = new Date();
  
  // Offer window: always 3 days from start
  const offerStart = new Date(startDate);
  const offerEnd = new Date(startDate);
  offerEnd.setDate(offerEnd.getDate() + 2); // 3 days total (start + 2)
  
  const offerWindow: CycleWindow = {
    start: offerStart,
    end: offerEnd,
    isActive: now >= offerStart && now <= offerEnd
  };
  
  // Extras window: default is the entire cycle
  const extrasWindow: CycleWindow = {
    start: new Date(startDate),
    end: new Date(endDate),
    isActive: now >= startDate && now <= endDate
  };
  
  return { offerWindow, extrasWindow };
};

export const getCycleDisplayName = (type: CycleType): string => {
  return type === 'semanal' ? 'Semanal (7 dias)' : 'Quinzenal (15 dias)';
};

export const getTimeUntilCycleEnd = (endDate: Date): number => {
  return Math.max(0, endDate.getTime() - new Date().getTime());
};

export const formatTimeRemaining = (milliseconds: number): string => {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};