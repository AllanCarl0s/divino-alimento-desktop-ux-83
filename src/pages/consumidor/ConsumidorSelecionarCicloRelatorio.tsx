import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';
import { UserMenuLarge } from '@/components/layout/UserMenuLarge';
import { useIsMobile } from '@/hooks/use-mobile';

interface Ciclo {
  id: string;
  nome: string;
  inicio_ofertas: string;
  fim_ofertas: string;
  status: 'ativo' | 'encerrado' | 'futuro';
}

const ConsumidorSelecionarCicloRelatorio = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [ciclos] = useState<Ciclo[]>([
    {
      id: '1',
      nome: '1º Ciclo de Novembro 2025',
      inicio_ofertas: '2025-11-01',
      fim_ofertas: '2025-11-15',
      status: 'ativo'
    },
    {
      id: '2',
      nome: '2º Ciclo de Novembro 2025',
      inicio_ofertas: '2025-11-16',
      fim_ofertas: '2025-11-30',
      status: 'ativo'
    },
    {
      id: '3',
      nome: '1º Ciclo de Dezembro 2025',
      inicio_ofertas: '2025-12-01',
      fim_ofertas: '2025-12-15',
      status: 'futuro'
    }
  ]);

  const ciclosAtivos = useMemo(() => {
    return ciclos
      .filter(ciclo => ciclo.status === 'ativo')
      .sort((a, b) => new Date(b.inicio_ofertas).getTime() - new Date(a.inicio_ofertas).getTime());
  }, [ciclos]);

  const formatarDataBR = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleVerRelatorio = (cicloId: string) => {
    navigate(`/consumidor/relatorio-pedidos/${cicloId}`);
  };

  return (
    <ResponsiveLayout
      headerContent={
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')} 
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <UserMenuLarge />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Relatório de Pedidos Diretos
          </h1>
          <p className="text-muted-foreground">
            Selecione o ciclo para visualizar o relatório de pedidos diretos
          </p>
        </div>

        {ciclosAtivos.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Nenhum ciclo ativo disponível no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {!isMobile ? (
              <div className="bg-card rounded-lg shadow-sm border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Ciclo</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ciclosAtivos.map((ciclo) => (
                      <TableRow key={ciclo.id}>
                        <TableCell className="font-medium">{ciclo.nome}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatarDataBR(ciclo.inicio_ofertas)} - {formatarDataBR(ciclo.fim_ofertas)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={ciclo.status === 'ativo' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {ciclo.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            onClick={() => handleVerRelatorio(ciclo.id)}
                            size="sm"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Relatório
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                {ciclosAtivos.map((ciclo) => (
                  <Card key={ciclo.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{ciclo.nome}</CardTitle>
                        <Badge 
                          variant={ciclo.status === 'ativo' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {ciclo.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatarDataBR(ciclo.inicio_ofertas)} - {formatarDataBR(ciclo.fim_ofertas)}
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleVerRelatorio(ciclo.id)}
                        className="w-full"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Relatório
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default ConsumidorSelecionarCicloRelatorio;
