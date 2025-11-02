import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Check } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function AdminMercadoMigrarOfertas() {
  const { cicloId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [destinoSelecionadoId, setDestinoSelecionadoId] = useState<string>(cicloId || "");
  const [ciclosOrigemIds, setCiclosOrigemIds] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<ProdutoMigracao[]>([]);
  const [busca, setBusca] = useState("");

  // Filtrar apenas ciclos que pertencem ao admin de mercado logado
  const cicloDestino = ciclos.find(c => c.id === destinoSelecionadoId);
  const ciclosFinalizados = ciclos.filter(c => 
    c.status === "Finalizado" && 
    c.id !== destinoSelecionadoId
    // TODO: filtrar por admin logado quando houver campo adminResponsavel
  );
  const ciclosAtivos = ciclos.filter(c => 
    c.status === "Ativo"
    // TODO: filtrar por admin logado quando houver campo adminResponsavel
  );

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

    const produtosMap = new Map<string, ProdutoMigracao>();

    ciclosOrigemIds.forEach(cicloId => {
      const sobras = sobrasPorCiclo[cicloId as keyof typeof sobrasPorCiclo] || [];

      sobras.forEach(s => {
        const ofertados = s.disponivel || 0;
        const pedidos = Math.floor(ofertados * 0.4);
        const sobraram = Math.max(ofertados - pedidos, 0);

        const chave = `${s.produto}_${s.fornecedor}_${s.unidade}`;
        const existente = produtosMap.get(chave);

        if (existente) {
          existente.ofertados += ofertados;
          existente.pedidos += pedidos;
          existente.sobraram += sobraram;
          existente.qtdMigrar += sobraram;
          existente.ciclosOrigem.push(cicloId);
        } else {
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

    toast({
      title: "✅ Ofertas migradas com sucesso!",
      description: `${selecionados.length} produtos foram adicionados ao ciclo de destino.`,
    });

    navigate('/adminmercado/ciclo-index');
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
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/adminmercado/ciclo-index')} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Administrador de mercado - Migrar Ofertas de um Ciclo para Outro
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Copie as ofertas já configuradas em um ciclo anterior para este ciclo
          </p>
        </div>

        {/* Seleção de Ciclo Destino */}
        {!cicloDestino && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Selecione o Ciclo de Destino</CardTitle>
              <CardDescription>
                Escolha um ciclo ativo do seu mercado para onde deseja migrar as ofertas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={destinoSelecionadoId} onValueChange={setDestinoSelecionadoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ciclo de destino (Ativo)" />
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
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-primary">Ciclo de Destino</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {cicloDestino.nome} • {cicloDestino.periodo}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mercado: {cicloDestino.mercados?.[0]?.nome || 'Mercado Central'}
                    </p>
                  </div>
                  <Badge variant="success">{cicloDestino.status}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Seleção de Ciclos de Origem */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Selecione os ciclos que deseja migrar as sobras</CardTitle>
                <CardDescription>
                  Você pode selecionar múltiplos ciclos finalizados do seu mercado
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
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          ciclosOrigemIds.includes(ciclo.id) 
                            ? 'border-primary border-2 bg-primary/5' 
                            : 'border hover:border-primary/50'
                        }`}
                        onClick={() => handleToggleCicloOrigem(ciclo.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={ciclosOrigemIds.includes(ciclo.id)}
                              onCheckedChange={() => handleToggleCicloOrigem(ciclo.id)}
                            />
                            <div className="flex-1">
                              <CardTitle className="text-base font-semibold">{ciclo.nome}</CardTitle>
                              <CardDescription className="text-sm">{ciclo.periodo}</CardDescription>
                            </div>
                            <Badge variant="warning">{ciclo.status}</Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/adminmercado/ciclo-index")}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCarregarSobras}
                    disabled={ciclosOrigemIds.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Carregar sobras selecionadas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tabela de Produtos */}
        {produtos.length > 0 && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-primary">Produtos que sobraram</CardTitle>
                  <CardDescription>
                    Selecione os produtos e quantidades que deseja migrar
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelecionarTodos}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Selecionar todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLimparSelecao}
                    className="border-primary text-primary hover:bg-primary/10"
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
                          className="w-20 text-right mx-auto"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Resumo da Migração */}
              {produtosSelecionados.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Itens Selecionados</p>
                      <p className="text-2xl font-bold text-primary">{totalItens}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade Total</p>
                      <p className="text-2xl font-bold text-primary">{totalQtd}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold text-success">{formatBRL(totalValor)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/adminmercado/ciclo-index')}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  onClick={handleSalvarMigracao}
                  disabled={produtosSelecionados.length === 0}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Migrar Ofertas Selecionadas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
}
