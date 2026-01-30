import { NextResponse } from "next/server";
import { fetchSistemaProdutos } from "@/lib/sistema";
import { getProducts, saveProducts, normalizeGtin } from "@/lib/products-db";
import type { Produto } from "@/types/Produto";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LAST_SYNC_FILE = path.join(process.cwd(), "data", "last_sync_sysmo.json");

// Sysmo: codigo = Código Reduzido (ou id/sku/codigo_barras); gtin = Código de Barras / EAN (mapeado em sistema.ts: gtin ?? codigo_barras ?? ean)
function produtoToProductDB(p: Produto) {
  const now = new Date().toISOString();
  const gtin = normalizeGtin(p.gtin || "") || (p.gtin || "").trim();
  return {
    codigo: p.codigo,
    descricao: p.descricao,
    gtin,
    preco: p.preco,
    estoque: p.estoque,
    imagem: p.imagem || "",
    marca: p.marca || "",
    createdAt: now,
    updatedAt: now,
  };
}

export async function GET() {
  try {
    const produtos = await fetchSistemaProdutos();
    if (produtos.length === 0) {
      const existing = await getProducts();
      return NextResponse.json({
        ok: true,
        message: "Nenhum produto retornado do Sysmo; mantidos dados locais.",
        total: existing.length,
        synced: 0,
        lastSync: new Date().toISOString(),
      });
    }

    const existing = await getProducts();
    const byCode = new Map(existing.map((p) => [p.codigo, p]));

    const toSave = produtos.map((p: Produto) => {
      const prev = byCode.get(p.codigo);
      const row = produtoToProductDB(p);
      if (prev) {
        row.createdAt = prev.createdAt;
        row.updatedAt = new Date().toISOString();
      }
      return row;
    });

    await saveProducts(toSave);

    await fs.mkdir(path.dirname(LAST_SYNC_FILE), { recursive: true });
    await fs.writeFile(
      LAST_SYNC_FILE,
      JSON.stringify({
        lastSync: new Date().toISOString(),
        totalProducts: toSave.length,
      }),
      "utf-8"
    );

    return NextResponse.json({
      ok: true,
      message: "Sincronização Sysmo concluída.",
      total: toSave.length,
      synced: toSave.length,
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao sincronizar Sysmo:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET();
}
