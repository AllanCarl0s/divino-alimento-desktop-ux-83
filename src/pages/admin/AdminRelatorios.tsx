import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  TrendingUp, 
  Package, 
  Store,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockVendas = [
  {
    id: 1,
    ciclo: 'Ciclo Janeiro 2024',
    itens: 15,
    valor: 5750.00,
    status: 'Concluído',
    data: '2024-01-31'
  },
  {
    id: 2,
    ciclo: 'PNAE Janeiro 2024',
    itens: 8,
    valor: 12500.00,
    status: 'Concluído',
    data: '2024-01-31'
  },
  {
    id: 3,
    ciclo: 'Ciclo Fevereiro 2024',
    itens: 18,
    valor: 6200.00,
    status: 'Em andamento',
    data: '2024-02-15'
  }
];

const mockQuantidades = [
  {
    produto: 'Tomate Orgânico',
    totalKg: 125,
    fornecedores: ['João Silva', 'Maria Santos'],
    ciclos: 3
  },
  {
    produto: 'Alface Hidropônica',
    totalKg: 280,
    fornecedores: ['Maria Santos', 'Carlos Oliveira'],
    ciclos: 2
  },
  {
    produto: 'Cenoura Baby',
    totalKg: 85,
    fornecedores: ['Carlos Oliveira'],
    ciclos: 3
  }
];

const mockMercados = [
  {
    mercado: 'Mercado Central',
    totalVendido: 8750.00,
    ticketMedio: 125.50,
    pedidos: 24
  },
  {
    mercado: 'Feira Livre',
    totalVendido: 5200.00,
    ticketMedio: 89.75,
    pedidos: 18
  },
  {
    mercado: 'PNAE - Secretaria Educação',
    totalVendido: 12500.00,
    ticketMedio: 650.00,
    pedidos: 4
  }
];

const AdminRelatorios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('vendas');
  const [periodoInicio, setPeriodoInicio] = useState('2024-01-01');
  const [periodoFim, setPeriodoFim] = useState('2024-12-31');

  const exportarCSV = (tipo: string) => {
    toast({
      title: "Arquivo gerado.",
      description: `Relatório de ${tipo} exportado com sucesso.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Concluído': { variant: 'default' as const, color: '' },
      'Em andamento': { variant: 'outline' as const, color: 'border-blue-400 text-blue-700' },
      'Cancelado': { variant: 'destructive' as const, color: '' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Em andamento'];
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color}`}>
        {status}
      </Badge>
    );
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            Analytics e relatórios gerenciais
          </p>
        </div>

        {/* Period Filter */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inicio" className="text-sm">Data início</Label>
                <Input
                  id="inicio"
                  type="date"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fim" className="text-sm">Data fim</Label>
                <Input
                  id="fim"
                  type="date"
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="quantidades">Quantidades</TabsTrigger>
            <TabsTrigger value="mercados">Mercados</TabsTrigger>
          </TabsList>

          <TabsContent value="vendas" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <div>
                      <p className="text-sm opacity-90">Total Vendas</p>
                      <p className="text-lg font-bold">
                        R$ {mockVendas.reduce((sum, v) => sum + v.valor, 0).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Médio</p>
                      <p className="text-lg font-bold text-accent">
                        R$ {(mockVendas.reduce((sum, v) => sum + v.valor, 0) / mockVendas.length).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendas Table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Vendas por Ciclo</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarCSV('vendas')}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Exportar CSV</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockVendas.map((venda) => (
                  <div key={venda.id} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">{venda.ciclo}</span>
                      </div>
                      {getStatusBadge(venda.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Itens:</span>
                        <p className="font-medium">{venda.itens}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-medium text-primary">R$ {venda.valor.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data:</span>
                        <p className="font-medium">{new Date(venda.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quantidades" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Consolidado por Produto</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarCSV('quantidades')}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Exportar CSV</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockQuantidades.map((item, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="font-medium">{item.produto}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total vendido:</span>
                        <p className="font-medium text-primary">{item.totalKg} kg</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ciclos:</span>
                        <p className="font-medium">{item.ciclos}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-muted-foreground text-sm">Fornecedores:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.fornecedores.map((fornecedor, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {fornecedor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mercados" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Desempenho por Mercado</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarCSV('mercados')}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Exportar CSV</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockMercados.map((mercado, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Store className="w-4 h-4 text-primary" />
                      <span className="font-medium">{mercado.mercado}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <p className="font-medium text-primary">R$ {mercado.totalVendido.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ticket médio:</span>
                        <p className="font-medium">R$ {mercado.ticketMedio.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pedidos:</span>
                        <p className="font-medium">{mercado.pedidos}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminRelatorios;