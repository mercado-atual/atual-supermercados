import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Promocao } from "@/types/Promocao";

export const dynamic = "force-dynamic";

interface PromocaoRaw {
  codigo: string;
  nome: string;
  preco_normal: number;
  preco_promocional: number;
  desconto_percentual?: number;
  data_inicio: string;
  data_fim: string;
  codigo_promocao: string;
  descricao_promocao?: string;
  categoria?: string;
  subcategoria?: string;
}

interface PromocoesFile {
  atualizado_em?: string;
  total_promocoes?: number;
  promocoes: PromocaoRaw[];
}

function extractDate(dateTimeString: string): string {
  return dateTimeString.split(" ")[0];
}

function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

function calculateDiscountPercent(normal: number, promocional: number): number {
  if (normal <= 0) return 0;
  return Math.round(((normal - promocional) / normal) * 100 * 100) / 100;
}

function normalizePromocao(raw: PromocaoRaw, today: string): Promocao | null {
  if (!raw.codigo || !raw.nome || !raw.codigo_promocao) {
    return null;
  }

  const inicio = extractDate(raw.data_inicio);
  const fim = extractDate(raw.data_fim);

  if (!inicio || !fim) {
    return null;
  }

  const normal = Number(raw.preco_normal);
  const promocional = Number(raw.preco_promocional);

  if (isNaN(normal) || isNaN(promocional) || normal < 0 || promocional < 0) {
    return null;
  }

  const ativa = isDateInRange(today, inicio, fim);

  return {
    id: raw.codigo_promocao,
    produto: {
      codigo: raw.codigo,
      descricao: raw.nome,
    },
    preco: {
      normal,
      promocional,
      descontoPercentual: calculateDiscountPercent(normal, promocional),
    },
    tipo: "desconto_simples",
    vigencia: {
      inicio,
      fim,
      ativa,
    },
    selo: raw.descricao_promocao?.trim() || undefined,
    origem: "arquivo",
  };
}

function convertPromocaoToLegacyFormat(promocao: Promocao): PromocaoRaw {
  return {
    codigo: promocao.produto.codigo,
    nome: promocao.produto.descricao,
    preco_normal: promocao.preco.normal,
    preco_promocional: promocao.preco.promocional,
    desconto_percentual: promocao.preco.descontoPercentual,
    data_inicio: `${promocao.vigencia.inicio} 00:00:00`,
    data_fim: `${promocao.vigencia.fim} 23:59:59`,
    codigo_promocao: promocao.id,
    descricao_promocao: promocao.selo || "",
    categoria: "",
    subcategoria: "",
  };
}

export async function GET(request: NextRequest) {
  try {
    const promocoesPath = path.join(process.cwd(), "public", "promocoes.json");
    const fileContent = await fs.readFile(promocoesPath, "utf-8");
    const data: PromocoesFile = JSON.parse(fileContent);

    if (!Array.isArray(data.promocoes)) {
      return NextResponse.json(
        { error: "Erro ao carregar promoções", promocoes: [], total_promocoes: 0 },
        { status: 200 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const promocoes: Promocao[] = data.promocoes
      .map((raw) => normalizePromocao(raw, today))
      .filter((p): p is Promocao => p !== null && p.vigencia.ativa);

    if (promocoes.length > 0) {
      const promocoesLegacy = promocoes.map(convertPromocaoToLegacyFormat);
      return NextResponse.json({
        atualizado_em: data.atualizado_em || new Date().toISOString(),
        total_promocoes: promocoesLegacy.length,
        promocoes: promocoesLegacy,
      });
    }

    const promocoesJSON = JSON.parse(fileContent);
    return NextResponse.json(promocoesJSON);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar promoções", promocoes: [], total_promocoes: 0 },
      { status: 200 }
    );
  }
}
