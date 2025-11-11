import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoleTitle } from '@/components/layout/RoleTitle';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Download, FileText, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface EntregaFornecedor {
  id: string;
  fornecedor: string;
  produto: string;
  unidade_medida: string;
  valor_unitario: number;
  quantidade_entregue: number;
  valor_total: number;
  ciclo: string;
  agricultura_familiar: boolean;
  certificacao: 'organico' | 'transicao' | 'convencional';
}

export default function AdminRelatorioFornecedoresResultado() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const ciclosIds = searchParams.get('ciclos')?.split(',') || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'fornecedor' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] = useState<string>('todos');
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>('todos');

  // Mock data - entregas consolidadas dos ciclos selecionados
  const entregas: EntregaFornecedor[] = [
    {
      id: '1',
      fornecedor: 'Fazenda Verde',
      produto: 'Tomate',
      unidade_medida: 'kg',
      valor_unitario: 5.50,
      quantidade_entregue: 120,
      valor_total: 660.00,
      ciclo: '1º Ciclo de Outubro',
      agricultura_familiar: true,
      certificacao: 'organico'
    },
    {
      id: '2',
      fornecedor: 'Fazenda Verde',
      produto: 'Alface',
      unidade_medida: 'unidade',
      valor_unitario: 2.00,
      quantidade_entregue: 200,
      valor_total: 400.00,
      ciclo: '1º Ciclo de Outubro',
      agricultura_familiar: true,
      certificacao: 'transicao'
    },
    {
      id: '3',
      fornecedor: 'Sítio do Sol',
      produto: 'Cenoura',
      unidade_medida: 'kg',
      valor_unitario: 4.00,
      quantidade_entregue: 80,
      valor_total: 320.00,
      ciclo: '2º Ciclo de Outubro',
      agricultura_familiar: false,
      certificacao: 'convencional'
    },
    {
      id: '4',
      fornecedor: 'Horta Orgânica',
      produto: 'Rúcula',
      unidade_medida: 'maço',
      valor_unitario: 3.50,
      quantidade_entregue: 150,
      valor_total: 525.00,
      ciclo: '2º Ciclo de Outubro',
      agricultura_familiar: true,
      certificacao: 'organico'
    },
    {
      id: '5',
      fornecedor: 'Fazenda Verde',
      produto: 'Batata',
      unidade_medida: 'kg',
      valor_unitario: 3.80,
      quantidade_entregue: 95,
      valor_total: 361.00,
      ciclo: '1º Ciclo de Novembro',
      agricultura_familiar: true,
      certificacao: 'convencional'
    },
    {
      id: '6',
      fornecedor: 'Sítio do Sol',
      produto: 'Abóbora',
      unidade_medida: 'kg',
      valor_unitario: 4.20,
      quantidade_entregue: 65,
      valor_total: 273.00,
      ciclo: '1º Ciclo de Novembro',
      agricultura_familiar: true,
      certificacao: 'organico'
    }
  ];

  const filteredEntregas = entregas
    .filter(entrega => {
      const matchSearch = entrega.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.ciclo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchAgriculturaFamiliar = filtroAgriculturaFamiliar === 'todos' ||
        (filtroAgriculturaFamiliar === 'sim' && entrega.agricultura_familiar) ||
        (filtroAgriculturaFamiliar === 'nao' && !entrega.agricultura_familiar);
      
      const matchCertificacao = filtroCertificacao === 'todos' ||
        entrega.certificacao === filtroCertificacao;
      
      return matchSearch && matchAgriculturaFamiliar && matchCertificacao;
    })
    .sort((a, b) => {
      if (sortBy === 'fornecedor') {
        const compareResult = a.fornecedor.localeCompare(b.fornecedor);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      }
      return 0;
    });

  const totalQuantidade = filteredEntregas.reduce((acc, e) => acc + e.quantidade_entregue, 0);
  const valorTotalGeral = filteredEntregas.reduce((acc, e) => acc + e.valor_total, 0);

  const handleExportCSV = async () => {
    try {
      const ciclosData = ciclosIds.map((id) => ({
        id: parseInt(id),
        nome: `Ciclo ${id}`
      }));
      
      const { exportFornecedoresCSV } = await import('@/utils/export');
      exportFornecedoresCSV(filteredEntregas, ciclosData);
      toast.success('Download do CSV concluído');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosData = ciclosIds.map((id) => ({
        id: parseInt(id),
        nome: `Ciclo ${id}`
      }));
      
      const resumo = {
        totalQuantidade,
        valorTotal: valorTotalGeral
      };
      
      const { exportFornecedoresPDF } = await import('@/utils/export');
      exportFornecedoresPDF(filteredEntregas, ciclosData, resumo);
      toast.success('Download do PDF concluído');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
    }
  };

  const handleSortByFornecedor = () => {
    if (sortBy === 'fornecedor') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('fornecedor');
      setSortOrder('asc');
    }
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <button
          onClick={() => navigate('/admin/relatorio-fornecedores')}
          className="flex items-center text-primary-foreground hover:opacity-80 transition-opacity focus-ring p-2 -ml-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <RoleTitle page="Relatório de Entregas dos Fornecedores" className="text-3xl" />
          <p className="text-muted-foreground mt-2">
            Visualize e exporte as entregas realizadas nos ciclos selecionados
          </p>
        </div>

        {/* Resumo Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Resumo Consolidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quantidade de Registros</p>
                <p className="text-2xl font-bold">{filteredEntregas.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantidade Total Entregue</p>
                <p className="text-2xl font-bold">{totalQuantidade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Consolidado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {valorTotalGeral.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedor, produto ou ciclo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Agricultura Familiar</label>
              <Select value={filtroAgriculturaFamiliar} onValueChange={setFiltroAgriculturaFamiliar}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Certificação</label>
              <Select value={filtroCertificacao} onValueChange={setFiltroCertificacao}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="organico">Orgânico</SelectItem>
                  <SelectItem value="transicao">Transição</SelectItem>
                  <SelectItem value="convencional">Convencional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Table / Cards */}
        {!isMobile ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ciclo</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handleSortByFornecedor}
                  >
                    <div className="flex items-center gap-2">
                      Fornecedor(a)
                      <ArrowUpDown className="h-4 w-4" />
                      {sortBy === 'fornecedor' && (
                        <span className="text-xs text-muted-foreground">
                          ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Qtd. Entregue</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntregas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhuma entrega registrada.'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntregas.map((entrega) => (
                    <TableRow key={entrega.id}>
                      <TableCell className="font-medium">{entrega.ciclo}</TableCell>
                      <TableCell>{entrega.fornecedor}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{entrega.produto}</span>
                          <div className="flex gap-1">
                            {entrega.agricultura_familiar && (
                              <Badge variant="secondary" className="text-xs">
                                Agricultura Familiar
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                entrega.certificacao === 'organico' ? 'border-green-600 text-green-600' :
                                entrega.certificacao === 'transicao' ? 'border-yellow-600 text-yellow-600' :
                                'border-gray-400 text-gray-600'
                              }`}
                            >
                              {entrega.certificacao === 'organico' ? 'Orgânico' :
                               entrega.certificacao === 'transicao' ? 'Transição' :
                               'Convencional'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{entrega.unidade_medida}</TableCell>
                      <TableCell className="text-right">
                        R$ {entrega.valor_unitario.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-right">{entrega.quantidade_entregue}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        R$ {entrega.valor_total.toFixed(2).replace('.', ',')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Visualização em Cards para Mobile */
          <div className="space-y-3">
            {filteredEntregas.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhuma entrega registrada.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEntregas.map((entrega) => (
                <Card key={entrega.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="font-semibold text-sm text-muted-foreground">{entrega.ciclo}</p>
                        <p className="font-bold text-lg">{entrega.fornecedor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Valor Total</p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {entrega.valor_total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{entrega.produto}</p>
                          <div className="flex flex-wrap gap-1">
                            {entrega.agricultura_familiar && (
                              <Badge variant="secondary" className="text-xs">
                                Agricultura Familiar
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                entrega.certificacao === 'organico' ? 'border-green-600 text-green-600' :
                                entrega.certificacao === 'transicao' ? 'border-yellow-600 text-yellow-600' :
                                'border-gray-400 text-gray-600'
                              }`}
                            >
                              {entrega.certificacao === 'organico' ? 'Orgânico' :
                               entrega.certificacao === 'transicao' ? 'Transição' :
                               'Convencional'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Unidade</p>
                          <p className="font-medium">{entrega.unidade_medida}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Valor Unit.</p>
                          <p className="font-medium">R$ {entrega.valor_unitario.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Qtd. Entregue</p>
                          <p className="font-medium">{entrega.quantidade_entregue}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Footer Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/relatorio-fornecedores')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
