import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ConsumerType = 'cesta' | 'venda_direta';

interface ConsumerContextType {
  consumerType: ConsumerType;
  setConsumerType: (type: ConsumerType) => void;
}

const ConsumerContext = createContext<ConsumerContextType | undefined>(undefined);

export const useConsumer = () => {
  const context = useContext(ConsumerContext);
  if (context === undefined) {
    throw new Error('useConsumer must be used within a ConsumerProvider');
  }
  return context;
};

interface ConsumerProviderProps {
  children: ReactNode;
}

export const ConsumerProvider: React.FC<ConsumerProviderProps> = ({ children }) => {
  // Get consumer type from localStorage (saved during registration)
  const [consumerType, setConsumerType] = useState<ConsumerType>(() => {
    const storedType = localStorage.getItem('da.consumerType') as ConsumerType;
    console.log('ConsumerContext: Loading stored type:', storedType);
    return storedType || 'cesta';
  });

  // Update localStorage when consumer type changes
  const handleSetConsumerType = (type: ConsumerType) => {
    setConsumerType(type);
    localStorage.setItem('da.consumerType', type);
  };

  return (
    <ConsumerContext.Provider value={{ consumerType, setConsumerType: handleSetConsumerType }}>
      {children}
    </ConsumerContext.Provider>
  );
};