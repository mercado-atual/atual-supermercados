import * as fs from 'fs';
import * as path from 'path';

const CSV_FILE = path.join(process.cwd(), 'data', 'produtos_atual.csv');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'products.ts');

interface CSVProduct {
  codigo: string;
  descricao: string;
  gtin: string;
  preco: number;
  estoque: number;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Palavras-chave para EXCLUIR (não são produtos de supermercado)
const EXCLUDE_KEYWORDS = [
  // Construção e materiais
  'cantoneira', 'perfil', 'alumínio', 'aluminio', 'cobre', 'ferro', 'aço', 'aco',
  'tijolo', 'cimento', 'areia', 'pedra', 'argamassa', 'reboco', 'gesso', 'drywall',
  'porta', 'janela', 'telha', 'telha', 'cano', 'tubo', 'conexão', 'conexao', 'registro',
  'torneira', 'chuveiro', 'vaso', 'pia', 'ralo', 'sifão', 'sifao', 'caixa dágua',
  'fiação', 'fiacao', 'fio', 'cabo', 'disjuntor', 'tomada', 'interruptor', 'lâmpada',
  'lampada', 'led', 'luminária', 'luminaria', 'lustre', 'pendente', 'plafon',
  
  // Elétrica e eletrônicos
  'transformador', 'fonte', 'carregador', 'adaptador', 'fusível', 'fusivel',
  'relé', 'rele', 'contator', 'no-break', 'nobreak', 'estabilizador',
  'computador', 'notebook', 'tablet', 'smartphone', 'celular', 'telefone',
  'tv', 'televisão', 'televisao', 'monitor', 'impressora', 'scanner',
  'roteador', 'modem', 'antena', 'amplificador', 'caixa de som', 'microfone',
  
  // Ferramentas
  'ferramenta', 'ferro', 'martelo', 'chave', 'chave de fenda', 'alicate', 'serra',
  'furadeira', 'parafusadeira', 'lixadeira', 'esmerilhadeira', 'solda', 'soldador',
  'grampo', 'parafuso', 'prego', 'porca', 'arruela', 'rebite', 'bucha',
  'trena', 'nível', 'nivel', 'esquadro', 'régua', 'regua', 'metro',
  
  // Serviços e outros
  'energia elétrica', 'energia eletrica', 'energia', 'vale gas', 'vale-gás', 'vale gás',
  'vale gas un', 'gás', 'gas', 'combustível', 'combustivel',
  'serviço', 'servico', 'consulta', 'atendimento', 'instalação', 'instalacao',
  'manutenção', 'manutencao', 'reparo', 'conserto', 'assistência', 'assistencia',
  
  // Outros não alimentícios
  'eletrodo', 'elétrodo', 'arame', 'tela', 'grade', 'alambrado', 'cerca',
  'portão', 'portao', 'cancela', 'guarda-corpo', 'corrimão', 'corrimao',
  'vidro', 'espelho', 'laje', 'concreto', 'argila', 'barro', 'azulejo',
  
  // Bazar/hardware não alimentício
  'quadro de portas', 'porta refrigerada', 'gaveta', 'prateleira', 'estante',
  'armário', 'armario', 'gaveteiro', 'arquivo', 'cadeado', 'tranca', 'fechadura',
];

// Função para verificar se o produto deve ser EXCLUÍDO
function shouldExclude(descricao: string): boolean {
  const descLower = descricao.toLowerCase();
  
  // Excluir se contém qualquer palavra-chave de exclusão
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (descLower.includes(keyword)) {
      return true;
    }
  }
  
  // Excluir se parece ser um cabeçalho ou linha de seção
  if (descLower.startsWith('departamento') || descLower.startsWith('seção') ||
      descLower.startsWith('secao') || descLower.includes('mercado frozza') ||
      descLower.includes('total') || descLower.includes('subtotal')) {
    return true;
  }
  
  return false;
}

function determineCategory(descricao: string): string {
  const descLower = descricao.toLowerCase();
  
  if (descLower.includes('fruta') || descLower.includes('verdura') || descLower.includes('legume') || 
      descLower.includes('banana') || descLower.includes('tomate') || descLower.includes('alface') ||
      descLower.includes('cenoura') || descLower.includes('batata') || descLower.includes('cebola') ||
      descLower.includes('maçã') || descLower.includes('maca') || descLower.includes('abacaxi') ||
      descLower.includes('laranja') || descLower.includes('limão') || descLower.includes('limao') ||
      descLower.includes('uva') || descLower.includes('mamão') || descLower.includes('mamao') ||
      descLower.includes('melancia') || descLower.includes('melão') || descLower.includes('melao') ||
      descLower.includes('manga') || descLower.includes('morango') || descLower.includes('kiwi') ||
      descLower.includes('pêra') || descLower.includes('pera') || descLower.includes('pêssego') ||
      descLower.includes('pessego') || descLower.includes('brócolis') || descLower.includes('brocolis') ||
      descLower.includes('repolho') || descLower.includes('pepino') || descLower.includes('abobrinha') ||
      descLower.includes('berinjela') || descLower.includes('chuchu') || descLower.includes('couve') ||
      descLower.includes('espinafre') || descLower.includes('rúcula') || descLower.includes('rucula') ||
      descLower.includes('agrião') || descLower.includes('agriao') || descLower.includes('salsinha') ||
      descLower.includes('cebolinha') || descLower.includes('coentro') || descLower.includes('manjericão') ||
      descLower.includes('manjericao') || descLower.includes('pimentão') || descLower.includes('pimentao')) {
    return 'hortifruti';
  } else if (descLower.includes('carne') || descLower.includes('frango') || descLower.includes('peixe') ||
             descLower.includes('bovina') || descLower.includes('porco') || descLower.includes('linguiça') ||
             descLower.includes('linguica') || descLower.includes('alcatra') || descLower.includes('picanha') ||
             descLower.includes('contrafilé') || descLower.includes('contrafile') || descLower.includes('filé') ||
             descLower.includes('file') || descLower.includes('mignon') || descLower.includes('coxão') ||
             descLower.includes('coxa') || descLower.includes('patinho') || descLower.includes('maminha') ||
             descLower.includes('acém') || descLower.includes('acem') || descLower.includes('paleta') ||
             descLower.includes('músculo') || descLower.includes('musculo') || descLower.includes('costela') ||
             descLower.includes('lagarto') || descLower.includes('cupim') || descLower.includes('fraldinha') ||
             descLower.includes('salmão') || descLower.includes('salmao') || descLower.includes('tilápia') ||
             descLower.includes('tilapia') || descLower.includes('sardinha') || descLower.includes('camarão') ||
             descLower.includes('camarao') || descLower.includes('polvo') || descLower.includes('presunto') ||
             descLower.includes('mortadela') || descLower.includes('salame') || descLower.includes('bacon')) {
    return 'acougue';
  } else if (descLower.includes('pão') || descLower.includes('pao') || descLower.includes('bolo') ||
             descLower.includes('torta') || descLower.includes('croissant') || descLower.includes('baguete') ||
             descLower.includes('sonho') || descLower.includes('brigadeiro') || descLower.includes('biscoito') ||
             descLower.includes('rosca')) {
    return 'padaria';
  } else if (descLower.includes('cerveja') || descLower.includes('refrigerante') || descLower.includes('suco') ||
             descLower.includes('água') || descLower.includes('agua') || descLower.includes('bebida') ||
             descLower.includes('coca') || descLower.includes('guaraná') || descLower.includes('guarana') ||
             descLower.includes('pepsi') || descLower.includes('fanta') || descLower.includes('sprite') ||
             descLower.includes('vinho') || descLower.includes('café') || descLower.includes('cafe') ||
             descLower.includes('achocolatado') || descLower.includes('chá') || descLower.includes('cha') ||
             descLower.includes('mate') || descLower.includes('energético') || descLower.includes('energetico')) {
    return 'bebidas';
  } else if (descLower.includes('sabão') || descLower.includes('sabao') || descLower.includes('detergente') ||
             descLower.includes('limpa') || descLower.includes('desinfetante') || descLower.includes('água sanitária') ||
             descLower.includes('agua sanitaria') || descLower.includes('veja') || descLower.includes('omo') ||
             descLower.includes('brilho') || descLower.includes('lustra') || descLower.includes('multiuso') ||
             descLower.includes('esponja') || descLower.includes('pano') || descLower.includes('vassoura') ||
             descLower.includes('rodo') || descLower.includes('balde') || descLower.includes('saco de lixo') ||
             descLower.includes('saco plastico') || descLower.includes('papel toalha') || descLower.includes('papel higienico')) {
    return 'limpeza';
  } else if (descLower.includes('shampoo') || descLower.includes('condicionador') || descLower.includes('sabonete') ||
             descLower.includes('pasta de dente') || descLower.includes('creme dental') || descLower.includes('escova') ||
             descLower.includes('desodorante') || descLower.includes('absorvente') || descLower.includes('fralda') ||
             descLower.includes('algodão') || descLower.includes('algodao') || descLower.includes('cotton') ||
             descLower.includes('papel higiênico') || descLower.includes('papel higienico') || descLower.includes('lenço') ||
             descLower.includes('lenco') || descLower.includes('toalha') || descLower.includes('protetor')) {
    return 'higiene';
  }
  
  return 'ofertas';
}

function determineUnit(descricao: string): string {
  const descLower = descricao.toLowerCase();
  
  if (descLower.includes('kg') || descLower.includes('quilo') || descLower.includes('grama') ||
      descLower.includes('g ') || descLower.endsWith('g')) {
    return 'kg';
  } else if (descLower.includes('litro') || descLower.includes(' l ') || descLower.endsWith('l') ||
             descLower.includes('ml') || descLower.includes('ml ')) {
    return 'l';
  } else if (descLower.includes('pacote') || descLower.includes('pct') || descLower.includes('pac ') ||
             descLower.includes('pac.') || descLower.includes('embalagem')) {
    return 'pct';
  } else if (descLower.includes('dúzia') || descLower.includes('duzia') || descLower.includes('dz')) {
    return 'dz';
  } else if (descLower.includes('maço') || descLower.includes('maco')) {
    return 'maço';
  } else if (descLower.includes('bandeja')) {
    return 'bandeja';
  } else if (descLower.includes('fatia')) {
    return 'fatia';
  }
  
  return 'un';
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

async function importCSVToProducts() {
  console.log('📖 Lendo arquivo CSV...');
  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  console.log(`📊 Total de linhas: ${lines.length}`);
  
  if (lines.length < 2) {
    throw new Error('CSV deve ter pelo menos cabeçalho e uma linha de dados');
  }
  
  // Verificar cabeçalho
  const header = lines[0].toLowerCase();
  if (!header.includes('codigo') || !header.includes('descricao') || !header.includes('preco')) {
    throw new Error('Cabeçalho CSV inválido. Esperado: codigo,descricao,gtin,preco,estoque');
  }
  
  // Parsear produtos
  const products: CSVProduct[] = [];
  let errors = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const values = parseCSVLine(line);
      
      if (values.length < 5) continue;
      
      const codigo = values[0]?.replace(/^"|"$/g, '').trim() || '';
      const descricao = values[1]?.replace(/^"|"$/g, '').trim() || '';
      const gtin = values[2]?.replace(/^"|"$/g, '').trim() || '';
      const precoStr = values[3]?.replace(/^"|"$/g, '').trim() || '0';
      const estoqueStr = values[4]?.replace(/^"|"$/g, '').trim() || '0';
      
      // Validar descrição obrigatória
      if (!descricao) continue;
      
      // Ignorar linhas que são cabeçalhos de seção
      const descUpper = descricao.toUpperCase();
      if (descUpper.startsWith('DEPARTAMENTO') || descUpper.startsWith('SECAO') || 
          descUpper.startsWith('SEÇÃO') || descUpper.includes('MERCADO FROZZA')) {
        continue;
      }
      
      // EXCLUIR produtos que NÃO são de supermercado
      if (shouldExclude(descricao)) {
        continue;
      }
      
      // Converter preço
      const preco = parseFloat(precoStr.replace(',', '.'));
      // REMOVER produtos com preço zero ou inválido
      // Também remover produtos com preço muito baixo (menor que R$ 0,50) que geralmente são erros
      if (isNaN(preco) || preco <= 0.50) continue;
      
      // Converter estoque
      const estoqueStrClean = estoqueStr.replace(/\./g, '').replace(',', '.');
      const estoque = parseInt(estoqueStrClean);
      
      products.push({
        codigo,
        descricao,
        gtin: gtin === '0' ? '' : gtin,
        preco,
        estoque: isNaN(estoque) || estoque < 0 ? 0 : estoque,
      });
    } catch (error) {
      errors++;
      if (errors <= 10) {
        console.warn(`⚠️  Erro na linha ${i + 1}: ${error}`);
      }
    }
  }
  
  console.log(`✅ Produtos processados: ${products.length}`);
  console.log(`⚠️  Erros: ${errors}`);
  
  // Verificar quais imagens existem
  const imagesDir = path.join(process.cwd(), 'public', 'produtos');
  const existingImages = new Set<string>();
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir);
    imageFiles.forEach(file => {
      if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
        const codigo = file.replace(/\.(jpg|jpeg)$/i, '');
        existingImages.add(codigo);
      }
    });
  }
  
  console.log(`📸 Imagens encontradas: ${existingImages.size}`);
  
  // Gerar código TypeScript
  const productsCode = products.map((p, index) => {
    const category = determineCategory(p.descricao);
    const unit = determineUnit(p.descricao);
    const priceFormatted = p.preco.toFixed(2).replace('.', ',');
    
    // Limitar descrição para título (primeiros 50 caracteres)
    const title = p.descricao.length > 50 
      ? p.descricao.substring(0, 47) + '...'
      : p.descricao;
    
    // Verificar se existe imagem para este código
    const hasImage = existingImages.has(p.codigo);
    const imagePath = hasImage ? `/produtos/${p.codigo}.jpg` : '';
    
    return `  {
    id: "${p.codigo}",
    title: "${escapeString(title)}",
    price: "${priceFormatted}",
    unit: "${unit}",
    image: "${imagePath}",
    category: "${category}",
    description: "${escapeString(p.descricao)}",
  }`;
  }).join(',\n');
  
  const fileContent = `// Dados compartilhados de produtos para todo o projeto
// IMPORTADO AUTOMATICAMENTE DO CSV: data/produtos_atual.csv
// Última atualização: ${new Date().toLocaleString('pt-BR')}

export interface Product {
  id: string;
  title: string;
  price: string;
  unit: string;
  image?: string;
  badge?: string;
  description?: string;
  category: string;
}

export const products: Product[] = [
${productsCode}
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
  );
};
`;
  
  // Salvar arquivo
  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
  
  console.log(`\n✅ Arquivo gerado: ${OUTPUT_FILE}`);
  console.log(`📊 Total de produtos: ${products.length}`);
  
  // Estatísticas
  const byCategory = products.reduce((acc, p) => {
    const cat = determineCategory(p.descricao);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📋 Distribuição por categoria:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });
  
  // Verificar Cebola Roxa
  const cebolaRoxa = products.find(p => 
    p.descricao.toUpperCase().includes('CEBOLA ROXA') && 
    p.descricao.toUpperCase().includes('KG')
  );
  
  if (cebolaRoxa) {
    console.log(`\n✅ Cebola Roxa encontrada:`);
    console.log(`   Código: ${cebolaRoxa.codigo}`);
    console.log(`   Descrição: ${cebolaRoxa.descricao}`);
    console.log(`   Preço: R$ ${cebolaRoxa.preco.toFixed(2).replace('.', ',')}`);
  }
}

importCSVToProducts().catch(console.error);
