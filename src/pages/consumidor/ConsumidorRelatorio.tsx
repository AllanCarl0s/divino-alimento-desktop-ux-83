import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatBRL } from '@/utils/currency';

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
}

export default function ConsumidorRelatorio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

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
      local_recebimento: 'Mercado Central'
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
      local_recebimento: 'Mercado Central'
    },
    {
      id: '3',
      produto: 'Cenoura',
      medida: 'kg',
      valor_unitario: 4.00,
      quantidade: 2,
      total: 8.00,
      data_recebimento: '15/11/2025',
      hora_recebimento: '14:00',
      local_recebimento: 'Mercado Central'
    },
    {
      id: '4',
      produto: 'Rúcula',
      medida: 'maço',
      valor_unitario: 3.50,
      quantidade: 4,
      total: 14.00,
      data_recebimento: '15/11/2025',
      hora_recebimento: '14:00',
      local_recebimento: 'Mercado Central'
    }
  ];

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Relatório de Pedidos do Consumidor
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Consulte e exporte os itens do seu pedido no ciclo selecionado
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
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Medida</TableHead>
                <TableHead className="text-right">Valor Unitário</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Local de Recebimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhum pedido registrado.'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.produto}</TableCell>
                    <TableCell>{pedido.medida}</TableCell>
                    <TableCell className="text-right">
                      {formatBRL(pedido.valor_unitario)}
                    </TableCell>
                    <TableCell className="text-right">{pedido.quantidade}</TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      {formatBRL(pedido.total)}
                    </TableCell>
                    <TableCell>
                      {pedido.data_recebimento} {pedido.hora_recebimento}
                    </TableCell>
                    <TableCell>{pedido.local_recebimento}</TableCell>
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
