export const sobrasPorCiclo: Record<string, Array<{
  id: string;
  produto: string;
  fornecedor: string;
  unidade: string;
  disponivel: number;
  valor: number;
}>> = {
  c_out_2: [
    { id:"p1", produto:"Tomate Orgânico", fornecedor:"Sítio Verde", unidade:"kg", disponivel:30, valor:4.20 },
    { id:"p2", produto:"Alface Crespa", fornecedor:"Maria Horta", unidade:"maço", disponivel:15, valor:2.00 },
    { id:"p3", produto:"Banana Prata", fornecedor:"João Produtor", unidade:"kg", disponivel:25, valor:5.00 }
  ],
  c_out_1: [
    { id:"p4", produto:"Ovos Caipiras", fornecedor:"Sítio Boa Vista", unidade:"dúzia", disponivel:20, valor:15.00 },
    { id:"p5", produto:"Tomate Orgânico", fornecedor:"João Produtor", unidade:"kg", disponivel:18, valor:4.50 }
  ],
  c_set_3: [
    { id:"p6", produto:"Cenoura Orgânica", fornecedor:"Fazenda Santa Clara", unidade:"kg", disponivel:40, valor:3.80 },
    { id:"p7", produto:"Mamão Formosa", fornecedor:"Sítio Verde", unidade:"kg", disponivel:22, valor:6.50 },
    { id:"p8", produto:"Batata Doce", fornecedor:"Maria Horta", unidade:"kg", disponivel:28, valor:4.10 }
  ]
};
