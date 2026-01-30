import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, generateAdminToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar credenciais
    if (verifyAdminCredentials(username, password)) {
      const token = generateAdminToken();
      
      return NextResponse.json({
        success: true,
        token,
        message: "Login realizado com sucesso",
      });
    } else {
      return NextResponse.json(
        { error: "Usuário ou senha incorretos" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 }
    );
  }
}
