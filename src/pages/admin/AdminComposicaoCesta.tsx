import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Search, ArrowLeft, AlertTriangle } from 'lucide-react';

interface ProdutoOfertado {
  id: string;
  nome: string;
  unidade: string;
  valor: number;
  fornecedor: string;
  quantidadeOfertada: number;
  selecionado: boolean;
  quantidadePedida: number;
}

export default function AdminComposicaoCesta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [composicao, setComposicao] = useState<Map<string, number>>(new Map());
  const [produtos] = useState<ProdutoOfertado[]>([
    {
      id: '1',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      valor: 4.50,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 50,
      selecionado: false,
      quantidadePedida: 0
    },
    {
      id: '2',
      nome: 'Alface Crespa',
      unidade: 'kg',
      valor: 3.20,
      fornecedor: 'Maria Horta',
      quantidadeOfertada: 30,
      selecionado: false,
      quantidadePedida: 0
    },
    {
      id: '3',
      nome: 'Ovos Caipiras',
      unidade: 'dúzia',
      valor: 15.00,
      fornecedor: 'Sítio Boa Vista',
      quantidadeOfertada: 100,
      selecionado: false,
      quantidadePedida: 0
    }
  ]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    quantidade: 50,
    valorMaximo: 80.00,
    tipo: 'Cesta'
  };

  // Lista derivada de produtos selecionados
  const selectedProducts = produtos.filter(p => selectedIds.has(p.id));

  // Cálculos reativos
  const valorAtual = selectedProducts.reduce((acc, p) => {
    const pedidos = composicao.get(p.id) || 0;
    return acc + (p.valor * pedidos);
  }, 0);
  
  const saldo = ciclo.valorMaximo - valorAtual;

  const handleToggleProduto = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        // Remove também da composição
        setComposicao(prevComp => {
          const newComp = new Map(prevComp);
          newComp.delete(id);
          return newComp;
        });
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleQuantidadeChange = (id: string, quantidade: number) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    const validQuantity = Math.max(0, Math.min(quantidade, produto.quantidadeOfertada));
    
    setComposicao(prev => {
      const newComp = new Map(prev);
      if (validQuantity === 0) {
        newComp.delete(id);
      } else {
        newComp.set(id, validQuantity);
      }
      return newComp;
    });
  };

  const handlePublicar = () => {
    // Preparar dados para envio
    const payload = selectedProducts
      .filter(p => (composicao.get(p.id) || 0) > 0)
      .map(p => ({
        produto_id: p.id,
        fornecedor_id: p.fornecedor,
        valor_unit: p.valor,
        pedidos: composicao.get(p.id) || 0
      }));

    setIsLoading(true);
    
    // Simular chamada ao backend
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Cesta publicada com sucesso.",
        className: "bg-green-600 text-white border-green-700",
      });
      console.log('Dados enviados:', payload);
    }, 1000);
  };

  // Produtos selecionados com pedidos > 0
  const produtosSelecionadosComPedidos = selectedProducts.filter(p => (composicao.get(p.id) || 0) > 0);
  
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.fornecedor.toLowerCase().includes(busca.toLowerCase())
  );

  const podePublicar = valorAtual <= ciclo.valorMaximo && produtosSelecionadosComPedidos.length > 0;
  const excedeuValor = valorAtual > ciclo.valorMaximo;

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/ciclo-index')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Banner de alerta quando excede valor máximo */}
        {excedeuValor && (
          <Alert variant="destructive" className="sticky top-0 z-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Valor atual excede o valor máximo permitido para este mercado.
            </AlertDescription>
          </Alert>
        )}

        {/* Resumo fixo (sticky) */}
        <Card className="sticky top-0 z-40 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {ciclo.tipo}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="text-2xl font-bold">{ciclo.quantidade}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Máximo</p>
                  <p className="text-2xl font-bold">R$ {ciclo.valorMaximo.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Atual</p>
                  <p className="text-2xl font-bold">R$ {valorAtual.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {saldo.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Produtos Selecionados */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : selectedProducts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Produtos Selecionados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Medida</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Ofertados</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Valor Acumulado</TableHead>
                    <TableHead>Disponíveis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProducts.map((produto) => {
                    const pedidos = composicao.get(produto.id) || 0;
                    const valorAcumulado = produto.valor * pedidos;
                    const disponiveis = produto.quantidadeOfertada - pedidos;
                    
                    return (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell>R$ {produto.valor.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>{produto.fornecedor}</TableCell>
                        <TableCell>{produto.quantidadeOfertada}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={pedidos}
                            onChange={(e) => handleQuantidadeChange(produto.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                            max={produto.quantidadeOfertada}
                          />
                        </TableCell>
                        <TableCell>R$ {valorAcumulado.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>{disponiveis}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : null}

        {/* Todos os Produtos Ofertados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todos os Produtos Ofertados</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor ou produto..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : produtosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma oferta disponível para este ciclo.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Selecionar</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Medida</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Quantidade Ofertada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(produto.id)}
                          onCheckedChange={() => handleToggleProduto(produto.id)}
                          disabled={produto.quantidadeOfertada === 0}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>R$ {produto.valor.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell>{produto.fornecedor}</TableCell>
                      <TableCell>{produto.quantidadeOfertada}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => navigate('/admin/ciclo-index')}>
                Voltar
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button 
                        onClick={handlePublicar}
                        disabled={!podePublicar || isLoading}
                      >
                        {isLoading ? 'Publicando...' : 'Publicar Cesta'}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!podePublicar && (
                    <TooltipContent>
                      <p>Ajuste os produtos para que o valor total não ultrapasse o máximo permitido.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
}
