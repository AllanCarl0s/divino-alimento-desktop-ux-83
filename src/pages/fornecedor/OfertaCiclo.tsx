import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Search, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { formatBRLInput, parseBRLToNumber } from '@/utils/currency';

interface ProdutoOfertado {
  id: string;
  produtoId: string;
  nome: string;
  unidade: string;
  valor: number;
  quantidade: number;
}

export default function OfertaCiclo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [periodoAberto, setPeriodoAberto] = useState(true);
  const [ofertaEnviada, setOfertaEnviada] = useState(false);
  const [busca, setBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valor, setValor] = useState('');
  const [produtosOfertados, setProdutosOfertados] = useState<ProdutoOfertado[]>([]);

  // Mock data - ciclo info
  const ciclo = {
    id: id || '1',
    nome: '1º Ciclo de Novembro 2025',
    inicioOfertas: '02/11/2025',
    fimOfertas: '17/11/2025',
    status: 'ativo'
  };

  // Mock produtos disponíveis
  const produtosDisponiveis = [
    { id: '1', nome: 'Tomate Orgânico', unidade: 'kg' },
    { id: '2', nome: 'Alface Crespa', unidade: 'kg' },
    { id: '3', nome: 'Ovos Caipiras', unidade: 'dúzia' },
    { id: '4', nome: 'Mel Orgânico', unidade: 'litro' }
  ];

  useEffect(() => {
    // Simular verificação de período
    const hoje = new Date();
    const fim = new Date('2025-11-17');
    setPeriodoAberto(hoje <= fim);
  }, []);

  const handleAdicionarProduto = () => {
    if (!produtoSelecionado || !quantidade || !valor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const produto = produtosDisponiveis.find(p => p.id === produtoSelecionado);
    if (!produto) return;

    const novoProduto: ProdutoOfertado = {
      id: Date.now().toString(),
      produtoId: produto.id,
      nome: produto.nome,
      unidade: produto.unidade,
      valor: parseBRLToNumber(valor),
      quantidade: parseFloat(quantidade)
    };

    setProdutosOfertados([...produtosOfertados, novoProduto]);
    setProdutoSelecionado('');
    setQuantidade('');
    setValor('');
    
    toast({
      title: "Sucesso",
      description: "Produto adicionado à oferta.",
    });
  };

  const handleRemoverProduto = (id: string) => {
    setProdutosOfertados(produtosOfertados.filter(p => p.id !== id));
    toast({
      title: "Produto removido",
      description: "O produto foi removido da oferta.",
    });
  };

  const handleEnviarOferta = () => {
    if (produtosOfertados.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setOfertaEnviada(true);
    
    toast({
      title: "Oferta enviada!",
      description: "Sua oferta foi registrada com sucesso.",
    });
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
        {/* Cabeçalho com informações do ciclo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Período: {ciclo.inicioOfertas} – {ciclo.fimOfertas}
                </p>
              </div>
              <Badge variant={periodoAberto ? "success" : "destructive"}>
                {periodoAberto ? "Período de oferta aberto" : "Período encerrado"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Barra de progresso */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm font-medium">Período aberto</span>
          </div>
          <div className={`w-16 h-1 ${ofertaEnviada ? 'bg-primary' : 'bg-primary'}`}></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${ofertaEnviada ? 'bg-primary' : 'bg-primary'} text-primary-foreground flex items-center justify-center font-semibold`}>
              2
            </div>
            <span className="text-sm font-medium">Seleção de produtos</span>
          </div>
          <div className={`w-16 h-1 ${ofertaEnviada ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${ofertaEnviada ? 'bg-primary' : 'bg-muted'} ${ofertaEnviada ? 'text-primary-foreground' : 'text-muted-foreground'} flex items-center justify-center font-semibold`}>
              3
            </div>
            <span className={`text-sm font-medium ${ofertaEnviada ? 'text-foreground' : 'text-muted-foreground'}`}>Oferta enviada</span>
          </div>
        </div>

        {ofertaEnviada ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">Oferta Enviada com Sucesso!</h3>
              <p className="text-muted-foreground">
                Sua oferta foi registrada e está sendo processada.
              </p>
              <Button onClick={() => navigate('/fornecedor/cronograma')} className="mt-4">
                Voltar ao Cronograma
              </Button>
            </CardContent>
          </Card>
        ) : periodoAberto ? (
          <>
            {/* Formulário de adição */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Produto à Oferta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Produto *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Digite o nome do produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={produtoSelecionado}
                      onChange={(e) => setProdutoSelecionado(e.target.value)}
                      className="w-full mt-2 p-2 border rounded-md"
                    >
                      <option value="">Selecione um produto</option>
                      {produtosDisponiveis
                        .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
                        .map(produto => (
                          <option key={produto.id} value={produto.id}>
                            {produto.nome} ({produto.unidade})
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Quantidade *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label>Valor Unitário (R$) *</Label>
                    <Input
                      placeholder="0,00"
                      value={valor}
                      onChange={(e) => setValor(formatBRLInput(e.target.value))}
                    />
                  </div>
                </div>

                <Button onClick={handleAdicionarProduto} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
              </CardContent>
            </Card>

            {/* Lista de produtos ofertados */}
            {produtosOfertados.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Ofertados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Valor Unitário</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosOfertados.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>{produto.unidade}</TableCell>
                          <TableCell>R$ {produto.valor.toFixed(2).replace('.', ',')}</TableCell>
                          <TableCell>{produto.quantidade}</TableCell>
                          <TableCell>R$ {(produto.valor * produto.quantidade).toFixed(2).replace('.', ',')}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoverProduto(produto.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => navigate('/admin/ciclo-index')}>
                      Cancelar
                    </Button>
                    <Button onClick={handleEnviarOferta}>
                      Enviar Oferta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Período para ofertas encerrado. Não há produtos ofertados por você.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
}
