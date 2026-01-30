import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const baseUrl = process.env.SISTEMA_API_URL;
    const user = process.env.SISTEMA_API_USER;
    const pass = process.env.SISTEMA_API_PASS;

    if (!baseUrl || !user || !pass) {
      return NextResponse.json(
        { sucesso: false, erro: "Variáveis de ambiente do Sysmo não configuradas" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${user}:${pass}`).toString("base64");

    const url = baseUrl.endsWith("/")
      ? `${baseUrl}hubprodutos.listar_produtos`
      : `${baseUrl}/hubprodutos.listar_produtos`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        pagina: "1",
        tamanho_pagina: "10",
        partner_key: ""
      })
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      return NextResponse.json(
        {
          sucesso: false,
          status: response.status,
          erro: erroTexto
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      sucesso: true,
      total: data?.dados?.length ?? 0,
      amostra: (data?.dados ?? []).slice(0, 3)
    });

  } catch (err: any) {
    return NextResponse.json(
      { sucesso: false, erro: err.message },
      { status: 500 }
    );
  }
}
