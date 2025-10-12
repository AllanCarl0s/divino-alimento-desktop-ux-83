import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatBRLInput, parseBRLToNumber } from '@/utils/currency';
import { ProdutoComercializavel, OfertaProduto, agruparPorProdutoBase, criarDescricaoProduto } from '@/types/produto-oferta';

// Mock data - produtos comercializáveis
const mockProdutosComercializaveis: ProdutoComercializavel[] = [
  {
    id: 'pc1',
    produto_base_id: 'pb1',
    produto_base_nome: 'Tomate Orgânico',
    unidade: 'Unidade',
    peso: 0.15,
    preco_base: 0.68,
    quantidade: 1,
    status: 'ativo',
    certificado: true,
    agricultura_familiar: true,
  },
  {
    id: 'pc2',
    produto_base_id: 'pb1',
    produto_base_nome: 'Tomate Orgânico',
    unidade: 'Cesta',
    peso: 1.0,
    preco_base: 4.50,
    quantidade: 1,
    status: 'ativo',
    certificado: true,
    agricultura_familiar: true,
  },
  {
    id: 'pc3',
    produto_base_id: 'pb1',
    produto_base_nome: 'Tomate Orgânico',
    unidade: 'Dúzia',
    peso: 1.8,
    preco_base: 8.00,
    quantidade: 12,
    status: 'ativo',
    certificado: true,
    agricultura_familiar: true,
  },
  {
    id: 'pc4',
    produto_base_id: 'pb2',
    produto_base_nome: 'Alface Hidropônica',
    unidade: 'Unidade',
    peso: 0.3,
    preco_base: 2.50,
    quantidade: 1,
    status: 'ativo',
    certificado: false,
    agricultura_familiar: true,
  },
  {
    id: 'pc5',
    produto_base_id: 'pb2',
    produto_base_nome: 'Alface Hidropônica',
    unidade: 'Caixa',
    peso: 3.0,
    preco_base: 25.00,
    quantidade: 10,
    status: 'ativo',
    certificado: false,
    agricultura_familiar: true,
  },
];

export default function AdminOferta() {
  const navigate = useNavigate();
  const { id: cicloId } = useParams();
  
  const [ofertas, setOfertas] = useState<OfertaProduto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOferta, setEditingOferta] = useState<OfertaProduto | null>(null);
  const [searchProduto, setSearchProduto] = useState('');
  
  // Form state
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');

  // Mock ciclo data
  const cicloNome = '1º Ciclo de Novembro 2025';

  // Agrupar produtos por produto base
  const produtosAgrupados = useMemo(() => {
    return agruparPorProdutoBase(mockProdutosComercializaveis);
  }, []);

  // Produtos filtrados pela busca
  const produtosFiltrados = useMemo(() => {
    if (!searchProduto) return mockProdutosComercializaveis;
    
    const busca = searchProduto.toLowerCase();
    return mockProdutosComercializaveis.filter(p => 
      p.produto_base_nome.toLowerCase().includes(busca) ||
      p.unidade.toLowerCase().includes(busca)
    );
  }, [searchProduto]);

  // Ao selecionar um produto, preencher o valor unitário com o preço base
  useEffect(() => {
    if (selectedProdutoId && !editingOferta) {
      const produto = mockProdutosComercializaveis.find(p => p.id === selectedProdutoId);
      if (produto) {
        setValorUnitario(formatBRLInput(produto.preco_base.toFixed(2)));
      }
    }
  }, [selectedProdutoId, editingOferta]);

  const handleOpenDialog = (oferta?: OfertaProduto) => {
    if (oferta) {
      setEditingOferta(oferta);
      setSelectedProdutoId(oferta.produto_comercializavel_id);
      setValorUnitario(formatBRLInput(oferta.valor_unitario.toFixed(2)));
      setQuantidadeDisponivel(oferta.quantidade_disponivel.toString());
    } else {
      setEditingOferta(null);
      setSelectedProdutoId('');
      setValorUnitario('');
      setQuantidadeDisponivel('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingOferta(null);
    setSelectedProdutoId('');
    setValorUnitario('');
    setQuantidadeDisponivel('');
  };

  const handleSaveOferta = () => {
    if (!selectedProdutoId || !valorUnitario || !quantidadeDisponivel) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para continuar.',
        variant: 'destructive',
      });
      return;
    }

    const produto = mockProdutosComercializaveis.find(p => p.id === selectedProdutoId);
    if (!produto) return;

    const valor = parseBRLToNumber(valorUnitario);
    const quantidade = parseInt(quantidadeDisponivel);

    if (editingOferta) {
      // Atualizar oferta existente
      setOfertas(ofertas.map(o => 
        o.id === editingOferta.id 
          ? {
              ...o,
              produto_comercializavel_id: selectedProdutoId,
              produto_base_nome: produto.produto_base_nome,
              unidade: produto.unidade,
              peso: produto.peso,
              volume: produto.volume,
              preco_base: produto.preco_base,
              valor_unitario: valor,
              quantidade_disponivel: quantidade,
            }
          : o
      ));
      toast({ title: 'Oferta atualizada', description: 'A oferta foi atualizada com sucesso.' });
    } else {
      // Criar nova oferta
      const novaOferta: OfertaProduto = {
        id: `oferta-${Date.now()}`,
        ciclo_id: cicloId || '',
        mercado_ciclo_id: '', // Será preenchido pelo contexto do mercado
        produto_comercializavel_id: selectedProdutoId,
        produto_base_nome: produto.produto_base_nome,
        unidade: produto.unidade,
        peso: produto.peso,
        volume: produto.volume,
        preco_base: produto.preco_base,
        valor_unitario: valor,
        quantidade_disponivel: quantidade,
      };
      setOfertas([...ofertas, novaOferta]);
      toast({ title: 'Oferta criada', description: 'A oferta foi criada com sucesso.' });
    }

    handleCloseDialog();
  };

  const handleDeleteOferta = (id: string) => {
    setOfertas(ofertas.filter(o => o.id !== id));
    toast({ title: 'Oferta excluída', description: 'A oferta foi excluída com sucesso.' });
  };

  const getTotalOfertas = () => {
    return ofertas.reduce((sum, o) => sum + o.quantidade_disponivel, 0);
  };

  const getValorTotal = () => {
    return ofertas.reduce((sum, o) => sum + (o.valor_unitario * o.quantidade_disponivel), 0);
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
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Criar/Editar Oferta</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Ciclo: {cicloNome}
          </p>
        </div>

        {/* Summary Card */}
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                <p className="text-2xl font-bold text-primary">{getTotalOfertas()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Estimado</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {getValorTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Oferta
          </Button>
        </div>

        {/* Produtos Ofertados Table */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Ofertados</CardTitle>
          </CardHeader>
          <CardContent>
            {ofertas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma oferta cadastrada. Clique em "Nova Oferta" para começar.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Peso/Volume</TableHead>
                    <TableHead>Preço Base</TableHead>
                    <TableHead>Valor Unitário</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ofertas.map((oferta) => (
                    <TableRow key={oferta.id}>
                      <TableCell className="font-medium">{oferta.produto_base_nome}</TableCell>
                      <TableCell>{oferta.unidade}</TableCell>
                      <TableCell>
                        {oferta.peso ? `${oferta.peso.toFixed(2)} kg` : 
                         oferta.volume ? `${oferta.volume.toFixed(2)} L` : '-'}
                      </TableCell>
                      <TableCell>R$ {oferta.preco_base.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={oferta.valor_unitario !== oferta.preco_base ? 'warning' : 'secondary'}>
                          R$ {oferta.valor_unitario.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>{oferta.quantidade_disponivel}</TableCell>
                      <TableCell className="font-bold">
                        R$ {(oferta.valor_unitario * oferta.quantidade_disponivel).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDialog(oferta)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteOferta(oferta.id)}
                            className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog para criar/editar oferta */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingOferta ? 'Editar Oferta' : 'Nova Oferta'}</DialogTitle>
              <DialogDescription>
                Selecione o produto e configure os valores da oferta.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Busca de produto */}
              <div>
                <Label htmlFor="search">Buscar Produto</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Digite o nome do produto..."
                    value={searchProduto}
                    onChange={(e) => setSearchProduto(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Seleção de produto */}
              <div>
                <Label htmlFor="produto">Produto *</Label>
                <Select value={selectedProdutoId} onValueChange={setSelectedProdutoId}>
                  <SelectTrigger id="produto">
                    <SelectValue placeholder="Selecione o produto e variação" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {produtosFiltrados.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {criarDescricaoProduto(produto)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Todas as variações do mesmo produto base estão disponíveis
                </p>
              </div>

              {/* Valor Unitário */}
              <div>
                <Label htmlFor="valor">Valor Unitário (R$) *</Label>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(formatBRLInput(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor preenchido automaticamente com o Preço Base, mas pode ser editado
                </p>
              </div>

              {/* Quantidade Disponível */}
              <div>
                <Label htmlFor="quantidade">Quantidade Disponível *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantidadeDisponivel}
                  onChange={(e) => setQuantidadeDisponivel(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSaveOferta}>
                {editingOferta ? 'Atualizar' : 'Criar'} Oferta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
}
