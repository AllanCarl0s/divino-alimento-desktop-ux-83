export type Gender = 'male' | 'female' | 'nonbinary' | 'unspecified';
export type AppRole = 'consumidor' | 'fornecedor' | 'admin' | 'admin_mercado';

const neutralLabels = {
  consumidor: 'Consumidor(a)',
  fornecedor: 'Fornecedor(a)',
  admin: 'Administrador(a)',
  admin_mercado: 'Administrador(a) de mercado',
};

const maleLabels = {
  consumidor: 'Consumidor',
  fornecedor: 'Fornecedor',
  admin: 'Administrador',
  admin_mercado: 'Administrador de mercado',
};

const femaleLabels = {
  consumidor: 'Consumidora',
  fornecedor: 'Fornecedora',
  admin: 'Administradora',
  admin_mercado: 'Administradora de mercado',
};

/**
 * Retorna o rótulo apropriado do perfil baseado no gênero do usuário
 * @param role - O perfil/role do usuário
 * @param gender - O gênero do usuário
 * @returns String com o rótulo formatado
 */
export function roleLabel(role: AppRole, gender: Gender = 'unspecified'): string {
  if (gender === 'male') return maleLabels[role];
  if (gender === 'female') return femaleLabels[role];
  return neutralLabels[role]; // nonbinary/unspecified
}

/**
 * Retorna a descrição do perfil para uso nos cards de registro
 */
export function roleDescription(role: AppRole): string {
  const descriptions = {
    consumidor: 'Receba cestas e alimentos orgânicos.',
    fornecedor: 'Gestão de alimentos e vendas para estabelecimentos.',
    admin: 'Gestão completa da plataforma e todos os mercados.',
    admin_mercado: 'Gestão específica de um mercado e seus fornecedores.',
  };
  return descriptions[role];
}

/**
 * Retorna o título completo da página com papel e seção
 * @param role - O perfil/role do usuário
 * @param page - Nome da página/seção (ex: "Minha Cesta")
 * @param gender - O gênero do usuário
 * @returns String com o título formatado para uso em metas/SEO
 */
export function getPageTitle(role: AppRole, page: string, gender: Gender = 'unspecified'): string {
  const roleText = roleLabel(role, gender);
  return `${roleText} – ${page}`;
}
