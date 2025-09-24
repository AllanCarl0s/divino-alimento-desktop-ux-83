export interface MercadoLocal {
  id: string;
  nome: string;
  status: 'ativo' | 'inativo';
  tipo: 'Cestas' | 'Venda Direta';
}

export const mercadosLocais: MercadoLocal[] = [
  { id: "mc", nome: "Mercado Central", status: "ativo", tipo: "Cestas" },
  { id: "mv", nome: "Mercado da Vila", status: "ativo", tipo: "Venda Direta" },
  { id: "sl", nome: "Supermercado Local", status: "ativo", tipo: "Venda Direta" },
  { id: "fo", nome: "Feira Orgânica", status: "ativo", tipo: "Cestas" }
];

export const getMercadosAtivos = () => mercadosLocais.filter(m => m.status === 'ativo');