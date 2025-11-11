import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoleTitle } from '@/components/layout/RoleTitle';
import { ArrowLeft, Search, Edit2, Check, Trash2 } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";

interface Pagamento {
  id: string;
  tipo: "Fornecedor" | "Consumidor";
  nome: string;
  ciclo: string;
  mercado: string;
  valorTotal: number;
  status: "Pendente" | "Pago";
  dataPagamento?: string;
  observacao?: string;
}

const AdminPagamentosGerir = () => {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"Todos" | "Pendentes" | "Pagos">("Todos");
  const [ordenacao, setOrdenacao] = useState<"nome" | "data" | "valor">("nome");
  const [editandoPagamento, setEditandoPagamento] = useState<Pagamento | null>(null);
  const [novoValor, setNovoValor] = useState<string>("");
  const [novoStatus, setNovoStatus] = useState<"Pendente" | "Pago">("Pendente");
  const [novaDataPagamento, setNovaDataPagamento] = useState<string>("");
  const [novaObservacao, setNovaObservacao] = useState<string>("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pagamentoParaExcluir, setPagamentoParaExcluir] = useState<string | null>(null);

  useEffect(() => {
    // Carregar dados do localStorage
    const dadosSalvos = localStorage.getItem("pagamentosGerados");
    if (dadosSalvos) {
      const pagamentosIniciais = JSON.parse(dadosSalvos).map((p: any) => ({
        ...p,
        status: "Pendente" as const,
        dataPagamento: undefined,
      }));
      setPagamentos(pagamentosIniciais);
    } else {
      // Dados mock caso não tenha vindo da tela de geração
      const mockPagamentos: Pagamento[] = [
        {
          id: "1",
          tipo: "Fornecedor",
          nome: "Sítio Verde",
          ciclo: "Ciclo 01/2025",
          mercado: "Mercado Central",
          valorTotal: 450.00,
          status: "Pendente",
        },
        {
          id: "2",
          tipo: "Consumidor",
          nome: "Ana Souza",
          ciclo: "Ciclo 01/2025",
          mercado: "Mercado Central",
          valorTotal: 120.00,
          status: "Pago",
          dataPagamento: "2025-01-10",
          observacao: "Pagamento via PIX",
        },
        {
          id: "3",
          tipo: "Fornecedor",
          nome: "Maria Horta",
          ciclo: "Ciclo 02/2025",
          mercado: "Mercado Norte",
          valorTotal: 300.00,
          status: "Pendente",
        },
      ];
      setPagamentos(mockPagamentos);
    }
  }, []);

  const handleMarcarPago = (id: string) => {
    setPagamentos(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: "Pago" as const, dataPagamento: new Date().toISOString().split("T")[0] }
          : p
      )
    );
    toast({
      title: "Pagamento registrado com sucesso.",
      description: "O status foi atualizado para 'Pago'.",
    });
  };

  const handleEditarPagamento = (pagamento: Pagamento) => {
    setEditandoPagamento(pagamento);
    setNovoValor(pagamento.valorTotal.toFixed(2).replace(".", ","));
    setNovoStatus(pagamento.status);
    setNovaDataPagamento(pagamento.dataPagamento || "");
    setNovaObservacao(pagamento.observacao || "");
    setDialogAberto(true);
  };

  const handleSalvarEdicao = () => {
    if (editandoPagamento) {
      const valorFormatado = parseFloat(novoValor.replace(",", "."));
      setPagamentos(prev =>
        prev.map(p =>
          p.id === editandoPagamento.id
            ? { 
                ...p, 
                valorTotal: valorFormatado,
                status: novoStatus,
                dataPagamento: novaDataPagamento || undefined,
                observacao: novaObservacao || undefined
              }
            : p
        )
      );
      toast({
        title: "Pagamento atualizado!",
        description: "O pagamento foi editado com sucesso.",
      });
      setDialogAberto(false);
      setEditandoPagamento(null);
    }
  };

  const handleExcluirPagamento = () => {
    if (pagamentoParaExcluir) {
      setPagamentos(prev => prev.filter(p => p.id !== pagamentoParaExcluir));
      toast({
        title: "Pagamento excluído",
        description: "O registro de pagamento foi removido com sucesso.",
      });
      setPagamentoParaExcluir(null);
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data?: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Filtros e ordenação
  let pagamentosFiltrados = pagamentos.filter(p => {
    const matchBusca = 
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.ciclo.toLowerCase().includes(busca.toLowerCase()) ||
      p.mercado.toLowerCase().includes(busca.toLowerCase()) ||
      p.tipo.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus =
      filtroStatus === "Todos" ||
      (filtroStatus === "Pendentes" && p.status === "Pendente") ||
      (filtroStatus === "Pagos" && p.status === "Pago");

    return matchBusca && matchStatus;
  });

  // Ordenação
  pagamentosFiltrados = [...pagamentosFiltrados].sort((a, b) => {
    if (ordenacao === "nome") {
      return a.nome.localeCompare(b.nome);
    } else if (ordenacao === "data") {
      const dataA = a.dataPagamento || "9999-99-99";
      const dataB = b.dataPagamento || "9999-99-99";
      return dataA.localeCompare(dataB);
    } else {
      return a.valorTotal - b.valorTotal;
    }
  });

  // Cálculos do resumo
  const pagamentosPendentes = pagamentos.filter(p => p.status === "Pendente").length;
  const pagamentosRealizados = pagamentos.filter(p => p.status === "Pago").length;
  const totalMovimentado = pagamentos.reduce((acc, p) => acc + p.valorTotal, 0);

  return (
    <ResponsiveLayout
      headerContent={<UserMenuLarge />}
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/dashboard")}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <RoleTitle page="Gerir Lista de Pagamentos" className="text-3xl mb-2" />
          <p className="text-muted-foreground">
            Acompanhe, edite e registre os pagamentos pendentes e realizados.
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, tipo, ciclo ou mercado..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroStatus} onValueChange={(v: any) => setFiltroStatus(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Mostrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Pendentes">Pendentes</SelectItem>
                  <SelectItem value="Pagos">Pagos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ordenacao} onValueChange={(v: any) => setOrdenacao(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="valor">Valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Pagamentos */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Registros de Pagamento</CardTitle>
            <CardDescription>
              {pagamentosFiltrados.length} registro(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-primary">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Ciclo</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Mercado</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Valor Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Data do Pagamento</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentosFiltrados.map((pagamento, idx) => (
                    <tr
                      key={pagamento.id}
                      className={`border-b hover:bg-muted/50 transition-colors ${
                        idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <Badge variant={pagamento.tipo === "Fornecedor" ? "default" : "secondary"}>
                          {pagamento.tipo}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{pagamento.nome}</td>
                      <td className="py-3 px-4">{pagamento.ciclo}</td>
                      <td className="py-3 px-4">{pagamento.mercado}</td>
                      <td className="py-3 px-4 font-semibold">{formatarValor(pagamento.valorTotal)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={pagamento.status === "Pago" ? "success" : "outline"}>
                          {pagamento.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{formatarData(pagamento.dataPagamento)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {pagamento.status === "Pendente" && (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleMarcarPago(pagamento.id)}
                              title="Marcar como pago"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleEditarPagamento(pagamento)}
                            title="Editar"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => setPagamentoParaExcluir(pagamento.id)}
                            title="Excluir"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-md bg-success/10">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pagamentosPendentes}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-success/10">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Pagamentos Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pagamentosRealizados}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-success/10">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Total Movimentado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatarValor(totalMovimentado)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
          >
            Voltar
          </Button>
        </div>

        {/* Dialog para Editar Pagamento */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Pagamento</DialogTitle>
              <DialogDescription>
                Ajuste os dados do pagamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="valor">Valor Total (R$)</Label>
                <Input
                  id="valor"
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={novoStatus} onValueChange={(v: any) => setNovoStatus(v)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dataPagamento">Data do Pagamento</Label>
                <Input
                  id="dataPagamento"
                  type="date"
                  value={novaDataPagamento}
                  onChange={(e) => setNovaDataPagamento(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="observacao">Observação</Label>
                <Input
                  id="observacao"
                  value={novaObservacao}
                  onChange={(e) => setNovaObservacao(e.target.value)}
                  placeholder="Ex: Pagamento via PIX"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarEdicao}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AlertDialog para Confirmar Exclusão */}
        <AlertDialog open={!!pagamentoParaExcluir} onOpenChange={() => setPagamentoParaExcluir(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este registro de pagamento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleExcluirPagamento}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminPagamentosGerir;
