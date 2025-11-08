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
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';

// Mock data - in real app would come from API/context
const mockFornecedorData = {
  nomeFornecedor: 'Sítio Bela Vista',
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
  const { nomeFornecedor, ciclos } = mockFornecedorData;

  const acoesLoja = [
    {
      title: 'Ofertar Alimento',
      description: 'Publique e edite seus alimentos nos ciclos ativos, dentro do período de oferta.',
      icon: ShoppingBag,
      route: '/fornecedor/selecionar-ciclo',
      enabled: true
    },
    {
      title: 'Relatório de Entregas',
      description: 'Veja os pedidos e locais de entrega dos produtos desse ciclo.',
      icon: Truck,
      route: `/fornecedor/entregas/${ciclos[0]?.id || '1'}`,
      enabled: true
    }
  ];

  const acoesAdministracao = [
    {
      title: 'Pedidos e Gestão de Pagamentos',
      description: 'Acompanhe pedidos recebidos e controle os pagamentos efetuados e pendentes.',
      icon: Wallet,
      route: '/fornecedor/pagamentos',
      enabled: true
    },
    {
      title: 'Dados Pessoais',
      description: 'Atualize suas informações de perfil e contato.',
      icon: UserCircle,
      route: '/usuario/1',
      enabled: true
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
      headerContent={
        <UserMenuLarge />
      }
    >
      <div className="container max-w-7xl mx-auto py-6 px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Fornecedor - Painel fornecedor @
          </h1>
        </div>

        {/* Loja */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Loja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoesLoja.map((acao, index) => (
              <Card 
                key={index}
                className="shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]"
                onClick={() => navigate(acao.route)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <acao.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{acao.title}</CardTitle>
                      <CardDescription className="mt-2">{acao.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Administração */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Administração
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoesAdministracao.map((acao, index) => (
              <Card 
                key={index}
                className="shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]"
                onClick={() => navigate(acao.route)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <acao.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{acao.title}</CardTitle>
                      <CardDescription className="mt-2">{acao.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default LojaProdutor;
