export type TipoVenda = 'cesta' | 'lote' | 'venda_direta';
export type StatusComposicao = 'pendente' | 'em_andamento' | 'concluida';

export interface CicloMercado {
  id: string;
  ciclo_id: string;
  mercado_id: string;
  nome_mercado: string;
  tipo_venda: TipoVenda;
  ordem: number;
  status_composicao: StatusComposicao;
  
  // Campos específicos por tipo de venda
  quantidade_cestas?: number;
  valor_alvo_cesta?: string;
  valor_alvo_lote?: string;
  ponto_entrega?: string;
  
  // Períodos
  periodo_entrega_fornecedor_inicio?: string;
  periodo_entrega_fornecedor_fim?: string;
  periodo_retirada_inicio?: string;
  periodo_retirada_fim?: string;
  periodo_compras_inicio?: string;
  periodo_compras_fim?: string;
}

export interface Ciclo {
  id: string;
  nome: string;
  inicio_ofertas: string;
  fim_ofertas: string;
  status: 'ativo' | 'inativo';
  admin_responsavel_id: string;
  admin_responsavel_nome: string;
  observacoes?: string;
  mercados: CicloMercado[];
}

export const getNomeTipoVenda = (tipo: TipoVenda): string => {
  const nomes: Record<TipoVenda, string> = {
    'cesta': 'Cesta',
    'lote': 'Lote',
    'venda_direta': 'Venda Direta',
  };
  return nomes[tipo];
};

export const getStatusComposicaoLabel = (status: StatusComposicao): string => {
  const labels: Record<StatusComposicao, string> = {
    'pendente': 'Pendente',
    'em_andamento': 'Em andamento',
    'concluida': 'Concluída',
  };
  return labels[status];
};

export const getStatusComposicaoColor = (status: StatusComposicao): string => {
  const colors: Record<StatusComposicao, string> = {
    'pendente': 'text-muted-foreground',
    'em_andamento': 'text-yellow-600',
    'concluida': 'text-green-600',
  };
  return colors[status];
};
