import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Search, FileDown, ShoppingBag } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data - ciclos disponíveis
const ciclosDisponiveis = [
  { id: 1, nome: "1º Ciclo de Outubro", status: "Finalizado" },
  { id: 2, nome: "2º Ciclo de Outubro", status: "Finalizado" },
  { id: 3, nome: "1º Ciclo de Novembro", status: "Ativo" },
];

// Mock data - pedidos de consumidores (conforme especificação)
const mockPedidos = [
  { id: 1, consumidor: "Ana Souza", ciclo: "2º Ciclo de Outubro", produto: "Alface Crespa", medida: "maço", quantidade: 3, valorUnitario: 2.00, total: 6.00 },
  { id: 2, consumidor: "Carlos Lima", ciclo: "1º Ciclo de Novembro", produto: "Tomate Orgânico", medida: "kg", quantidade: 5, valorUnitario: 4.50, total: 22.50 },
  { id: 3, consumidor: "Beatriz Ramos", ciclo: "1º Ciclo de Outubro", produto: "Ovos Caipiras", medida: "dúzia", quantidade: 2, valorUnitario: 15.00, total: 30.00 },
  { id: 4, consumidor: "Diego Alves", ciclo: "1º Ciclo de Novembro", produto: "Banana Prata", medida: "kg", quantidade: 4, valorUnitario: 5.00, total: 20.00 },
];

const AdminRelatorioConsumidoresResultado = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Obter IDs dos ciclos selecionados da URL
  const selectedCicloIds = useMemo(() => {
    const ciclosParam = searchParams.get('ciclos');
    return ciclosParam ? ciclosParam.split(',').map(Number) : [];
  }, [searchParams]);

  // Obter nomes dos ciclos selecionados
  const ciclosSelecionados = useMemo(() => {
    return ciclosDisponiveis.filter(c => selectedCicloIds.includes(c.id));
  }, [selectedCicloIds]);

  // Filtrar pedidos baseado nos ciclos selecionados e termo de busca
  const pedidosFiltrados = useMemo(() => {
    return mockPedidos.filter(pedido => {
      const ciclo = ciclosDisponiveis.find(c => c.nome === pedido.ciclo);
      const cicloMatch = ciclo && selectedCicloIds.includes(ciclo.id);
      
      const searchMatch = searchTerm === '' || 
        pedido.consumidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
      
      return cicloMatch && searchMatch;
    });
  }, [selectedCicloIds, searchTerm]);

  const valorTotalConsolidado = useMemo(() => {
    return pedidosFiltrados.reduce((acc, p) => acc + p.total, 0);
  }, [pedidosFiltrados]);

  const handleExportCSV = () => {
    toast.success('Download do CSV concluído');
  };

  const handleExportPDF = () => {
    toast.success('Download do PDF concluído');
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
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            Resultado – Pedidos de Consumidores
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <span className="text-muted-foreground">Ciclos selecionados:</span>
            {ciclosSelecionados.map(ciclo => (
              <Badge 
                key={ciclo.id} 
                variant={ciclo.status === 'Ativo' ? 'success' : 'secondary'}
              >
                {ciclo.nome} ({ciclo.status})
              </Badge>
            ))}
          </div>
        </div>

        {/* Card de Resumo */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold text-primary">{pedidosFiltrados.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consumidores</p>
                <p className="text-2xl font-bold text-primary">
                  {new Set(pedidosFiltrados.map(p => p.consumidor)).size}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">
                  {valorTotalConsolidado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barra de Busca e Botões de Export */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Resultados do Relatório</CardTitle>
                <CardDescription>
                  {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExportCSV} variant="outline" size="sm">
                  <FileDown className="w-4 h-4 mr-2" />
                  Baixar CSV
                </Button>
                <Button onClick={handleExportPDF} variant="outline" size="sm">
                  <FileDown className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por consumidor, produto ou ciclo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabela de Resultados */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-semibold">Consumidor</th>
                    <th className="text-left p-3 font-semibold">Ciclo</th>
                    <th className="text-left p-3 font-semibold">Produto</th>
                    <th className="text-left p-3 font-semibold">Medida</th>
                    <th className="text-right p-3 font-semibold">Valor Unit. (R$)</th>
                    <th className="text-right p-3 font-semibold">Quantidade</th>
                    <th className="text-right p-3 font-semibold">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido, index) => (
                    <tr key={pedido.id} className={`border-b hover:bg-accent/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                      <td className="p-3">{pedido.consumidor}</td>
                      <td className="p-3">{pedido.ciclo}</td>
                      <td className="p-3">{pedido.produto}</td>
                      <td className="p-3">{pedido.medida}</td>
                      <td className="p-3 text-right">
                        {pedido.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-right">{pedido.quantidade}</td>
                      <td className="p-3 text-right font-semibold">
                        {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary/10 font-bold sticky bottom-0">
                    <td colSpan={6} className="p-3 text-right text-lg">VALOR TOTAL CONSOLIDADO:</td>
                    <td className="p-3 text-right text-primary text-lg">
                      {valorTotalConsolidado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminRelatorioConsumidoresResultado;
