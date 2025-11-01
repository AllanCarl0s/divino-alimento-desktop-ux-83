import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import logoDivino from '@/assets/LOGO_DIVINO_ALIMENTOS.png';
import logoAkarui from '@/assets/logo-akarui.png';
import logoTekopora from '@/assets/logo-tekopora.png';
import heroBasket from '@/assets/hero-basket.jpg';

const Index = () => {
  const navigate = useNavigate();
  const cycleTitle = "Ciclo outubro 2025";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Faixa branca superior */}
      <div className="h-8 lg:h-12 bg-white" />
      
      {/* Header laranja com logo sobreposto */}
      <header className="relative h-16 lg:h-20 bg-[#F29B2C] flex items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 lg:mt-10">
          <button 
            onClick={() => navigate('/')}
            className="hover:opacity-90 transition-opacity"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          >
            <img 
              src={logoDivino}
              alt="Divino Alimento"
              className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] lg:w-[160px] lg:h-[160px] object-contain"
            />
          </button>
        </div>
      </header>

      {/* Container principal centralizado */}
      <main className="flex-1 flex flex-col items-center px-4 lg:px-8 max-w-[1200px] mx-auto w-full">
        {/* Bloco institucional com ícone folha + texto */}
        <section className="flex flex-col items-center justify-center gap-2 mt-16 lg:mt-20 mb-8 lg:mb-10 max-w-[640px]">
          <Leaf className="w-14 h-14 text-[#2E7D32] flex-shrink-0" />
          <p className="text-[#374151] text-base lg:text-lg text-center leading-relaxed font-medium">
            Divino Alimento é uma plataforma que facilita o fluxo de informação de vendas alimentos produzido por diversos agricultores para diversos compradores
          </p>
        </section>

        {/* Imagem hero com alimentos frescos */}
        <section className="w-full max-w-[900px] mb-8 lg:mb-10">
          <img 
            src={heroBasket}
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
        <footer className="flex flex-col items-center gap-6 mb-12 lg:mb-16 mt-auto">
          <div className="w-[120px] h-[2px] bg-[#2E7D32] opacity-40" />
          <p className="text-[#4B5563] text-xs sm:text-[13px] lg:text-sm font-medium">desenvolvido por:</p>
          <div className="flex items-center gap-7 sm:gap-10 lg:gap-[40px]">
            <img 
              src={logoAkarui}
              alt="Akarui"
              className="h-9 sm:h-12 lg:h-[60px] object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            <img 
              src={logoTekopora}
              alt="Tekoporã"
              className="h-9 sm:h-12 lg:h-[60px] object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
