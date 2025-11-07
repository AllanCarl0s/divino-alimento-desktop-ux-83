export interface MercadoLocal {
  id: string;
  nome: string;
  status: 'ativo' | 'inativo';
  tipo: 'Cestas' | 'Venda Direta' | 'Lote';
  administrador?: string;
}

export const mercadosLocais: MercadoLocal[] = [
  { id: "mc", nome: "Mercado Central", status: "ativo", tipo: "Cestas", administrador: "João Silva" },
  { id: "mv", nome: "Mercado da Vila", status: "inativo", tipo: "Lote", administrador: "Carlos Silva" },
  { id: "sl", nome: "Supermercado Local", status: "ativo", tipo: "Venda Direta", administrador: "Fernanda Lima" },
  { id: "fo", nome: "Mercado Verde", status: "ativo", tipo: "Cestas", administrador: "João Silva" },
  { id: "mp", nome: "Mercado Popular", status: "ativo", tipo: "Lote", administrador: "João Silva" }
];

export const getMercadosAtivos = () => mercadosLocais.filter(m => m.status === 'ativo');