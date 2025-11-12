import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { ShoppingCart, FileText, Wallet, UserCircle, ChevronRight, ArrowLeft, ShoppingBasket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';
import { Button } from '@/components/ui/button';
import { formatBRL } from '@/utils/currency';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import leafTitleIcon from '@/assets/leaf-title-icon.png';


const Dashboard = () => {
  const navigate = useNavigate();
  const { currentCycle } = useCycle();

  const acoes = [
    {
      titulo: 'Minha Cesta',
      descricao: 'Ver itens da sua cesta no ciclo atual',
      icone: ShoppingBasket,
      rota: '/minhaCesta/1',
      habilitado: true,
      badge: undefined
    },
    {
      titulo: 'Pedido em Varejo',
      descricao: 'Comprar alimentos da venda direta',
      icone: ShoppingCart,
      rota: '/consumidor/selecionar-ciclo',
      habilitado: true,
      badge: undefined
    },
    {
      titulo: 'Relatório de Pedidos',
      descricao: 'Visualize e exporte relatórios dos seus pedidos',
      icone: FileText,
      rota: '/consumidor/relatorio-pedidos',
      habilitado: true,
      badge: undefined
    },
    {
      titulo: 'Dados Pessoais',
      descricao: 'Atualize seu perfil e contato',
      icone: UserCircle,
      rota: '/usuario/1',
      habilitado: true,
      badge: undefined
    }
  ];

  return (
    <ResponsiveLayout
      headerContent={
        <UserMenuLarge />
      }
    >
      <div className="space-y-6 pt-8">
        {/* Header */}
        <div className="text-center relative mb-8">
          <img 
            src={leafTitleIcon} 
            alt="" 
            className="absolute left-1/2 -translate-x-[175px] md:-translate-x-[250px] top-1/2 -translate-y-[80%] w-10 h-10 md:w-16 md:h-16"
          />
          <h1 className="text-xl md:text-[28px] font-bold text-primary">
            Gerencie suas compras
          </h1>
        </div>

        {/* Resumo do Ciclo Atual */}
        <div className="mb-8 bg-white rounded-[14px] shadow-[0px_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Cabeçalho */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-center text-[#2C3E50] text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Resumo do Ciclo Atual
            </h3>
            
            {/* Badge do Ciclo */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#FFA726] rounded-full px-6 py-2">
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  1º Ciclo de Novembro 2025 — Ativo
                </span>
              </div>
            </div>

            {/* Local e Data de Entrega - mesma linha */}
            <div className="bg-[#F5F5F5] rounded-lg px-4 py-3 mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <span className="text-[#666] text-sm font-semibold">Local de Entrega: </span>
                  <span className="text-[#666] text-sm">Mercado Central</span>
                </div>
                <div>
                  <span className="text-[#666] text-sm font-semibold">Data e Hora da Entrega: </span>
                  <span className="text-[#666] text-sm">15/11/2025 às 14:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo - Duas Colunas */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coluna Esquerda - Alimentos da Cesta */}
            <div className="bg-[#E8F5E9] rounded-[10px] p-4">
              <h4 className="text-[#2C3E50] text-base font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Alimentos da Cesta:
              </h4>
              <ul className="space-y-2 text-[#333] text-sm mb-4">
                <li>- Tomate (3 kg) — Fornecedor(a): Sítio Bela Vista</li>
                <li>- Alface (5 unidades) — Fornecedor(a): Orgânicos da Serra</li>
                <li>- Cenoura (2 kg) — Fornecedor(a): Fazenda São José</li>
              </ul>
              <div className="pt-3 border-t border-[#126B3F]/20">
                <p className="text-[#2C3E50] text-base font-bold">Valor Total Cesta: {formatBRL(48.50)}</p>
              </div>
            </div>

            {/* Coluna Direita - Compras em Varejo */}
            <div className="bg-white border border-[#E0E0E0] rounded-[10px] p-4">
              <h4 className="text-[#2C3E50] text-base font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Compras em Varejo:
              </h4>
              <ul className="space-y-2 text-[#333] text-sm mb-4">
                <li>- Banana Nanica (1,5 kg) — Fornecedor(a): Sítio Boa Esperança</li>
                <li>- Mel Orgânico (300 g) — Fornecedor(a): Apiário Flor do Campo</li>
              </ul>
              <div className="pt-3 border-t border-[#E0E0E0]">
                <p className="text-[#2C3E50] text-base font-bold">Valor Total: {formatBRL(32.50)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gestão desse Ciclo */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Gestão desse Ciclo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoes.slice(0, 2).map((acao, idx) => (
              <Card
                key={idx}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  !acao.habilitado ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => acao.habilitado && navigate(acao.rota)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <acao.icone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {acao.titulo}
                        </h3>
                        {acao.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {acao.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {acao.descricao}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ações Administrativas */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Ações Administrativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoes.slice(2).map((acao, idx) => (
              <Card
                key={idx}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  !acao.habilitado ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => acao.habilitado && navigate(acao.rota)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <acao.icone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {acao.titulo}
                        </h3>
                        {acao.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {acao.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {acao.descricao}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Dashboard;