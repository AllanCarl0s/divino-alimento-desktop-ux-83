import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, Download, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface PedidoConsumidor {
  id: string;
  consumidor: string;
  produto: string;
  medida: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
  ciclo: string;
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

  // Mock data - pedidos consolidados dos ciclos selecionados
  const pedidos: PedidoConsumidor[] = [
    {
      id: '1',
      consumidor: 'Maria Silva',
      produto: 'Tomate',
      medida: 'kg',
      valor_unitario: 5.50,
      quantidade: 3,
      total: 16.50,
      ciclo: '1º Ciclo de Outubro'
    },
    {
      id: '2',
      consumidor: 'Maria Silva',
      produto: 'Alface',
      medida: 'unidade',
      valor_unitario: 2.00,
      quantidade: 5,
      total: 10.00,
      ciclo: '1º Ciclo de Outubro'
    },
    {
      id: '3',
      consumidor: 'João Santos',
      produto: 'Cenoura',
      medida: 'kg',
      valor_unitario: 4.00,
      quantidade: 2,
      total: 8.00,
      ciclo: '2º Ciclo de Outubro'
    },
    {
      id: '4',
      consumidor: 'Ana Costa',
      produto: 'Rúcula',
      medida: 'maço',
      valor_unitario: 3.50,
      quantidade: 4,
      total: 14.00,
      ciclo: '2º Ciclo de Outubro'
    },
    {
      id: '5',
      consumidor: 'Pedro Lima',
      produto: 'Batata',
      medida: 'kg',
      valor_unitario: 3.80,
      quantidade: 5,
      total: 19.00,
      ciclo: '1º Ciclo de Novembro'
    },
    {
      id: '6',
      consumidor: 'Carla Souza',
      produto: 'Abóbora',
      medida: 'kg',
      valor_unitario: 4.20,
      quantidade: 3,
      total: 12.60,
      ciclo: '1º Ciclo de Novembro'
    }
  ];

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.consumidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.ciclo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuantidade = filteredPedidos.reduce((acc, p) => acc + p.quantidade, 0);
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

  const handleExportCSV = () => {
    toast.success('Download do CSV iniciado');
  };

  const handleExportPDF = () => {
    toast.success('Download do PDF iniciado');
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
          <h1 className="text-3xl font-bold text-gradient-primary">
            Administrador - Relatório de Pedidos dos Consumidores
          </h1>
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
                <p className="text-sm text-muted-foreground">Quantidade de Pedidos</p>
                <p className="text-2xl font-bold">{filteredPedidos.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantidade Total de Itens</p>
                <p className="text-2xl font-bold">{totalQuantidade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Consolidado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {valorTotalGeral.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por consumidor, produto ou ciclo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
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

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciclo</TableHead>
                <TableHead>Consumidor</TableHead>
                <TableHead>Produto</TableHead>
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
                    <TableCell>{pedido.produto}</TableCell>
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
