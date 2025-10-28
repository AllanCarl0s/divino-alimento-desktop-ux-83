import React from 'react';
import logoDivino from '@/assets/LOGO_DIVINO_ALIMENTOS.png';

interface CoBrandAkaruiProps {
  className?: string;
}

export const CoBrandAkarui = ({ className }: CoBrandAkaruiProps) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="flex justify-center mb-4">
        <a 
          href="https://github.com/AssociacaoAkarui/DivinoAlimento"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <img 
            src={logoDivino}
            alt="Divino Alimento"
            className="w-full max-w-[220px] object-contain hover:opacity-80 transition-opacity"
          />
        </a>
      </div>
    </div>
  );
};

export default CoBrandAkarui;