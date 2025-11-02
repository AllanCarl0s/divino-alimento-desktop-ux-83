import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MobileLayout from '@/components/layout/MobileLayout';
import { ArrowLeft, Package, Users, Minus, Plus, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockCiclo = {
  id: '1',
  nome: 'Ciclo Janeiro 2024',
  periodo: '01/01/2024 - 31/01/2024',
  status: 'Publicado',
  valorAlvo: 5000,
  valorRealizado: 4750
};

const mockItens = [
  {
    id: 1,
    item: 'Tomate Orgânico',
    fornecedor: 'João Silva',
    planejado: 50,
    entregue: 45,
    observacao: 'Perda na colheita devido à chuva'
  },
  {
    id: 2,
    item: 'Alface Hidropônica',
    fornecedor: 'Maria Santos',
    planejado: 100,
    entregue: 110,
    observacao: 'Produção excedeu expectativa'
  },
  {
    id: 3,
    item: 'Cenoura Baby',
    fornecedor: 'Carlos Oliveira',
    planejado: 30,
    entregue: 30,
    observacao: ''
  }
];

const AdminGestao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itens, setItens] = useState(mockItens);

  const handleQuantityChange = (itemId: number, field: 'entregue', value: number) => {
    setItens(itens.map(item => 
      item.id === itemId ? { ...item, [field]: Math.max(0, value) } : item
    ));
  };

  const handleObservationChange = (itemId: number, observacao: string) => {
    setItens(itens.map(item => 
      item.id === itemId ? { ...item, observacao } : item
    ));
  };

  const handleSaveItem = (itemId: number) => {
    toast({
      title: "Dados salvos com sucesso.",
    });
  };

  const handleApplyAdjustments = () => {
    const novoValorRealizado = itens.reduce((total, item) => {
      // Mock calculation - R$ 7.50 per kg average
      return total + (item.entregue * 7.5);
    }, 0);
    
    toast({
      title: "Dados salvos com sucesso.",
      description: `Valor realizado atualizado: R$ ${novoValorRealizado.toFixed(2).replace('.', ',')}`,
    });
  };

  return (
    <MobileLayout 
      headerContent={
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
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Gestão do Ciclo</h1>
          <p className="text-sm text-muted-foreground">{mockCiclo.nome}</p>
        </div>

        {/* Ciclo Info */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="font-medium">{mockCiclo.periodo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="default" className="mt-1">{mockCiclo.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Alvo</p>
                <p className="font-medium text-primary">R$ {mockCiclo.valorAlvo.toFixed(2).replace('.', ',')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Realizado</p>
                <p className="font-medium text-accent">R$ {mockCiclo.valorRealizado.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Management */}
        <div className="space-y-4">
          <h2 className="font-semibold flex items-center">
            <Package className="w-4 h-4 mr-2 text-primary" />
            Ajuste de Oferta por Item
          </h2>

          {itens.map((item) => (
            <Card key={item.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-poppins">{item.item}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.fornecedor}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Planejado (kg)</Label>
                    <p className="font-medium text-lg">{item.planejado}</p>
                  </div>
                  <div>
                    <Label htmlFor={`entregue-${item.id}`} className="text-sm text-muted-foreground">Entregue (kg)</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleQuantityChange(item.id, 'entregue', item.entregue - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        id={`entregue-${item.id}`}
                        type="number"
                        value={item.entregue}
                        onChange={(e) => handleQuantityChange(item.id, 'entregue', parseInt(e.target.value) || 0)}
                        className="text-center w-16"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleQuantityChange(item.id, 'entregue', item.entregue + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`obs-${item.id}`} className="text-sm">Observação</Label>
                  <Textarea
                    id={`obs-${item.id}`}
                    placeholder="Observações sobre a entrega..."
                    value={item.observacao}
                    onChange={(e) => handleObservationChange(item.id, e.target.value)}
                    className="resize-none mt-1"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Diferença: </span>
                    <span className={`font-medium ${
                      item.entregue - item.planejado >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.entregue - item.planejado > 0 ? '+' : ''}{item.entregue - item.planejado} kg
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveItem(item.id)}
                    className="flex items-center space-x-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Salvar</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Apply Adjustments */}
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recalcular Valor Realizado</p>
                <p className="text-sm text-muted-foreground">
                  Aplicar os ajustes de quantidade ao valor final do ciclo
                </p>
              </div>
              <Button
                onClick={handleApplyAdjustments}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Aplicar Ajustes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default AdminGestao;