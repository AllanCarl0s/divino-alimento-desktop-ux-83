import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { 
  ArrowLeft,
  ShoppingBag,
  Truck,
  Wallet,
  UserCircle,
  Calendar,
  Package,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data - in real app would come from API/context
const mockFornecedorData = {
  proximaEntrega: '15/11/2025 18:25',
  itensAEntregar: 12,
  valorEstimado: 1850.50,
  pagamentosPendentes: 3,
  ciclos: [
    {
      id: 'c_nov_1',
      nome: '1º Ciclo de Novembro 2025',
      status: 'Ativo',
      periodoOferta: { inicio: '31/10/2025', fim: '03/11/2025' },
      dataEntrega: '15/11/2025 18:25',
      localEntrega: 'Mercado Central',
      dentroJanelaOferta: true
    },
    {
      id: 'c_out_2',
      nome: '2º Ciclo de Outubro 2025',
      status: 'Finalizado',
      periodoOferta: { inicio: '20/10/2025', fim: '23/10/2025' },
      dataEntrega: '30/10/2025 14:00',
      localEntrega: 'Feira Livre',
      dentroJanelaOferta: false
    }
  ]
};

const LojaProdutor = () => {
  const navigate = useNavigate();
  const { proximaEntrega, itensAEntregar, valorEstimado, pagamentosPendentes, ciclos } = mockFornecedorData;

  const kpis = [
    { 
      label: 'Próxima Entrega', 
      value: proximaEntrega || '—', 
      icon: Calendar,
      color: 'text-blue-600'
    },
    { 
      label: 'Itens a Entregar', 
      value: itensAEntregar.toString(), 
      icon: Package,
      color: 'text-green-600'
    },
    { 
      label: 'Valor Estimado', 
      value: `R$ ${valorEstimado.toFixed(2).replace('.', ',')}`, 
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    { 
      label: 'Pagamentos Pendentes', 
      value: pagamentosPendentes.toString(), 
      icon: Wallet,
      color: 'text-orange-600'
    }
  ];

  const acoes = [
    {
      title: 'Ofertar Produtos',
      description: 'Publique/edite seus produtos nos ciclos ativos, dentro do período de oferta.',
      icon: ShoppingBag,
      route: ciclos.find(c => c.dentroJanelaOferta) ? `/oferta/${ciclos.find(c => c.dentroJanelaOferta)?.id}` : '/oferta/1',
      enabled: ciclos.some(c => c.dentroJanelaOferta),
      badge: ciclos.some(c => c.dentroJanelaOferta) ? null : 'Fora do período',
      cicloAtivo: ciclos.find(c => c.dentroJanelaOferta)
    },
    {
      title: 'Relatório de Entregas',
      description: 'Veja o que entregar por ciclo (produtos, quantidades, local e horário).',
      icon: Truck,
      route: `/fornecedor/entregas/${ciclos[0]?.id || '1'}`,
      enabled: true,
      badge: null
    },
    {
      title: 'Meus Pagamentos',
      description: 'Acompanhe registros a receber e pagos.',
      icon: Wallet,
      route: '/fornecedor/pagamentos',
      enabled: true,
      badge: null
    },
    {
      title: 'Dados Pessoais',
      description: 'Atualize seus dados de perfil e contato.',
      icon: UserCircle,
      route: '/usuario/1',
      enabled: true,
      badge: null
    }
  ];

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="container max-w-7xl mx-auto py-6 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">
              Painel do Fornecedor
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie suas ofertas, entregas e pagamentos
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
            Fornecedor Ativo
          </Badge>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                    <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoes.map((acao, index) => (
              <Card 
                key={index}
                className={`shadow-sm transition-all duration-200 ${
                  acao.enabled 
                    ? 'hover:shadow-md cursor-pointer hover:scale-[1.02]' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => acao.enabled && navigate(acao.route)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${acao.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                        <acao.icon className={`w-6 h-6 ${acao.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{acao.title}</CardTitle>
                        {acao.badge && (
                          <Badge variant="secondary" className="mt-1">
                            {acao.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{acao.description}</CardDescription>
                  {acao.cicloAtivo && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {acao.cicloAtivo.nome}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Oferta: {acao.cicloAtivo.periodoOferta.inicio} - {acao.cicloAtivo.periodoOferta.fim}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Meus Ciclos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Meus Ciclos
          </h2>
          {ciclos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    Nenhum ciclo encontrado
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Volte mais tarde ou complete seu cadastro.
                  </p>
                </div>
                <Button onClick={() => navigate('/dados-pessoais')}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Ir para Dados Pessoais
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ciclos.map((ciclo) => (
                <Card key={ciclo.id} className="shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{ciclo.nome}</h3>
                          <Badge variant={ciclo.status === 'Ativo' ? 'default' : 'secondary'}>
                            {ciclo.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            Período: {ciclo.periodoOferta.inicio} - {ciclo.periodoOferta.fim}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Entrega: {ciclo.dataEntrega}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Local: {ciclo.localEntrega}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={ciclo.dentroJanelaOferta ? 'default' : 'outline'}
                          disabled={!ciclo.dentroJanelaOferta}
                          onClick={() => navigate(`/oferta/${ciclo.id}`)}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Ofertar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/fornecedor/entregas/${ciclo.id}`)}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Ver Entregas
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default LojaProdutor;
