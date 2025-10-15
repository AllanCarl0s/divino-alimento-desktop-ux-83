import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Search, ArrowLeft, AlertTriangle, Trash2 } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProdutoOfertado {
  id: string;
  nome: string;
  unidade: string;
  valor: number;
  fornecedor: string;
  quantidadeOfertada: number;
  selecionado: boolean;
}

export default function AdminComposicaoVendaDiretaLiberar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');
  
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [produtos, setProdutos] = useState<ProdutoOfertado[]>([
    {
      id: '1',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      valor: 4.50,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 50,
      selecionado: true,
    },
    {
      id: '2',
      nome: 'Alface Crespa',
      unidade: 'maço',
      valor: 2.00,
      fornecedor: 'Maria Horta',
      quantidadeOfertada: 30,
      selecionado: true,
    },
    {
      id: '3',
      nome: 'Cenoura',
      unidade: 'kg',
      valor: 3.20,
      fornecedor: 'Sítio Verde',
      quantidadeOfertada: 40,
      selecionado: false,
    },
    {
      id: '4',
      nome: 'Ovos Caipiras',
      unidade: 'dúzia',
      valor: 15.00,
      fornecedor: 'Sítio Boa Vista',
      quantidadeOfertada: 100,
      selecionado: true,
    },
    {
      id: '5',
      nome: 'Banana Prata',
      unidade: 'kg',
      valor: 5.00,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 60,
      selecionado: false,
    },
  ]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    mercado: 'Feira do Produtor',
    valorMaximo: 500.00,
    tipo: 'Venda Direta'
  };

  // Filtrar produtos pela busca
  const produtosFiltrados = useMemo(() => {
    if (!busca.trim()) return produtos;
    const termo = busca.toLowerCase();
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.fornecedor.toLowerCase().includes(termo)
    );
  }, [produtos, busca]);

  // Produtos selecionados
  const produtosSelecionados = useMemo(() => {
    return produtos.filter(p => p.selecionado);
  }, [produtos]);

  // Cálculos
  const valorTotal = produtosSelecionados.reduce((acc, p) => acc + (p.valor * p.quantidadeOfertada), 0);
  const saldo = ciclo.valorMaximo - valorTotal;
  const quantidadeTotal = produtosSelecionados.length;
  const excedeuValor = valorTotal > ciclo.valorMaximo;

  const handleToggleProduto = (id: string) => {
    setProdutos(prev => prev.map(p => 
      p.id === id ? { ...p, selecionado: !p.selecionado } : p
    ));
  };

  const handleRemoverProduto = (id: string) => {
    setProdutos(prev => prev.map(p => 
      p.id === id ? { ...p, selecionado: false } : p
    ));
  };

  const handlePublicarClick = () => {
    if (excedeuValor) {
      setShowConfirmModal(true);
    } else {
      executarPublicacao();
    }
  };

  const executarPublicacao = () => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Venda direta publicada com sucesso!",
        className: "bg-green-600 text-white border-green-700",
      });
      
      console.log('Venda direta publicada:', {
        cicloId: id,
        mercadoId,
        produtos: produtosSelecionados.map(p => ({
          id: p.id,
          quantidade: p.quantidadeOfertada,
        }))
      });
    }, 1000);
  };

  const podePublicar = produtosSelecionados.length > 0;

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
        {/* Resumo fixo (sticky) */}
        <Card className="sticky top-16 z-40 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {ciclo.tipo} • {ciclo.mercado}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Qtd. Produtos</p>
                  <p className="text-2xl font-bold">{quantidadeTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Máximo</p>
                  <p className="text-2xl font-bold">{formatBRL(ciclo.valorMaximo)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatBRL(valorTotal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatBRL(saldo)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Banner de alerta quando excede valor máximo */}
        {excedeuValor && (
          <Alert 
            variant="destructive" 
            className="border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]"
            role="alert"
          >
            <AlertTriangle className="h-4 w-4" aria-label="Aviso" />
            <AlertDescription className="text-sm">
              ⚠️ Valor atual excede o valor máximo permitido para este mercado.
            </AlertDescription>
          </Alert>
        )}

        {/* Produtos Selecionados */}
        {produtosSelecionados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Produtos Selecionados para Venda Direta</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="td-texto">Produto</TableHead>
                    <TableHead className="td-texto">Medida</TableHead>
                    <TableHead className="td-valor">Valor Unit.</TableHead>
                    <TableHead className="td-texto">Fornecedor</TableHead>
                    <TableHead className="td-numero">Ofertados</TableHead>
                    <TableHead className="td-numero">Pedidos</TableHead>
                    <TableHead className="td-valor">Valor Acumulado</TableHead>
                    <TableHead className="td-numero">Disponíveis</TableHead>
                    <TableHead className="td-icone">Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosSelecionados.map((produto) => {
                    const valorAcumulado = produto.valor * produto.quantidadeOfertada;
                    
                    return (
                      <TableRow key={produto.id}>
                        <TableCell className="td-texto font-medium">{produto.nome}</TableCell>
                        <TableCell className="td-texto">{produto.unidade}</TableCell>
                        <TableCell className="td-valor">{formatBRL(produto.valor)}</TableCell>
                        <TableCell className="td-texto">{produto.fornecedor}</TableCell>
                        <TableCell className="td-numero">{produto.quantidadeOfertada}</TableCell>
                        <TableCell className="td-numero">0</TableCell>
                        <TableCell className="td-valor font-medium">
                          {formatBRL(valorAcumulado)}
                        </TableCell>
                        <TableCell className="td-numero">{produto.quantidadeOfertada}</TableCell>
                        <TableCell className="td-icone">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoverProduto(produto.id)}
                            className="h-8 w-8 mx-auto transition-opacity hover:opacity-70"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Todos os Produtos Ofertados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>Todos os Produtos Ofertados</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produto ou fornecedor..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="td-icone">Selecionar</TableHead>
                  <TableHead className="td-texto">Produto</TableHead>
                  <TableHead className="td-texto">Medida</TableHead>
                  <TableHead className="td-valor">Valor Unit.</TableHead>
                  <TableHead className="td-texto">Fornecedor</TableHead>
                  <TableHead className="td-numero">Quantidade Ofertada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="td-icone">
                        <Checkbox
                          checked={produto.selecionado}
                          onCheckedChange={() => handleToggleProduto(produto.id)}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="td-texto font-medium">{produto.nome}</TableCell>
                      <TableCell className="td-texto">{produto.unidade}</TableCell>
                      <TableCell className="td-valor">{formatBRL(produto.valor)}</TableCell>
                      <TableCell className="td-texto">{produto.fornecedor}</TableCell>
                      <TableCell className="td-numero">{produto.quantidadeOfertada}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => navigate('/admin/ciclo-index')}>
                Voltar
              </Button>
              <Button 
                onClick={handlePublicarClick}
                disabled={!podePublicar || isLoading}
              >
                {isLoading ? 'Publicando...' : 'Publicar Venda Direta'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Liberar venda direta?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso publicará a venda direta do <strong>{ciclo.mercado}</strong> no ciclo <strong>{ciclo.nome}</strong> para os consumidores.
              {excedeuValor && (
                <span className="block mt-2 text-orange-600">
                  ⚠️ O valor total excede o limite permitido.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executarPublicacao}>
              Liberar Venda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
