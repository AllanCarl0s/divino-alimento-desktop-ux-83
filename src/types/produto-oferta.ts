export interface ProdutoBase {
  id: string;
  nome: string;
  categoria?: string;
}

export interface ProdutoComercializavel {
  id: string;
  produto_base_id: string;
  produto_base_nome: string;
  unidade: string;
  peso?: number; // em kg
  volume?: number; // em litros
  preco_base: number;
  quantidade?: number; // Ex: 12 unidades em uma dúzia
  status: 'ativo' | 'inativo';
  certificado?: boolean;
  agricultura_familiar?: boolean;
}

export type CertificacaoType = 'organico' | 'transicao' | 'convencional';
export type TipoAgriculturaType = 'familiar' | 'nao_familiar';

export interface OfertaProduto {
  id: string;
  ciclo_id: string;
  mercado_ciclo_id: string;
  produto_comercializavel_id: string;
  produto_base_nome: string;
  unidade: string;
  peso?: number;
  volume?: number;
  preco_base: number;
  valor_unitario: number; // Preço que será usado na oferta (editável)
  quantidade_disponivel: number;
  quantidade_ofertada?: number;
  certificacao: CertificacaoType;
  tipo_agricultura: TipoAgriculturaType;
}

export interface ProdutoComercializavelVariacao extends ProdutoComercializavel {
  descricao_completa: string; // "Tomate Orgânico (Unidade) – 0,15 kg – R$ 0,68"
}

/**
 * Cria a descrição completa do produto para exibição no dropdown
 */
export const criarDescricaoProduto = (produto: ProdutoComercializavel): string => {
  const partes: string[] = [
    produto.produto_base_nome,
    `(${produto.unidade})`,
  ];
  
  if (produto.peso) {
    partes.push(`– ${produto.peso.toFixed(2)} kg`);
  } else if (produto.volume) {
    partes.push(`– ${produto.volume.toFixed(2)} L`);
  }
  
  if (produto.quantidade && produto.quantidade > 1) {
    partes.push(`– ${produto.quantidade} un.`);
  }
  
  partes.push(`– R$ ${produto.preco_base.toFixed(2)}`);
  
  return partes.join(' ');
};

/**
 * Agrupa produtos comercializáveis por produto base
 */
export const agruparPorProdutoBase = (
  produtos: ProdutoComercializavel[]
): Map<string, ProdutoComercializavelVariacao[]> => {
  const grupos = new Map<string, ProdutoComercializavelVariacao[]>();
  
  produtos.forEach(produto => {
    const variacoes = grupos.get(produto.produto_base_id) || [];
    variacoes.push({
      ...produto,
      descricao_completa: criarDescricaoProduto(produto),
    });
    grupos.set(produto.produto_base_id, variacoes);
  });
  
  return grupos;
};
