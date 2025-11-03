import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ShoppingBasket, MapPin, Clock, CalendarDays } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data - cesta do consumidor
const mockCesta = {
  ciclo: {
    nome: '1º Ciclo de Novembro 2025',
    tipo: 'Cesta Semanal',
    status: 'Ativo',
    retirada: {
      data: '15/11/2025',
      horario: '14:00 às 18:00',
      local: 'Mercado Central - Praça da Alimentação'
    }
  },
  itens: [
    {
      id: '1',
      produto: 'Alface Crespa',
      medida: 'Maço',
      quantidade: 2,
      valorUnitario: 3.50,
      isExtra: false
    },
    {
      id: '2',
      produto: 'Tomate Orgânico',
      medida: 'Kg',
      quantidade: 1.5,
      valorUnitario: 8.90,
      isExtra: false
    },
    {
      id: '3',
      produto: 'Cenoura',
      medida: 'Kg',
      quantidade: 1,
      valorUnitario: 4.50,
      isExtra: false
    },
    {
      id: '4',
      produto: 'Banana Prata',
      medida: 'Dúzia',
      quantidade: 1,
      valorUnitario: 6.00,
      isExtra: true
    },
  ],
  taxas: 5.00
};

const MinhaCesta = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Estado vazio (comentar/descomentar para testar)
  const temCesta = true;

  const valorProdutos = mockCesta.itens.reduce(
    (sum, item) => sum + item.valorUnitario * item.quantidade,
    0
  );
  const valorTotal = valorProdutos + mockCesta.taxas;

  if (!temCesta) {
    return (
      <ResponsiveLayout
        headerContent={<UserMenuLarge />}
        leftHeaderContent={
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-primary-foreground hover:opacity-80 transition-opacity focus-ring p-2 -ml-2"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Minha Cesta</h1>
            <p className="text-muted-foreground mt-2">
              Itens da sua cesta no ciclo atual
            </p>
          </div>

          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBasket className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Você ainda não tem itens na cesta deste ciclo.
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Confira os produtos disponíveis na venda direta
                  </p>
                  <Button 
                    onClick={() => navigate('/pedidoConsumidores/1')}
                    variant="outline"
                  >
                    Ver opções de compra direta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout
      headerContent={<UserMenuLarge />}
      leftHeaderContent={
        <button
          onClick={() => navigate('/dashboard')}
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
          <h1 className="text-3xl font-bold text-gradient-primary">Consumidor - Minha Cesta</h1>
          <p className="text-muted-foreground mt-2">
            Itens da sua cesta no ciclo atual
          </p>
        </div>

        {/* Banner Ciclo Ativo */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={mockCesta.ciclo.status === 'Ativo' ? 'default' : 'secondary'} 
                className={mockCesta.ciclo.status === 'Ativo' ? 'bg-primary' : ''}
              >
                {mockCesta.ciclo.status}
              </Badge>
              <span className="font-medium">
                {mockCesta.ciclo.nome} – {mockCesta.ciclo.tipo}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Cesta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5" />
              Resumo da Cesta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor dos Produtos</span>
              <span className="font-medium">{formatBRL(valorProdutos)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxas</span>
              <span className="font-medium">{formatBRL(mockCesta.taxas)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Final</span>
              <span className="text-primary">{formatBRL(valorTotal)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Produtos da Cesta */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos da Minha Cesta</CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <div className="space-y-3">
                {mockCesta.itens.map(item => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1">
                        <h3 className="font-poppins font-bold text-base text-primary leading-tight">
                          {item.produto}
                        </h3>
                        {item.isExtra && (
                          <Badge 
                            className="mt-1 bg-secondary text-secondary-foreground text-xs"
                          >
                            Extra
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medida:</span>
                        <span className="font-medium text-foreground">{item.medida}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantidade:</span>
                        <span className="font-medium text-foreground">{item.quantidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor Unitário:</span>
                        <span className="font-medium text-foreground">{formatBRL(item.valorUnitario)}</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Valor Total:</span>
                        <span className="font-bold text-primary">{formatBRL(item.valorUnitario * item.quantidade)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Medida</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Valor Unitário</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCesta.itens.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.produto}</span>
                          {item.isExtra && (
                            <Badge variant="secondary" className="text-xs">
                              Extra
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.medida}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.quantidade}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatBRL(item.valorUnitario)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatBRL(item.valorUnitario * item.quantidade)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Informações de Retirada/Entrega */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Retirada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Data</div>
                <div className="text-muted-foreground">{mockCesta.ciclo.retirada.data}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Horário</div>
                <div className="text-muted-foreground">{mockCesta.ciclo.retirada.horario}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Local de Retirada</div>
                <div className="text-muted-foreground">{mockCesta.ciclo.retirada.local}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default MinhaCesta;
