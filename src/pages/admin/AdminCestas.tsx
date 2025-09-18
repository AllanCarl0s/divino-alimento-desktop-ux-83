import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Plus, Calendar, Eye, Edit, CheckCircle2, Package, Users, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockCycles = [
  {
    id: 1,
    name: 'Ciclo Agosto/25',
    status: 'Publicado',
    period: '01/08/25 - 31/08/25',
    supplierPeriod: '15/07/25 - 25/07/25',
    extrasPeriod: '20/08/25 - 28/08/25',
    targetValue: 'R$ 15.000,00',
    currentValue: 'R$ 14.200,00'
  },
  {
    id: 2,
    name: 'Ciclo Julho/25',
    status: 'Encerrado',
    period: '01/07/25 - 31/07/25',
    supplierPeriod: '15/06/25 - 25/06/25',
    extrasPeriod: '20/07/25 - 28/07/25',
    targetValue: 'R$ 18.000,00',
    currentValue: 'R$ 17.850,00'
  }
];

const AdminCestas = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycle, setNewCycle] = useState({
    name: '',
    cyclePeriod: '',
    supplierPeriod: '',
    extrasPeriod: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateCycle = () => {
    toast({
      title: "Dados salvos com sucesso.",
      description: "Redirecionando para composição da cesta.",
    });
    setShowNewCycleModal(false);
    navigate('/admin/cestas/composicao/novo');
  };

  const handlePublishCycle = (cycleId: number) => {
    toast({
      title: "Ciclo publicado.",
      description: "O ciclo está disponível para os consumidores.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Publicado':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'Encerrado':
        return <Badge variant="secondary">{status}</Badge>;
      case 'Rascunho':
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Módulo de Cestas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie ciclos de cestas e composições
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="todos">Todos os Ciclos</TabsTrigger>
            <TabsTrigger value="novo">Novo Ciclo</TabsTrigger>
          </TabsList>

          {/* All Cycles Tab */}
          <TabsContent value="todos" className="space-y-4">
            <div className="space-y-4">
              {mockCycles.map((cycle) => (
                <Card key={cycle.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-poppins">{cycle.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{cycle.period}</p>
                      </div>
                      {getStatusBadge(cycle.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Fornecedores:</span>
                        <p className="font-medium">{cycle.supplierPeriod}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Extras:</span>
                        <p className="font-medium">{cycle.extrasPeriod}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Meta:</span>
                        <p className="font-medium text-primary">{cycle.targetValue}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Realizado:</span>
                        <p className="font-medium text-green-600">{cycle.currentValue}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center space-x-1"
                        onClick={() => navigate(`/admin/cestas/resumo/${cycle.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver resumo</span>
                      </Button>
                      
                      {cycle.status === 'Publicado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center space-x-1"
                          onClick={() => navigate(`/admin/cestas/composicao/${cycle.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </Button>
                      )}
                      
                      {cycle.status === 'Rascunho' && (
                        <Button
                          size="sm"
                          className="flex-1 flex items-center space-x-1"
                          onClick={() => handlePublishCycle(cycle.id)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Publicar</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* New Cycle Tab */}
          <TabsContent value="novo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Criar Novo Ciclo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cycleName">Nome do Ciclo</Label>
                  <Input
                    id="cycleName"
                    placeholder="Ex: Ciclo Setembro/25"
                    value={newCycle.name}
                    onChange={(e) => setNewCycle(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cyclePeriod">Tempo do Ciclo</Label>
                  <Input
                    id="cyclePeriod"
                    placeholder="Ex: 01/09/25 - 30/09/25"
                    value={newCycle.cyclePeriod}
                    onChange={(e) => setNewCycle(prev => ({ ...prev, cyclePeriod: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierPeriod">Período de Oferta (Fornecedores)</Label>
                  <Input
                    id="supplierPeriod"
                    placeholder="Ex: 15/08/25 - 25/08/25"
                    value={newCycle.supplierPeriod}
                    onChange={(e) => setNewCycle(prev => ({ ...prev, supplierPeriod: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extrasPeriod">Período de Compra (Extras)</Label>
                  <Input
                    id="extrasPeriod"
                    placeholder="Ex: 20/09/25 - 28/09/25"
                    value={newCycle.extrasPeriod}
                    onChange={(e) => setNewCycle(prev => ({ ...prev, extrasPeriod: e.target.value }))}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCreateCycle}
                  disabled={!newCycle.name || !newCycle.cyclePeriod}
                >
                  Criar Ciclo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminCestas;