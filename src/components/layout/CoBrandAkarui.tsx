import React from 'react';
import logoDivino from '@/assets/LOGO_DIVINO_ALIMENTOS.png';

interface CoBrandAkaruiProps {
  className?: string;
}

export const CoBrandAkarui = ({ className }: CoBrandAkaruiProps) => {
  return (
    <div className={`text-center ${className}`} style={{ marginTop: '40px', marginBottom: '24px' }}>
      <div className="flex justify-center">
        <a 
          href="https://github.com/AssociacaoAkarui/DivinoAlimento"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity"
        >
          <img 
            src={logoDivino}
            alt="Divino Alimento"
            className="w-[220px] h-auto object-contain"
          />
        </a>
      </div>
    </div>
  );
};

export default CoBrandAkarui;