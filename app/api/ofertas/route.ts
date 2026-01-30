import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products-db";
import {
  classificarBlocoOferta,
  getBlocoLabel,
  ORDEM_BLOCOS,
  type BlocoOferta,
  type ProdutoVitrine,
} from "@/lib/categorias-ofertas";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache por 60 segundos

const MARCAS_CONHECIDAS = [
  "TIO JOAO", "TIO JOÃO", "CAMIL", "PRATO FINO", "KITANDA", "BROTO LEGAL",
  "TREMBOM", "DONA BENTA", "BOM ARROZ", "ARROZ DO CAMPO",
  "TIO URBANO", "TIO PEDRO", "TIO JORGE", "TIO PAULO", "TIO CARLOS",
  "JASMINE", "NATURALLIFE", "RAMPINELLI", "BLUE VILLE", "KARUI", "MANINHO",
  "NEILAR", "FIT FOOD", "DIA MAES", "DIA DOS PAIS", "OMO", "YPE", "VEJA",
];

function extrairMarcaDaDescricao(descricao: string): string | undefined {
  if (!descricao) return undefined;
  const descUpper = descricao.toUpperCase().trim();
  for (const marca of MARCAS_CONHECIDAS) {
    const regex = new RegExp(`\\b${marca.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (regex.test(descUpper)) return marca;
  }
  return undefined;
}

function construirCaminhoImagem(codigo: string, marca: string): string {
  if (!codigo) return "";
  const normalizar = (t: string) =>
    t
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");
  const codigoLimpo = codigo.trim();
  if (marca) return `/produtos/${codigoLimpo}_${normalizar(marca)}.jpg`;
  return `/produtos/${codigoLimpo}.jpg`;
}

// Cache de processamento para evitar recalcular tudo
let cachedResult: { blocos: any[]; lastSync: string | null; total: number } | null = null;
let cacheTime = 0;
const CACHE_TTL = 30000; // 30 segundos

export async function GET() {
  try {
    // Verificar cache
    const now = Date.now();
    if (cachedResult && (now - cacheTime) < CACHE_TTL) {
      return NextResponse.json(cachedResult);
    }

    // Buscar promoções ativas para filtrar apenas produtos em promoção
    let codigosEmPromocao = new Set<string>();
    try {
      const promocoesPath = path.join(process.cwd(), "public", "promocoes.json");
      const promocoesContent = await fs.readFile(promocoesPath, "utf-8");
      const promocoesData = JSON.parse(promocoesContent);
      const today = new Date().toISOString().split("T")[0];
      
      if (Array.isArray(promocoesData.promocoes)) {
        promocoesData.promocoes.forEach((p: any) => {
          const inicio = p.data_inicio?.split(" ")[0];
          const fim = p.data_fim?.split(" ")[0];
          if (inicio && fim && today >= inicio && today <= fim && p.codigo) {
            codigosEmPromocao.add(p.codigo);
          }
        });
      }
    } catch {
      // Se não conseguir ler promoções, mostra todos (fallback)
    }

    const dbProducts = await getProducts();
    
    // FILTRAR: mostrar apenas produtos que estão em promoção
    const produtosEmPromocao = codigosEmPromocao.size > 0
      ? dbProducts.filter((p) => codigosEmPromocao.has(p.codigo))
      : dbProducts; // Se não tiver promoções, mostra todos (fallback)

    // Otimizar: processar em lote e usar regex pré-compiladas
    const descLower = (s: string) => s.toLowerCase();
    const testKg = /kg|quilo|grama/i;
    const testLitro = /litro| l |\d+\s*ml/i;
    const testPct = /pct|pacote|pac/i;

    const produtos: ProdutoVitrine[] = produtosEmPromocao.map((p) => {
      const marca = (p as { marca?: string }).marca || extrairMarcaDaDescricao(p.descricao);
      const imagem =
        (p as { imagem?: string }).imagem ||
        construirCaminhoImagem(p.codigo, marca || "");
      
      let unit = "un";
      const desc = p.descricao;
      if (testKg.test(desc)) unit = "kg";
      else if (testLitro.test(desc)) unit = "l";
      else if (testPct.test(desc)) unit = "pct";

      return {
        id: p.codigo,
        title: p.descricao,
        price: p.preco.toFixed(2).replace(".", ","),
        unit,
        image: imagem || undefined,
        category: "ofertas",
        description: p.descricao,
        marca: marca || undefined,
        badge: "Oferta",
        bloco: classificarBlocoOferta(p.descricao),
      };
    });

    const blocos: Record<BlocoOferta, ProdutoVitrine[]> = {
      cesta_basica: [],
      alimentos: [],
      bebidas: [],
      limpeza: [],
      higiene: [],
      outros: [],
    };

    produtos.forEach((p) => {
      if (blocos[p.bloco]) blocos[p.bloco].push(p);
    });

    let lastSync: string | null = null;
    try {
      const lastSyncPath = path.join(process.cwd(), "data", "last_sync_sysmo.json");
      const raw = await fs.readFile(lastSyncPath, "utf-8");
      const data = JSON.parse(raw);
      lastSync = data.lastSync || null;
    } catch {
      // ignore
    }

    const result = {
      blocos: ORDEM_BLOCOS.map((key) => ({
        id: key,
        label: getBlocoLabel(key),
        produtos: blocos[key] || [],
      })),
      lastSync,
      total: produtos.length,
    };

    // Atualizar cache
    cachedResult = result;
    cacheTime = now;

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erro ao buscar ofertas:", error);
    return NextResponse.json(
      { blocos: [], lastSync: null, total: 0, error: String(error) },
      { status: 500 }
    );
  }
}
