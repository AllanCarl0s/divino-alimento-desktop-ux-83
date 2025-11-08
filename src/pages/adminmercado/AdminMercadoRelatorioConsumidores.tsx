import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, Download, FileText, Eye, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

interface PedidoConsumidor {
  id: string;
  consumidor: string;
  produto: string;
  fornecedor: string;
  medida: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
  agricultura_familiar: boolean;
  certificacao: 'organico' | 'transicao' | 'convencional';
}

interface PedidoDetalhado extends PedidoConsumidor {
  endereco: string;
  telefone: string;
  data_pedido: string;
}

export default function AdminMercadoRelatorioConsumidores() {
  const navigate = useNavigate();
  const { cicloId } = useParams();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetalhado | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'fornecedor' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] = useState<string>('todos');
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>('todos');

  // Mock data - filtrado para consumidores do mercado do admin
  const pedidos: PedidoConsumidor[] = [
    {
      id: '1',
      consumidor: 'Maria Silva',
      produto: 'Tomate',
      fornecedor: 'Sítio Verde',
      medida: 'kg',
      valor_unitario: 5.50,
      quantidade: 3,
      total: 16.50,
      agricultura_familiar: true,
      certificacao: 'organico'
    },
    {
      id: '2',
      consumidor: 'Maria Silva',
      produto: 'Alface',
      fornecedor: 'Maria Horta',
      medida: 'unidade',
      valor_unitario: 2.00,
      quantidade: 5,
      total: 10.00,
      agricultura_familiar: true,
      certificacao: 'transicao'
    },
    {
      id: '3',
      consumidor: 'João Santos',
      produto: 'Cenoura',
      fornecedor: 'Fazenda Santa Clara',
      medida: 'kg',
      valor_unitario: 4.00,
      quantidade: 2,
      total: 8.00,
      agricultura_familiar: false,
      certificacao: 'convencional'
    },
    {
      id: '4',
      consumidor: 'Ana Costa',
      produto: 'Rúcula',
      fornecedor: 'João Produtor',
      medida: 'maço',
      valor_unitario: 3.50,
      quantidade: 4,
      total: 14.00,
      agricultura_familiar: true,
      certificacao: 'organico'
    }
  ];

  // Mock data - informações do mercado
  const mercadoInfo = {
    nome: 'Mercado Central',
    pontoRetirada: 'Praça Central, 123',
    dataRetirada: '26/11/2025',
    horaRetirada: '14:00'
  };

  const filteredPedidos = pedidos
    .filter(pedido => {
      const matchSearch = pedido.consumidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
      
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
  const totalKg = filteredPedidos
    .filter(p => p.medida === 'kg')
    .reduce((acc, p) => acc + p.quantidade, 0);
  const valorTotalGeral = filteredPedidos.reduce((acc, p) => acc + p.total, 0);

  const handleVerPedido = (pedido: PedidoConsumidor) => {
    const pedidoDetalhado: PedidoDetalhado = {
      ...pedido,
      endereco: 'Rua Exemplo, 123 - Centro',
      telefone: '(11) 98765-4321',
      data_pedido: '15/11/2025'
    };
    setSelectedPedido(pedidoDetalhado);
    setModalOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      const ciclosData = [{ id: parseInt(cicloId || '1'), nome: `Ciclo ${cicloId}` }];
      const { exportConsumidoresCSV } = await import('@/utils/export');
      exportConsumidoresCSV(filteredPedidos, ciclosData);
      toast.success('Download do CSV concluído');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosData = [{ id: parseInt(cicloId || '1'), nome: `Ciclo ${cicloId}` }];
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
          onClick={() => navigate('/adminmercado/ciclo-index')} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Administrador de mercado - Relatório de Pedidos dos Consumidores
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Consulte e exporte os pedidos consolidados do seu mercado neste ciclo
          </p>
        </div>

        {/* Resumo Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Resumo do Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Consumidores</p>
                <p className="text-2xl font-bold text-primary">{totalConsumidores}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Kg de Alimento</p>
                <p className="text-2xl font-bold text-primary">{totalKg.toFixed(2).replace('.', ',')} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Comercializado</p>
                <p className="text-2xl font-bold text-success">
                  R$ {valorTotalGeral.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por consumidor, produto ou fornecedor"
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

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consumidor</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handleSortByFornecedor}
                >
                  <div className="flex items-center gap-2">
                    Fornecedor
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'fornecedor' && (
                      <span className="text-xs text-muted-foreground">
                        ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Medida</TableHead>
                <TableHead className="text-right">Valor Unitário</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Ações</TableHead>
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
                    <TableCell className="font-medium">{pedido.consumidor}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>{pedido.produto}</span>
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
                    <TableCell className="text-right font-semibold text-success">
                      R$ {pedido.total.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerPedido(pedido)}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Pedido
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Footer Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate('/adminmercado/ciclo-index')}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary">Detalhes do Pedido Individual</DialogTitle>
            <DialogDescription>
              Informações completas do pedido selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Consumidor</p>
                  <p className="text-base font-semibold">{selectedPedido.consumidor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data do Pedido</p>
                  <p className="text-base font-semibold">{selectedPedido.data_pedido}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-base font-semibold">{selectedPedido.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                  <p className="text-base font-semibold">{selectedPedido.endereco}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">{selectedPedido.produto}</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedPedido.quantidade} {selectedPedido.medida}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-success">
                      R$ {selectedPedido.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}
