import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleTitle } from '@/components/layout/RoleTitle';
import { ArrowLeft, Edit2, Trash2, Check } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";

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
  ciclo: string;
  mercado: string;
  valorTotal: number;
  status: "A receber" | "A pagar" | "Pago" | "Cancelado";
  dataPagamento?: string;
  observacao?: string;
}

const ciclosFinalizados: Ciclo[] = [
  {
    id: "1",
    nome: "1º Ciclo de Outubro 2025",
    periodo: "01/10/2025 – 07/10/2025",
    status: "Finalizado",
    totalFornecedores: 12,
    totalConsumidores: 85,
  },
  {
    id: "2",
    nome: "2º Ciclo de Outubro 2025",
    periodo: "08/10/2025 – 14/10/2025",
    status: "Finalizado",
    totalFornecedores: 15,
    totalConsumidores: 92,
  },
  {
    id: "3",
    nome: "3º Ciclo de Setembro 2025",
    periodo: "15/09/2025 – 21/09/2025",
    status: "Finalizado",
    totalFornecedores: 10,
    totalConsumidores: 78,
  },
];

const AdminPagamentosGerar = () => {
  const navigate = useNavigate();
  const [ciclosSelecionados, setCiclosSelecionados] = useState<string[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [editandoPagamento, setEditandoPagamento] = useState<Pagamento | null>(null);
  const [novoValor, setNovoValor] = useState<string>("");
  const [novoStatus, setNovoStatus] = useState<string>("");
  const [novaDataPagamento, setNovaDataPagamento] = useState<string>("");
  const [novaObservacao, setNovaObservacao] = useState<string>("");
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleToggleCiclo = (cicloId: string) => {
    setCiclosSelecionados(prev => 
      prev.includes(cicloId)
        ? prev.filter(id => id !== cicloId)
        : [...prev, cicloId]
    );
  };

  const ciclosSelecionadosData = ciclosFinalizados.filter(c => ciclosSelecionados.includes(c.id));
  const totalFornecedores = ciclosSelecionadosData.reduce((sum, c) => sum + c.totalFornecedores, 0);
  const totalConsumidores = ciclosSelecionadosData.reduce((sum, c) => sum + c.totalConsumidores, 0);
  const todosFinalizados = ciclosSelecionadosData.every(c => c.status === "Finalizado");

  const gerarListaPagamentos = () => {
    const mockPagamentos: Pagamento[] = [
      {
        id: "1",
        tipo: "Fornecedor",
        nome: "Sítio Verde",
        ciclo: "1º Ciclo de Outubro 2025",
        mercado: "Mercado Central",
        valorTotal: 450.00,
        status: "A receber",
      },
      {
        id: "2",
        tipo: "Consumidor",
        nome: "Ana Souza",
        ciclo: "1º Ciclo de Outubro 2025",
        mercado: "Mercado Sul",
        valorTotal: 120.00,
        status: "A pagar",
      },
      {
        id: "3",
        tipo: "Fornecedor",
        nome: "Maria Horta",
        ciclo: "2º Ciclo de Outubro 2025",
        mercado: "Mercado Central",
        valorTotal: 300.00,
        status: "A receber",
      },
      {
        id: "4",
        tipo: "Consumidor",
        nome: "João Silva",
        ciclo: "2º Ciclo de Outubro 2025",
        mercado: "Mercado Norte",
        valorTotal: 180.00,
        status: "A pagar",
      },
      {
        id: "5",
        tipo: "Fornecedor",
        nome: "Fazenda Boa Vista",
        ciclo: "3º Ciclo de Setembro 2025",
        mercado: "Mercado Central",
        valorTotal: 225.00,
        status: "A receber",
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
                status: novoStatus as Pagamento["status"],
                dataPagamento: novaDataPagamento || undefined,
                observacao: novaObservacao || undefined
              }
            : p
        )
      );
      toast({
        title: "Pagamento atualizado!",
        description: "As alterações foram salvas com sucesso.",
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
    // Salvar os dados no localStorage para usar na tela de gestão
    localStorage.setItem("pagamentosGerados", JSON.stringify(pagamentos));
    
    toast({
      title: "Lista de pagamentos gerada com sucesso.",
      description: `${pagamentos.length} registros foram salvos.`,
    });
    
    navigate("/admin/pagamentos-gerir");
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
          <RoleTitle page="Gerar Lista de Pagamentos" className="text-3xl mb-2" />
          <p className="text-muted-foreground">
            Gere automaticamente os registros de pagamentos de fornecedores e consumidores de ciclos finalizados.
          </p>
        </div>

        {/* Seleção de Ciclos */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Selecionar Ciclos Finalizados</CardTitle>
            <CardDescription>
              Marque os ciclos que deseja incluir na lista de pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ciclosFinalizados.map((ciclo) => (
                <div
                  key={ciclo.id}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`ciclo-${ciclo.id}`}
                    checked={ciclosSelecionados.includes(ciclo.id)}
                    onCheckedChange={() => handleToggleCiclo(ciclo.id)}
                  />
                  <label
                    htmlFor={`ciclo-${ciclo.id}`}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{ciclo.nome}</span>
                      <Badge variant="warning">{ciclo.status}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{ciclo.periodo}</span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Seleção */}
        {ciclosSelecionados.length > 0 && (
          <Card className="mb-6 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">Resumo da Seleção</CardTitle>
                <Badge variant={todosFinalizados ? "warning" : "default"}>
                  {todosFinalizados ? "Todos Finalizados" : "Parcial"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="font-semibold">
                    {ciclosSelecionados.length > 1 
                      ? "Múltiplos ciclos selecionados" 
                      : ciclosSelecionadosData[0]?.periodo}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Fornecedores</p>
                  <p className="font-semibold">{totalFornecedores}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Consumidores</p>
                  <p className="font-semibold">{totalConsumidores}</p>
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
                      <th className="text-left py-3 px-4 font-semibold text-primary">Ciclo</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Mercado</th>
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
                        <td className="py-3 px-4">{pagamento.ciclo}</td>
                        <td className="py-3 px-4">{pagamento.mercado}</td>
                        <td className="py-3 px-4 font-semibold">{formatarValor(pagamento.valorTotal)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={
                            pagamento.status === "Pago" ? "success" : 
                            pagamento.status === "Cancelado" ? "destructive" :
                            pagamento.status === "A receber" ? "default" : "outline"
                          }>
                            {pagamento.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleEditarPagamento(pagamento)}
                              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleExcluirPagamento(pagamento.id)}
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                <select
                  id="status"
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="A receber">A receber</option>
                  <option value="A pagar">A pagar</option>
                  <option value="Pago">Pago</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
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
                  placeholder="Adicionar observação (opcional)"
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
      </div>
    </ResponsiveLayout>
  );
};

export default AdminPagamentosGerar;
