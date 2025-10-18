import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ciclos } from "@/fixtures/ciclos";
import { sobrasPorCiclo } from "@/fixtures/produtosSobra";
import { formatBRL } from "@/utils/currency";

interface ProdutoMigracao {
  id: string;
  produto: string;
  fornecedor: string;
  unidade: string;
  valor: number;
  ofertados: number;
  pedidos: number;
  sobraram: number;
  qtdMigrar: number;
  selecionado: boolean;
  ciclosOrigem: string[];
}

const AdminMigrarOfertas = () => {
  const { destinoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [destinoSelecionadoId, setDestinoSelecionadoId] = useState<string>(destinoId || "");
  const [ciclosOrigemIds, setCiclosOrigemIds] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<ProdutoMigracao[]>([]);
  const [busca, setBusca] = useState("");
  const [editandoProduto, setEditandoProduto] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ fornecedor: string; valor: string }>({
    fornecedor: "",
    valor: ""
  });

  const cicloDestino = ciclos.find(c => c.id === destinoSelecionadoId);
  const ciclosFinalizados = ciclos.filter(c => c.status === "Finalizado" && c.id !== destinoSelecionadoId);
  const ciclosAtivos = ciclos.filter(c => c.status === "Ativo");

  // Carregar sobras de múltiplos ciclos
  const handleCarregarSobras = () => {
    if (ciclosOrigemIds.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um ciclo de origem.",
        variant: "destructive",
      });
      return;
    }

    if (!cicloDestino) {
      toast({
        title: "Atenção",
        description: "Selecione um ciclo de destino.",
        variant: "destructive",
      });
      return;
    }

    // Mapa para agrupar produtos
    const produtosMap = new Map<string, ProdutoMigracao>();

    ciclosOrigemIds.forEach(cicloId => {
      const sobras = sobrasPorCiclo[cicloId as keyof typeof sobrasPorCiclo] || [];

      sobras.forEach(s => {
        const ofertados = s.disponivel || 0;
        const pedidos = Math.floor(ofertados * 0.4); // Mock: 40% vendidos
        const sobraram = Math.max(ofertados - pedidos, 0);

        // Chave para agrupar: produto + fornecedor + unidade
        const chave = `${s.produto}_${s.fornecedor}_${s.unidade}`;
        const existente = produtosMap.get(chave);

        if (existente) {
          // Agrupar produtos iguais
          existente.ofertados += ofertados;
          existente.pedidos += pedidos;
          existente.sobraram += sobraram;
          existente.qtdMigrar += sobraram;
          existente.ciclosOrigem.push(cicloId);
        } else {
          // Novo produto
          produtosMap.set(chave, {
            id: s.id,
            produto: s.produto,
            fornecedor: s.fornecedor,
            unidade: s.unidade,
            valor: s.valor,
            ofertados,
            pedidos,
            sobraram,
            qtdMigrar: sobraram,
            selecionado: sobraram > 0,
            ciclosOrigem: [cicloId]
          });
        }
      });
    });

    const todosProdutos = Array.from(produtosMap.values());

    if (todosProdutos.every(p => p.sobraram === 0)) {
      toast({
        title: "Atenção",
        description: "Nenhum item disponível para migração nos ciclos selecionados.",
        variant: "destructive",
      });
      return;
    }

    setProdutos(todosProdutos);
  };

  const handleToggleCicloOrigem = (cicloId: string) => {
    setCiclosOrigemIds(prev =>
      prev.includes(cicloId)
        ? prev.filter(id => id !== cicloId)
        : [...prev, cicloId]
    );
  };

  const handleToggleProduto = (id: string, checked: boolean) => {
    setProdutos(prev => prev.map(p =>
      p.id === id ? { ...p, selecionado: checked } : p
    ));
  };

  const handleQtdMigrarChange = (id: string, value: number) => {
    setProdutos(prev => prev.map(p => {
      if (p.id === id) {
        const qtd = Math.max(1, Math.min(value, p.sobraram));
        return { ...p, qtdMigrar: qtd };
      }
      return p;
    }));
  };

  const handleSelecionarTodos = () => {
    setProdutos(prev => prev.map(p =>
      p.sobraram > 0 ? { ...p, selecionado: true } : p
    ));
  };

  const handleLimparSelecao = () => {
    setProdutos(prev => prev.map(p => ({ ...p, selecionado: false })));
  };

  const handleEditarProduto = (id: string) => {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      setEditandoProduto(id);
      setEditValues({
        fornecedor: produto.fornecedor,
        valor: produto.valor.toString()
      });
    }
  };

  const handleSalvarEdicao = (id: string) => {
    setProdutos(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          fornecedor: editValues.fornecedor,
          valor: parseFloat(editValues.valor) || p.valor
        };
      }
      return p;
    }));
    setEditandoProduto(null);
  };

  const handleSalvarMigracao = () => {
    const selecionados = produtos.filter(p => p.selecionado);

    if (selecionados.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um produto para salvar.",
        variant: "destructive",
      });
      return;
    }

    if (!cicloDestino) {
      toast({
        title: "Erro",
        description: "Ciclo de destino não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (cicloDestino.status !== "Ativo") {
      toast({
        title: "Erro",
        description: "Ciclo de destino precisa estar ativo para receber migração.",
        variant: "destructive",
      });
      return;
    }

    // Simular salvamento
    toast({
      title: "✅ Ofertas migradas com sucesso!",
      description: `${selecionados.length} produtos foram adicionados ao ciclo de destino.`,
    });

    // Redirecionar para oferta do destino
    navigate(`/admin/oferta/${destinoSelecionadoId}`);
  };

  const produtosFiltrados = produtos.filter(p =>
    p.produto.toLowerCase().includes(busca.toLowerCase()) ||
    p.fornecedor.toLowerCase().includes(busca.toLowerCase())
  );

  const produtosSelecionados = produtos.filter(p => p.selecionado);
  const totalItens = produtosSelecionados.length;
  const totalQtd = produtosSelecionados.reduce((sum, p) => sum + p.qtdMigrar, 0);
  const totalValor = produtosSelecionados.reduce((sum, p) => sum + (p.qtdMigrar * p.valor), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-warning p-4">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/ciclo-index")}
            className="text-warning-foreground hover:bg-warning-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-warning-foreground">Migrar Ofertas entre Ciclos</h1>
            <p className="text-sm text-warning-foreground/80">
              Selecione o ciclo de destino e as origens de onde deseja migrar produtos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {/* Seleção de Ciclo Destino (se não houver destinoId válido) */}
        {!cicloDestino && (
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardHeader>
              <CardTitle>Selecione o Ciclo de Destino</CardTitle>
              <CardDescription>
                Escolha um ciclo ativo para onde deseja migrar as ofertas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={destinoSelecionadoId} onValueChange={setDestinoSelecionadoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ciclo de destino (Ativo/Iniciado)" />
                </SelectTrigger>
                <SelectContent>
                  {ciclosAtivos.map((ciclo) => (
                    <SelectItem key={ciclo.id} value={ciclo.id}>
                      {ciclo.nome} • {ciclo.periodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Card do Ciclo Destino */}
        {cicloDestino && (
          <>
            <Card className="mb-6 border-primary/20 bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-primary">Ciclo de Destino</CardTitle>
                    <CardDescription>
                      {cicloDestino.nome} • {cicloDestino.periodo}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {cicloDestino.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Seleção de Ciclos de Origem */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Selecione os ciclos que deseja migrar as sobras</CardTitle>
                <CardDescription>
                  Você pode selecionar múltiplos ciclos finalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ciclosFinalizados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há ciclos finalizados para selecionar como origem.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ciclosFinalizados.map((ciclo) => (
                      <Card
                        key={ciclo.id}
                        className={`cursor-pointer transition-all hover:border-primary/50 ${ciclosOrigemIds.includes(ciclo.id) ? 'border-primary bg-primary/5' : ''
                          }`}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={ciclosOrigemIds.includes(ciclo.id)}
                              onCheckedChange={() => handleToggleCicloOrigem(ciclo.id)}
                            />
                            <div className="flex-1">
                              <CardTitle className="text-base">{ciclo.nome}</CardTitle>
                              <CardDescription className="text-sm">{ciclo.periodo}</CardDescription>
                            </div>
                            <Badge className="bg-orange-500 text-white">
                              {ciclo.status}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/ciclo-index")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCarregarSobras}
                    disabled={ciclosOrigemIds.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Carregar sobras selecionadas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tabela de Produtos (quando houver produtos carregados) */}
        {produtos.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Produtos que sobraram</CardTitle>
                  <CardDescription>
                    Selecione os produtos e quantidades que deseja migrar
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelecionarTodos}
                  >
                    Selecionar todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLimparSelecao}
                  >
                    Limpar seleção
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Buscar produto ou fornecedor..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Sel.</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Medida</TableHead>
                      <TableHead className="text-right">Ofertados</TableHead>
                      <TableHead className="text-right">Pedidos</TableHead>
                      <TableHead className="text-right">Sobraram</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">Migrar (Qtd)</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosFiltrados.map((produto) => (
                      <TableRow
                        key={produto.id}
                        className={produto.sobraram === 0 ? 'opacity-50' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={produto.selecionado}
                            disabled={produto.sobraram === 0}
                            onCheckedChange={(checked) => handleToggleProduto(produto.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{produto.produto}</TableCell>
                        <TableCell>{produto.fornecedor}</TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell className="text-right">{produto.ofertados}</TableCell>
                        <TableCell className="text-right">{produto.pedidos}</TableCell>
                        <TableCell className="text-right font-semibold">{produto.sobraram}</TableCell>
                        <TableCell className="text-right">{formatBRL(produto.valor)}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            max={produto.sobraram}
                            value={produto.qtdMigrar}
                            disabled={produto.sobraram === 0 || !produto.selecionado}
                            onChange={(e) => handleQtdMigrarChange(produto.id, Number(e.target.value))}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          {produto.sobraram > 0 && (
                            <Popover
                              open={editandoProduto === produto.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  handleEditarProduto(produto.id);
                                } else {
                                  setEditandoProduto(null);
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="fornecedor">Fornecedor</Label>
                                    <Input
                                      id="fornecedor"
                                      value={editValues.fornecedor}
                                      onChange={(e) => setEditValues(prev => ({ ...prev, fornecedor: e.target.value }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="valor">Valor Unitário</Label>
                                    <Input
                                      id="valor"
                                      type="number"
                                      step="0.01"
                                      value={editValues.valor}
                                      onChange={(e) => setEditValues(prev => ({ ...prev, valor: e.target.value }))}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditandoProduto(null)}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSalvarEdicao(produto.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Salvar
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totais */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardDescription>Itens selecionados</CardDescription>
                    <CardTitle className="text-2xl">{totalItens}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardDescription>Quantidade total</CardDescription>
                    <CardTitle className="text-2xl">{totalQtd}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardDescription>Valor estimado</CardDescription>
                    <CardTitle className="text-2xl">{formatBRL(totalValor)}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setProdutos([]);
                    setCiclosOrigemIds([]);
                  }}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSalvarMigracao}
                  disabled={produtosSelecionados.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Salvar no ciclo destino ({totalItens} {totalItens === 1 ? 'item' : 'itens'})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminMigrarOfertas;
