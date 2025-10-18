import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Search, FileDown, Truck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data - ciclos disponíveis
const ciclosDisponiveis = [
  { id: 1, nome: "1º Ciclo de Outubro", status: "Finalizado" },
  { id: 2, nome: "2º Ciclo de Outubro", status: "Finalizado" },
  { id: 3, nome: "1º Ciclo de Novembro", status: "Ativo" },
];

// Mock data - entregas (conforme especificação)
const mockEntregas = [
  // 1º Ciclo de Outubro (Finalizado)
  { id: 1, fornecedor: "Sítio Boa Vista", ciclo: "1º Ciclo de Outubro", produto: "Ovos Caipiras", medida: "dúzia", quantidade: 20, valorUnitario: 15.00, total: 300.00 },
  { id: 2, fornecedor: "João Produtor", ciclo: "1º Ciclo de Outubro", produto: "Banana Prata", medida: "kg", quantidade: 30, valorUnitario: 5.00, total: 150.00 },
  
  // 2º Ciclo de Outubro (Finalizado)
  { id: 3, fornecedor: "João Produtor", ciclo: "2º Ciclo de Outubro", produto: "Tomate Orgânico", medida: "kg", quantidade: 50, valorUnitario: 4.50, total: 225.00 },
  { id: 4, fornecedor: "Maria Horta", ciclo: "2º Ciclo de Outubro", produto: "Alface Crespa", medida: "maço", quantidade: 30, valorUnitario: 2.00, total: 60.00 },
  
  // 1º Ciclo de Novembro (Ativo)
  { id: 5, fornecedor: "Sítio Verde", ciclo: "1º Ciclo de Novembro", produto: "Tomate Orgânico", medida: "kg", quantidade: 30, valorUnitario: 4.20, total: 126.00 },
  { id: 6, fornecedor: "Sítio Boa Vista", ciclo: "1º Ciclo de Novembro", produto: "Ovos Caipiras", medida: "dúzia", quantidade: 100, valorUnitario: 15.00, total: 1500.00 },
  { id: 7, fornecedor: "João Produtor", ciclo: "1º Ciclo de Novembro", produto: "Banana Prata", medida: "kg", quantidade: 60, valorUnitario: 5.00, total: 300.00 },
  { id: 8, fornecedor: "João Produtor", ciclo: "1º Ciclo de Novembro", produto: "Tomate Orgânico", medida: "kg", quantidade: 25, valorUnitario: 4.50, total: 112.50 },
  { id: 9, fornecedor: "Maria Horta", ciclo: "1º Ciclo de Novembro", produto: "Tomate Orgânico", medida: "kg", quantidade: 25, valorUnitario: 4.20, total: 105.00 },
  { id: 10, fornecedor: "Sítio Verde", ciclo: "1º Ciclo de Novembro", produto: "Tomate Orgânico", medida: "kg", quantidade: 25, valorUnitario: 4.80, total: 120.00 },
];

const AdminRelatorioFornecedoresResultado = () => {
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

  // Filtrar entregas baseado nos ciclos selecionados e termo de busca
  const entregasFiltradas = useMemo(() => {
    return mockEntregas.filter(entrega => {
      const ciclo = ciclosDisponiveis.find(c => c.nome === entrega.ciclo);
      const cicloMatch = ciclo && selectedCicloIds.includes(ciclo.id);
      
      const searchMatch = searchTerm === '' || 
        entrega.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
      
      return cicloMatch && searchMatch;
    });
  }, [selectedCicloIds, searchTerm]);

  const valorTotalConsolidado = useMemo(() => {
    return entregasFiltradas.reduce((acc, e) => acc + e.total, 0);
  }, [entregasFiltradas]);

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
          onClick={() => navigate('/admin/relatorio-fornecedores')}
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
            <Truck className="w-8 h-8" />
            Resultado – Pedidos de Fornecedores
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

        {/* Barra de Busca e Botões de Export */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Resultados do Relatório</CardTitle>
                <CardDescription>
                  {entregasFiltradas.length} {entregasFiltradas.length === 1 ? 'entrega encontrada' : 'entregas encontradas'}
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
                placeholder="Buscar por fornecedor, produto ou ciclo..."
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
                    <th className="text-left p-3 font-semibold">Fornecedor</th>
                    <th className="text-left p-3 font-semibold">Ciclo</th>
                    <th className="text-left p-3 font-semibold">Produto</th>
                    <th className="text-left p-3 font-semibold">Medida</th>
                    <th className="text-right p-3 font-semibold">Valor Unit. (R$)</th>
                    <th className="text-right p-3 font-semibold">Quantidade</th>
                    <th className="text-right p-3 font-semibold">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {entregasFiltradas.map((entrega, index) => (
                    <tr key={entrega.id} className={`border-b hover:bg-accent/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                      <td className="p-3">{entrega.fornecedor}</td>
                      <td className="p-3">{entrega.ciclo}</td>
                      <td className="p-3">{entrega.produto}</td>
                      <td className="p-3">{entrega.medida}</td>
                      <td className="p-3 text-right">
                        {entrega.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-right">{entrega.quantidade}</td>
                      <td className="p-3 text-right font-semibold">
                        {entrega.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

export default AdminRelatorioFornecedoresResultado;
