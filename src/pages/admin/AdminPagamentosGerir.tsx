import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Edit2, Check } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";

interface Pagamento {
  id: string;
  tipo: "Fornecedor" | "Consumidor";
  nome: string;
  produto: string;
  valorTotal: number;
  status: "Pendente" | "Pago";
  dataPagamento?: string;
}

const AdminPagamentosGerir = () => {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"Todos" | "Pendentes" | "Pagos">("Todos");
  const [ordenacao, setOrdenacao] = useState<"nome" | "data" | "valor">("nome");
  const [editandoPagamento, setEditandoPagamento] = useState<Pagamento | null>(null);
  const [novoValor, setNovoValor] = useState<string>("");
  const [dialogAberto, setDialogAberto] = useState(false);

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
          produto: "Tomate Orgânico",
          valorTotal: 450.00,
          status: "Pendente",
        },
        {
          id: "2",
          tipo: "Consumidor",
          nome: "Ana Souza",
          produto: "Cesta semanal",
          valorTotal: 120.00,
          status: "Pago",
          dataPagamento: "2025-01-10",
        },
        {
          id: "3",
          tipo: "Fornecedor",
          nome: "Maria Horta",
          produto: "Banana Prata",
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
    setDialogAberto(true);
  };

  const handleSalvarEdicao = () => {
    if (editandoPagamento) {
      const valorFormatado = parseFloat(novoValor.replace(",", "."));
      setPagamentos(prev =>
        prev.map(p =>
          p.id === editandoPagamento.id
            ? { ...p, valorTotal: valorFormatado }
            : p
        )
      );
      toast({
        title: "Valor atualizado!",
        description: "O pagamento foi editado com sucesso.",
      });
      setDialogAberto(false);
      setEditandoPagamento(null);
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
      p.produto.toLowerCase().includes(busca.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold text-primary mb-2">
            Administrador - Gerir Lista de Pagamentos
          </h1>
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
                  placeholder="Buscar por nome, tipo ou produto..."
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
                    <th className="text-left py-3 px-4 font-semibold text-primary">Produto / Item</th>
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
                      <td className="py-3 px-4">{pagamento.produto}</td>
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
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleMarcarPago(pagamento.id)}
                              title="Marcar como pago"
                            >
                              <Check className="h-4 w-4 text-success" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditarPagamento(pagamento)}
                            title="Editar valor"
                          >
                            <Edit2 className="h-4 w-4" />
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

        {/* Dialog para Editar Valor */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Valor do Pagamento</DialogTitle>
              <DialogDescription>
                Ajuste o valor total do pagamento
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="valor">Valor Total (R$)</Label>
              <Input
                id="valor"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                placeholder="0,00"
              />
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
      </div>
    </ResponsiveLayout>
  );
};

export default AdminPagamentosGerir;
