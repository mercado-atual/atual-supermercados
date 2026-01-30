const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminhos
const excelFile = path.join(__dirname, '..', 'lista de preços para site.xlsx');
const outputDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(outputDir, 'produtos_atual.csv');

// Criar pasta data se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('📖 Lendo arquivo Excel...');
const workbook = XLSX.readFile(excelFile);

// Pegar a primeira planilha
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converter para JSON
const rawData = XLSX.utils.sheet_to_json(worksheet, { 
  header: 1, 
  defval: '',
  raw: false 
});

console.log(`📊 Total de linhas no arquivo: ${rawData.length}`);

// Baseado na análise do arquivo:
// - Coluna 1 (índice 0): código
// - Coluna 2 (índice 1): descrição
// - Coluna 4 (índice 3): GTIN
// - Coluna 11 ou 12 (índice 10 ou 11): preço (Tab1)
// - Coluna 15 (índice 14): estoque (Disponível)

// Encontrar a linha de cabeçalho (linha com "GTIN")
let headerRowIndex = -1;

for (let i = 0; i < Math.min(10, rawData.length); i++) {
  const row = rawData[i];
  if (!Array.isArray(row)) continue;
  
  // Verificar se a linha contém "GTIN" na coluna 4 (índice 3)
  if (row[3] && row[3].toString().toUpperCase().includes('GTIN')) {
    headerRowIndex = i;
    break;
  }
}

if (headerRowIndex === -1) {
  console.error('❌ Não foi possível encontrar o cabeçalho no arquivo');
  process.exit(1);
}

console.log(`✅ Cabeçalho encontrado na linha ${headerRowIndex + 1}`);

// Mapear colunas baseado na estrutura conhecida
const columnMap = {
  codigo: 0,      // Coluna 1
  descricao: 1,   // Coluna 2
  gtin: 3,        // Coluna 4
  preco: 10,      // Coluna 11 (Tab1) - usar primeira coluna de preço
  estoque: 14     // Coluna 15 (Disponível)
};

console.log('📋 Colunas mapeadas:');
console.log('  - codigo: coluna 1 (índice 0)');
console.log('  - descricao: coluna 2 (índice 1)');
console.log('  - gtin: coluna 4 (índice 3)');
console.log('  - preco: coluna 11 (índice 10 - Tab1)');
console.log('  - estoque: coluna 15 (índice 14 - Disponível)');

// Processar dados
const produtos = [];
let linhasIgnoradas = 0;
let semPreco = 0;
let semGtin = 0;

for (let i = headerRowIndex + 1; i < rawData.length; i++) {
  const row = rawData[i];
  
  // Ignorar linhas vazias
  if (!Array.isArray(row) || row.length === 0) {
    linhasIgnoradas++;
    continue;
  }
  
  // Verificar se a linha tem dados válidos (não é apenas cabeçalho de relatório)
  const codigo = row[columnMap.codigo]?.toString().trim() || '';
  const descricao = row[columnMap.descricao]?.toString().trim() || '';
  
  // Ignorar se não tem código ou descrição
  if (!codigo && !descricao) {
    linhasIgnoradas++;
    continue;
  }
  
  // Ignorar se parece ser um cabeçalho de relatório ou seção
  const rowText = row.join(' ').toUpperCase();
  
  // Ignorar linhas que são claramente cabeçalhos de seção
  // (quando a descrição começa com "DEPARTAMENTO" ou contém apenas texto de cabeçalho)
  const descUpper = descricao.toUpperCase();
  if (descUpper.startsWith('DEPARTAMENTO') || 
      descUpper.startsWith('SECAO') || 
      descUpper.startsWith('SEÇÃO') ||
      descUpper.startsWith('MERCADO FROZZA') ||
      descUpper.startsWith('MERCADOFROZZA')) {
    linhasIgnoradas++;
    continue;
  }
  
  // Ignorar linhas que são totais/subtotais
  if (rowText.includes('TOTAL') && (rowText.includes('GERAL') || rowText.includes('SUBTOTAL'))) {
    linhasIgnoradas++;
    continue;
  }
  
  // Normalizar preço - tentar coluna 11 primeiro, depois 12
  let preco = '';
  let precoNum = 0;
  
  // Tentar coluna 11 (Tab1)
  preco = row[columnMap.preco]?.toString().trim() || '';
  
  // Se vazio, tentar coluna 12
  if (!preco && row[11]) {
    preco = row[11].toString().trim();
  }
  
  if (preco) {
    // Remover símbolos e espaços, substituir vírgula por ponto
    preco = preco.replace(/[R$\s]/g, '').replace(',', '.');
    precoNum = parseFloat(preco);
    
    if (isNaN(precoNum) || precoNum < 0) {
      precoNum = 0;
      semPreco++;
    }
  } else {
    semPreco++;
  }
  
  // Normalizar estoque - remover pontos de milhar
  let estoque = 0;
  const estoqueStr = row[columnMap.estoque]?.toString().trim() || '';
  if (estoqueStr) {
    // Remover pontos de milhar e converter
    const estoqueClean = estoqueStr.replace(/\./g, '').replace(',', '.');
    const estoqueNum = parseFloat(estoqueClean);
    estoque = isNaN(estoqueNum) || estoqueNum < 0 ? 0 : Math.floor(estoqueNum);
  }
  
  // Normalizar GTIN
  let gtin = '';
  if (columnMap.gtin !== undefined) {
    gtin = row[columnMap.gtin]?.toString().trim() || '';
    // Remover espaços e caracteres especiais do GTIN
    gtin = gtin.replace(/\s/g, '');
    // Tratar "0" como vazio
    if (gtin === '0' || gtin === '') {
      gtin = '';
      semGtin++;
    }
  } else {
    semGtin++;
  }
  
  // Normalizar descrição (remover quebras de linha e espaços extras)
  const descricaoNormalizada = descricao
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Adicionar produto
  produtos.push({
    codigo: codigo || `PROD${i}`,
    descricao: descricaoNormalizada || 'Sem descrição',
    gtin: gtin || '',
    preco: precoNum.toFixed(2),
    estoque: estoque.toString()
  });
}

console.log(`\n📦 Processamento concluído:`);
console.log(`   ✅ Produtos processados: ${produtos.length}`);
console.log(`   ⏭️  Linhas ignoradas: ${linhasIgnoradas}`);
console.log(`   ⚠️  Produtos sem preço: ${semPreco}`);
console.log(`   ⚠️  Produtos sem GTIN: ${semGtin}`);

// Gerar CSV UTF-8
const csvHeader = 'codigo,descricao,gtin,preco,estoque\n';
const csvRows = produtos.map(p => {
  // Escapar vírgulas e aspas no CSV
  const escapeCSV = (str) => {
    if (!str) return '';
    const s = str.toString();
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  
  return [
    escapeCSV(p.codigo),
    escapeCSV(p.descricao),
    escapeCSV(p.gtin),
    escapeCSV(p.preco),
    escapeCSV(p.estoque)
  ].join(',');
}).join('\n');

const csvContent = csvHeader + csvRows;

// Salvar arquivo com BOM UTF-8
const BOM = '\uFEFF';
fs.writeFileSync(outputFile, BOM + csvContent, 'utf8');

console.log(`\n✅ Arquivo CSV gerado com sucesso!`);
console.log(`   📁 Local: ${outputFile}`);
console.log(`   📊 Total de produtos: ${produtos.length}`);

// Mostrar 5 exemplos
console.log(`\n📋 Exemplos (primeiros 5 produtos):`);
produtos.slice(0, 5).forEach((p, i) => {
  console.log(`\n   ${i + 1}. Código: ${p.codigo}`);
  console.log(`      Descrição: ${p.descricao.substring(0, 50)}${p.descricao.length > 50 ? '...' : ''}`);
  console.log(`      GTIN: ${p.gtin || '(vazio)'}`);
  console.log(`      Preço: R$ ${p.preco}`);
  console.log(`      Estoque: ${p.estoque}`);
});

// Avisos
if (semPreco > 0) {
  console.log(`\n⚠️  ATENÇÃO: ${semPreco} produto(s) sem preço válido (será 0.00)`);
}

if (semGtin > 0) {
  console.log(`\n⚠️  ATENÇÃO: ${semGtin} produto(s) sem GTIN (campo vazio)`);
}

console.log('\n✨ Processamento finalizado!');
