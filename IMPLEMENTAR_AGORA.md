# 🚀 Guia Rápido: Implementar Banco de Dados e Auth

## ⚡ Passo a Passo Rápido

### 1️⃣ Instalar Dependências

```bash
cd c:\projeto_atual
npm install @prisma/client prisma bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken ts-node
```

### 2️⃣ Escolher Banco de Dados

**Opção Mais Fácil: Supabase (GRATUITO)**
1. Acesse: https://supabase.com
2. Crie conta gratuita
3. Crie novo projeto
4. Vá em Settings > Database
5. Copie a "Connection string"

**Ou use PostgreSQL local:**
- Instale PostgreSQL
- Crie banco: `createdb atual_supermercados`

### 3️⃣ Configurar .env.local

Crie arquivo `.env.local` na raiz:

```env
# Database (cole a connection string do Supabase)
DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:5432/postgres"

# JWT Secrets (gere strings aleatórias)
JWT_SECRET="sua_chave_secreta_aqui_minimo_32_caracteres_12345678901234567890"
JWT_REFRESH_SECRET="outra_chave_secreta_aqui_minimo_32_caracteres_09876543210987654321"
ADMIN_SECRET="admin_secret_para_api_requests_12345"

# App URL
NEXT_PUBLIC_APP_URL="https://projeto-atual-psi.vercel.app"
```

### 4️⃣ Inicializar Prisma

```bash
npx prisma init
```

### 5️⃣ Copiar Schema

Copie o conteúdo do arquivo `docs/IMPLEMENTACAO_BANCO_AUTH.md` seção "Schema do Banco de Dados" para `prisma/schema.prisma`

### 6️⃣ Executar Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 7️⃣ Criar Seed

Copie o código do seed de `docs/IMPLEMENTACAO_BANCO_AUTH.md` para `prisma/seed.ts`

### 8️⃣ Executar Seed

```bash
npx prisma db seed
```

### 9️⃣ Atualizar Código

Siga as instruções em `docs/IMPLEMENTACAO_BANCO_AUTH.md` para atualizar:
- `lib/db.ts`
- `lib/auth.ts`
- `lib/middleware.ts`
- `lib/orders.ts`
- APIs de admin
- APIs de autenticação

### 🔟 Testar

```bash
npm run dev
```

Acesse: http://localhost:3000/admin/login

---

## ✅ Pronto!

Agora você tem:
- ✅ Banco de dados persistente
- ✅ Autenticação segura com JWT
- ✅ Senhas com hash bcrypt
- ✅ Sistema completo e seguro

---

## 🆘 Precisa de Ajuda?

Veja o arquivo completo: `docs/IMPLEMENTACAO_BANCO_AUTH.md`



