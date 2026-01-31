// Sistema de persistência de produtos em arquivo JSON
// Simples e funcional, sem necessidade de banco de dados complexo

import fs from 'fs/promises';
import path from 'path';

export interface ProductDB {
  codigo: string;
  descricao: string;
  gtin: string;
  preco: number;
  estoque: number;
  createdAt: string;
  updatedAt: string;
  imagem?: string; // Caminho da imagem do produto
  marca?: string; // Marca/Fabricante/Industrializador do produto
  badge?: string; // Ex: "Oferta" para oferta relâmpago
}

const DB_FILE = path.join(process.cwd(), 'data', 'produtos_db.json');

// Garantir que a pasta data existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Ler produtos do arquivo
export async function getProducts(): Promise<ProductDB[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Arquivo não existe, retornar array vazio
      return [];
    }
    throw error;
  }
}

// Salvar produtos no arquivo
export async function saveProducts(products: ProductDB[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

/**
 * Extrai só dígitos do valor (busca flexível: ignora espaços, traços, etc.).
 */
export function digitsOnly(gtin: string): string {
  return (gtin || '').trim().replace(/\D/g, '');
}

/**
 * Normaliza GTIN (código de barras) para comparação e armazenamento.
 * EAN-13: só dígitos, 13 caracteres (zeros à esquerda).
 * Assim o scanner encontra o produto mesmo com formato diferente (espaços, zeros à esquerda, etc.).
 */
export function normalizeGtin(gtin: string): string {
  const digits = digitsOnly(gtin);
  if (digits.length === 0) return '';
  const s = digits.length > 13 ? digits.slice(-13) : digits;
  return s.padStart(13, '0');
}

// Buscar produto por código
export async function getProductByCodigo(codigo: string): Promise<ProductDB | null> {
  const products = await getProducts();
  return products.find(p => p.codigo === codigo) || null;
}

/**
 * Alias GTIN -> codigo: códigos lidos pelo scanner que correspondem ao mesmo produto no Sysmo.
 */
const GTIN_ALIAS_TO_CODIGO: Record<string, string> = {
  '7896798603434': '524900', // Barra Fruta Supino 24G (Banana e Abacaxi)
};

/**
 * Alias automático para códigos que começam com 789: remove zeros à esquerda.
 * Sysmo pode gravar com zero na frente (ex: 07896798603434); scanner lê 789...3434.
 */
function clean789LeadingZeros(digits: string): string {
  if (!digits) return digits;
  const cleaned = digits.replace(/^0+/, "");
  return cleaned.startsWith("789") ? cleaned : digits;
}

/**
 * Gera todas as formas de busca a partir do número lido (exato + partes).
 * Inclui últimos 12 dígitos para ignorar dígito verificador e zero inicial.
 */
function buildSearchCandidates(scannedDigits: string, normalized13: string): Set<string> {
  const candidates = new Set<string>();
  if (normalized13) candidates.add(normalized13);
  candidates.add(normalizeGtin("0" + scannedDigits));
  if (scannedDigits.length >= 12) candidates.add(scannedDigits.slice(-12));
  if (scannedDigits.length >= 11) candidates.add(scannedDigits.slice(-11));
  if (scannedDigits.length >= 8) candidates.add(scannedDigits);
  return candidates;
}

/**
 * Verifica se um produto bate com algum candidato de busca.
 * Match pelos últimos 12 dígitos: ignora dígito verificador e zero inicial (Sysmo 12 vs 13 dígitos).
 */
function productMatchesCandidates(
  p: ProductDB,
  candidates: Set<string>
): boolean {
  const codigoDig = digitsOnly(p.codigo || "");
  const gtinDig = digitsOnly(p.gtin || "");
  const gtinNorm = normalizeGtin(p.gtin || "");

  if (!codigoDig && !gtinDig && !gtinNorm) return false;

  if (candidates.has(codigoDig) || candidates.has(gtinDig) || candidates.has(gtinNorm)) return true;

  for (const c of candidates) {
    if (c.length < 6) continue;
    if (codigoDig && (codigoDig === c || codigoDig.endsWith(c) || c.endsWith(codigoDig))) return true;
    if (gtinNorm && (gtinNorm === c || gtinNorm.endsWith(c) || c.endsWith(gtinNorm))) return true;
    if (gtinDig && (gtinDig === c || gtinDig.endsWith(c) || c.endsWith(gtinDig))) return true;
    // Match apenas últimos 12 dígitos (ignora dígito verificador e zero à esquerda)
    if (c.length === 12) {
      if (gtinNorm.length >= 12 && gtinNorm.slice(-12) === c) return true;
      if (codigoDig.length >= 12 && codigoDig.slice(-12) === c) return true;
      if (gtinDig.length >= 12 && gtinDig.slice(-12) === c) return true;
    }
  }
  return false;
}

/**
 * Busca produto pelo código lido no scanner (foco total no código de barras).
 * - Alias automático: códigos que começam com 789 têm zeros à esquerda removidos antes da busca.
 * - Match exato; se não achar, match pelos últimos 12 dígitos (ignora dígito verificador e zero inicial).
 */
export async function getProductByGtin(gtin: string): Promise<ProductDB | null> {
  const raw = (gtin || "").trim();
  if (!raw) return null;

  let digits = digitsOnly(raw);
  if (digits.length === 0) return null;

  digits = clean789LeadingZeros(digits);

  const n1 = normalizeGtin(digits);
  const candidates = buildSearchCandidates(digits, n1);

  const products = await getProducts();

  // 1) Busca em todas as colunas (codigo + gtin) com exato e partes
  let found: ProductDB | null = products.find((p) => productMatchesCandidates(p, candidates)) ?? null;

  // 2) Alias: GTIN da embalagem mapeado para codigo do banco
  if (!found && n1 && GTIN_ALIAS_TO_CODIGO[n1]) {
    found = await getProductByCodigo(GTIN_ALIAS_TO_CODIGO[n1]);
  }

  return found;
}

/**
 * Normaliza texto para busca: remove acentos e coloca em minúsculas.
 * Assim "Coca", "COCA" e "coca" trazem o mesmo resultado.
 */
export function normalizeForSearch(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Busca por termos (fuzzy): separa as palavras e exige que TODAS apareçam na descrição.
 * Ex.: "Arroz Branco" → retorna itens que tenham "Arroz" E "Branco" (qualquer ordem).
 * Ignora acentos e maiúsculas. Ranking: nome que COMEÇA com o que foi digitado aparece no topo.
 * Limite padrão 100 resultados.
 */
export async function searchProductsByDescricao(
  termo: string,
  limit = 100
): Promise<{ total: number; products: ProductDB[] }> {
  const q = (termo || "").trim();
  if (!q) return { total: 0, products: [] };

  const queryNorm = normalizeForSearch(q);
  // Ignora termos com menos de 3 caracteres (ex.: "t1" em "Arroz t1 Branco") para não zerar a busca
  const terms = queryNorm.split(/\s+/).filter((t) => t.length >= 3);
  if (terms.length === 0) return { total: 0, products: [] };

  const products = await getProducts();

  const matches = products.filter((p) => {
    const descNorm = normalizeForSearch(p.descricao || "");
    return terms.every((t) => descNorm.includes(t));
  });

  const total = matches.length;

  const firstTerm = terms[0];
  const ranked = matches.slice().sort((a, b) => {
    const descA = normalizeForSearch(a.descricao || "");
    const descB = normalizeForSearch(b.descricao || "");
    const score = (desc: string) => {
      if (desc.startsWith(queryNorm)) return 0;
      if (desc.startsWith(firstTerm)) return 1;
      return 2;
    };
    const scoreA = score(descA);
    const scoreB = score(descB);
    if (scoreA !== scoreB) return scoreA - scoreB;
    const posA = descA.indexOf(firstTerm);
    const posB = descB.indexOf(firstTerm);
    return posA - posB;
  });

  const slice = ranked.slice(0, limit);
  return { total, products: slice };
}

// Atualizar badge (ex: oferta relâmpago)
export async function updateProductBadge(codigo: string, badge: string): Promise<ProductDB | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.codigo === codigo);
  if (index === -1) return null;
  const now = new Date().toISOString();
  products[index] = {
    ...products[index],
    badge: badge || undefined,
    updatedAt: now,
  };
  await saveProducts(products);
  return products[index];
}

// Atualizar ou criar produto
export async function upsertProduct(product: Omit<ProductDB, 'createdAt' | 'updatedAt'>): Promise<ProductDB> {
  const products = await getProducts();
  const existingIndex = products.findIndex(p => p.codigo === product.codigo);
  
  const now = new Date().toISOString();
  
  if (existingIndex >= 0) {
    // Atualizar produto existente
    products[existingIndex] = {
      ...products[existingIndex],
      ...product,
      updatedAt: now,
    };
    await saveProducts(products);
    return products[existingIndex];
  } else {
    // Criar novo produto
    const newProduct: ProductDB = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };
    products.push(newProduct);
    await saveProducts(products);
    return newProduct;
  }
}

// Limpar todos os produtos
export async function clearProducts(): Promise<void> {
  await saveProducts([]);
}

// Importar produtos do CSV (array de objetos)
export async function importProductsFromCSV(
  csvData: Array<{
    codigo: string;
    descricao: string;
    gtin: string;
    preco: string;
    estoque: string;
  }>
): Promise<{
  imported: number;
  updated: number;
  errors: Array<{ row: number; error: string }>;
}> {
  const errors: Array<{ row: number; error: string }> = [];
  let imported = 0;
  let updated = 0;
  
  const existingProducts = await getProducts();
  const existingCodes = new Set(existingProducts.map(p => p.codigo));
  
  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];
    const rowNum = i + 2; // +2 porque linha 1 é cabeçalho
    
    try {
      // Validar descrição (obrigatória)
      if (!row.descricao || !row.descricao.trim()) {
        errors.push({ row: rowNum, error: 'Descrição obrigatória' });
        continue;
      }
      
      // Validar código
      if (!row.codigo || !row.codigo.trim()) {
        errors.push({ row: rowNum, error: 'Código obrigatório' });
        continue;
      }
      
      // Validar e converter preço
      let preco = 0;
      if (row.preco) {
        const precoStr = row.preco.toString().replace(',', '.').trim();
        preco = parseFloat(precoStr);
        if (isNaN(preco) || preco < 0) {
          errors.push({ row: rowNum, error: `Preço inválido: ${row.preco}` });
          continue;
        }
      }
      
      // Validar e converter estoque
      let estoque = 0;
      if (row.estoque) {
        const estoqueStr = row.estoque.toString().replace(/\./g, '').replace(',', '.').trim();
        estoque = parseInt(estoqueStr);
        if (isNaN(estoque) || estoque < 0) {
          estoque = 0;
        }
      }
      
      // Normalizar GTIN (EAN-13, 13 dígitos) para o scanner encontrar; senão manter original
      const gtinFinal = normalizeGtin(row.gtin || '') || (row.gtin || '').trim();
      
      // Verificar se já existe
      const exists = existingCodes.has(row.codigo.trim());
      
      await upsertProduct({
        codigo: row.codigo.trim(),
        descricao: row.descricao.trim(),
        gtin: gtinFinal,
        preco: preco,
        estoque: estoque,
      });
      
      if (exists) {
        updated++;
      } else {
        imported++;
      }
    } catch (error: any) {
      errors.push({ row: rowNum, error: error.message || 'Erro desconhecido' });
    }
  }
  
  return { imported, updated, errors };
}
