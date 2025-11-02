import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Truck, Package, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mock data
const mockCiclos = [
  { id: 'c_nov_1', nome: '1º Ciclo de Novembro 2025', status: 'Ativo' },
  { id: 'c_out_2', nome: '2º Ciclo de Outubro 2025', status: 'Finalizado' }
];

const mockEntregas = {
  c_nov_1: {
    ciclo: '1º Ciclo de Novembro 2025',
    dataEntrega: '15/11/2025',
    horario: '18:25',
    local: 'Mercado Central',
    endereco: 'Rua das Flores, 123 - Centro',
    produtos: [
      { id: '1', nome: 'Tomate Orgânico', quantidade: 50, unidade: 'kg' },
      { id: '2', nome: 'Alface Hidropônica', quantidade: 30, unidade: 'unidades' },
      { id: '3', nome: 'Cenoura Baby', quantidade: 25, unidade: 'kg' }
    ]
  },
  c_out_2: {
    ciclo: '2º Ciclo de Outubro 2025',
    dataEntrega: '30/10/2025',
    horario: '14:00',
    local: 'Feira Livre',
    endereco: 'Praça da Liberdade - Bairro Sul',
    produtos: [
      { id: '4', nome: 'Pepino Japonês', quantidade: 40, unidade: 'kg' },
      { id: '5', nome: 'Rúcula Orgânica', quantidade: 20, unidade: 'maços' }
    ]
  }
};

const FornecedorRelatorioEntregas = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cicloParam = searchParams.get('ciclo');
  
  const [cicloSelecionado, setCicloSelecionado] = useState<string>(
    cicloParam || mockCiclos[0]?.id || ''
  );

  const entregaSelecionada = cicloSelecionado ? mockEntregas[cicloSelecionado as keyof typeof mockEntregas] : null;

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/fornecedor/loja')}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            Fornecedor - Relatório de Entregas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Veja o que entregar por ciclo (produtos, quantidades, local e horário)
          </p>
        </div>

        {/* Seleção de Ciclo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecionar Ciclo</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={cicloSelecionado} onValueChange={setCicloSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um ciclo" />
              </SelectTrigger>
              <SelectContent>
                {mockCiclos.map((ciclo) => (
                  <SelectItem key={ciclo.id} value={ciclo.id}>
                    {ciclo.nome} ({ciclo.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Detalhes da Entrega */}
        {entregaSelecionada ? (
          <>
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Informações da Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data e Horário</p>
                      <p className="text-lg font-semibold">
                        {entregaSelecionada.dataEntrega} às {entregaSelecionada.horario}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Local de Entrega</p>
                      <p className="text-lg font-semibold">{entregaSelecionada.local}</p>
                      <p className="text-sm text-muted-foreground">{entregaSelecionada.endereco}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Produtos a Entregar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entregaSelecionada.produtos.map((produto, index) => (
                    <div 
                      key={produto.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {produto.quantidade} {produto.unidade}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Item {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total de Itens:</span>
                    <Badge className="text-base px-4 py-1">
                      {entregaSelecionada.produtos.length} itens
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Nenhum ciclo selecionado
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Selecione um ciclo para visualizar as entregas
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => navigate('/fornecedor/loja')}>
            Voltar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default FornecedorRelatorioEntregas;
