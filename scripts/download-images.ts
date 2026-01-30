import * as fs from 'fs';
import * as path from 'path';

const CSV_FILE = path.join(process.cwd(), 'data', 'produtos_atual.csv');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'produtos');
const LOG_FILE = path.join(process.cwd(), 'scripts', 'download-images.log');

interface CSVProduct {
  codigo: string;
  descricao: string;
  gtin: string;
  preco: number;
  estoque: number;
}

interface DownloadStats {
  total: number;
  downloaded: number;
  skipped: number;
  errors: number;
  ignored: number; // produtos sem GTIN
}

// Parse CSV line handling quotes
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

// Read CSV file
function readCSV(): CSVProduct[] {
  const content = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  const header = parseCSVLine(lines[0]);
  const products: CSVProduct[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 5) continue;
    
    const codigo = values[0]?.trim() || '';
    const descricao = values[1]?.trim() || '';
    const gtin = values[2]?.trim() || '';
    const preco = parseFloat(values[3]?.replace(',', '.') || '0');
    const estoque = parseInt(values[4]?.trim() || '0');
    
    if (codigo && descricao) {
      products.push({
        codigo,
        descricao,
        gtin,
        preco,
        estoque
      });
    }
  }
  
  return products;
}

// Ensure images directory exists
function ensureImagesDir(): void {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
}

// Check if image already exists
function imageExists(codigo: string): boolean {
  const imagePath = path.join(IMAGES_DIR, `${codigo}.jpg`);
  return fs.existsSync(imagePath);
}

// Fetch image from Open Food Facts
async function fetchFromOpenFoodFacts(gtin: string): Promise<string | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${gtin}.json`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Atual Supermercados - Product Image Bot'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      // Try to get the front image first, then any image
      const imageUrl = data.product.image_url 
        || data.product.image_front_url
        || data.product.image_front_small_url
        || data.product.images?.[`${gtin}_front`]?.sizes?.full?.url
        || null;
      
      return imageUrl;
    }
    
    return null;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      log(`⚠️ Timeout ao buscar GTIN ${gtin}`);
    } else {
      log(`⚠️ Erro ao buscar GTIN ${gtin}: ${error.message}`);
    }
    return null;
  }
}

// Download image from URL
async function downloadImage(imageUrl: string, outputPath: string): Promise<boolean> {
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Atual Supermercados - Product Image Bot'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return false;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Basic validation: check if it's a valid image (JPEG/PNG)
    // Check magic numbers
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    
    if (!isJpeg && !isPng) {
      return false;
    }
    
    // Minimum size validation (at least 1KB)
    if (buffer.length < 1024) {
      return false;
    }
    
    // Write file
    fs.writeFileSync(outputPath, buffer);
    return true;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      log(`⚠️ Timeout ao baixar imagem de ${imageUrl}`);
    } else {
      log(`⚠️ Erro ao baixar imagem de ${imageUrl}: ${error.message}`);
    }
    return false;
  }
}

// Log message to file and console
function log(message: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

// Main function
async function main() {
  log('=== Iniciando robô de download de imagens ===');
  
  ensureImagesDir();
  
  // Clear previous log
  if (fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '');
  }
  
  const products = readCSV();
  log(`Total de produtos no CSV: ${products.length}`);
  
  const stats: DownloadStats = {
    total: 0,
    downloaded: 0,
    skipped: 0,
    errors: 0,
    ignored: 0
  };
  
  // Filter products with GTIN
  const productsWithGTIN = products.filter(p => p.gtin && p.gtin.trim() !== '');
  log(`Produtos com GTIN: ${productsWithGTIN.length}`);
  log(`Produtos sem GTIN (ignorados): ${products.length - productsWithGTIN.length}`);
  
  stats.ignored = products.length - productsWithGTIN.length;
  stats.total = productsWithGTIN.length;
  
  // Process products
  for (let i = 0; i < productsWithGTIN.length; i++) {
    const product = productsWithGTIN[i];
    const imagePath = path.join(IMAGES_DIR, `${product.codigo}.jpg`);
    
    // Skip if image already exists
    if (imageExists(product.codigo)) {
      stats.skipped++;
      if ((i + 1) % 100 === 0) {
        log(`Progresso: ${i + 1}/${productsWithGTIN.length} - Pulados: ${stats.skipped}, Baixados: ${stats.downloaded}, Erros: ${stats.errors}`);
      }
      continue;
    }
    
    // Try Open Food Facts
    try {
      const imageUrl = await fetchFromOpenFoodFacts(product.gtin);
      
      if (imageUrl) {
        const success = await downloadImage(imageUrl, imagePath);
        if (success) {
          stats.downloaded++;
          log(`✓ Baixado: ${product.codigo} - ${product.descricao.substring(0, 50)}`);
        } else {
          stats.errors++;
          log(`✗ Erro ao baixar: ${product.codigo} - ${product.descricao.substring(0, 50)}`);
        }
      } else {
        stats.errors++;
        log(`✗ Imagem não encontrada: ${product.codigo} - ${product.descricao.substring(0, 50)}`);
      }
    } catch (error) {
      stats.errors++;
      log(`✗ Erro ao processar: ${product.codigo} - ${error}`);
    }
    
    // Rate limiting: wait 500ms between requests (como no script Python)
    if (i < productsWithGTIN.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Progress log every 50 products
    if ((i + 1) % 50 === 0) {
      log(`Progresso: ${i + 1}/${productsWithGTIN.length} - Pulados: ${stats.skipped}, Baixados: ${stats.downloaded}, Erros: ${stats.errors}`);
    }
  }
  
  // Final statistics
  log('=== Estatísticas finais ===');
  log(`Total de produtos processados: ${stats.total}`);
  log(`Produtos sem GTIN (ignorados): ${stats.ignored}`);
  log(`Imagens já existentes (puladas): ${stats.skipped}`);
  log(`Imagens baixadas com sucesso: ${stats.downloaded}`);
  log(`Erros: ${stats.errors}`);
  log('=== Robô finalizado ===');
}

// Run
main().catch(error => {
  log(`ERRO FATAL: ${error}`);
  console.error(error);
  process.exit(1);
});
