import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, FileDown, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';

// Mock data - ciclos do administrador de mercado logado
const ciclosDisponiveis = [
  { id: 1, nome: "1º Ciclo de Outubro", status: "Finalizado", dataRetirada: "16/10/2024", horaRetirada: "14:00", localRetirada: "Mercado Central - Praça Central, 123" },
  { id: 2, nome: "2º Ciclo de Outubro", status: "Finalizado", dataRetirada: "31/10/2024", horaRetirada: "14:00", localRetirada: "Mercado Central - Praça Central, 123" },
  { id: 3, nome: "1º Ciclo de Novembro", status: "Ativo", dataRetirada: "16/11/2024", horaRetirada: "14:00", localRetirada: "Mercado Central - Praça Central, 123" },
].sort((a, b) => {
  const [diaA, mesA, anoA] = a.dataRetirada.split('/').map(Number);
  const [diaB, mesB, anoB] = b.dataRetirada.split('/').map(Number);
  const dateA = new Date(anoA, mesA - 1, diaA);
  const dateB = new Date(anoB, mesB - 1, diaB);
  return dateB.getTime() - dateA.getTime(); // Most recent first
});

const AdminMercadoRelatorioConsumidoresCiclo = () => {
  const navigate = useNavigate();
  const [selectedCiclos, setSelectedCiclos] = useState<number[]>([]);

  const handleCicloToggle = (cicloId: number) => {
    setSelectedCiclos(prev => 
      prev.includes(cicloId) 
        ? prev.filter(id => id !== cicloId)
        : [...prev, cicloId]
    );
  };

  const handleMostrarRelatorio = () => {
    if (selectedCiclos.length === 0) {
      toast.error('Selecione pelo menos um ciclo');
      return;
    }
    
    navigate(`/adminmercado/relatorio-consumidores/resultado?ciclos=${selectedCiclos.join(',')}`);
  };

  const handleExportCSV = async () => {
    if (selectedCiclos.length === 0) {
      toast.error('Selecione pelo menos um ciclo');
      return;
    }
    
    try {
      const selectedCiclosData = ciclosDisponiveis.filter(c => selectedCiclos.includes(c.id));
      
      // Mock data para export - em produção viria da API
      const mockPedidos = [
        { ciclo: '1º Ciclo de Outubro', consumidor: 'Maria Silva', produto: 'Tomate', fornecedor: 'Sítio Verde', medida: 'kg', valor_unitario: 5.50, quantidade: 3, total: 16.50, agricultura_familiar: true, certificacao: 'organico' },
        { ciclo: '1º Ciclo de Outubro', consumidor: 'João Santos', produto: 'Alface', fornecedor: 'Maria Horta', medida: 'unidade', valor_unitario: 2.00, quantidade: 5, total: 10.00, agricultura_familiar: true, certificacao: 'transicao' }
      ];
      
      const { exportConsumidoresCSV } = await import('@/utils/export');
      exportConsumidoresCSV(mockPedidos, selectedCiclosData);
      toast.success('Download do CSV concluído');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleExportPDF = async () => {
    if (selectedCiclos.length === 0) {
      toast.error('Selecione pelo menos um ciclo');
      return;
    }
    
    try {
      const selectedCiclosData = ciclosDisponiveis.filter(c => selectedCiclos.includes(c.id));
      
      // Mock data para export - em produção viria da API
      const mockPedidos = [
        { ciclo: '1º Ciclo de Outubro', consumidor: 'Maria Silva', produto: 'Tomate', fornecedor: 'Sítio Verde', medida: 'kg', valor_unitario: 5.50, quantidade: 3, total: 16.50, agricultura_familiar: true, certificacao: 'organico' },
        { ciclo: '1º Ciclo de Outubro', consumidor: 'João Santos', produto: 'Alface', fornecedor: 'Maria Horta', medida: 'unidade', valor_unitario: 2.00, quantidade: 5, total: 10.00, agricultura_familiar: true, certificacao: 'transicao' }
      ];
      
      const resumo = {
        totalConsumidores: 2,
        totalKg: 3,
        valorTotal: 26.50
      };
      
      const { exportConsumidoresPDF } = await import('@/utils/export');
      exportConsumidoresPDF(mockPedidos, selectedCiclosData, resumo);
      toast.success('Download do PDF concluído');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
    }
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <button
          onClick={() => navigate('/adminmercado/dashboard')}
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
            Administrador de mercado - Relatório de Pedidos dos Consumidores
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione os ciclos do seu mercado para gerar o relatório consolidado.
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
                <div key={ciclo.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id={`ciclo-${ciclo.id}`}
                    checked={selectedCiclos.includes(ciclo.id)}
                    onCheckedChange={() => handleCicloToggle(ciclo.id)}
                  />
                  <label
                    htmlFor={`ciclo-${ciclo.id}`}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{ciclo.nome}</span>
                      <Badge variant={ciclo.status === 'Ativo' ? 'success' : 'secondary'}>
                        {ciclo.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Entrega: {ciclo.dataRetirada}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button 
                onClick={handleMostrarRelatorio}
                className="bg-primary hover:bg-primary/90"
              >
                Mostrar Relatório
              </Button>
              <Button 
                onClick={handleExportCSV}
                variant="outline"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Baixar CSV
              </Button>
              <Button 
                onClick={handleExportPDF}
                variant="outline"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminMercadoRelatorioConsumidoresCiclo;
