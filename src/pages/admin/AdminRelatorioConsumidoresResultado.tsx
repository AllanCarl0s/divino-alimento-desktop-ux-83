import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoleTitle } from '@/components/layout/RoleTitle';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Download, FileText, Eye, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface PedidoConsumidor {
  id: string;
  consumidor: string;
  produto: string;
  fornecedor: string;
  medida: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
  ciclo: string;
  agricultura_familiar: boolean;
  certificacao: 'organico' | 'transicao' | 'convencional';
}

interface PedidoDetalhado extends PedidoConsumidor {
  endereco: string;
  telefone: string;
  data_pedido: string;
}

export default function AdminRelatorioConsumidoresResultado() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ciclosIds = searchParams.get('ciclos')?.split(',') || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetalhado | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'fornecedor' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] = useState<string>('todos');
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>('todos');
  const isMobile = useIsMobile();

  // Mock data - pedidos consolidados dos ciclos selecionados
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
      ciclo: '1º Ciclo de Outubro',
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
      ciclo: '1º Ciclo de Outubro',
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
      ciclo: '2º Ciclo de Outubro',
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
      ciclo: '2º Ciclo de Outubro',
      agricultura_familiar: true,
      certificacao: 'organico'
    },
    {
      id: '5',
      consumidor: 'Pedro Lima',
      produto: 'Batata',
      fornecedor: 'Sítio Boa Vista',
      medida: 'kg',
      valor_unitario: 3.80,
      quantidade: 5,
      total: 19.00,
      ciclo: '1º Ciclo de Novembro',
      agricultura_familiar: true,
      certificacao: 'convencional'
    },
    {
      id: '6',
      consumidor: 'Carla Souza',
      produto: 'Abóbora',
      fornecedor: 'Sítio Verde',
      medida: 'kg',
      valor_unitario: 4.20,
      quantidade: 3,
      total: 12.60,
      ciclo: '1º Ciclo de Novembro',
      agricultura_familiar: true,
      certificacao: 'organico'
    }
  ];

  const filteredPedidos = pedidos
    .filter(pedido => {
      // Filtro de busca
      const matchSearch = pedido.consumidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro agricultura familiar
      const matchAgriculturaFamiliar = filtroAgriculturaFamiliar === 'todos' ||
        (filtroAgriculturaFamiliar === 'sim' && pedido.agricultura_familiar) ||
        (filtroAgriculturaFamiliar === 'nao' && !pedido.agricultura_familiar);
      
      // Filtro certificação
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
      const ciclosData = ciclosIds.map((id, index) => ({
        id: parseInt(id),
        nome: `Ciclo ${id}`
      }));
      
      const { exportConsumidoresCSV } = await import('@/utils/export');
      exportConsumidoresCSV(filteredPedidos, ciclosData);
      toast.success('Download do CSV concluído');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosData = ciclosIds.map((id, index) => ({
        id: parseInt(id),
        nome: `Ciclo ${id}`
      }));
      
      const resumo = {
        totalConsumidores,
        totalKg,
        valorTotal: valorTotalGeral
      };
      
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
        <button
          onClick={() => navigate('/admin/relatorio-consumidores')}
          className="flex items-center text-primary-foreground hover:opacity-80 transition-opacity focus-ring p-2 -ml-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <RoleTitle page="Relatório de Pedidos dos Consumidores" className="text-3xl" />
          <p className="text-muted-foreground mt-2">
            Consulte e exporte os pedidos consolidados dos ciclos selecionados
          </p>
        </div>

        {/* Resumo Card */}
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

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por consumidor, produto, fornecedor ou ciclo"
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

            <Button 
              variant="outline" 
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
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
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum pedido registrado.'}
                </p>
              </Card>
            ) : (
              filteredPedidos.map((pedido) => (
                <Card key={pedido.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Ciclo</p>
                        <p className="font-medium">{pedido.ciclo}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {pedido.medida}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Consumidor</p>
                      <p className="font-medium">{pedido.consumidor}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Produto</p>
                      <p className="font-medium">{pedido.produto}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
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

                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Fornecedor</p>
                      <p className="font-medium">{pedido.fornecedor}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Valor Unit.</p>
                        <p className="font-medium">R$ {pedido.valor_unitario.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Quantidade</p>
                        <p className="font-medium">{pedido.quantidade}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-lg text-green-600">
                          R$ {pedido.total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerPedido(pedido)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Pedido
                      </Button>
                    </div>
                  </div>
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
                <TableHead>Consumidor(a)</TableHead>
                <TableHead>Produto</TableHead>
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
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
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
                      <TableCell className="text-right font-semibold text-green-600">
                        R$ {pedido.total.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerPedido(pedido)}
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
        )}

        {/* Footer Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/relatorio-consumidores')}
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
            <DialogTitle>Detalhes do Pedido Individual</DialogTitle>
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ciclo</p>
                  <p className="text-base font-semibold">{selectedPedido.ciclo}</p>
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
                    <span className="text-lg font-bold text-green-600">
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
