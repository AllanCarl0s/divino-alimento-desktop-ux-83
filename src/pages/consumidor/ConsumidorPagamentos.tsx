import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Eye } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { useIsMobile } from '@/hooks/use-mobile';

interface Pagamento {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  status: 'A Pagar' | 'Pago';
}

export default function ConsumidorPagamentos() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<string>('recente');

  // Mock data - in production this would come from API filtered by current user
  const pagamentos: Pagamento[] = [
    {
      id: '1',
      data: '15/11/2025',
      descricao: 'Ciclo Novembro - 1ª Quinzena',
      valor: 156.50,
      status: 'A Pagar'
    },
    {
      id: '2',
      data: '01/11/2025',
      descricao: 'Ciclo Outubro - 2ª Quinzena',
      valor: 142.00,
      status: 'Pago'
    },
    {
      id: '3',
      data: '15/10/2025',
      descricao: 'Ciclo Outubro - 1ª Quinzena',
      valor: 168.30,
      status: 'Pago'
    },
    {
      id: '4',
      data: '01/10/2025',
      descricao: 'Ciclo Setembro - 2ª Quinzena',
      valor: 135.80,
      status: 'Pago'
    }
  ];

  const filteredPagamentos = pagamentos
    .filter(p => 
      (statusFilter === 'todos' || p.status === statusFilter) &&
      (p.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'recente') {
        return new Date(b.data.split('/').reverse().join('-')).getTime() - 
               new Date(a.data.split('/').reverse().join('-')).getTime();
      } else {
        return new Date(a.data.split('/').reverse().join('-')).getTime() - 
               new Date(b.data.split('/').reverse().join('-')).getTime();
      }
    });

  const aReceber = pagamentos.filter(p => p.status === 'A Pagar').reduce((acc, p) => acc + p.valor, 0);
  const pagos = pagamentos.filter(p => p.status === 'Pago').reduce((acc, p) => acc + p.valor, 0);
  const total = aReceber + pagos;

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
            Consumidor - Meus Pagamentos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Acompanhe seus pagamentos (em aberto e quitados)
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-warning/30">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">A Pagar</p>
              <p className="text-2xl md:text-3xl font-bold text-warning">
                {formatBRL(aReceber)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-success/30">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Pagos</p>
              <p className="text-2xl md:text-3xl font-bold text-success">
                {formatBRL(pagos)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/30">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Movimentado</p>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {formatBRL(total)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="A Pagar">A Pagar</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recente">Mais recente</SelectItem>
              <SelectItem value="antigo">Mais antigo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table / Cards */}
        {isMobile ? (
          <div className="space-y-3">
            {filteredPagamentos.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhum pagamento encontrado.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPagamentos.map((pagamento) => (
                <Card key={pagamento.id} className="border border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Data:</span> {pagamento.data}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Descrição:</span> {pagamento.descricao}
                      </p>
                      <p className="text-base font-semibold text-primary">
                        <span className="font-medium text-sm text-muted-foreground">Valor:</span> {formatBRL(pagamento.valor)}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <Badge 
                          className={
                            pagamento.status === 'Pago' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-[hsl(var(--warning))] text-white'
                          }
                        >
                          {pagamento.status}
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
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagamentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum pagamento encontrado.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPagamentos.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell className="font-medium">{pagamento.data}</TableCell>
                      <TableCell>{pagamento.descricao}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatBRL(pagamento.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={pagamento.status === 'Pago' ? 'default' : 'secondary'}
                          className={pagamento.status === 'Pago' ? 'bg-success' : 'bg-warning'}
                        >
                          {pagamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
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
