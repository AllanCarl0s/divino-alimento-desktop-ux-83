import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ciclos } from "@/fixtures/ciclos";
import { sobrasPorCiclo } from "@/fixtures/produtosSobra";
import { formatBRL } from "@/utils/currency";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ProdutoMigracao = {
  id: string;
  produto: string;
  fornecedor: string;
  unidade: string;
  disponivel: number;
  valor: number;
  selecionado: boolean;
  qtdMigrar: number;
};

export default function AdminMigrarOfertas() {
  const { idDestino } = useParams<{ idDestino: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [etapa, setEtapa] = useState(1);
  const [cicloOrigemId, setCicloOrigemId] = useState<string>("");
  const [produtos, setProdutos] = useState<ProdutoMigracao[]>([]);
  const [busca, setBusca] = useState("");
  const [showFornecedorDialog, setShowFornecedorDialog] = useState(false);
  const [fornecedorPendente, setFornecedorPendente] = useState("");

  const cicloDestino = ciclos.find(c => c.id === idDestino);
  const ciclosFinalizados = ciclos.filter(c => c.status === "Finalizado");
  const cicloOrigem = ciclos.find(c => c.id === cicloOrigemId);

  const produtosFiltrados = useMemo(() => {
    if (!busca) return produtos;
    const termo = busca.toLowerCase();
    return produtos.filter(p => 
      p.produto.toLowerCase().includes(termo) || 
      p.fornecedor.toLowerCase().includes(termo)
    );
  }, [produtos, busca]);

  const produtosSelecionados = produtos.filter(p => p.selecionado);
  const totalItens = produtosSelecionados.length;
  const totalQtd = produtosSelecionados.reduce((acc, p) => acc + p.qtdMigrar, 0);
  const totalValor = produtosSelecionados.reduce((acc, p) => acc + (p.qtdMigrar * p.valor), 0);

  const handleAvancarEtapa1 = () => {
    if (!cicloOrigemId) return;
    
    const sobras = sobrasPorCiclo[cicloOrigemId] || [];
    setProdutos(sobras.map(p => ({
      ...p,
      selecionado: false,
      qtdMigrar: p.disponivel
    })));
    setEtapa(2);
  };

  const handleToggleProduto = (id: string, checked: boolean) => {
    setProdutos(prev => prev.map(p => 
      p.id === id ? { ...p, selecionado: checked } : p
    ));
  };

  const handleQtdChange = (id: string, value: string) => {
    const qtd = parseInt(value) || 0;
    setProdutos(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, qtdMigrar: Math.min(Math.max(1, qtd), p.disponivel) };
      }
      return p;
    }));
  };

  const handleMigrarSelecionados = () => {
    if (produtosSelecionados.length === 0) return;
    
    // Simular verificação de fornecedor
    const fornecedoresUnicos = [...new Set(produtosSelecionados.map(p => p.fornecedor))];
    const fornecedorNaoCadastrado = fornecedoresUnicos.find(f => Math.random() > 0.7); // 30% chance
    
    if (fornecedorNaoCadastrado) {
      setFornecedorPendente(fornecedorNaoCadastrado);
      setShowFornecedorDialog(true);
      return;
    }
    
    setEtapa(3);
  };

  const handleConfirmarFornecedor = () => {
    setShowFornecedorDialog(false);
    setEtapa(3);
  };

  const handleSalvarMigracao = () => {
    toast({
      title: "Ofertas migradas com sucesso",
      description: `${totalItens} produtos migrados para o ciclo destino.`,
      className: "bg-success text-success-foreground"
    });
    navigate(`/oferta/${idDestino}`);
  };

  if (!cicloDestino) {
    return (
      <div className="min-h-screen bg-background p-6">
        <p>Ciclo destino não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho laranja */}
      <div className="bg-orange-500 text-white px-6 py-4">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/ciclo-index")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Migração de Ofertas Entre Ciclos</h1>
            <p className="text-white/90 text-sm mt-1">
              Selecione o ciclo de origem e os produtos que deseja migrar.
            </p>
          </div>
        </div>
        
        {/* Badge do ciclo destino */}
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="default" className="bg-white text-orange-500 hover:bg-white">
            {cicloDestino.nome}
          </Badge>
          <Badge variant="success">{cicloDestino.status}</Badge>
          <span className="text-sm text-white/90">{cicloDestino.periodo}</span>
        </div>
      </div>

      {/* Wizard de etapas */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                etapa === num 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : etapa > num
                  ? "bg-success text-success-foreground border-success"
                  : "bg-muted text-muted-foreground border-muted"
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-24 h-0.5 mx-2 ${etapa > num ? "bg-success" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-24 mt-2">
          <span className={`text-sm ${etapa >= 1 ? "font-medium" : "text-muted-foreground"}`}>
            Selecionar Origem
          </span>
          <span className={`text-sm ${etapa >= 2 ? "font-medium" : "text-muted-foreground"}`}>
            Selecionar Produtos
          </span>
          <span className={`text-sm ${etapa >= 3 ? "font-medium" : "text-muted-foreground"}`}>
            Revisar e Salvar
          </span>
        </div>
      </div>

      {/* Conteúdo da etapa */}
      <div className="p-6">
        {etapa === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Selecione o ciclo de origem</h2>
            <div className="space-y-3">
              {ciclosFinalizados.map((ciclo) => (
                <Card 
                  key={ciclo.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    cicloOrigemId === ciclo.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setCicloOrigemId(ciclo.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox 
                        checked={cicloOrigemId === ciclo.id}
                        onCheckedChange={() => setCicloOrigemId(ciclo.id)}
                      />
                      <div>
                        <h3 className="font-semibold">{ciclo.nome}</h3>
                        <p className="text-sm text-muted-foreground">{ciclo.periodo}</p>
                      </div>
                    </div>
                    <Badge variant="warning">{ciclo.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleAvancarEtapa1}
                disabled={!cicloOrigemId}
                size="lg"
              >
                Avançar
              </Button>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Selecione os produtos a migrar</h2>
                <p className="text-sm text-muted-foreground">
                  Origem: {cicloOrigem?.nome}
                </p>
              </div>
              <Input
                placeholder="Buscar por produto ou fornecedor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Qtd Disponível</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-center">Qtd Migrar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>
                        <Checkbox
                          checked={produto.selecionado}
                          onCheckedChange={(checked) => handleToggleProduto(produto.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{produto.produto}</TableCell>
                      <TableCell>{produto.fornecedor}</TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell className="text-right">{produto.disponivel}</TableCell>
                      <TableCell className="text-right">{formatBRL(produto.valor)}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={1}
                          max={produto.disponivel}
                          value={produto.qtdMigrar}
                          onChange={(e) => handleQtdChange(produto.id, e.target.value)}
                          disabled={!produto.selecionado}
                          className="w-20 mx-auto text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Cards de totalização */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Itens Selecionados</p>
                  <p className="text-2xl font-bold text-primary">{totalItens}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Qtd Total Migrar</p>
                  <p className="text-2xl font-bold text-primary">{totalQtd}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Valor Total Estimado</p>
                  <p className="text-2xl font-bold text-primary">{formatBRL(totalValor)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEtapa(1)}>
                Voltar
              </Button>
              <Button 
                onClick={handleMigrarSelecionados}
                disabled={produtosSelecionados.length === 0}
                size="lg"
              >
                Migrar selecionados
              </Button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Revisar e salvar migração</h2>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Produto</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Qtd Migrar</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosSelecionados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.produto}</TableCell>
                      <TableCell>{produto.fornecedor}</TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell className="text-right">{produto.qtdMigrar}</TableCell>
                      <TableCell className="text-right">{formatBRL(produto.valor)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatBRL(produto.qtdMigrar * produto.valor)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/30 font-bold">
                    <TableCell colSpan={3} className="text-right">TOTAIS:</TableCell>
                    <TableCell className="text-right">{totalQtd}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right text-primary text-lg">
                      {formatBRL(totalValor)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEtapa(2)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarMigracao} size="lg">
                Salvar e Finalizar Migração
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog de fornecedor não cadastrado */}
      <AlertDialog open={showFornecedorDialog} onOpenChange={setShowFornecedorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fornecedor não cadastrado</AlertDialogTitle>
            <AlertDialogDescription>
              Fornecedor '{fornecedorPendente}' não está cadastrado no ciclo destino. 
              Deseja manter como fornecedor externo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarFornecedor}>
              Manter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
