/**
 * Busca imagens no Open Food Facts por GTIN e salva em public/produtos/{codigo}.jpg.
 * Lê de data/produtos_db.json (catálogo com 16k+ itens).
 * Opcionalmente atualiza o JSON com imagem: "/produtos/{codigo}.jpg" quando encontrar.
 *
 * Uso: npx tsx scripts/download-images-from-db.ts
 * Tempo estimado: ~0,5 s por produto sem foto → 16k ≈ 2–2,5 h.
 */

import * as fs from "fs";
import * as path from "path";

const DB_FILE = path.join(process.cwd(), "data", "produtos_db.json");
const IMAGES_DIR = path.join(process.cwd(), "public", "produtos");
const LOG_FILE = path.join(process.cwd(), "scripts", "download-images-from-db.log");

interface ProductDB {
  codigo: string;
  descricao: string;
  gtin: string;
  preco: number;
  estoque: number;
  createdAt: string;
  updatedAt: string;
  imagem?: string;
  marca?: string;
  badge?: string;
}

interface DownloadStats {
  total: number;
  downloaded: number;
  skipped: number;
  errors: number;
  ignored: number;
  updated: number;
}

function log(message: string): void {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + "\n");
  } catch {
    // ignore
  }
}

function loadDB(): ProductDB[] {
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw) as ProductDB[];
}

function saveDB(products: ProductDB[]): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2), "utf-8");
}

function ensureImagesDir(): void {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
}

function imageFileExists(codigo: string): boolean {
  return fs.existsSync(path.join(IMAGES_DIR, `${codigo}.jpg`));
}

async function fetchImageUrlFromOpenFoodFacts(gtin: string): Promise<string | null> {
  const normalized = gtin.trim().replace(/^0+/, "") || gtin;
  const url = `https://world.openfoodfacts.org/api/v0/product/${normalized}.json`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      headers: { "User-Agent": "Atual Supermercados - Product Image Bot" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status !== 1 || !data.product) return null;
    const p = data.product;
    return (
      p.image_url ||
      p.image_front_url ||
      p.image_front_small_url ||
      (p.images && p.images[`${normalized}_front`]?.sizes?.full?.url) ||
      null
    );
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      log(`Timeout GTIN ${gtin}`);
    } else {
      log(`Erro GTIN ${gtin}: ${e}`);
    }
    return null;
  }
}

async function downloadImage(imageUrl: string, outputPath: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": "Atual Supermercados - Product Image Bot" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return false;
    const buffer = Buffer.from(await response.arrayBuffer());
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng =
      buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    if (!isJpeg && !isPng) return false;
    if (buffer.length < 1024) return false;
    fs.writeFileSync(outputPath, buffer);
    return true;
  } catch {
    return false;
  }
}

const UPDATE_DB = process.env.UPDATE_DB !== "0" && process.env.UPDATE_DB !== "false";

async function main(): Promise<void> {
  log("=== Download de imagens a partir de produtos_db.json (Open Food Facts) ===");
  ensureImagesDir();

  let products: ProductDB[] = loadDB();
  log(`Total de produtos no JSON: ${products.length}`);

  const withGtin = products.filter((p) => p.gtin && String(p.gtin).trim() !== "");
  log(`Produtos com GTIN: ${withGtin.length}`);

  const toProcess = withGtin.filter((p) => {
    if (imageFileExists(p.codigo)) return false;
    if (p.imagem && p.imagem.trim() !== "") return false;
    return true;
  });
  log(`Produtos a processar (sem arquivo local e sem imagem): ${toProcess.length}`);

  const stats: DownloadStats = {
    total: toProcess.length,
    downloaded: 0,
    skipped: 0,
    errors: 0,
    ignored: products.length - withGtin.length,
    updated: 0,
  };

  const codeToIndex = new Map<string, number>();
  products.forEach((p, i) => codeToIndex.set(p.codigo, i));

  for (let i = 0; i < toProcess.length; i++) {
    const p = toProcess[i];
    const imagePath = path.join(IMAGES_DIR, `${p.codigo}.jpg`);

    const imageUrl = await fetchImageUrlFromOpenFoodFacts(p.gtin);
    if (imageUrl) {
      const ok = await downloadImage(imageUrl, imagePath);
      if (ok) {
        stats.downloaded++;
        if (UPDATE_DB) {
          const idx = codeToIndex.get(p.codigo);
          if (idx !== undefined) {
            products[idx] = { ...products[idx], imagem: `/produtos/${p.codigo}.jpg` };
            stats.updated++;
          }
        }
        log(`OK ${p.codigo} - ${p.descricao.slice(0, 50)}`);
      } else {
        stats.errors++;
      }
    } else {
      stats.errors++;
    }

    if (i < toProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
    if ((i + 1) % 100 === 0) {
      log(`Progresso ${i + 1}/${toProcess.length} - baixados: ${stats.downloaded}, erros: ${stats.errors}`);
    }
  }

  if (UPDATE_DB && stats.updated > 0) {
    saveDB(products);
    log(`DB atualizado: ${stats.updated} produtos com campo imagem preenchido.`);
  }

  log("=== Estatísticas ===");
  log(`Processados: ${stats.total}`);
  log(`Baixados: ${stats.downloaded}`);
  log(`Erros/não encontrados: ${stats.errors}`);
  log(`Ignorados (sem GTIN): ${stats.ignored}`);
  log("=== Fim ===");
}

main().catch((e) => {
  log(`ERRO: ${e}`);
  process.exit(1);
});
