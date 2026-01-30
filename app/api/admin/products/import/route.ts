import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { importProductsFromCSV, clearProducts } from "@/lib/products-db";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || null;

    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clearBeforeImport = formData.get('clear') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo CSV é obrigatório" },
        { status: 400 }
      );
    }

    // Ler conteúdo do arquivo
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "Arquivo CSV deve ter pelo menos uma linha de cabeçalho e uma linha de dados" },
        { status: 400 }
      );
    }

    // Verificar cabeçalho
    const header = lines[0].toLowerCase();
    const requiredColumns = ['codigo', 'descricao', 'gtin', 'preco', 'estoque'];
    const hasAllColumns = requiredColumns.every(col => header.includes(col));

    if (!hasAllColumns) {
      return NextResponse.json(
        { 
          error: "Cabeçalho CSV inválido. Colunas esperadas: codigo,descricao,gtin,preco,estoque",
          received: lines[0]
        },
        { status: 400 }
      );
    }

    // Função para parsear linha CSV corretamente
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    // Parsear CSV
    const csvData: Array<{
      codigo: string;
      descricao: string;
      gtin: string;
      preco: string;
      estoque: string;
    }> = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parsear linha CSV
      const values = parseCSVLine(line);
      
      if (values.length >= 5) {
        // Remover aspas dos valores
        const cleanValue = (val: string) => val.replace(/^"|"$/g, '').trim();
        
        csvData.push({
          codigo: cleanValue(values[0] || ''),
          descricao: cleanValue(values[1] || ''),
          gtin: cleanValue(values[2] || ''),
          preco: cleanValue(values[3] || '0'),
          estoque: cleanValue(values[4] || '0'),
        });
      }
    }

    if (csvData.length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto encontrado no CSV" },
        { status: 400 }
      );
    }

    // Limpar produtos se solicitado
    if (clearBeforeImport) {
      await clearProducts();
    }

    // Importar produtos
    const result = await importProductsFromCSV(csvData);

    return NextResponse.json({
      success: true,
      message: "Importação concluída",
      summary: {
        totalProcessed: csvData.length,
        imported: result.imported,
        updated: result.updated,
        errors: result.errors.length,
        errorDetails: result.errors.slice(0, 10), // Limitar a 10 erros
      },
    });

  } catch (error: any) {
    console.error("Erro na importação:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar importação" },
      { status: 500 }
    );
  }
}
