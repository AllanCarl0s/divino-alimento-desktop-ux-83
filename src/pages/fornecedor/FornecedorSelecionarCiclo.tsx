import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatarDataBR } from '@/utils/ciclo';
import { Ciclo } from '@/types/ciclo-mercado';

export default function FornecedorSelecionarCiclo() {
  const navigate = useNavigate();

  // Mock data - apenas ciclos ativos
  const [ciclos] = useState<Ciclo[]>([
    { 
      id: '1', 
      nome: '1º Ciclo de Novembro 2025', 
      inicio_ofertas: '2025-11-03', 
      fim_ofertas: '2025-11-18',
      status: 'ativo',
      admin_responsavel_id: '1',
      admin_responsavel_nome: 'João Silva',
      mercados: []
    },
    { 
      id: '2', 
      nome: '2º Ciclo de Outubro 2025', 
      inicio_ofertas: '2025-10-22', 
      fim_ofertas: '2025-10-30',
      status: 'ativo',
      admin_responsavel_id: '2',
      admin_responsavel_nome: 'Anna Cardoso',
      mercados: []
    },
    { 
      id: '3', 
      nome: '1º Ciclo de Outubro 2025', 
      inicio_ofertas: '2025-10-13', 
      fim_ofertas: '2025-10-20',
      status: 'ativo',
      admin_responsavel_id: '3',
      admin_responsavel_nome: 'Maria Santos',
      mercados: []
    }
  ]);

  // Filtra apenas ciclos ativos
  const ciclosAtivos = useMemo(() => {
    return ciclos
      .filter(ciclo => ciclo.status === 'ativo')
      .sort((a, b) => new Date(b.inicio_ofertas).getTime() - new Date(a.inicio_ofertas).getTime());
  }, [ciclos]);

  const handleOfertarAlimento = (cicloId: string) => {
    navigate(`/oferta/${cicloId}`);
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/fornecedor/loja')} 
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      } 
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Selecione o Ciclo para Ofertar</h1>
          <p className="text-sm md:text-base text-muted-foreground">Escolha em qual ciclo ativo você deseja ofertar seus alimentos.</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Ciclo</TableHead>
                  <TableHead>Período de Ofertas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ciclosAtivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum ciclo ativo disponível no momento.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  ciclosAtivos.map((ciclo) => (
                    <TableRow key={ciclo.id}>
                      <TableCell className="font-medium">{ciclo.nome}</TableCell>
                      <TableCell>{formatarDataBR(ciclo.inicio_ofertas)} – {formatarDataBR(ciclo.fim_ofertas)}</TableCell>
                      <TableCell>
                        <Badge variant="success">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handleOfertarAlimento(ciclo.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Ofertar Alimento
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {ciclosAtivos.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Nenhum ciclo ativo disponível no momento.</p>
            </Card>
          ) : (
            ciclosAtivos.map((ciclo) => (
              <Card key={ciclo.id} className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{ciclo.nome}</h3>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><span className="font-medium">Período:</span> {formatarDataBR(ciclo.inicio_ofertas)} – {formatarDataBR(ciclo.fim_ofertas)}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleOfertarAlimento(ciclo.id)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ofertar Alimento
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
