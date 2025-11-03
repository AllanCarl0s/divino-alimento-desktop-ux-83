import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatBRL } from '@/utils/currency';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { useIsMobile } from '@/hooks/use-mobile';

interface PedidoItem {
  id: string;
  produto: string;
  medida: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
  data_recebimento: string;
  hora_recebimento: string;
  local_recebimento: string;
  status_pagamento: 'Pago' | 'Pendente' | 'Não recebido';
  ciclo: string;
}

export default function ConsumidorRelatorio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Mock data - in production this would come from API filtered by current user
  const pedidos: PedidoItem[] = [
    {
      id: '1',
      produto: 'Tomate',
      medida: 'kg',
      valor_unitario: 5.50,
      quantidade: 3,
      total: 16.50,
      data_recebimento: '15/11/2025',
      hora_recebimento: '14:00',
      local_recebimento: 'Mercado Central',
      status_pagamento: 'Pendente',
      ciclo: '1º Ciclo de Novembro 2025'
    },
    {
      id: '2',
      produto: 'Alface',
      medida: 'unidade',
      valor_unitario: 2.00,
      quantidade: 5,
      total: 10.00,
      data_recebimento: '15/11/2025',
      hora_recebimento: '14:00',
      local_recebimento: 'Mercado Central',
      status_pagamento: 'Pago',
      ciclo: '1º Ciclo de Novembro 2025'
    },
    {
      id: '3',
      produto: 'Cenoura',
      medida: 'kg',
      valor_unitario: 4.00,
      quantidade: 2,
      total: 8.00,
      data_recebimento: '08/11/2025',
      hora_recebimento: '14:00',
      local_recebimento: 'Mercado Central',
      status_pagamento: 'Pago',
      ciclo: '4º Ciclo de Outubro 2025'
    },
    {
      id: '4',
      produto: 'Rúcula',
      medida: 'maço',
      valor_unitario: 3.50,
      quantidade: 4,
      total: 14.00,
      data_recebimento: '08/11/2025',
      hora_recebimento: '14:00',
      local_recebimento: 'Mercado Central',
      status_pagamento: 'Pendente',
      ciclo: '4º Ciclo de Outubro 2025'
    }
  ];

  const filteredPedidos = pedidos
    .filter(pedido => pedido.produto.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(pedido => statusFilter === 'todos' || pedido.status_pagamento === statusFilter)
    .sort((a, b) => {
      // Pendentes primeiro
      if (a.status_pagamento === 'Pendente' && b.status_pagamento !== 'Pendente') return -1;
      if (a.status_pagamento !== 'Pendente' && b.status_pagamento === 'Pendente') return 1;
      return 0;
    });

  const totalQuantidade = filteredPedidos.reduce((acc, p) => acc + p.quantidade, 0);
  const valorTotalGeral = filteredPedidos.reduce((acc, p) => acc + p.total, 0);

  const handleExportCSV = () => {
    toast({
      title: "Exportação iniciada",
      description: "O relatório CSV está sendo gerado..."
    });
    // In production: generate and download CSV
  };

  const handleExportPDF = () => {
    toast({
      title: "Exportação iniciada",
      description: "O relatório PDF está sendo gerado..."
    });
    // In production: generate and download PDF
  };

  return (
    <ResponsiveLayout 
      headerContent={<UserMenuLarge />}
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Consumidor - Relatório Financeiro do Consumidor
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Acompanhe seus pedidos, valores e status de pagamento por ciclo
          </p>
        </div>

        {/* Resumo Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Resumo do Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quantidade de Pedidos</p>
                <p className="text-2xl font-bold text-primary">{filteredPedidos.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantidade Total de Itens</p>
                <p className="text-2xl font-bold text-primary">{totalQuantidade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Consolidado</p>
                <p className="text-2xl font-bold text-success">
                  {formatBRL(valorTotalGeral)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status Geral do Pagamento</p>
                <Badge variant={filteredPedidos.some(p => p.status_pagamento === 'Pendente') ? 'secondary' : 'default'} className="mt-1">
                  {filteredPedidos.some(p => p.status_pagamento === 'Pendente') ? 'Pagamentos Pendentes' : 'Tudo Pago'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os ciclos</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Não recebido">Não recebido</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrar por produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Table / Cards */}
        {isMobile ? (
          <div className="space-y-3">
            {filteredPedidos.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum pedido registrado.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPedidos.map((pedido) => (
                <Card key={pedido.id} className="border border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Ciclo:</span> {pedido.ciclo}
                      </p>
                      <p className="text-base font-bold text-primary">
                        <span className="font-medium text-sm text-muted-foreground">Produto:</span> {pedido.produto}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Medida:</span> {pedido.medida}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Quantidade:</span> {pedido.quantidade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Valor Unitário:</span> {formatBRL(pedido.valor_unitario)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        <span className="font-medium text-muted-foreground">Valor Total:</span> {formatBRL(pedido.total)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Local:</span> {pedido.local_recebimento}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <Badge 
                          className={
                            pedido.status_pagamento === 'Pago' 
                              ? 'bg-primary text-primary-foreground' 
                              : pedido.status_pagamento === 'Pendente' 
                              ? 'bg-[hsl(var(--warning))] text-white' 
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {pedido.status_pagamento}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Medida</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum pedido registrado.'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPedidos.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium text-sm">{pedido.ciclo}</TableCell>
                      <TableCell className="font-medium">{pedido.produto}</TableCell>
                      <TableCell>{pedido.medida}</TableCell>
                      <TableCell className="text-right">
                        {formatBRL(pedido.valor_unitario)}
                      </TableCell>
                      <TableCell className="text-right">{pedido.quantidade}</TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        {formatBRL(pedido.total)}
                      </TableCell>
                      <TableCell className="text-sm">{pedido.local_recebimento}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            pedido.status_pagamento === 'Pago' ? 'default' : 
                            pedido.status_pagamento === 'Pendente' ? 'secondary' : 
                            'destructive'
                          }
                          className={
                            pedido.status_pagamento === 'Pago' ? 'bg-green-500' : 
                            pedido.status_pagamento === 'Pendente' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }
                        >
                          {pedido.status_pagamento}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Footer Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
