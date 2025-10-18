import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Search, FileDown, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data - ciclos disponíveis
const ciclosDisponiveis = [
  { id: 1, nome: "Ciclo 01/2024 - Janeiro", status: "Finalizado" },
  { id: 2, nome: "Ciclo 02/2024 - Fevereiro", status: "Finalizado" },
  { id: 3, nome: "Ciclo 03/2024 - Março", status: "Ativo" },
];

// Mock data - pedidos de consumidores
const mockPedidos = [
  { id: 1, consumidor: "Ana Paula", ciclo: "Ciclo 01/2024", produto: "Tomate Cereja", medida: "kg", quantidade: 2, valorUnitario: 8.50, total: 17.00 },
  { id: 2, consumidor: "Carlos Eduardo", ciclo: "Ciclo 01/2024", produto: "Alface Crespa", medida: "un", quantidade: 3, valorUnitario: 3.50, total: 10.50 },
  { id: 3, consumidor: "Ana Paula", ciclo: "Ciclo 02/2024", produto: "Cenoura", medida: "kg", quantidade: 1.5, valorUnitario: 4.00, total: 6.00 },
  { id: 4, consumidor: "Beatriz Santos", ciclo: "Ciclo 02/2024", produto: "Batata Doce", medida: "kg", quantidade: 3, valorUnitario: 5.50, total: 16.50 },
  { id: 5, consumidor: "Carlos Eduardo", ciclo: "Ciclo 03/2024", produto: "Rúcula", medida: "mç", quantidade: 2, valorUnitario: 2.80, total: 5.60 },
  { id: 6, consumidor: "Daniela Costa", ciclo: "Ciclo 03/2024", produto: "Tomate Cereja", medida: "kg", quantidade: 1, valorUnitario: 8.50, total: 8.50 },
];

const AdminRelatorioConsumidores = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCiclos, setSelectedCiclos] = useState<number[]>([]);
  const [relatorioGerado, setRelatorioGerado] = useState(false);

  const handleCicloToggle = (cicloId: number) => {
    setSelectedCiclos(prev => 
      prev.includes(cicloId) 
        ? prev.filter(id => id !== cicloId)
        : [...prev, cicloId]
    );
  };

  const handleGerarRelatorio = () => {
    if (selectedCiclos.length === 0) {
      toast.error('Selecione pelo menos um ciclo');
      return;
    }
    
    toast.success('Relatório gerado com sucesso');
    setRelatorioGerado(true);
  };

  const handleExportCSV = () => {
    toast.success('Download do CSV concluído');
  };

  const handleExportPDF = () => {
    toast.success('Download do PDF concluído');
  };

  // Filtrar pedidos baseado nos ciclos selecionados e termo de busca
  const pedidosFiltrados = mockPedidos.filter(pedido => {
    const cicloMatch = selectedCiclos.length === 0 || 
      selectedCiclos.some(id => ciclosDisponiveis.find(c => c.id === id)?.nome === pedido.ciclo);
    
    const searchMatch = searchTerm === '' || 
      pedido.consumidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return cicloMatch && searchMatch;
  });

  const valorTotalConsolidado = pedidosFiltrados.reduce((acc, p) => acc + p.total, 0);

  return (
    <ResponsiveLayout
      headerContent={
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-primary-foreground hover:underline focus-ring"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            Relatório de Pedidos dos Consumidores
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione os ciclos para gerar o relatório consolidado.
          </p>
        </div>

        {/* Card de Seleção de Ciclos */}
        <Card>
          <CardHeader>
            <CardTitle>Selecione os Ciclos</CardTitle>
            <CardDescription>Marque os ciclos que deseja incluir no relatório</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ciclosDisponiveis.map(ciclo => (
                <div key={ciclo.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id={`ciclo-${ciclo.id}`}
                    checked={selectedCiclos.includes(ciclo.id)}
                    onCheckedChange={() => handleCicloToggle(ciclo.id)}
                  />
                  <label
                    htmlFor={`ciclo-${ciclo.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium">{ciclo.nome}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      ciclo.status === 'Ativo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ciclo.status}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button 
                onClick={handleGerarRelatorio}
                className="bg-primary hover:bg-primary/90"
              >
                Gerar Relatório
              </Button>
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                disabled={!relatorioGerado}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Baixar CSV
              </Button>
              <Button 
                onClick={handleExportPDF}
                variant="outline"
                disabled={!relatorioGerado}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Resumo */}
        {relatorioGerado && (
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
        )}

        {/* Barra de Busca */}
        {relatorioGerado && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por consumidor, produto ou ciclo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Tabela de Resultados */}
        {relatorioGerado && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados do Relatório</CardTitle>
              <CardDescription>
                {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold">Consumidor</th>
                      <th className="text-left p-3 font-semibold">Ciclo</th>
                      <th className="text-left p-3 font-semibold">Produto</th>
                      <th className="text-left p-3 font-semibold">Medida</th>
                      <th className="text-right p-3 font-semibold">Quantidade</th>
                      <th className="text-right p-3 font-semibold">Valor Unit.</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id} className="border-b hover:bg-accent/50 transition-colors">
                        <td className="p-3">{pedido.consumidor}</td>
                        <td className="p-3">{pedido.ciclo}</td>
                        <td className="p-3">{pedido.produto}</td>
                        <td className="p-3">{pedido.medida}</td>
                        <td className="p-3 text-right">{pedido.quantidade}</td>
                        <td className="p-3 text-right">
                          {pedido.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-3 text-right font-semibold">
                          {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-primary/10 font-bold">
                      <td colSpan={6} className="p-3 text-right">VALOR TOTAL CONSOLIDADO:</td>
                      <td className="p-3 text-right text-primary text-lg">
                        {valorTotalConsolidado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default AdminRelatorioConsumidores;
