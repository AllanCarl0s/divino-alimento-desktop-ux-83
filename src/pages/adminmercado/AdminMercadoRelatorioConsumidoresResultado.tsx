import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Download, FileText, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { RoleTitle } from '@/components/layout/RoleTitle';

interface PedidoConsumidor {
  id: string;
  consumidor: string;
  alimento: string;
  fornecedor: string;
  medida: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
  ciclo: string;
  agricultura_familiar: boolean;
  certificacao: 'organico' | 'transicao' | 'convencional';
}

export default function AdminMercadoRelatorioConsumidoresResultado() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ciclosIds = searchParams.get('ciclos')?.split(',') || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'fornecedor' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] = useState<string>('todos');
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>('todos');

  // Mock data
  const pedidos: PedidoConsumidor[] = [
    {
      id: '1',
      consumidor: 'Maria Silva',
      alimento: 'Tomate',
      fornecedor: 'Sítio Verde',
      medida: 'kg',
      valor_unitario: 5.50,
      quantidade: 3,
      total: 16.50,
      ciclo: '1º Ciclo de Outubro',
      agricultura_familiar: true,
      certificacao: 'organico'
    },
    {
      id: '2',
      consumidor: 'João Santos',
      alimento: 'Alface',
      fornecedor: 'Maria Horta',
      medida: 'unidade',
      valor_unitario: 2.00,
      quantidade: 5,
      total: 10.00,
      ciclo: '1º Ciclo de Outubro',
      agricultura_familiar: true,
      certificacao: 'transicao'
    }
  ];

  const filteredPedidos = pedidos
    .filter(pedido => {
      const matchSearch = pedido.consumidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchAgriculturaFamiliar = filtroAgriculturaFamiliar === 'todos' ||
        (filtroAgriculturaFamiliar === 'sim' && pedido.agricultura_familiar) ||
        (filtroAgriculturaFamiliar === 'nao' && !pedido.agricultura_familiar);
      
      const matchCertificacao = filtroCertificacao === 'todos' ||
        pedido.certificacao === filtroCertificacao;
      
      return matchSearch && matchAgriculturaFamiliar && matchCertificacao;
    })
    .sort((a, b) => {
      if (sortBy === 'fornecedor') {
        const compareResult = a.fornecedor.localeCompare(b.fornecedor);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      }
      return 0;
    });

  const totalConsumidores = new Set(filteredPedidos.map(p => p.consumidor)).size;
  const totalKg = filteredPedidos.filter(p => p.medida === 'kg').reduce((acc, p) => acc + p.quantidade, 0);
  const valorTotalGeral = filteredPedidos.reduce((acc, p) => acc + p.total, 0);

  const handleExportCSV = async () => {
    try {
      const ciclosData = ciclosIds.map((id) => ({ id: parseInt(id), nome: `Ciclo ${id}` }));
      const { exportConsumidoresCSV } = await import('@/utils/export');
      exportConsumidoresCSV(filteredPedidos, ciclosData);
      toast.success('Download do CSV concluído');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosData = ciclosIds.map((id) => ({ id: parseInt(id), nome: `Ciclo ${id}` }));
      const resumo = { totalConsumidores, totalKg, valorTotal: valorTotalGeral };
      const { exportConsumidoresPDF } = await import('@/utils/export');
      exportConsumidoresPDF(filteredPedidos, ciclosData, resumo);
      toast.success('Download do PDF concluído');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
    }
  };

  const handleSortByFornecedor = () => {
    if (sortBy === 'fornecedor') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('fornecedor');
      setSortOrder('asc');
    }
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/adminmercado/relatorios/consumidores-ciclo', { replace: true })} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <RoleTitle page="Relatório de Pedidos dos Consumidores" className="text-3xl" />
          <p className="text-muted-foreground mt-2">
            Consulte e exporte os pedidos consolidados dos ciclos selecionados
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Resumo Consolidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Consumidores</p>
                <p className="text-2xl font-bold">{totalConsumidores}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Kg de Alimento</p>
                <p className="text-2xl font-bold">{totalKg.toFixed(2).replace('.', ',')} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Comercializado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {valorTotalGeral.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por consumidor, alimento, fornecedor ou ciclo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Agricultura Familiar</label>
              <Select value={filtroAgriculturaFamiliar} onValueChange={setFiltroAgriculturaFamiliar}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Certificação</label>
              <Select value={filtroCertificacao} onValueChange={setFiltroCertificacao}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="organico">Orgânico</SelectItem>
                  <SelectItem value="transicao">Transição</SelectItem>
                  <SelectItem value="convencional">Convencional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciclo</TableHead>
                <TableHead>Consumidor(a)</TableHead>
                <TableHead>Alimento</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handleSortByFornecedor}
                >
                  <div className="flex items-center gap-2">
                    Fornecedor(a)
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'fornecedor' && (
                      <span className="text-xs text-muted-foreground">
                        ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Medida</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Total</TableHead>
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
                    <TableCell className="font-medium">{pedido.ciclo}</TableCell>
                    <TableCell>{pedido.consumidor}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>{pedido.alimento}</span>
                        <div className="flex gap-1">
                          {pedido.agricultura_familiar && (
                            <Badge variant="secondary" className="text-xs">
                              Agricultura Familiar
                            </Badge>
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              pedido.certificacao === 'organico' ? 'border-green-600 text-green-600' :
                              pedido.certificacao === 'transicao' ? 'border-yellow-600 text-yellow-600' :
                              'border-gray-400 text-gray-600'
                            }`}
                          >
                            {pedido.certificacao === 'organico' ? 'Orgânico' :
                             pedido.certificacao === 'transicao' ? 'Transição' :
                             'Convencional'}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pedido.fornecedor}</TableCell>
                    <TableCell>{pedido.medida}</TableCell>
                    <TableCell className="text-right">
                      R$ {pedido.valor_unitario.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="text-right">{pedido.quantidade}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      R$ {pedido.total.toFixed(2).replace('.', ',')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate('/adminmercado/relatorios/consumidores-ciclo')}
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
