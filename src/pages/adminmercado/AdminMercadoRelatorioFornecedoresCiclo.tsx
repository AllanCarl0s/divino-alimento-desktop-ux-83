import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, FileDown, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';

// Mock data - ciclos do administrador de mercado logado
const ciclosDisponiveis = [
  { id: 1, nome: "1º Ciclo de Outubro", status: "Finalizado", dataEntrega: "15/10/2024", horaEntrega: "08:00", localEntrega: "Mercado Central - Praça Central, 123" },
  { id: 2, nome: "2º Ciclo de Outubro", status: "Finalizado", dataEntrega: "30/10/2024", horaEntrega: "08:00", localEntrega: "Mercado Central - Praça Central, 123" },
  { id: 3, nome: "1º Ciclo de Novembro", status: "Ativo", dataEntrega: "15/11/2024", horaEntrega: "08:00", localEntrega: "Mercado Central - Praça Central, 123" },
];

const AdminMercadoRelatorioFornecedoresCiclo = () => {
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
    
    navigate(`/adminmercado/relatorio-fornecedores/resultado?ciclos=${selectedCiclos.join(',')}`);
  };

  const handleExportCSV = () => {
    if (selectedCiclos.length === 0) {
      toast.error('Selecione pelo menos um ciclo');
      return;
    }
    toast.success('Download do CSV concluído');
  };

  const handleExportPDF = () => {
    if (selectedCiclos.length === 0) {
      toast.error('Selecione pelo menos um ciclo');
      return;
    }
    toast.success('Download do PDF concluído');
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
          <h1 className="text-3xl font-bold text-gradient-primary flex items-center gap-2">
            <Truck className="w-8 h-8" />
            Administrador de mercado - Relatório de Pedidos dos Fornecedores
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
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-medium">{ciclo.nome}</span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          ciclo.status === 'Ativo' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ciclo.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Entrega: {ciclo.dataEntrega} às {ciclo.horaEntrega} • {ciclo.localEntrega}
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

export default AdminMercadoRelatorioFornecedoresCiclo;
