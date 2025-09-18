import React from 'react';

interface CoBrandAkaruiProps {
  className?: string;
}

export const CoBrandAkarui = ({ className }: CoBrandAkaruiProps) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="flex justify-center mb-4">
        <img 
          src="/lovable-uploads/462db28b-ff03-4183-a5cc-69b691bfa845.png"
          alt="Akarui - Parceiro Oficial"
          className="h-32 lg:h-40 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <p className="text-sm lg:text-base text-muted-foreground">
        Em parceria com Akarui
      </p>
    </div>
  );
};

export default CoBrandAkarui;