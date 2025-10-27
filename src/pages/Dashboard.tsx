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

        {/* Resumo do Ciclo Atual */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Resumo do Ciclo Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ciclo</p>
                <p className="font-semibold">1º Ciclo de Novembro 2025</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data e Hora de Entrega</p>
                <p className="font-semibold">15/11/2025 às 14:00</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local de Entrega</p>
              <p className="font-semibold">Mercado Central</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Produtos da Cesta</p>
              <div className="space-y-1 text-sm">
                <p>• Tomate (3 kg)</p>
                <p>• Alface (5 unidades)</p>
                <p>• Cenoura (2 kg)</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate('/minhaCesta/1')}
                >
                  Ver todos
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Compras em Varejo</p>
              <div className="space-y-1 text-sm">
                <p>• Rúcula (4 maços)</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate('/pedidoConsumidores/1')}
                >
                  Ver todos
                </Button>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">Valor Total Devido</p>
                <p className="text-xl font-bold text-success">{formatBRL(48.50)}</p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => navigate('/minhaCesta/1')}
              >
                Visualizar Detalhes da Cesta
              </Button>
            </div>
          </CardContent>
        </Card>

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