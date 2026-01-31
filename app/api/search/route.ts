import { NextRequest, NextResponse } from "next/server";
import { searchProductsByDescricao } from "@/lib/products-db";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 30;

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        count: 0,
        products: [],
        message: "Digite um termo para buscar",
      });
    }

    const { products: dbProducts } = await searchProductsByDescricao(q.trim(), Math.min(limit, 100));

    const testKg = /kg|quilo|grama/i;
    const testLitro = /litro| l |\d+\s*ml/i;
    const testPct = /pct|pacote|pac/i;

    const produtos: Product[] = dbProducts.map((p) => {
        const marca = (p as { marca?: string }).marca || extrairMarcaDaDescricao(p.descricao);
        const imagem =
          (p as { imagem?: string }).imagem ||
          construirCaminhoImagem(p.codigo, marca || "");

        let unit = "un";
        const desc = p.descricao;
        if (testKg.test(desc)) unit = "kg";
        else if (testLitro.test(desc)) unit = "l";
        else if (testPct.test(desc)) unit = "pct";

        const descLower = p.descricao.toLowerCase();
        let category = "ofertas";
        if (/fruta|verdura|legume|banana|tomate|alface|cenoura|batata|cebola/.test(descLower)) {
          category = "hortifruti";
        } else if (/carne|frango|peixe|bovina|porco|linguiça|alcatra|picanha|contrafilé/.test(descLower)) {
          category = "acougue";
        } else if (/pão|bolo|torta|croissant|baguete/.test(descLower)) {
          category = "padaria";
        } else if (/cerveja|refrigerante|suco|água|bebida|coca|guaraná|pepsi/.test(descLower)) {
          category = "bebidas";
        }

        return {
          id: p.codigo,
          title: p.descricao,
          price: p.preco.toFixed(2).replace(".", ","),
          unit,
          image: imagem || undefined,
          category,
          description: p.descricao,
          marca: marca || undefined,
        };
      });

    return NextResponse.json({
      success: true,
      count: produtos.length,
      products: produtos,
      query: q,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    return NextResponse.json(
      {
        success: false,
        count: 0,
        products: [],
        error: String(error),
      },
      { status: 500 }
    );
  }
}
