import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoDivino from '@/assets/LOGO_DIVINO_ALIMENTOS.png';
import logoAkarui from '@/assets/logo-akarui.png';
import logoTekopora from '@/assets/logo-tekopora.png';
import heroAlimentos from '@/assets/hero-alimentos.png';
import leafIcon from '@/assets/leaf-icon.png';

const Index = () => {
  const navigate = useNavigate();
  const cycleTitle = "Ciclo outubro 2025";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Faixa branca superior */}
      <div className="h-12 lg:h-16 bg-white" />
      
      {/* Header laranja com logo sobreposto */}
      <header className="relative h-20 lg:h-28 bg-[#F29B2C] flex items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 lg:mt-14">
          <a 
            href="https://github.com/AssociacaoAkarui/DivinoAlimento"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          >
            <img 
              src={logoDivino}
              alt="Divino Alimento"
              className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain"
            />
          </a>
        </div>
      </header>

      {/* Container principal centralizado */}
      <main className="flex-1 flex flex-col items-center px-4 lg:px-8 max-w-[1200px] mx-auto w-full">
        {/* Bloco institucional com ícone folha + texto */}
        <section className="flex items-center justify-center gap-3 mt-16 lg:mt-20 mb-8 lg:mb-10 max-w-[720px] px-4 mx-auto">
          <img 
            src={leafIcon} 
            alt="Folha verde" 
            className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 -mt-12"
          />
          <p className="text-[#374151] text-base lg:text-lg text-center leading-relaxed font-medium">
            Divino Alimento é uma plataforma que facilita o fluxo de informação de vendas de alimentos produzido por diversos agricultores e agricultoras para diversos consumidores
          </p>
        </section>

        {/* Imagem hero com alimentos frescos */}
        <section className="w-full max-w-[900px] mb-8 lg:mb-10">
          <img 
            src={heroAlimentos}
            alt="Cesta de alimentos frescos orgânicos"
            className="w-full h-[200px] sm:h-[240px] lg:h-[300px] object-cover object-center rounded-xl shadow-md"
          />
        </section>

        {/* Título do ciclo */}
        <h1 className="text-[#2E7D32] text-[26px] sm:text-[30px] lg:text-[38px] font-bold text-center mb-6 lg:mb-8 mt-8">
          {cycleTitle}
        </h1>

        {/* Botão CTA */}
        <button
          onClick={() => navigate('/login')}
          className="bg-[#2E7D32] hover:bg-[#1E6529] text-white font-semibold px-8 py-3.5 rounded-full transition-colors mb-16 lg:mb-20 text-lg w-full max-w-[320px] shadow-md"
        >
          entrar/cadastrar
        </button>

        {/* Rodapé com logos */}
        <footer className="flex flex-col items-center gap-8 mb-16 lg:mb-20 mt-auto">
          <div className="w-[200px] h-[4px] bg-[#2E7D32] opacity-40" />
          <p className="text-[#4B5563] text-lg sm:text-xl lg:text-2xl font-semibold">desenvolvido por:</p>
          <div className="flex items-center gap-12 sm:gap-16 lg:gap-20">
            <a 
              href="https://www.akarui.org.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoAkarui}
                alt="Akarui"
                className="h-20 sm:h-28 lg:h-[120px] object-contain"
                style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}
              />
            </a>
            <a 
              href="https://www.tekopora.top/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoTekopora}
                alt="Tekoporã"
                className="h-20 sm:h-28 lg:h-[120px] object-contain"
                style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}
              />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
