import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { formatBRL } from '@/utils/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProdutoVendido {
  id: string;
  nome: string;
  unidade: string;
  fornecedor: string;
  valor: number;
  quantidadeVendida: number;
  bloqueado: boolean;
}

interface ProdutoMultiFornecedor {
  id: string;
  nome: string;
  unidade: string;
  quantidadeVendida: number;
  fornecedores: {
    id: string;
    nome: string;
    valor: number;
  }[];
}

export default function AdminComposicaoVendaDiretaCompor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get('mercado');
  
  const [isLoading, setIsLoading] = useState(false);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<Map<string, string>>(new Map());

  // Produtos com único fornecedor (auto-preenchidos e bloqueados)
  const [produtosUnicos] = useState<ProdutoVendido[]>([
    {
      id: '1',
      nome: 'Ovos Caipiras',
      unidade: 'dúzia',
      fornecedor: 'Sítio Boa Vista',
      valor: 15.00,
      quantidadeVendida: 20,
      bloqueado: true,
    },
    {
      id: '2',
      nome: 'Banana Prata',
      unidade: 'kg',
      fornecedor: 'João Produtor',
      valor: 5.00,
      quantidadeVendida: 30,
      bloqueado: true,
    },
  ]);

  // Produtos com múltiplos fornecedores (requerem seleção)
  const [produtosMulti] = useState<ProdutoMultiFornecedor[]>([
    {
      id: '3',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      quantidadeVendida: 25,
      fornecedores: [
        { id: 'f1', nome: 'João Produtor', valor: 4.50 },
        { id: 'f2', nome: 'Maria Horta', valor: 4.20 },
        { id: 'f3', nome: 'Sítio Verde', valor: 4.80 },
      ],
    },
    {
      id: '4',
      nome: 'Alface Crespa',
      unidade: 'maço',
      quantidadeVendida: 15,
      fornecedores: [
        { id: 'f4', nome: 'João Produtor', valor: 2.00 },
        { id: 'f5', nome: 'Maria Horta', valor: 1.80 },
      ],
    },
  ]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    mercado: 'Feira do Produtor',
    valorMaximo: 500.00,
    tipo: 'Venda Direta'
  };

  // Calcular valores
  const valorTotalUnicos = produtosUnicos.reduce((acc, p) => 
    acc + (p.valor * p.quantidadeVendida), 0
  );

  const valorTotalMulti = useMemo(() => {
    let total = 0;
    produtosMulti.forEach(produto => {
      const fornecedorId = fornecedoresSelecionados.get(produto.id);
      if (fornecedorId) {
        const fornecedor = produto.fornecedores.find(f => f.id === fornecedorId);
        if (fornecedor) {
          total += fornecedor.valor * produto.quantidadeVendida;
        }
      }
    });
    return total;
  }, [produtosMulti, fornecedoresSelecionados]);

  const valorTotal = valorTotalUnicos + valorTotalMulti;
  const valorTotalVendas = valorTotal; // Mesmo valor para demonstração
  const saldo = ciclo.valorMaximo - valorTotal;

  const handleSelecionarFornecedor = (produtoId: string, fornecedorId: string) => {
    setFornecedoresSelecionados(prev => {
      const newMap = new Map(prev);
      newMap.set(produtoId, fornecedorId);
      return newMap;
    });
  };

  const handleSalvar = () => {
    // Validar se todos os produtos multi foram selecionados
    const todosSelecionados = produtosMulti.every(p => 
      fornecedoresSelecionados.has(p.id)
    );

    if (!todosSelecionados) {
      toast({
        title: "Atenção",
        description: "Selecione um fornecedor para todos os produtos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Composição de vendas atualizada com sucesso!",
        className: "bg-green-600 text-white border-green-700",
      });
      
      console.log('Composição salva:', {
        cicloId: id,
        mercadoId,
        produtosUnicos,
        fornecedoresSelecionados: Object.fromEntries(fornecedoresSelecionados),
      });
    }, 1000);
  };

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
                  <p className="text-sm text-muted-foreground">Valor Máximo</p>
                  <p className="text-2xl font-bold">{formatBRL(ciclo.valorMaximo)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Atual</p>
                  <p className="text-2xl font-bold">{formatBRL(valorTotal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Vendas</p>
                  <p className="text-2xl font-bold">{formatBRL(valorTotalVendas)}</p>
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

        {/* Produtos Vendidos (Auto-preenchimento) */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Vendidos (Base em Pedidos Finalizados)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="td-texto">Produto</TableHead>
                  <TableHead className="td-texto">Medida</TableHead>
                  <TableHead className="td-valor">Valor Unit.</TableHead>
                  <TableHead className="td-texto">Fornecedor</TableHead>
                  <TableHead className="td-numero">Quantidade Vendida</TableHead>
                  <TableHead className="td-valor">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosUnicos.map((produto) => {
                  const valorTotal = produto.valor * produto.quantidadeVendida;
                  
                  return (
                    <TableRow key={produto.id} className="opacity-70">
                      <TableCell className="td-texto font-medium">{produto.nome}</TableCell>
                      <TableCell className="td-texto">{produto.unidade}</TableCell>
                      <TableCell className="td-valor">{formatBRL(produto.valor)}</TableCell>
                      <TableCell className="td-texto">{produto.fornecedor}</TableCell>
                      <TableCell className="td-numero">{produto.quantidadeVendida}</TableCell>
                      <TableCell className="td-valor font-medium">
                        {formatBRL(valorTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Produtos com múltiplos fornecedores */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos com Mais de um Fornecedor (Selecione a Origem)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {produtosMulti.map((produto) => {
                const fornecedorSelecionado = fornecedoresSelecionados.get(produto.id);
                
                return (
                  <div key={produto.id} className="border rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-semibold text-lg">{produto.nome}</h4>
                      <p className="text-sm text-muted-foreground">
                        {produto.unidade} • Quantidade vendida: {produto.quantidadeVendida}
                      </p>
                    </div>
                    
                    <RadioGroup
                      value={fornecedorSelecionado || ''}
                      onValueChange={(value) => handleSelecionarFornecedor(produto.id, value)}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="td-icone">Selecionar</TableHead>
                            <TableHead className="td-texto">Fornecedor</TableHead>
                            <TableHead className="td-valor">Valor Unit.</TableHead>
                            <TableHead className="td-numero">Qtd. Vendida</TableHead>
                            <TableHead className="td-valor">Valor Acumulado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {produto.fornecedores
                            .sort((a, b) => a.nome.localeCompare(b.nome))
                            .map((fornecedor) => {
                              const valorAcumulado = fornecedor.valor * produto.quantidadeVendida;
                              
                              return (
                                <TableRow key={fornecedor.id}>
                                  <TableCell className="td-icone">
                                    <RadioGroupItem 
                                      value={fornecedor.id} 
                                      id={`${produto.id}-${fornecedor.id}`}
                                      className="mx-auto"
                                    />
                                  </TableCell>
                                  <TableCell className="td-texto">
                                    <Label 
                                      htmlFor={`${produto.id}-${fornecedor.id}`}
                                      className="cursor-pointer"
                                    >
                                      {fornecedor.nome}
                                    </Label>
                                  </TableCell>
                                  <TableCell className="td-valor">
                                    {formatBRL(fornecedor.valor)}
                                  </TableCell>
                                  <TableCell className="td-numero">
                                    {produto.quantidadeVendida}
                                  </TableCell>
                                  <TableCell className="td-valor font-medium">
                                    {formatBRL(valorAcumulado)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </RadioGroup>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => navigate('/admin/ciclo-index')}>
                Voltar
              </Button>
              <Button 
                onClick={handleSalvar}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Composição'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
}
