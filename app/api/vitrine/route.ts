import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { fetchSistemaProdutos, mapProdutosFromFile } from "@/lib/sistema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sistemaProdutos = await fetchSistemaProdutos();
    if (sistemaProdutos.length > 0) {
      return NextResponse.json(sistemaProdutos, {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    const produtosPath = path.join(process.cwd(), "data", "produtos.json");
    const produtosData = await fs.readFile(produtosPath, "utf-8");
    const produtosJSON = JSON.parse(produtosData);
    const produtosNormalizados = mapProdutosFromFile(produtosJSON);
    return NextResponse.json(produtosNormalizados, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("❌ Erro ao carregar vitrine:", error);
    return NextResponse.json(
      { error: "Erro ao carregar produtos da vitrine" },
      { status: 500 }
    );
  }
}
