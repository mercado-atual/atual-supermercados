import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products-db";
import { Product } from "@/lib/products";

export const dynamic = 'force-dynamic';

// GET: Listar produtos para o site público
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    // Buscar produtos do banco de dados
    const dbProducts = await getProducts();

    // Converter para formato do site
    let products: Product[] = dbProducts.map((p, index) => {
      // Mapear categoria baseado na descrição (lógica simples)
      let category = "ofertas";
      const descLower = p.descricao.toLowerCase();
      
      if (descLower.includes("fruta") || descLower.includes("verdura") || descLower.includes("legume") || 
          descLower.includes("banana") || descLower.includes("tomate") || descLower.includes("alface")) {
        category = "hortifruti";
      } else if (descLower.includes("carne") || descLower.includes("frango") || descLower.includes("peixe") ||
                 descLower.includes("bovina") || descLower.includes("porco") || descLower.includes("linguiça")) {
        category = "acougue";
      } else if (descLower.includes("pão") || descLower.includes("bolo") || descLower.includes("torta")) {
        category = "padaria";
      } else if (descLower.includes("cerveja") || descLower.includes("refrigerante") || descLower.includes("suco") ||
                 descLower.includes("água") || descLower.includes("bebida")) {
        category = "bebidas";
      }

      // Determinar unidade baseado na descrição
      let unit = "un";
      if (descLower.includes("kg") || descLower.includes("quilo")) {
        unit = "kg";
      } else if (descLower.includes("litro") || descLower.includes("l")) {
        unit = "l";
      } else if (descLower.includes("pacote") || descLower.includes("pct")) {
        unit = "pct";
      }

      // Formatar preço para exibição brasileira
      const priceFormatted = p.preco.toFixed(2).replace('.', ',');

      return {
        id: p.codigo,
        title: p.descricao,
        price: priceFormatted,
        unit: unit,
        image: p.gtin ? `/produtos/${p.gtin}.jpg` : '',
        category: category,
        description: p.descricao,
      };
    });

    // Filtrar por categoria
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    // Buscar por termo
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Limitar resultados
    if (limit) {
      const limitNum = parseInt(limit, 10);
      products = products.slice(0, limitNum);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
