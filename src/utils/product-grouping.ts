export type CertificationType = 'organico' | 'transicao' | 'convencional';
export type AgricultureType = 'familiar' | 'nao_familiar';

export interface Oferta {
  id: string;
  produto_base: string;
  nome: string;
  unidade: string;
  fornecedor: string;
  valor: number;
  quantidadeOfertada: number;
  certificacao?: CertificationType;
  tipo_agricultura?: AgricultureType;
}

export interface ProductGroup {
  produto_base: string;
  variantes: Oferta[];
  minPreco: number;
  totalVariantes: number;
}

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

export function groupAndSortProducts(ofertas: Oferta[]): ProductGroup[] {
  // Agrupar por produto_base
  const grouped = ofertas.reduce((acc, oferta) => {
    const key = oferta.produto_base;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(oferta);
    return acc;
  }, {} as Record<string, Oferta[]>);

  // Criar array de grupos e ordenar
  const groups: ProductGroup[] = Object.entries(grouped).map(([produto_base, variantes]) => {
    // Ordenar variantes: fornecedor A→Z, depois unidade A→Z, depois preço
    const sortedVariantes = [...variantes].sort((a, b) => {
      const fornecedorCompare = collator.compare(a.fornecedor, b.fornecedor);
      if (fornecedorCompare !== 0) return fornecedorCompare;
      
      const unidadeCompare = collator.compare(a.unidade, b.unidade);
      if (unidadeCompare !== 0) return unidadeCompare;
      
      return a.valor - b.valor;
    });

    return {
      produto_base,
      variantes: sortedVariantes,
      minPreco: Math.min(...variantes.map(v => v.valor)),
      totalVariantes: variantes.length,
    };
  });

  // Ordenar grupos por produto_base A→Z
  groups.sort((a, b) => collator.compare(a.produto_base, b.produto_base));

  return groups;
}

export function filterProducts(
  groups: ProductGroup[],
  busca: string,
  filtros?: {
    unidades?: string[];
    fornecedores?: string[];
    precoMin?: number;
    precoMax?: number;
    disponivelMin?: number;
    certificacoes?: Set<CertificationType>;
    tiposAgricultura?: Set<AgricultureType>;
  }
): ProductGroup[] {
  const searchLower = busca.toLowerCase();
  
  return groups
    .map(group => {
      // Filtrar variantes
      let variantes = group.variantes;

      // Busca
      if (busca) {
        variantes = variantes.filter(v => 
          v.produto_base.toLowerCase().includes(searchLower) ||
          v.fornecedor.toLowerCase().includes(searchLower) ||
          v.unidade.toLowerCase().includes(searchLower)
        );
      }

      // Filtros existentes
      if (filtros?.unidades?.length) {
        variantes = variantes.filter(v => filtros.unidades!.includes(v.unidade));
      }
      if (filtros?.fornecedores?.length) {
        variantes = variantes.filter(v => filtros.fornecedores!.includes(v.fornecedor));
      }
      if (filtros?.precoMin !== undefined) {
        variantes = variantes.filter(v => v.valor >= filtros.precoMin!);
      }
      if (filtros?.precoMax !== undefined) {
        variantes = variantes.filter(v => v.valor <= filtros.precoMax!);
      }
      if (filtros?.disponivelMin !== undefined) {
        variantes = variantes.filter(v => v.quantidadeOfertada >= filtros.disponivelMin!);
      }

      // Novos filtros de certificação e tipo de agricultura
      if (filtros?.certificacoes && filtros.certificacoes.size > 0 && filtros.certificacoes.size < 3) {
        variantes = variantes.filter(v => v.certificacao && filtros.certificacoes!.has(v.certificacao));
      }
      if (filtros?.tiposAgricultura && filtros.tiposAgricultura.size > 0 && filtros.tiposAgricultura.size < 2) {
        variantes = variantes.filter(v => v.tipo_agricultura && filtros.tiposAgricultura!.has(v.tipo_agricultura));
      }

      return {
        ...group,
        variantes,
        minPreco: variantes.length > 0 ? Math.min(...variantes.map(v => v.valor)) : group.minPreco,
        totalVariantes: variantes.length,
      };
    })
    .filter(group => group.variantes.length > 0); // Remover grupos vazios
}
