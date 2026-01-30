import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface UpdateRequest {
  userId: string;
  telefone?: string;
  endereco?: string;
  cpf?: string;
  totalCompras?: number;
  [key: string]: any;
}

export async function PUT(request: NextRequest) {
  try {
    const data: UpdateRequest = await request.json();
    const { userId, totalCompras, cpf, ...updateData } = data;

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // TODO: Em produção, buscar do banco de dados
    // const currentUser = await db.users.findUnique({ where: { id: userId } });
    // if (!currentUser) {
    //   return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    // }

      // VALIDAÇÃO CRÍTICA: CPF não pode ser alterado após a primeira compra
      // Regra oficial do Clube de Fidelidade:
      // - CPF pode ser alterado SOMENTE se totalCompras === 0
      // - Após a primeira compra (totalCompras > 0), o CPF NÃO pode mais ser alterado
      
      // Se CPF está sendo enviado e é obrigatório
      if (cpf !== undefined && cpf.trim() !== "") {
        // Validar formato de CPF
        const cpfNumbers = cpf.replace(/\D/g, "");
        if (cpfNumbers.length !== 11) {
          return NextResponse.json(
            { error: "CPF deve ter 11 dígitos" },
            { status: 400 }
          );
        }
        
        // Validar CPF (algoritmo de validação)
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) {
          sum += parseInt(cpfNumbers.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpfNumbers.substring(9, 10))) {
          return NextResponse.json(
            { error: "CPF inválido. Verifique os dígitos." },
            { status: 400 }
          );
        }
        sum = 0;
        for (let i = 1; i <= 10; i++) {
          sum += parseInt(cpfNumbers.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpfNumbers.substring(10, 11))) {
          return NextResponse.json(
            { error: "CPF inválido. Verifique os dígitos." },
            { status: 400 }
          );
        }
      }
      
      // Se o usuário tentar atualizar o CPF e já tiver realizado compras, bloquear
      if (cpf !== undefined && cpf.trim() !== "" && totalCompras !== undefined && totalCompras > 0) {
      // Em produção, buscar o CPF atual do banco para comparar:
      // const currentUser = await db.users.findUnique({ where: { id: userId } });
      // const currentCPF = currentUser?.cpf || "";
      // 
      // Se o CPF enviado for diferente do CPF atual, bloquear:
      // if (cpf !== currentCPF) {
      //   return NextResponse.json(
      //     { error: "CPF não pode ser alterado após a primeira compra." },
      //     { status: 403 }
      //   );
      // }
      
      // Por enquanto, em modo simulado:
      // Se totalCompras > 0 e cpf foi enviado, bloquear qualquer tentativa de atualização
      // Isso garante que o CPF não seja alterado após a primeira compra
      return NextResponse.json(
        { error: "CPF não pode ser alterado após a primeira compra." },
        { status: 403 }
      );
    }

    // Permitir atualização de telefone e endereço normalmente, independente do número de compras
    // O updateData já contém telefone e endereco (se enviados), sem o cpf

    // TODO: Em produção, atualizar no banco de dados
    // const updatedUser = await db.users.update({
    //   where: { id: userId },
    //   data: {
    //     telefone: updateData.telefone,
    //     endereco: updateData.endereco,
    //     // CPF não é atualizado se totalCompras > 0 (já validado acima)
    //     ...(totalCompras === 0 && cpf !== undefined ? { cpf } : {}),
    //   }
    // });

    // Por enquanto, retornamos os dados atualizados
    // Se totalCompras === 0, permitimos atualizar CPF
    // Se totalCompras > 0, não incluímos CPF na atualização
    const updatedUser = {
      ...updateData,
      ...(totalCompras === 0 && cpf !== undefined ? { cpf } : {}),
      id: userId,
    };

    console.log("✅ Usuário atualizado:", userId);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar dados" },
      { status: 500 }
    );
  }
}

