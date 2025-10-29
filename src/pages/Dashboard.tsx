import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { ShoppingCart, FileText, Wallet, UserCircle, ChevronRight, ArrowLeft, ShoppingBasket, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';
import { Button } from '@/components/ui/button';
import { formatBRL } from '@/utils/currency';


const Dashboard = () => {
  const navigate = useNavigate();
  const { currentCycle } = useCycle();

  const acoes = [
    {
      titulo: 'Minha Cesta',
      descricao: 'Ver itens da sua cesta no ciclo atual',
      icone: ShoppingBasket,
      rota: '/minhaCesta/1',
      habilitado: true
    },
    {
      titulo: 'Pedido em Varejo',
      descricao: 'Comprar produtos da feira direta',
      icone: ShoppingCart,
      rota: '/pedidoConsumidores/1',
      habilitado: true
    },
    {
      titulo: 'Relatório de Recebimentos',
      descricao: 'Veja o que você irá receber por ciclo (data/hora e local)',
      icone: FileText,
      rota: '/consumidor/relatorio/1',
      habilitado: true
    },
    {
      titulo: 'Meus Pagamentos',
      descricao: 'Acompanhe seus pagamentos (em aberto e quitados)',
      icone: Wallet,
      rota: '/consumidor/pagamentos',
      habilitado: true,
      badge: 'Pendente'
    },
    {
      titulo: 'Dados Pessoais',
      descricao: 'Atualize seu perfil e contato',
      icone: UserCircle,
      rota: '/usuario/1',
      habilitado: true
    }
  ];

  return (
    <ResponsiveLayout
      headerContent={
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Bem-vindo e bem-vinda à plataforma do Divino Alimento
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gerencie suas cestas e pedidos
          </p>
        </div>

        {/* Resumo do Ciclo Atual - Clean Layout */}
        <div className="mb-8 bg-white rounded-[14px] shadow-[0px_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Linha superior verde fina */}
          <div className="h-1 bg-[#126B3F]" />
          
          {/* Cabeçalho */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-center text-[#126B3F] text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Resumo do Ciclo Atual
            </h3>
          </div>

          {/* Conteúdo - Duas Colunas */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              {/* Bloco 1: Identificação do Ciclo */}
              <div className="bg-[#EAF7EF] rounded-[10px] px-4 py-2 inline-block">
                <span className="text-[#126B3F] text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  1º Ciclo de Novembro 2025 — Ativo
                </span>
              </div>

              {/* Bloco 2: Local e Data de Entrega */}
              <div className="space-y-3">
                <div>
                  <p className="text-[#555] text-sm font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Local de Entrega
                  </p>
                  <p className="text-[#333] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Mercado Central
                  </p>
                </div>
                <div>
                  <p className="text-[#555] text-sm font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Data e Hora da Entrega
                  </p>
                  <p className="text-[#333] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    15/11/2025 às 14:00
                  </p>
                </div>
              </div>

              {/* Bloco 3: Produtos da Cesta e Compras em Varejo */}
              <div className="bg-[#F5FAF6] rounded-[10px] p-4 space-y-4 mt-5">
                <div>
                  <p className="text-[#222] text-base font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Produtos da Cesta
                  </p>
                  <ul className="space-y-2 text-[#333] text-sm">
                    <li>- Tomate (3 kg) — Fornecedor: Sítio Bela Vista</li>
                    <li>- Alface (5 unidades) — Fornecedor: Orgânicos da Serra</li>
                    <li>- Cenoura (2 kg) — Fornecedor: Fazenda São José</li>
                  </ul>
                  <button 
                    onClick={() => navigate('/minhaCesta/1')}
                    className="text-[#126B3F] text-sm font-semibold mt-3 hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                <div>
                  <p className="text-[#222] text-base font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Compras em Varejo
                  </p>
                  <ul className="space-y-2 text-[#333] text-sm">
                    <li>- Banana Nanica (1,5 kg) — Fornecedor: Sítio Boa Esperança</li>
                    <li>- Mel Orgânico (300 g) — Fornecedor: Apiário Flor do Campo</li>
                  </ul>
                  <button 
                    onClick={() => navigate('/pedidoConsumidores/1')}
                    className="text-[#126B3F] text-sm font-semibold mt-3 hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="pt-3 border-t border-[#126B3F]/20">
                  <p className="text-[#126B3F] text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {formatBRL(48.50 + 32.50)}
                  </p>
                  <p className="text-[#555] text-xs font-medium">Valor Total Devido</p>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Resumo de Valores */}
            <div className="bg-[#F5FAF6] rounded-[10px] p-4 border-l-4 border-[#126B3F] h-fit space-y-4">
              {/* Valor Cesta */}
              <div>
                <p className="text-[#555] text-xs font-medium mb-1">Valor Total Cesta</p>
                <p className="text-[#126B3F] text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {formatBRL(48.50)}
                </p>
              </div>

              {/* Valor Varejo */}
              <div className="pb-4 border-b border-[#126B3F]/20">
                <p className="text-[#555] text-xs font-medium mb-1">Valor Total Varejo</p>
                <p className="text-[#126B3F] text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {formatBRL(32.50)}
                </p>
              </div>

              {/* Total Geral */}
              <div>
                <p className="text-[#555] text-sm font-semibold mb-1">Valor Total do Ciclo</p>
                <p className="text-[#126B3F] text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {formatBRL(48.50 + 32.50)}
                </p>
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