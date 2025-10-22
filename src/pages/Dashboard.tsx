import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { ShoppingCart, FileText, Wallet, UserCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConsumer } from '@/contexts/ConsumerContext';
import { useCycle } from '@/hooks/useCycle';
import { Button } from '@/components/ui/button';


const Dashboard = () => {
  const navigate = useNavigate();
  const { currentCycle } = useCycle();

  // Mock data - in production this would come from API
  const kpis = [
    { label: 'Cestas do ciclo', value: '4', color: 'text-primary' },
    { label: 'Total extras', value: 'R$ 156', color: 'text-accent' },
    { label: 'Produtos favoritos', value: '12', color: 'text-secondary' },
    { label: 'Satisfação', value: '85%', color: 'text-warning' }
  ];

  const acoes = [
    {
      titulo: 'Pedido Consumidores',
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

  // Mock cycles data - in production this would come from API
  const ciclos = [
    {
      id: 1,
      nome: '1º Ciclo de Novembro 2025',
      status: 'Ativo',
      janela_compra: { inicio: '01/11/2025', fim: '05/11/2025', ativo: true },
      entrega: { data: '15/11/2025', hora: '14:00', local: 'Mercado Central' }
    },
    {
      id: 2,
      nome: '2º Ciclo de Novembro 2025',
      status: 'Finalizado',
      janela_compra: { inicio: '08/11/2025', fim: '12/11/2025', ativo: false },
      entrega: { data: '22/11/2025', hora: '14:00', local: 'Feira Livre' }
    }
  ];

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Bem-vindo de volta!
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gerencie suas cestas e pedidos
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl md:text-3xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {kpi.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoes.map((acao, idx) => (
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

        {/* Meus Ciclos */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Meus Ciclos
          </h2>
          {ciclos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum ciclo encontrado no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ciclos.map((ciclo) => (
                <Card key={ciclo.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {ciclo.nome}
                          </h3>
                          <Badge variant={ciclo.status === 'Ativo' ? 'default' : 'secondary'}>
                            {ciclo.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Janela de Compra:</span>
                            <Badge variant={ciclo.janela_compra.ativo ? 'default' : 'secondary'}>
                              {ciclo.janela_compra.ativo ? 'Ativo' : 'Encerrado'}
                            </Badge>
                            <span className="text-muted-foreground">
                              {ciclo.janela_compra.inicio} - {ciclo.janela_compra.fim}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Entrega:</span>
                            <span className="font-medium">
                              {ciclo.entrega.data} às {ciclo.entrega.hora} • {ciclo.entrega.local}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/pedidoConsumidores/${ciclo.id}`)}
                          disabled={!ciclo.janela_compra.ativo}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          Comprar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/consumidor/relatorio/${ciclo.id}`)}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          Ver Pedido
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Current Cycle Info */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg font-poppins text-gradient-primary">
              {currentCycle.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm md:text-base">
              <span className="text-muted-foreground">Período:</span>
              <span className="font-medium">
                {currentCycle.startDate.toLocaleDateString('pt-BR')} - {currentCycle.endDate.toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm md:text-base mt-2">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium">
                {currentCycle.type === 'semanal' ? 'Semanal (7 dias)' : 'Quinzenal (15 dias)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm md:text-base mt-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="default" className="bg-primary">
                {currentCycle.status === 'active' ? 'Ativo' : 
                 currentCycle.status === 'upcoming' ? 'Em breve' : 'Encerrado'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default Dashboard;