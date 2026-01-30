import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TestResult {
  endpoint: string;
  status: number;
  sucesso: boolean;
  erro?: string;
  dados?: any;
}

export async function GET() {
  try {
    const baseUrl = process.env.SISTEMA_API_URL;
    const user = process.env.SISTEMA_API_USER;
    const pass = process.env.SISTEMA_API_PASS;

    if (!baseUrl || !user || !pass) {
      return NextResponse.json(
        {
          status: 500,
          sucesso: false,
          erro: "Variáveis de ambiente do Sysmo não configuradas",
          testes: [],
        },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${user}:${pass}`).toString("base64");
    const baseUrlClean = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    const endpointsParaTestar = [
      `${baseUrlClean}/v1/hub/Produtos`,
      `${baseUrlClean}/v1/hub/produtos`,
      `${baseUrlClean}/hub/Produtos`,
      `${baseUrlClean}/hub/produtos`,
      `${baseUrlClean}/sysmo-integrador-api/v1/hub/Produtos`,
      `${baseUrlClean}/sysmo-integrador-api/v1/hub/produtos`,
      `${baseUrlClean}/sysmo-integrador-api/hub/Produtos`,
      `${baseUrlClean}/sysmo-integrador-api/hub/produtos`,
      `${baseUrlClean}/v1/produtos`,
      `${baseUrlClean}/produtos`,
      `${baseUrlClean}/api/v1/hub/produtos`,
      `${baseUrlClean}/api/hub/produtos`,
    ];

    const resultados: TestResult[] = [];

    for (const endpoint of endpointsParaTestar) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Basic ${credentials}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const status = response.status;
        let dados: any = null;
        let erro: string | undefined = undefined;

        if (response.ok) {
          try {
            dados = await response.json();
          } catch {
            dados = await response.text();
          }
        } else {
          try {
            const errorText = await response.text();
            erro = errorText.substring(0, 200);
          } catch {
            erro = `Erro HTTP ${status}`;
          }
        }

        resultados.push({
          endpoint,
          status,
          sucesso: response.ok,
          erro: erro || undefined,
          dados: response.ok ? (Array.isArray(dados) ? { total: dados.length, amostra: dados.slice(0, 2) } : dados) : undefined,
        });
      } catch (err: any) {
        resultados.push({
          endpoint,
          status: 0,
          sucesso: false,
          erro: err.message || "Erro de conexão",
        });
      }
    }

    const sucesso = resultados.some((r) => r.sucesso);
    const todos404 = resultados.every((r) => r.status === 404 || r.status === 0);

    return NextResponse.json({
      status: sucesso ? 200 : todos404 ? 404 : 500,
      sucesso,
      resumo: {
        totalTestes: resultados.length,
        sucessos: resultados.filter((r) => r.sucesso).length,
        erros404: resultados.filter((r) => r.status === 404).length,
        outrosErros: resultados.filter((r) => !r.sucesso && r.status !== 404).length,
      },
      conclusao: todos404
        ? "Todos os endpoints retornaram 404. HubProdutos não está publicado/habilitado para este cliente."
        : sucesso
        ? "Pelo menos um endpoint funcionou."
        : "Nenhum endpoint funcionou. Verifique autenticação e URL base.",
      resultados,
      recomendacao: todos404
        ? "Solicitar ao suporte do Sysmo: 1) Confirmação se HubProdutos está ativo para Atual Supermercados. 2) Liberação/publicação do HubProdutos. 3) Ou informar qual Hub equivalente usar para produtos."
        : "",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 500,
        sucesso: false,
        erro: err.message || "Erro desconhecido",
        testes: [],
      },
      { status: 500 }
    );
  }
}
