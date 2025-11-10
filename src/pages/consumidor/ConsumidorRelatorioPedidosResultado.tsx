import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { useIsMobile } from '@/hooks/use-mobile';

interface PedidoItem {
  id: string;
  alimento: string;
  fornecedor: string;
  medida: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipo: 'Cesta' | 'Varejo';
}

export default function ConsumidorRelatorioPedidosResultado() {
  const navigate = useNavigate();
  const { cicloId } = useParams();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof PedidoItem>('alimento');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock data - pedidos do consumidor
  const [pedidos] = useState<PedidoItem[]>([
    {
      id: '1',
      alimento: 'Tomate',
      fornecedor: 'Sítio Bela Vista',
      medida: 'kg',
      quantidade: 3,
      valorUnitario: 8.50,
      valorTotal: 25.50,
      tipo: 'Cesta'
    },
    {
      id: '2',
      alimento: 'Alface',
      fornecedor: 'Orgânicos da Serra',
      medida: 'unidade',
      quantidade: 5,
      valorUnitario: 3.00,
      valorTotal: 15.00,
      tipo: 'Cesta'
    },
    {
      id: '3',
      alimento: 'Cenoura',
      fornecedor: 'Fazenda São José',
      medida: 'kg',
      quantidade: 2,
      valorUnitario: 4.00,
      valorTotal: 8.00,
      tipo: 'Cesta'
    },
    {
      id: '4',
      alimento: 'Banana Nanica',
      fornecedor: 'Sítio Boa Esperança',
      medida: 'kg',
      quantidade: 1.5,
      valorUnitario: 6.00,
      valorTotal: 9.00,
      tipo: 'Varejo'
    },
    {
      id: '5',
      alimento: 'Mel Orgânico',
      fornecedor: 'Apiário Flor do Campo',
      medida: 'g',
      quantidade: 300,
      valorUnitario: 0.078,
      valorTotal: 23.50,
      tipo: 'Varejo'
    }
  ]);

  // Filtros e ordenação
  const pedidosFiltrados = useMemo(() => {
    let resultado = pedidos.filter(pedido =>
      pedido.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    resultado.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

    return resultado;
  }, [pedidos, searchTerm, sortField, sortDirection]);

  // Resumo consolidado
  const resumo = useMemo(() => {
    const valorTotalCesta = pedidos
      .filter(p => p.tipo === 'Cesta')
      .reduce((sum, p) => sum + p.valorTotal, 0);
    
    const valorTotalVarejo = pedidos
      .filter(p => p.tipo === 'Varejo')
      .reduce((sum, p) => sum + p.valorTotal, 0);

    return {
      totalItens: pedidos.length,
      valorTotalCesta,
      valorTotalVarejo,
      valorTotal: valorTotalCesta + valorTotalVarejo
    };
  }, [pedidos]);

  const handleSort = (field: keyof PedidoItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Alimento', 'Fornecedor', 'Medida', 'Quantidade', 'Valor Unitário', 'Valor Total', 'Tipo'];
    const csvContent = [
      headers.join(','),
      ...pedidosFiltrados.map(p => 
        `"${p.alimento}","${p.fornecedor}","${p.medida}",${p.quantidade},${p.valorUnitario},${p.valorTotal},"${p.tipo}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_pedidos_ciclo_${cicloId}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    // Implementação simplificada - em produção, usar jsPDF
    console.log('Exportar PDF - Em desenvolvimento');
    alert('Funcionalidade de exportação PDF será implementada em breve');
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/consumidor/relatorio-pedidos')} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      } 
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Relatório de Pedidos</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {cicloId === '1' ? '1º Ciclo de Novembro 2025' : `Ciclo ${cicloId}`}
          </p>
        </div>

        {/* Resumo Consolidado */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                <p className="text-2xl font-bold text-primary">{resumo.totalItens}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Cesta</p>
                <p className="text-2xl font-bold text-green-600">{formatBRL(resumo.valorTotalCesta)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Varejo</p>
                <p className="text-2xl font-bold text-secondary">{formatBRL(resumo.valorTotalVarejo)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">{formatBRL(resumo.valorTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros e Ações */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por alimento ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleExportCSV}
                  variant="outline"
                  className="flex-1 md:flex-initial border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button 
                  onClick={handleExportPDF}
                  variant="outline"
                  className="flex-1 md:flex-initial border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela Desktop */}
        {!isMobile && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('alimento')}>
                    Alimento {sortField === 'alimento' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('fornecedor')}>
                    Fornecedor {sortField === 'fornecedor' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Medida</TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort('quantidade')}>
                    Quantidade {sortField === 'quantidade' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort('valorTotal')}>
                    Valor Total {sortField === 'valorTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('tipo')}>
                    Tipo {sortField === 'tipo' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosFiltrados.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.alimento}</TableCell>
                    <TableCell>{pedido.fornecedor}</TableCell>
                    <TableCell>{pedido.medida}</TableCell>
                    <TableCell className="text-right">{pedido.quantidade}</TableCell>
                    <TableCell className="text-right">{formatBRL(pedido.valorUnitario)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatBRL(pedido.valorTotal)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.tipo === 'Cesta' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {pedido.tipo}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Cards Mobile */}
        {isMobile && (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <Card key={pedido.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{pedido.alimento}</h3>
                      <p className="text-sm text-muted-foreground">{pedido.fornecedor}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      pedido.tipo === 'Cesta' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {pedido.tipo}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{pedido.quantidade} {pedido.medida}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Valor Unit.</p>
                      <p className="font-medium">{formatBRL(pedido.valorUnitario)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor Total</span>
                      <span className="text-lg font-bold text-primary">{formatBRL(pedido.valorTotal)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}
