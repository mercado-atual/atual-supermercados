import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductByCodigo } from "@/lib/products-db";
import { getProductById } from "@/lib/products";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

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

function dbToProduct(p: {
  codigo: string;
  descricao: string;
  preco: number;
  imagem?: string;
  marca?: string;
}): Product {
  const descLower = p.descricao.toLowerCase();
  let productCategory = "ofertas";
  if (/fruta|verdura|legume|banana|tomate|alface|cenoura|batata|cebola/.test(descLower)) {
    productCategory = "hortifruti";
  } else if (/carne|frango|peixe|bovina|porco|linguiça|alcatra|picanha|contrafilé/.test(descLower)) {
    productCategory = "acougue";
  } else if (/pão|bolo|torta|croissant|baguete/.test(descLower)) {
    productCategory = "padaria";
  } else if (/cerveja|refrigerante|suco|água|bebida|coca|guaraná|pepsi/.test(descLower)) {
    productCategory = "bebidas";
  }
  let unit = "un";
  if (/kg|quilo|grama/.test(descLower)) unit = "kg";
  else if (/litro| l |\d+\s*ml/.test(descLower)) unit = "l";
  else if (/pacote|pct|pac/.test(descLower)) unit = "pct";
  let marca = (p as { marca?: string }).marca || extrairMarcaDaDescricao(p.descricao);
  let imagem = (p as { imagem?: string }).imagem || construirCaminhoImagem(p.codigo, marca || "");
  return {
    id: p.codigo,
    title: p.descricao,
    price: p.preco.toFixed(2).replace(".", ","),
    unit,
    image: imagem || undefined,
    category: productCategory,
    description: p.descricao,
    marca: marca || undefined,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const dbProduct = await getProductByCodigo(id);
    if (dbProduct) {
      return NextResponse.json({
        success: true,
        product: dbToProduct(dbProduct),
      });
    }

    const staticProduct = getProductById(id);
    if (staticProduct) {
      return NextResponse.json({
        success: true,
        product: staticProduct,
      });
    }

    return NextResponse.json(
      { success: false, error: "Produto não encontrado" },
      { status: 404 }
    );
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}
