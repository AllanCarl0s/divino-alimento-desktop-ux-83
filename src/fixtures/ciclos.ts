export const ciclos = [
  // destino (ativo)
  {
    id: "c_nov_1",
    nome: "1º Ciclo de Novembro 2025",
    periodo: "31/10/2025 – 06/11/2025",
    status: "Ativo",
    mercados: [
      { ordem: 1, nome: "Feira Livre", tipo: "Venda Direta" },
      { ordem: 2, nome: "Mercado Zona Norte", tipo: "Lote" },
      { ordem: 3, nome: "Mercado Central", tipo: "Cesta" }
    ]
  },

  // origem (finalizados)
  {
    id: "c_out_2",
    nome: "2º Ciclo de Outubro 2025",
    periodo: "22/10/2025 – 30/10/2025",
    status: "Finalizado",
    mercados: [
      { ordem: 1, nome: "Mercado Central", tipo: "Cesta" }
    ]
  },
  {
    id: "c_out_1",
    nome: "1º Ciclo de Outubro 2025",
    periodo: "13/10/2025 – 20/10/2025",
    status: "Finalizado",
    mercados: [
      { ordem: 1, nome: "Feira Livre", tipo: "Venda Direta" }
    ]
  },
  {
    id: "c_set_3",
    nome: "3º Ciclo de Setembro 2025",
    periodo: "09/09/2025 – 16/09/2025",
    status: "Finalizado",
    mercados: [
      { ordem: 1, nome: "Mercado Bairro Sul", tipo: "Lote" },
      { ordem: 2, nome: "Feira do Produtor", tipo: "Venda Direta" },
      { ordem: 3, nome: "Mercado Centro", tipo: "Cesta" },
      { ordem: 4, nome: "Mercado Zona Leste", tipo: "Cesta" }
    ]
  }
];
