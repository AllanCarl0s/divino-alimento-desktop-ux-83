export interface ProdutoReferencia {
  id: string;
  nome: string;
  categoria: string;
  unidade: 'kg' | 'litro' | 'duzia';
  preco_referencia: number;
  ativo: boolean;
}

export const produtosReferencia: ProdutoReferencia[] = [
  {
    id: "ref-001",
    nome: "Tomate Orgânico",
    categoria: "Hortaliças",
    unidade: "kg",
    preco_referencia: 4.50,
    ativo: true
  },
  {
    id: "ref-002",
    nome: "Ovos Caipiras",
    categoria: "Derivados",
    unidade: "duzia",
    preco_referencia: 15.00,
    ativo: true
  },
  {
    id: "ref-003",
    nome: "Mel Orgânico",
    categoria: "Derivados",
    unidade: "litro",
    preco_referencia: 28.90,
    ativo: true
  }
];

export const categorias = Array.from(new Set(produtosReferencia.map(p => p.categoria)));