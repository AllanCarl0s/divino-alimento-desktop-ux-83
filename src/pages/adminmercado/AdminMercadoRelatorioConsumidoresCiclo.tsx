import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { useIsMobile } from '@/hooks/use-mobile';
import { RoleTitle } from '@/components/layout/RoleTitle';

// Mock data - ciclos do administrador de mercado logado
const ciclosDisponiveis = [
  { id: 1, nome: "1º Ciclo de Outubro", status: "Finalizado" as const, dataRetirada: "16/10/2024", mercado: "Mercado Central" },
  { id: 2, nome: "2º Ciclo de Outubro", status: "Finalizado" as const, dataRetirada: "31/10/2024", mercado: "Mercado Central" },
  { id: 3, nome: "1º Ciclo de Novembro", status: "Ativo" as const, dataRetirada: "16/11/2024", mercado: "Mercado Central" },
].sort((a, b) => {
  const [diaA, mesA, anoA] = a.dataRetirada.split('/').map(Number);
  const [diaB, mesB, anoB] = b.dataRetirada.split('/').map(Number);
  const dateA = new Date(anoA, mesA - 1, diaA);
  const dateB = new Date(anoB, mesB - 1, diaB);
  return dateB.getTime() - dateA.getTime(); // Most recent first
});

const AdminMercadoRelatorioConsumidoresCiclo = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
          <RoleTitle page="Relatório de Pedidos dos Consumidores" className="text-3xl" />
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
            {!isMobile ? (
              /* Visualização em Tabela para Desktop */
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Ciclo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mercado</TableHead>
                      <TableHead>Data de Retirada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ciclosDisponiveis.map(ciclo => (
                      <TableRow key={ciclo.id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleCicloToggle(ciclo.id)}>
                        <TableCell>
                          <Checkbox
                            id={`ciclo-${ciclo.id}`}
                            checked={selectedCiclos.includes(ciclo.id)}
                            onCheckedChange={() => handleCicloToggle(ciclo.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{ciclo.nome}</TableCell>
                        <TableCell>
                          <Badge variant={ciclo.status === 'Ativo' ? 'default' : 'secondary'}>
                            {ciclo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{ciclo.mercado}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {ciclo.dataRetirada}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* Visualização em Cards para Mobile */
              <div className="space-y-3">
                {ciclosDisponiveis.map(ciclo => (
                  <Card key={ciclo.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleCicloToggle(ciclo.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`ciclo-mobile-${ciclo.id}`}
                          checked={selectedCiclos.includes(ciclo.id)}
                          onCheckedChange={() => handleCicloToggle(ciclo.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium">{ciclo.nome}</span>
                            <Badge variant={ciclo.status === 'Ativo' ? 'default' : 'secondary'} className="shrink-0">
                              {ciclo.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Mercado:</span>
                              <span>{ciclo.mercado}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>Retirada: {ciclo.dataRetirada}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Button 
                onClick={handleMostrarRelatorio}
                className="w-full sm:w-auto"
              >
                Mostrar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminMercadoRelatorioConsumidoresCiclo;
