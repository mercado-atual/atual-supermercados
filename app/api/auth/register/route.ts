import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface RegisterRequest {
  cpf: string; // CPF OBRIGATÓRIO
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  password: string;
  notificacoesEmail?: boolean;
  notificacoesSMS?: boolean;
}

// Função de validação real de CPF
function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "");
  
  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(10, 11))) return false;
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const data: RegisterRequest = await request.json();

    // Validação básica - CPF é OBRIGATÓRIO
    if (!data.cpf || !data.nome || !data.email || !data.telefone || !data.endereco || !data.password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios, incluindo CPF" },
        { status: 400 }
      );
    }

    // Sanitizar CPF para somente números
    const cpfNumbers = data.cpf.replace(/\D/g, "");
    
    if (cpfNumbers.length !== 11) {
      return NextResponse.json(
        { error: "CPF deve ter 11 dígitos" },
        { status: 400 }
      );
    }

    // Validar CPF (usar números sanitizados)
    if (!validateCPF(cpfNumbers)) {
      return NextResponse.json(
        { error: "CPF inválido. Verifique os dígitos." },
        { status: 400 }
      );
    }

    // TODO: Em produção, verificar se CPF já existe no banco (UNIQUE constraint)
    // Simulação: verificar se CPF já está cadastrado (em memória)
    // Em produção: const existingUser = await db.users.findUnique({ where: { cpf: cpfNumbers } });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: "CPF já cadastrado" },
    //     { status: 409 }
    //   );
    // }

    // TODO: Em produção, salvar no banco de dados
    // Por enquanto, simulamos o cadastro
    const user = {
      id: `user_${Date.now()}`,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      cpf: cpfNumbers, // CPF salvo APENAS com números (sem pontuação)
      endereco: data.endereco,
      pontos: 0, // Novo cliente começa com 0 pontos
      totalCompras: 0, // Novo cliente começa com 0 compras
      notificacoesEmail: data.notificacoesEmail ?? true,
      notificacoesSMS: data.notificacoesSMS ?? true,
      createdAt: new Date().toISOString(),
    };

    // TODO: Hash da senha antes de salvar
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // await db.users.create({ ...user, password: hashedPassword });

    console.log("✅ Novo cliente cadastrado:", user.email);

    return NextResponse.json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      user,
    });

  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Erro ao realizar cadastro" },
      { status: 500 }
    );
  }
}

