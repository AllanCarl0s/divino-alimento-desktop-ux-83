import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CycleType, validateCycleDuration } from '@/types/cycle';

const AdminKitandinhaNovoCiclo = () => {
  const [cycleName, setCycleName] = useState('');
  const [cycleType, setCycleType] = useState<CycleType | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateAndUpdateCycle = () => {
    if (!cycleName || !cycleType || !startDate || !endDate) {
      setValidationErrors(['Preencha todos os campos obrigatórios.']);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const validation = validateCycleDuration(start, end, cycleType);
    setValidationErrors(validation.errors);
  };

  React.useEffect(() => {
    if (cycleName && cycleType && startDate && endDate) {
      validateAndUpdateCycle();
    }
  }, [cycleName, cycleType, startDate, endDate]);

  const handleCreateCycle = () => {
    validateAndUpdateCycle();
    
    if (validationErrors.length > 0) {
      toast({
        title: "Erro na validação",
        description: "Corrija os erros antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ciclo criado com sucesso!",
      description: `Ciclo "${cycleName}" foi criado.`,
    });
    
    navigate('/admin/kitandinha/composicao/novo');
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/venda')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="container mx-auto max-w-6xl p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitandinha - Novo Ciclo</h1>
          <p className="text-muted-foreground mt-2">
            Configure um novo ciclo de venda direta
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Configuração do Ciclo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cycleName">Nome do Ciclo</Label>
                <Input
                  id="cycleName"
                  placeholder="Ex: Ciclo Setembro 2025"
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycleType">Tipo do Ciclo</Label>
                <Select value={cycleType} onValueChange={(value) => setCycleType(value as CycleType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal (7 dias)</SelectItem>
                    <SelectItem value="quinzenal">Quinzenal (15 dias)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Erros de Validação:</span>
                  </div>
                  <ul className="text-xs text-destructive space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Resumo da Configuração</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nome:</span>
                  <span className="font-medium">{cycleName || 'Não definido'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="font-medium">
                    {cycleType ? (cycleType === 'semanal' ? 'Semanal (7 dias)' : 'Quinzenal (15 dias)') : 'Não definido'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Período:</span>
                  <span className="font-medium">
                    {startDate && endDate ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}` : 'Não definido'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Janela de ofertas:</span>
                  <span className="font-medium text-primary">3 dias fixos (início do ciclo)</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span>Próximos passos:</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Definir composição de compra para o ciclo</li>
                  <li>• Configurar janelas de extras (padrão: todo o ciclo)</li>
                  <li>• Gerenciar estoque disponível</li>
                  <li>• Configurar valores e fornecedores</li>
                  <li>• Publicar ciclo para consumidores</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/venda')}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCycle} 
            disabled={validationErrors.length > 0}
          >
            Criar Ciclo e Continuar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminKitandinhaNovoCiclo;