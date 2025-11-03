import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Wallet, DollarSign, CheckCircle, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatBRL } from '@/utils/currency';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data
const mockPagamentos = [
  {
    id: '1',
    data: '15/11/2025',
    descricao: 'Tomate Orgânico - 1º Ciclo Nov',
    valor: 225.00,
    status: 'A receber',
    ciclo: '1º Ciclo de Novembro 2025'
  },
  {
    id: '2',
    data: '15/11/2025',
    descricao: 'Alface Hidropônica - 1º Ciclo Nov',
    valor: 84.00,
    status: 'A receber',
    ciclo: '1º Ciclo de Novembro 2025'
  },
  {
    id: '3',
    data: '30/10/2025',
    descricao: 'Pepino Japonês - 2º Ciclo Out',
    valor: 152.00,
    status: 'Pago',
    ciclo: '2º Ciclo de Outubro 2025'
  },
  {
    id: '4',
    data: '30/10/2025',
    descricao: 'Rúcula Orgânica - 2º Ciclo Out',
    valor: 60.00,
    status: 'Pago',
    ciclo: '2º Ciclo de Outubro 2025'
  },
  {
    id: '5',
    data: '22/10/2025',
    descricao: 'Cenoura Baby - 1º Ciclo Out',
    valor: 175.00,
    status: 'Pago',
    ciclo: '1º Ciclo de Outubro 2025'
  }
];

const FornecedorPagamentos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('data');

  // Calcular totais
  const totalAReceber = mockPagamentos
    .filter(p => p.status === 'A receber')
    .reduce((sum, p) => sum + p.valor, 0);
  
  const totalPago = mockPagamentos
    .filter(p => p.status === 'Pago')
    .reduce((sum, p) => sum + p.valor, 0);
  
  const totalMovimentado = totalAReceber + totalPago;
  const qtdPendentes = mockPagamentos.filter(p => p.status === 'A receber').length;
  const qtdPagos = mockPagamentos.filter(p => p.status === 'Pago').length;

  // Filtrar e ordenar pagamentos
  const pagamentosFiltrados = mockPagamentos
    .filter(p => {
      const matchBusca = p.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                        p.ciclo.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || p.status === filtroStatus;
      return matchBusca && matchStatus;
    })
    .sort((a, b) => {
      if (ordenacao === 'data') {
        return b.data.localeCompare(a.data);
      } else if (ordenacao === 'valor') {
        return b.valor - a.valor;
      } else if (ordenacao === 'descricao') {
        return a.descricao.localeCompare(b.descricao);
      }
      return 0;
    });

  return (
    <ResponsiveLayout 
      headerContent={<UserMenuLarge />}
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/fornecedor/loja')}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            Fornecedor - Meus Pagamentos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe registros a receber e pagos
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">A Receber</p>
                  <p className="text-2xl font-bold text-orange-600">{formatBRL(totalAReceber)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{qtdPendentes} pagamentos</p>
                </div>
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pagos</p>
                  <p className="text-2xl font-bold text-green-600">{formatBRL(totalPago)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{qtdPagos} pagamentos</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Movimentado</p>
                  <p className="text-2xl font-bold text-primary">{formatBRL(totalMovimentado)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mockPagamentos.length} registros</p>
                </div>
                <DollarSign className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros e Ordenação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição ou ciclo..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="A receber">Pendentes</SelectItem>
                  <SelectItem value="Pago">Pagos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ordenacao} onValueChange={setOrdenacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="valor">Valor</SelectItem>
                  <SelectItem value="descricao">Descrição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Registros de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <div>
                {pagamentosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum pagamento encontrado
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pagamentosFiltrados.map((pagamento) => (
                      <div
                        key={pagamento.id}
                        className="bg-white border border-border rounded-xl p-4 space-y-2"
                      >
                        <div className="text-sm text-foreground">
                          <span className="text-muted-foreground">Data:</span> {pagamento.data}
                        </div>
                        <div className="text-sm text-foreground">
                          <span className="text-muted-foreground">Descrição:</span> {pagamento.descricao}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pagamento.ciclo}
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          <span className="text-muted-foreground font-normal">Valor:</span> {formatBRL(pagamento.valor)}
                        </div>
                        <div className="flex justify-start pt-2">
                          <Badge 
                            variant={pagamento.status === 'Pago' ? 'default' : 'secondary'}
                            className={
                              pagamento.status === 'Pago' 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }
                          >
                            {pagamento.status === 'Pago' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {pagamento.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descrição</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Valor</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagamentosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhum pagamento encontrado
                        </td>
                      </tr>
                    ) : (
                      pagamentosFiltrados.map((pagamento) => (
                        <tr key={pagamento.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-sm">{pagamento.data}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{pagamento.descricao}</p>
                              <p className="text-xs text-muted-foreground">{pagamento.ciclo}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold">
                            {formatBRL(pagamento.valor)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge 
                              variant={pagamento.status === 'Pago' ? 'default' : 'secondary'}
                              className={
                                pagamento.status === 'Pago' 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              }
                            >
                              {pagamento.status === 'Pago' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {pagamento.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => navigate('/fornecedor/loja')}>
            Voltar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default FornecedorPagamentos;
