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
      <div className="h-8 lg:h-10 bg-white" />
      
      {/* Header laranja com logo sobreposto */}
      <header className="relative h-14 lg:h-16 bg-[#F29B2C] flex items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-7 lg:mt-8">
          <button 
            onClick={() => navigate('/')}
            className="hover:opacity-90 transition-opacity"
          >
            <img 
              src={logoDivino}
              alt="Divino Alimento"
              className="w-20 h-20 lg:w-[120px] lg:h-[120px] object-contain"
            />
          </button>
        </div>
      </header>

      {/* Container principal centralizado */}
      <main className="flex-1 flex flex-col items-center px-4 lg:px-8 max-w-[1200px] mx-auto w-full">
        {/* Bloco institucional com ícone folha + texto */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 mt-12 lg:mt-16 mb-6 lg:mb-8 max-w-[720px]">
          <Leaf className="w-14 h-14 lg:w-14 lg:h-14 text-[#2E7D32] flex-shrink-0" />
          <p className="text-[#374151] text-base lg:text-base text-center lg:text-left leading-relaxed font-normal">
            Divino Alimento é uma plataforma que facilita o fluxo de informação de vendas alimentos produzido por diversos agricultores para diversos compradores
          </p>
        </section>

        {/* Imagem hero com alimentos frescos */}
        <section className="w-full mb-6 lg:mb-8">
          <img 
            src={heroBasket}
            alt="Cesta de alimentos frescos orgânicos"
            className="w-full h-[180px] lg:h-[280px] object-cover object-center rounded-lg"
          />
        </section>

        {/* Título do ciclo */}
        <h1 className="text-[#2E7D32] text-3xl lg:text-4xl font-bold text-center mb-4 lg:mb-6">
          {cycleTitle}
        </h1>

        {/* Botão CTA */}
        <button
          onClick={() => navigate('/login')}
          className="bg-[#2E7D32] hover:bg-[#256D2B] text-white font-semibold px-8 py-3 rounded-full transition-colors mb-12 lg:mb-16 text-base"
        >
          entrar/cadastrar
        </button>

        {/* Rodapé com logos */}
        <footer className="flex flex-col items-center gap-4 mb-8 lg:mb-12 mt-auto">
          <div className="w-20 h-px bg-[#2E7D32] opacity-30" />
          <p className="text-[#6B7280] text-xs font-medium">desenvolvido por:</p>
          <div className="flex items-center gap-8 lg:gap-12">
            <img 
              src={logoAkarui}
              alt="Akarui"
              className="h-16 lg:h-20 object-contain"
            />
            <img 
              src={logoTekopora}
              alt="Tekoporã"
              className="h-16 lg:h-20 object-contain"
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
