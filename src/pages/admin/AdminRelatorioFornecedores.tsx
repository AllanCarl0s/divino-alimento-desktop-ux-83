import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Search, FileDown, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data - ciclos disponíveis
const ciclosDisponiveis = [
  { id: 1, nome: "Ciclo 01/2024 - Janeiro", status: "Finalizado" },
  { id: 2, nome: "Ciclo 02/2024 - Fevereiro", status: "Finalizado" },
  { id: 3, nome: "Ciclo 03/2024 - Março", status: "Ativo" },
];

// Mock data - entregas
const mockEntregas = [
  { id: 1, fornecedor: "João Silva", ciclo: "Ciclo 01/2024", produto: "Tomate Cereja", medida: "kg", quantidade: 50, valorUnitario: 8.50, total: 425.00 },
  { id: 2, fornecedor: "Maria Santos", ciclo: "Ciclo 01/2024", produto: "Alface Crespa", medida: "un", quantidade: 100, valorUnitario: 3.50, total: 350.00 },
  { id: 3, fornecedor: "João Silva", ciclo: "Ciclo 02/2024", produto: "Cenoura", medida: "kg", quantidade: 80, valorUnitario: 4.00, total: 320.00 },
  { id: 4, fornecedor: "Carlos Oliveira", ciclo: "Ciclo 02/2024", produto: "Batata Doce", medida: "kg", quantidade: 120, valorUnitario: 5.50, total: 660.00 },
  { id: 5, fornecedor: "Maria Santos", ciclo: "Ciclo 03/2024", produto: "Rúcula", medida: "mç", quantidade: 60, valorUnitario: 2.80, total: 168.00 },
];

const AdminRelatorioFornecedores = () => {
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

  // Filtrar entregas baseado nos ciclos selecionados e termo de busca
  const entregasFiltradas = mockEntregas.filter(entrega => {
    const cicloMatch = selectedCiclos.length === 0 || 
      selectedCiclos.some(id => ciclosDisponiveis.find(c => c.id === id)?.nome === entrega.ciclo);
    
    const searchMatch = searchTerm === '' || 
      entrega.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return cicloMatch && searchMatch;
  });

  const valorTotalConsolidado = entregasFiltradas.reduce((acc, e) => acc + e.total, 0);

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
            <Truck className="w-8 h-8" />
            Relatório de Pedidos dos Fornecedores
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
                  <p className="text-sm text-muted-foreground">Total de Entregas</p>
                  <p className="text-2xl font-bold text-primary">{entregasFiltradas.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fornecedores</p>
                  <p className="text-2xl font-bold text-primary">
                    {new Set(entregasFiltradas.map(e => e.fornecedor)).size}
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
              placeholder="Buscar por fornecedor, produto ou ciclo"
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
                {entregasFiltradas.length} {entregasFiltradas.length === 1 ? 'entrega encontrada' : 'entregas encontradas'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold">Fornecedor</th>
                      <th className="text-left p-3 font-semibold">Ciclo</th>
                      <th className="text-left p-3 font-semibold">Produto</th>
                      <th className="text-left p-3 font-semibold">Medida</th>
                      <th className="text-right p-3 font-semibold">Quantidade</th>
                      <th className="text-right p-3 font-semibold">Valor Unit.</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entregasFiltradas.map((entrega) => (
                      <tr key={entrega.id} className="border-b hover:bg-accent/50 transition-colors">
                        <td className="p-3">{entrega.fornecedor}</td>
                        <td className="p-3">{entrega.ciclo}</td>
                        <td className="p-3">{entrega.produto}</td>
                        <td className="p-3">{entrega.medida}</td>
                        <td className="p-3 text-right">{entrega.quantidade}</td>
                        <td className="p-3 text-right">
                          {entrega.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-3 text-right font-semibold">
                          {entrega.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

export default AdminRelatorioFornecedores;
