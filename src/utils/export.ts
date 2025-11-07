import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CicloInfo {
  id: number;
  nome: string;
}

// Função para gerar CSV de pedidos de consumidores
export const exportConsumidoresCSV = (
  pedidos: any[],
  ciclos: CicloInfo[]
) => {
  const headers = [
    'Ciclo',
    'Consumidor',
    'Produto',
    'Fornecedor',
    'Medida',
    'Valor Unitário',
    'Quantidade',
    'Total',
    'Agricultura Familiar',
    'Certificação'
  ];

  const rows = pedidos.map(p => [
    p.ciclo,
    p.consumidor,
    p.produto,
    p.fornecedor,
    p.medida,
    `R$ ${p.valor_unitario.toFixed(2).replace('.', ',')}`,
    p.quantidade,
    `R$ ${p.total.toFixed(2).replace('.', ',')}`,
    p.agricultura_familiar ? 'Sim' : 'Não',
    p.certificacao === 'organico' ? 'Orgânico' : 
    p.certificacao === 'transicao' ? 'Transição' : 'Convencional'
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const ciclosNomes = ciclos.map(c => c.nome).join('_');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_consumidores_${ciclosNomes}_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função para gerar PDF de pedidos de consumidores
export const exportConsumidoresPDF = (
  pedidos: any[],
  ciclos: CicloInfo[],
  resumo: { totalConsumidores: number; totalKg: number; valorTotal: number }
) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Pedidos dos Consumidores', 14, 20);
  
  // Ciclos
  doc.setFontSize(11);
  doc.text(`Ciclos: ${ciclos.map(c => c.nome).join(', ')}`, 14, 30);
  
  // Resumo
  doc.setFontSize(10);
  doc.text(`Total de Consumidores: ${resumo.totalConsumidores}`, 14, 40);
  doc.text(`Total de Kg: ${resumo.totalKg.toFixed(2).replace('.', ',')} kg`, 14, 46);
  doc.text(`Valor Total: R$ ${resumo.valorTotal.toFixed(2).replace('.', ',')}`, 14, 52);
  
  // Tabela
  const tableData = pedidos.map(p => [
    p.ciclo,
    p.consumidor,
    p.produto,
    p.fornecedor,
    p.medida,
    `R$ ${p.valor_unitario.toFixed(2).replace('.', ',')}`,
    p.quantidade.toString(),
    `R$ ${p.total.toFixed(2).replace('.', ',')}`,
    p.agricultura_familiar ? 'Sim' : 'Não',
    p.certificacao === 'organico' ? 'Org.' : 
    p.certificacao === 'transicao' ? 'Trans.' : 'Conv.'
  ]);
  
  autoTable(doc, {
    startY: 60,
    head: [['Ciclo', 'Consumidor', 'Produto', 'Fornecedor', 'Med.', 'Vlr Unit.', 'Qtd', 'Total', 'Agr. Fam.', 'Cert.']],
    body: tableData,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  const ciclosNomes = ciclos.map(c => c.nome).join('_');
  doc.save(`relatorio_consumidores_${ciclosNomes}_${new Date().getTime()}.pdf`);
};

// Função para gerar CSV de entregas de fornecedores
export const exportFornecedoresCSV = (
  entregas: any[],
  ciclos: CicloInfo[]
) => {
  const headers = [
    'Ciclo',
    'Fornecedor',
    'Produto',
    'Unidade',
    'Valor Unitário',
    'Quantidade Entregue',
    'Valor Total'
  ];

  const rows = entregas.map(e => [
    e.ciclo,
    e.fornecedor,
    e.produto,
    e.unidade_medida,
    `R$ ${e.valor_unitario.toFixed(2).replace('.', ',')}`,
    e.quantidade_entregue,
    `R$ ${e.valor_total.toFixed(2).replace('.', ',')}`
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const ciclosNomes = ciclos.map(c => c.nome).join('_');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_fornecedores_${ciclosNomes}_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função para gerar PDF de entregas de fornecedores
export const exportFornecedoresPDF = (
  entregas: any[],
  ciclos: CicloInfo[],
  resumo: { totalQuantidade: number; valorTotal: number }
) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Entregas dos Fornecedores', 14, 20);
  
  // Ciclos
  doc.setFontSize(11);
  doc.text(`Ciclos: ${ciclos.map(c => c.nome).join(', ')}`, 14, 30);
  
  // Resumo
  doc.setFontSize(10);
  doc.text(`Quantidade de Registros: ${entregas.length}`, 14, 40);
  doc.text(`Quantidade Total Entregue: ${resumo.totalQuantidade}`, 14, 46);
  doc.text(`Valor Total: R$ ${resumo.valorTotal.toFixed(2).replace('.', ',')}`, 14, 52);
  
  // Tabela
  const tableData = entregas.map(e => [
    e.ciclo,
    e.fornecedor,
    e.produto,
    e.unidade_medida,
    `R$ ${e.valor_unitario.toFixed(2).replace('.', ',')}`,
    e.quantidade_entregue.toString(),
    `R$ ${e.valor_total.toFixed(2).replace('.', ',')}`
  ]);
  
  autoTable(doc, {
    startY: 60,
    head: [['Ciclo', 'Fornecedor', 'Produto', 'Unidade', 'Valor Unit.', 'Qtd Entregue', 'Valor Total']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  const ciclosNomes = ciclos.map(c => c.nome).join('_');
  doc.save(`relatorio_fornecedores_${ciclosNomes}_${new Date().getTime()}.pdf`);
};
