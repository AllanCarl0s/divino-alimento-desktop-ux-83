import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Plus, Package, Calendar, Edit, FileText, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockVendas = [
  {
    id: 1,
    nome: 'PNAE Janeiro 2024',
    mercado: 'Secretaria de Educação',
    periodo: '01/01/2024 - 31/01/2024',
    status: 'Publicado',
    valor: 'R$ 12.500,00'
  },
  {
    id: 2,
    nome: 'PNAE Fevereiro 2024',
    mercado: 'Escola Municipal Central',
    periodo: '01/02/2024 - 28/02/2024',
    status: 'Rascunho',
    valor: 'R$ 8.750,00'
  },
  {
    id: 3,
    nome: 'PNAE Março 2024',
    mercado: 'Colégio Estadual Norte',
    periodo: '01/03/2024 - 31/03/2024',
    status: 'Encerrado',
    valor: 'R$ 15.200,00'
  }
];

const AdminPnae = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('todas');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Rascunho': { variant: 'outline' as const, color: 'border-yellow-400 text-yellow-700' },
      'Publicado': { variant: 'default' as const, color: '' },
      'Encerrado': { variant: 'secondary' as const, color: '' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Rascunho;
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color}`}>
        {status}
      </Badge>
    );
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
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Módulo PNAE</h1>
          <p className="text-sm text-muted-foreground">
            Programa Nacional de Alimentação Escolar
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="todas">Todas as Vendas</TabsTrigger>
            <TabsTrigger value="nova">Nova Venda</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <School className="w-5 h-5" />
                    <div>
                      <p className="text-sm opacity-90">Vendas Ativas</p>
                      <p className="text-lg font-bold">
                        {mockVendas.filter(v => v.status === 'Publicado').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-accent">
                        R$ {mockVendas.reduce((sum, v) => 
                          sum + parseFloat(v.valor.replace('R$ ', '').replace('.', '').replace(',', '.')), 0
                        ).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendas List */}
            <div className="space-y-4">
              {mockVendas.map((venda) => (
                <Card key={venda.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                          <School className="w-4 h-4 text-primary" />
                          <span>{venda.nome}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(venda.status)}
                          <span className="text-sm text-muted-foreground">{venda.mercado}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Período:</span>
                          <p className="font-medium flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{venda.periodo}</span>
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <p className="font-medium text-primary">{venda.valor}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center space-x-1"
                        onClick={() => navigate(`/admin/pnae/composicao/${venda.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center space-x-1"
                        onClick={() => navigate(`/admin/pnae/resumo/${venda.id}`)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Resumo</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nova" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <span>Nova Venda PNAE</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da venda</label>
                  <input 
                    type="text"
                    placeholder="Ex: PNAE Abril 2024"
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de início</label>
                    <input 
                      type="date"
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de fim</label>
                    <input 
                      type="date"
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Período de oferta (fornecedores)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="date"
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input 
                      type="date"
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <School className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium">Lembrete PNAE:</p>
                      <p>
                        Certifique-se de que os produtos atendem às diretrizes do 
                        Programa Nacional de Alimentação Escolar antes da criação da venda.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => navigate('/admin/pnae/composicao/novo')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Venda
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminPnae;