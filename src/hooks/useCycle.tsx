import { useState, useEffect } from 'react';
import { Cycle, CycleType, createCycleWindows, validateCycleDuration } from '@/types/cycle';

// Mock current cycle data - in real app this would come from API
const mockCurrentCycle: Cycle = {
  id: 'cycle-sep-2025',
  name: 'Ciclo Setembro 2025',
  type: 'semanal',
  startDate: new Date('2025-09-01'),
  endDate: new Date('2025-09-07'),
  status: 'active',
  ...createCycleWindows(new Date('2025-09-01'), new Date('2025-09-07'))
};

export const useCycle = () => {
  const [currentCycle, setCurrentCycle] = useState<Cycle>(mockCurrentCycle);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date().getTime();
      const endTime = currentCycle.endDate.getTime();
      setTimeRemaining(Math.max(0, endTime - now));
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentCycle.endDate]);

  const createNewCycle = (
    name: string, 
    type: CycleType, 
    startDate: Date, 
    endDate: Date
  ): { success: boolean; errors: string[]; cycle?: Cycle } => {
    const validation = validateCycleDuration(startDate, endDate, type);
    
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const windows = createCycleWindows(startDate, endDate);
    
    const newCycle: Cycle = {
      id: `cycle-${Date.now()}`,
      name,
      type,
      startDate,
      endDate,
      status: 'upcoming',
      offerWindow: windows.offerWindow,
      extrasWindow: windows.extrasWindow
    };

    return { success: true, errors: [], cycle: newCycle };
  };

  return {
    currentCycle,
    timeRemaining,
    createNewCycle,
    setCurrentCycle
  };
};