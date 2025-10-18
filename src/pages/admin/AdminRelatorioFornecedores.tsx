import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, FileDown, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data - ciclos disponíveis
const ciclosDisponiveis = [
  { id: 1, nome: "Ciclo 01/2024 - Janeiro", status: "Finalizado", dataEntrega: "15/01/2024" },
  { id: 2, nome: "Ciclo 02/2024 - Fevereiro", status: "Finalizado", dataEntrega: "15/02/2024" },
  { id: 3, nome: "Ciclo 03/2024 - Março", status: "Ativo", dataEntrega: "15/03/2024" },
];

const AdminRelatorioFornecedores = () => {
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
    
    navigate(`/admin/relatorio-fornecedores/resultado?ciclos=${selectedCiclos.join(',')}`);
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
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
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
                    <span className="text-sm text-muted-foreground">Entrega: {ciclo.dataEntrega}</span>
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

export default AdminRelatorioFornecedores;
