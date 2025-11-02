import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Check } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Ciclo {
  id: string;
  nome: string;
  periodo: string;
  status: string;
  totalFornecedores: number;
  totalConsumidores: number;
}

interface Pagamento {
  id: string;
  tipo: "Fornecedor" | "Consumidor";
  nome: string;
  produto: string;
  valorTotal: number;
  status: "A receber" | "A pagar";
}

// Mock data - ciclos finalizados do administrador de mercado logado
const ciclosFinalizados: Ciclo[] = [
  {
    id: "1",
    nome: "1º Ciclo de Outubro 2025",
    periodo: "01/10/2025 – 07/10/2025",
    status: "Finalizado",
    totalFornecedores: 8,
    totalConsumidores: 45,
  },
  {
    id: "2",
    nome: "2º Ciclo de Outubro 2025",
    periodo: "08/10/2025 – 14/10/2025",
    status: "Finalizado",
    totalFornecedores: 10,
    totalConsumidores: 52,
  },
];

const AdminMercadoPagamentosGerar = () => {
  const navigate = useNavigate();
  const [cicloSelecionado, setCicloSelecionado] = useState<string>("");
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [editandoPagamento, setEditandoPagamento] = useState<Pagamento | null>(null);
  const [novoValor, setNovoValor] = useState<string>("");
  const [dialogAberto, setDialogAberto] = useState(false);

  const ciclo = ciclosFinalizados.find(c => c.id === cicloSelecionado);

  const gerarListaPagamentos = () => {
    const mockPagamentos: Pagamento[] = [
      {
        id: "1",
        tipo: "Fornecedor",
        nome: "Sítio Verde",
        produto: "Tomate Orgânico",
        valorTotal: 450.00,
        status: "A receber",
      },
      {
        id: "2",
        tipo: "Consumidor",
        nome: "Ana Souza",
        produto: "Cesta semanal",
        valorTotal: 120.00,
        status: "A pagar",
      },
      {
        id: "3",
        tipo: "Fornecedor",
        nome: "Maria Horta",
        produto: "Banana Prata",
        valorTotal: 300.00,
        status: "A receber",
      },
      {
        id: "4",
        tipo: "Consumidor",
        nome: "João Silva",
        produto: "Cesta mensal",
        valorTotal: 180.00,
        status: "A pagar",
      },
    ];

    setPagamentos(mockPagamentos);
    toast({
      title: "Lista gerada!",
      description: "Registros de pagamentos foram criados com sucesso.",
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

  const handleExcluirPagamento = (id: string) => {
    setPagamentos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Registro excluído",
      description: "O pagamento foi removido da lista.",
    });
  };

  const handleSalvarLista = () => {
    localStorage.setItem("pagamentosGeradosAdminMercado", JSON.stringify(pagamentos));
    
    toast({
      title: "Lista de pagamentos gerada com sucesso.",
      description: `${pagamentos.length} registros foram salvos.`,
    });
    
    navigate("/adminmercado/pagamentos/gerir");
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/adminmercado/dashboard")}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Administrador de mercado - Gerar Lista de Pagamentos
          </h1>
          <p className="text-muted-foreground">
            Gere automaticamente os registros de pagamentos de fornecedores e consumidores dos seus ciclos finalizados.
          </p>
        </div>

        {/* Seleção de Ciclo */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Selecionar Ciclo Finalizado</CardTitle>
            <CardDescription>
              Escolha o ciclo do seu mercado para gerar a lista de pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={cicloSelecionado} onValueChange={setCicloSelecionado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um ciclo finalizado..." />
              </SelectTrigger>
              <SelectContent>
                {ciclosFinalizados.map((ciclo) => (
                  <SelectItem key={ciclo.id} value={ciclo.id}>
                    {ciclo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Resumo do Ciclo */}
        {ciclo && (
          <Card className="mb-6 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">Resumo do Ciclo</CardTitle>
                <Badge variant="warning">{ciclo.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="font-semibold">{ciclo.periodo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Fornecedores</p>
                  <p className="font-semibold">{ciclo.totalFornecedores}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Consumidores</p>
                  <p className="font-semibold">{ciclo.totalConsumidores}</p>
                </div>
              </div>

              {pagamentos.length === 0 && (
                <div className="mt-4">
                  <Button
                    onClick={gerarListaPagamentos}
                    variant="default"
                    className="w-full md:w-auto"
                  >
                    Gerar lista de pagamentos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabela de Pagamentos */}
        {pagamentos.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-primary">Registros de Pagamento</CardTitle>
              <CardDescription>
                Revise e edite os registros antes de salvar
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
                      <th className="text-left py-3 px-4 font-semibold text-primary">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagamentos.map((pagamento, idx) => (
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
                          <Badge variant={pagamento.status === "A receber" ? "success" : "outline"}>
                            {pagamento.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEditarPagamento(pagamento)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleExcluirPagamento(pagamento.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSalvarLista}
                  variant="default"
                  size="lg"
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Salvar lista de pagamentos ({pagamentos.length} registros)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

export default AdminMercadoPagamentosGerar;
