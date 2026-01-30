import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // TODO: Em produção, buscar do banco de dados
    // const user = await db.users.findUnique({ where: { email } });
    // if (!user || !await bcrypt.compare(password, user.password)) {
    //   return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    // }

    // Por enquanto, simulamos login (aceita qualquer email/senha)
    // Em produção, isso deve ser substituído por autenticação real
    const user = {
      id: `user_${Date.now()}`,
      nome: "Cliente Exemplo",
      email: email,
      telefone: "(51) 99999-9999",
      cpf: "000.000.000-00",
      endereco: "Rua Exemplo, 123",
      pontos: 1500,
      totalCompras: 0, // Número de compras realizadas
      notificacoesEmail: true,
      notificacoesSMS: true,
      createdAt: new Date().toISOString(),
    };

    console.log("✅ Login realizado:", email);

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      user,
    });

  } catch (error) {
    console.error("❌ Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 }
    );
  }
}

