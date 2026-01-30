import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Produtos mockados simples
    const items = [
      {
        id: "1",
        nome: "Arroz",
        categoria: "ofertas",
        preco: 24.90,
        imagem: "",
        ativo: true,
      },
      {
        id: "2",
        nome: "Feijão",
        categoria: "ofertas",
        preco: 8.90,
        imagem: "",
        ativo: true,
      },
      {
        id: "3",
        nome: "Leite",
        categoria: "ofertas",
        preco: 5.49,
        imagem: "",
        ativo: true,
      },
      {
        id: "4",
        nome: "Refrigerante",
        categoria: "bebidas",
        preco: 8.99,
        imagem: "",
        ativo: true,
      },
    ];

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

