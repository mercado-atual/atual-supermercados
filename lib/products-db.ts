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

// Buscar produto por código
export async function getProductByCodigo(codigo: string): Promise<ProductDB | null> {
  const products = await getProducts();
  return products.find(p => p.codigo === codigo) || null;
}

// Buscar produto por GTIN (código de barras EAN-13)
export async function getProductByGtin(gtin: string): Promise<ProductDB | null> {
  const normalized = (gtin || '').trim().replace(/^0+/, '') || gtin;
  const products = await getProducts();
  return products.find(p => {
    const pGtin = (p.gtin || '').trim().replace(/^0+/, '');
    return pGtin === normalized || p.gtin === gtin;
  }) || null;
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
      
      // Normalizar GTIN
      const gtin = (row.gtin || '').trim();
      
      // Verificar se já existe
      const exists = existingCodes.has(row.codigo.trim());
      
      await upsertProduct({
        codigo: row.codigo.trim(),
        descricao: row.descricao.trim(),
        gtin: gtin,
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
