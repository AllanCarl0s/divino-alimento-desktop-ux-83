import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Pencil, Trash2, Search, Info, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatBRL, formatBRLInput, parseBRLToNumber } from '@/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProdutoComercializavel, OfertaProduto, criarDescricaoProduto, CertificacaoType, TipoAgriculturaType } from '@/types/produto-oferta';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const { activeRole } = useAuth();
  const { id: cicloId } = useParams();
  
  const [ofertas, setOfertas] = useState<OfertaProduto[]>([]);
  const [editingOferta, setEditingOferta] = useState<OfertaProduto | null>(null);
  const [searchProduto, setSearchProduto] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ofertaToDelete, setOfertaToDelete] = useState<string | null>(null);
  
  // Form state
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');
  const [precoBaseSugerido, setPrecoBaseSugerido] = useState<number | null>(null);
  const [salvandoOferta, setSalvandoOferta] = useState(false);
  const [certificacao, setCertificacao] = useState<CertificacaoType | ''>('');
  const [tipoAgricultura, setTipoAgricultura] = useState<TipoAgriculturaType | ''>('');

  // Refs para foco automático
  const valorInputRef = useRef<HTMLInputElement>(null);
  const quantidadeInputRef = useRef<HTMLInputElement>(null);

  // Carregar ofertas do localStorage na montagem
  useEffect(() => {
    const ofertasSalvas = localStorage.getItem(`ofertas-ciclo-${cicloId}`);
    if (ofertasSalvas) {
      setOfertas(JSON.parse(ofertasSalvas));
    }
  }, [cicloId]);

  // Mock ciclo data
  const mockCiclo = {
    id: cicloId || '1',
    nome: '1º Ciclo de Novembro 2025',
    data_inicio_oferta: new Date('2025-11-01'),
    data_fim_oferta: new Date('2025-11-07'),
    data_inicio_ciclo: new Date('2025-11-10'),
    data_fim_ciclo: new Date('2025-11-16'),
  };

  // Forçar período de oferta aberto para testes (UC011)
  const periodoOfertaAberto = true; // Status forçado: Liberado

  // Produtos filtrados pela busca
  const produtosFiltrados = useMemo(() => {
    if (!searchProduto) return mockProdutosComercializaveis;
    
    const busca = searchProduto.toLowerCase();
    return mockProdutosComercializaveis.filter(p => 
      p.produto_base_nome.toLowerCase().includes(busca) ||
      p.unidade.toLowerCase().includes(busca)
    );
  }, [searchProduto]);

  // Ao selecionar um produto, preencher o valor unitário com o preço base e focar
  useEffect(() => {
    if (selectedProdutoId && !editingOferta) {
      const produto = mockProdutosComercializaveis.find(p => p.id === selectedProdutoId);
      if (produto) {
        const precoFormatado = produto.preco_base.toFixed(2).replace('.', ',');
        setValorUnitario(precoFormatado);
        setPrecoBaseSugerido(produto.preco_base);
        // Focar no campo de valor após seleção
        setTimeout(() => valorInputRef.current?.focus(), 100);
      }
    }
  }, [selectedProdutoId, editingOferta]);

  // Validar se o formulário está completo
  const isFormValid = useMemo(() => {
    if (!selectedProdutoId || !valorUnitario || !quantidadeDisponivel || !certificacao || !tipoAgricultura) return false;
    const valor = parseBRLToNumber(valorUnitario);
    const qtd = parseInt(quantidadeDisponivel);
    return valor >= 0.01 && qtd >= 1 && !isNaN(valor) && !isNaN(qtd);
  }, [selectedProdutoId, valorUnitario, quantidadeDisponivel, certificacao, tipoAgricultura]);

  const handleLimparFormulario = () => {
    setEditingOferta(null);
    setSelectedProdutoId('');
    setValorUnitario('');
    setQuantidadeDisponivel('');
    setPrecoBaseSugerido(null);
    setCertificacao('');
    setTipoAgricultura('');
  };

  const handleAdicionarProduto = () => {
    if (!isFormValid) {
      const errors: string[] = [];
      if (!selectedProdutoId) errors.push('Produto');
      if (!valorUnitario) errors.push('Valor Unitário');
      if (!quantidadeDisponivel) errors.push('Quantidade');
      if (!certificacao) errors.push('Certificação');
      if (!tipoAgricultura) errors.push('Tipo de agricultura');
      
      toast({
        title: 'Campos obrigatórios não preenchidos',
        description: `Preencha: ${errors.join(', ')}. Valor deve ser ≥ R$ 0,01 e Quantidade ≥ 1.`,
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
              certificacao: certificacao as CertificacaoType,
              tipo_agricultura: tipoAgricultura as TipoAgriculturaType,
            }
          : o
      ));
      toast({ title: 'Produto atualizado', description: 'O produto foi atualizado na oferta.' });
    } else {
      // Criar nova oferta
      const novaOferta: OfertaProduto = {
        id: `oferta-${Date.now()}`,
        ciclo_id: cicloId || '',
        mercado_ciclo_id: '',
        produto_comercializavel_id: selectedProdutoId,
        produto_base_nome: produto.produto_base_nome,
        unidade: produto.unidade,
        peso: produto.peso,
        volume: produto.volume,
        preco_base: produto.preco_base,
        valor_unitario: valor,
        quantidade_disponivel: quantidade,
        certificacao: certificacao as CertificacaoType,
        tipo_agricultura: tipoAgricultura as TipoAgriculturaType,
      };
      setOfertas([...ofertas, novaOferta]);
      toast({ title: 'Produto adicionado', description: 'O produto foi adicionado à oferta.' });
    }

    handleLimparFormulario();
  };

  const handleEditarOferta = (oferta: OfertaProduto) => {
    setEditingOferta(oferta);
    setSelectedProdutoId(oferta.produto_comercializavel_id);
    const precoFormatado = oferta.valor_unitario.toFixed(2).replace('.', ',');
    setValorUnitario(precoFormatado);
    setQuantidadeDisponivel(oferta.quantidade_disponivel.toString());
    setPrecoBaseSugerido(oferta.preco_base);
    setCertificacao(oferta.certificacao);
    setTipoAgricultura(oferta.tipo_agricultura);
    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = (id: string) => {
    setOfertaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteOferta = () => {
    if (ofertaToDelete) {
      setOfertas(ofertas.filter(o => o.id !== ofertaToDelete));
      toast({ title: 'Produto removido', description: 'O produto foi removido da oferta.' });
      setOfertaToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleValorUnitarioBlur = () => {
    // Após sair do campo de preço, focar quantidade
    quantidadeInputRef.current?.focus();
  };

  const getTotalOfertas = () => {
    return ofertas.reduce((sum, o) => sum + o.quantidade_disponivel, 0);
  };

  const getValorTotal = () => {
    return ofertas.reduce((sum, o) => sum + (o.valor_unitario * o.quantidade_disponivel), 0);
  };

  const handleSalvarOferta = async () => {
    if (ofertas.length === 0) {
      toast({
        title: 'Nenhum produto na oferta',
        description: 'Adicione pelo menos um produto antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    setSalvandoOferta(true);

    // Simular salvamento no backend (substituir por chamada API real)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Persistir no localStorage
    localStorage.setItem(`ofertas-ciclo-${cicloId}`, JSON.stringify(ofertas));

    // Log de auditoria (em produção, enviar ao backend)
    console.log('Auditoria - Oferta Registrada:', {
      usuario: 'Admin',
      ciclo: mockCiclo.nome,
      ciclo_id: cicloId,
      timestamp: new Date().toISOString(),
      total_produtos: ofertas.length,
      total_itens: getTotalOfertas(),
      valor_total: getValorTotal(),
      produtos: ofertas.map(o => ({
        produto: o.produto_base_nome,
        unidade: o.unidade,
        quantidade: o.quantidade_disponivel,
        valor_unitario: o.valor_unitario,
        valor_total: o.valor_unitario * o.quantidade_disponivel
      }))
    });

    setSalvandoOferta(false);

    toast({
      title: '✓ Oferta registrada com sucesso',
      description: `${ofertas.length} produto(s) salvos no ciclo ${mockCiclo.nome}`,
      duration: 4000,
    });
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (activeRole === 'fornecedor') {
              navigate('/fornecedor/selecionar-ciclo');
            } else if (activeRole === 'admin_mercado') {
              navigate('/adminmercado/ciclo-index');
            } else {
              navigate('/admin/ciclo-index');
            }
          }}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0 space-y-6">
            {/* Title and Badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {activeRole === 'fornecedor' ? 'Fornecedor - ' : activeRole === 'admin_mercado' ? 'Administrador de mercado - ' : ''}{mockCiclo.nome}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Período: {format(mockCiclo.data_inicio_oferta, 'dd/MM/yyyy', { locale: ptBR })} - {format(mockCiclo.data_fim_oferta, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <Badge 
                variant={periodoOfertaAberto ? "default" : "secondary"}
                className={periodoOfertaAberto ? "bg-green-600 hover:bg-green-700 text-white whitespace-nowrap" : "bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap"}
              >
                {periodoOfertaAberto ? "Período de oferta aberto" : "Período de oferta encerrado"}
              </Badge>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-3 py-4">
              {/* Etapa 1 - Completa */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">Período aberto</span>
              </div>
              
              <div className="h-0.5 w-12 md:w-20 bg-green-600" />
              
              {/* Etapa 2 - Ativa */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold">
                  2
                </div>
                <span className="text-sm font-medium text-foreground">Seleção de produtos</span>
              </div>
              
              <div className="h-0.5 w-12 md:w-20 bg-muted" />
              
              {/* Etapa 3 - Pendente */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-muted text-muted-foreground font-bold">
                  3
                </div>
                <span className="text-sm font-medium text-muted-foreground">Oferta enviada</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {formatBRL(getValorTotal())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário inline - Adicionar Produto à Oferta */}
        <Card>
          <CardHeader>
            <CardTitle>{editingOferta ? 'Editar Produto' : 'Adicionar Produto à Oferta'}</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <SelectContent className="max-h-[300px] bg-background z-50">
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
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="valor">Valor Unitário (R$) *</Label>
                  {precoBaseSugerido && (
                    <Badge variant="secondary" className="gap-1">
                      <Info className="h-3 w-3" />
                      Preço Base
                    </Badge>
                  )}
                </div>
                <Input
                  ref={valorInputRef}
                  id="valor"
                  placeholder="0,00"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(formatBRLInput(e.target.value))}
                  onBlur={handleValorUnitarioBlur}
                  aria-describedby="valor-hint"
                />
                <p id="valor-hint" className="text-xs text-muted-foreground mt-1">
                  Valor sugerido (Preço Base). Você pode editar.
                </p>
              </div>

              {/* Quantidade Disponível */}
              <div>
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  ref={quantidadeInputRef}
                  id="quantidade"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantidadeDisponivel}
                  onChange={(e) => setQuantidadeDisponivel(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Informe a quantidade disponível (mínimo 1)
                </p>
              </div>

              {/* Certificações & Etiquetas */}
              <div className="border-t pt-4 mt-2">
                <h3 className="text-base font-semibold mb-4">Certificações & Etiquetas</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Certificação */}
                  <Card>
                    <CardContent className="pt-6">
                      <fieldset>
                        <legend className="text-sm font-medium mb-3">Certificação do produto *</legend>
                        <RadioGroup value={certificacao} onValueChange={(value) => setCertificacao(value as CertificacaoType)}>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="organico" id="cert-organico" />
                              <Label htmlFor="cert-organico" className="font-normal cursor-pointer">Produto orgânico</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="transicao" id="cert-transicao" />
                              <Label htmlFor="cert-transicao" className="font-normal cursor-pointer">Produto em transição agroecológica</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="convencional" id="cert-convencional" />
                              <Label htmlFor="cert-convencional" className="font-normal cursor-pointer">Produto convencional</Label>
                            </div>
                          </div>
                        </RadioGroup>
                        {!certificacao && selectedProdutoId && (
                          <p className="text-xs text-destructive mt-2">Selecione uma certificação</p>
                        )}
                      </fieldset>
                    </CardContent>
                  </Card>

                  {/* Tipo de Agricultura */}
                  <Card>
                    <CardContent className="pt-6">
                      <fieldset>
                        <legend className="text-sm font-medium mb-3">Tipo de agricultura *</legend>
                        <RadioGroup value={tipoAgricultura} onValueChange={(value) => setTipoAgricultura(value as TipoAgriculturaType)}>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="familiar" id="agri-familiar" />
                              <Label htmlFor="agri-familiar" className="font-normal cursor-pointer">Agricultura familiar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao_familiar" id="agri-nao-familiar" />
                              <Label htmlFor="agri-nao-familiar" className="font-normal cursor-pointer">Agricultura não familiar</Label>
                            </div>
                          </div>
                        </RadioGroup>
                        {!tipoAgricultura && selectedProdutoId && (
                          <p className="text-xs text-destructive mt-2">Selecione o tipo de agricultura</p>
                        )}
                      </fieldset>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 justify-end pt-2">
                {editingOferta && (
                  <Button variant="outline" onClick={handleLimparFormulario}>
                    Cancelar
                  </Button>
                )}
                <Button 
                  onClick={handleAdicionarProduto}
                  disabled={!isFormValid}
                >
                  {editingOferta ? 'Atualizar Produto' : 'Adicionar Produto'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos Ofertados Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produtos Ofertados</CardTitle>
            {ofertas.length > 0 && (
              <Button 
                onClick={handleSalvarOferta}
                disabled={salvandoOferta}
                className="bg-green-600 hover:bg-green-700"
              >
                {salvandoOferta ? 'Salvando...' : 'Salvar Oferta'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {ofertas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum produto adicionado. Use o formulário acima para adicionar produtos à oferta.
              </p>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Peso/Volume</TableHead>
                        <TableHead>Preço Base</TableHead>
                        <TableHead>Valor Unitário</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Certificação</TableHead>
                        <TableHead>Tipo de agricultura</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ofertas.map((oferta) => {
                        const total = oferta.valor_unitario * oferta.quantidade_disponivel;
                        const precoAlterado = oferta.valor_unitario !== oferta.preco_base;
                        
                        return (
                          <TableRow key={oferta.id}>
                            <TableCell className="font-medium">{oferta.produto_base_nome}</TableCell>
                            <TableCell>{oferta.unidade}</TableCell>
                            <TableCell>
                              {oferta.peso ? `${oferta.peso.toFixed(2)} kg` : 
                               oferta.volume ? `${oferta.volume.toFixed(2)} L` : '-'}
                            </TableCell>
                            <TableCell>{formatBRL(oferta.preco_base)}</TableCell>
                            <TableCell>
                              {precoAlterado ? (
                                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700">
                                  {formatBRL(oferta.valor_unitario)}
                                </Badge>
                              ) : (
                                <span>{formatBRL(oferta.valor_unitario)}</span>
                              )}
                            </TableCell>
                            <TableCell>{oferta.quantidade_disponivel}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={oferta.certificacao === 'organico' ? 'success' : oferta.certificacao === 'transicao' ? 'warning' : 'secondary'}
                                className={
                                  oferta.certificacao === 'organico' 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : oferta.certificacao === 'transicao' 
                                    ? 'bg-lime-600 text-white hover:bg-lime-700' 
                                    : 'bg-slate-500 text-white hover:bg-slate-600'
                                }
                              >
                                {oferta.certificacao === 'organico' ? 'Orgânico' : oferta.certificacao === 'transicao' ? 'Transição' : 'Convencional'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={
                                  oferta.tipo_agricultura === 'familiar' 
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
                                }
                              >
                                {oferta.tipo_agricultura === 'familiar' ? 'Agri. familiar' : 'Agri. não familiar'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold">
                              {formatBRL(total)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditarOferta(oferta)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleConfirmDelete(oferta.id)}
                                  className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                  {ofertas.map((oferta) => {
                    const total = oferta.valor_unitario * oferta.quantidade_disponivel;
                    const precoAlterado = oferta.valor_unitario !== oferta.preco_base;
                    
                    return (
                      <Card key={oferta.id} className="p-4">
                        <div className="space-y-3">
                          {/* Linha 1: Produto e Total */}
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-base">{oferta.produto_base_nome}</h3>
                            <span className="font-bold text-primary whitespace-nowrap">
                              {formatBRL(total)}
                            </span>
                          </div>

                          {/* Linha 2: Medida, Valor Unit, Quantidade */}
                          <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                            <span>{oferta.unidade}</span>
                            <span>|</span>
                            <span>
                              {precoAlterado ? (
                                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-xs">
                                  {formatBRL(oferta.valor_unitario)}
                                </Badge>
                              ) : (
                                formatBRL(oferta.valor_unitario)
                              )}
                            </span>
                            <span>|</span>
                            <span>Qtd: {oferta.quantidade_disponivel}</span>
                          </div>

                          {/* Linha 3: Badges de Certificação e Tipo */}
                          <div className="flex gap-2 flex-wrap">
                            <Badge 
                              variant={oferta.certificacao === 'organico' ? 'success' : oferta.certificacao === 'transicao' ? 'warning' : 'secondary'}
                              className={
                                oferta.certificacao === 'organico' 
                                  ? 'bg-green-600 text-white hover:bg-green-700' 
                                  : oferta.certificacao === 'transicao' 
                                  ? 'bg-lime-600 text-white hover:bg-lime-700' 
                                  : 'bg-slate-500 text-white hover:bg-slate-600'
                              }
                            >
                              {oferta.certificacao === 'organico' ? 'Orgânico' : oferta.certificacao === 'transicao' ? 'Transição' : 'Convencional'}
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className={
                                oferta.tipo_agricultura === 'familiar' 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100' 
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
                              }
                            >
                              {oferta.tipo_agricultura === 'familiar' ? 'Agri. familiar' : 'Agri. não familiar'}
                            </Badge>
                          </div>

                          {/* Botões de ação */}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditarOferta(oferta)}
                              className="flex-1"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmDelete(oferta.id)}
                              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este produto da oferta? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOfertaToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteOferta} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ResponsiveLayout>
  );
}
