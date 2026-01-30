# 🗄️ Implementação de Banco de Dados e Autenticação Segura

## 📋 O Que Precisamos Implementar

### 1. Banco de Dados
- Substituir armazenamento em memória por banco real
- Persistir pedidos, usuários e produtos

### 2. Autenticação Segura
- JWT tokens para admin e clientes
- Hash de senhas (bcrypt)
- Rate limiting
- Refresh tokens

---

## 🗄️ PARTE 1: BANCO DE DADOS

### Opções Recomendadas

#### **Opção 1: PostgreSQL + Prisma (RECOMENDADO)**
✅ Mais robusto e escalável  
✅ Relacionamentos complexos  
✅ Migrations automáticas  
✅ Type-safe

#### **Opção 2: MongoDB + Mongoose**
✅ Mais flexível  
✅ Schema dinâmico  
✅ Boa para documentos JSON

#### **Opção 3: Supabase (PostgreSQL gerenciado)**
✅ Gratuito até certo limite  
✅ Já inclui autenticação  
✅ Fácil de usar

### Vamos com PostgreSQL + Prisma (Melhor opção)

---

## 📦 Instalação e Configuração

### Passo 1: Instalar Dependências

```bash
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### Passo 2: Inicializar Prisma

```bash
npx prisma init
```

Isso cria:
- `prisma/schema.prisma` - Schema do banco
- `.env` - Variáveis de ambiente

### Passo 3: Configurar `.env`

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/atual_supermercados?schema=public"

# JWT Secrets
JWT_SECRET="seu_secret_super_seguro_aqui_minimo_32_caracteres"
JWT_REFRESH_SECRET="seu_refresh_secret_super_seguro_aqui_minimo_32_caracteres"
ADMIN_SECRET="admin_secret_para_api_requests"

# App
NEXT_PUBLIC_APP_URL="https://projeto-atual-psi.vercel.app"
```

---

## 📐 Schema do Banco de Dados

### Arquivo: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Usuários (Clientes)
model User {
  id                    String   @id @default(cuid())
  email                 String   @unique
  nome                  String
  telefone              String?
  senhaHash             String   @map("senha_hash")
  pontos                Int      @default(0)
  notificacaoEmail      Boolean  @default(true) @map("notificacao_email")
  notificacaoSMS        Boolean  @default(false) @map("notificacao_sms")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")
  
  orders                Order[]
  
  @@map("users")
}

// Produtos
model Product {
  id          String   @id
  title       String
  price       String
  unit        String
  image       String
  badge       String?
  description String?
  category    String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  orderItems  OrderItem[]
  
  @@map("products")
}

// Pedidos
model Order {
  id            String   @id @default(cuid())
  trackingCode  String   @unique @map("tracking_code")
  status        OrderStatus @default(RECEBIDO)
  paymentMethod String   @map("payment_method")
  total         Float
  customerName  String?  @map("customer_name")
  customerPhone String?  @map("customer_phone")
  customerEmail String?  @map("customer_email")
  notes         String?
  userId        String?  @map("user_id")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  user          User?    @relation(fields: [userId], references: [id])
  address       OrderAddress?
  items         OrderItem[]
  
  @@map("orders")
}

// Endereço do Pedido
model OrderAddress {
  id          String   @id @default(cuid())
  orderId     String   @unique @map("order_id")
  cep         String?
  rua         String
  numero      String
  complemento String?
  bairro      String
  cidade      String
  estado      String
  createdAt   DateTime @default(now()) @map("created_at")
  
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@map("order_addresses")
}

// Itens do Pedido
model OrderItem {
  id        String   @id @default(cuid())
  orderId   String   @map("order_id")
  productId String   @map("product_id")
  title     String
  quantity  Int
  price     Float
  createdAt DateTime @default(now()) @map("created_at")
  
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}

// Status do Pedido
enum OrderStatus {
  RECEBIDO
  ACEITO
  EM_SEPARACAO
  SAIU_ENTREGA
  ENTREGUE
  CANCELADO
}

// Administradores
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  senhaHash String   @map("senha_hash")
  nome      String
  email     String   @unique
  role      String   @default("admin")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("admins")
}
```

### Passo 4: Criar Migrations

```bash
npx prisma migrate dev --name init
```

### Passo 5: Gerar Prisma Client

```bash
npx prisma generate
```

---

## 🔐 PARTE 2: AUTENTICAÇÃO SEGURA

### Criar Utilitários de Autenticação

### Arquivo: `lib/auth.ts`

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
const JWT_EXPIRES_IN = '24h';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verificar senha
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Gerar JWT Token
export function generateToken(payload: {
  userId: string;
  email: string;
  role?: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Gerar Refresh Token
export function generateRefreshToken(payload: {
  userId: string;
  email: string;
}): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

// Verificar Token
export function verifyToken(token: string): {
  userId: string;
  email: string;
  role?: string;
} | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

// Verificar Refresh Token
export function verifyRefreshToken(token: string): {
  userId: string;
  email: string;
} | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as any;
  } catch (error) {
    return null;
  }
}
```

### Arquivo: `lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Middleware de Autenticação

### Arquivo: `lib/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function requireAuth(request: NextRequest): {
  userId: string;
  email: string;
  role?: string;
} | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  return payload;
}

export function requireAdmin(request: NextRequest): {
  userId: string;
  email: string;
  role?: string;
} | null {
  const payload = requireAuth(request);
  
  if (!payload || payload.role !== 'admin') {
    return null;
  }

  return payload;
}
```

---

## 🔄 ATUALIZAR CÓDIGO EXISTENTE

### 1. Atualizar `lib/orders.ts`

```typescript
import { prisma } from './db';
import { OrderStatus } from '@prisma/client';

export async function getAllOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: {
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getOrderByTrackingCode(trackingCode: string) {
  return prisma.order.findUnique({
    where: { trackingCode },
    include: {
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createOrder(orderData: {
  trackingCode: string;
  status: OrderStatus;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  address: {
    cep?: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  paymentMethod: string;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  userId?: string;
}) {
  return prisma.order.create({
    data: {
      trackingCode: orderData.trackingCode,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      total: orderData.total,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      userId: orderData.userId,
      address: {
        create: orderData.address,
      },
      items: {
        create: orderData.items,
      },
    },
    include: {
      address: true,
      items: true,
    },
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  notes?: string
) {
  return prisma.order.update({
    where: { id },
    data: {
      status,
      notes,
      updatedAt: new Date(),
    },
    include: {
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}
```

### 2. Atualizar API de Login Admin

### Arquivo: `app/api/admin/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.senhaHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: admin.id,
      email: admin.email,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nome: admin.nome,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Erro no login admin:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
```

### 3. Atualizar API de Pedidos Admin

### Arquivo: `app/api/admin/orders/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/orders';
import { requireAdmin } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const orders = await getAllOrders(
      status ? (status.toUpperCase() as any) : undefined
    );

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}
```

---

## 📝 SCRIPT DE SEED (Dados Iniciais)

### Arquivo: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';
import { products } from '../lib/products';

const prisma = new PrismaClient();

async function main() {
  // Criar admin padrão
  const adminPassword = await hashPassword('admin123');
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      senhaHash: adminPassword,
      nome: 'Administrador',
      email: 'admin@atual.com.br',
      role: 'admin',
    },
  });

  // Sincronizar produtos
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        price: product.price,
        unit: product.unit,
        image: product.image,
        badge: product.badge,
        description: product.description,
        category: product.category,
      },
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        unit: product.unit,
        image: product.image,
        badge: product.badge,
        description: product.description,
        category: product.category,
      },
    });
  }

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Adicionar ao `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### Executar seed:

```bash
npx prisma db seed
```

---

## 🚀 PRÓXIMOS PASSOS

### 1. Configurar Banco de Dados

**Opção A: PostgreSQL Local**
```bash
# Instalar PostgreSQL
# Criar banco: createdb atual_supermercados
```

**Opção B: Supabase (Recomendado para começar)**
1. Criar conta em https://supabase.com
2. Criar novo projeto
3. Copiar connection string
4. Colocar no `.env`

**Opção C: Railway/Render (Deploy fácil)**
1. Criar conta
2. Criar PostgreSQL
3. Copiar connection string

### 2. Atualizar Variáveis de Ambiente

Criar `.env.local`:
```env
DATABASE_URL="sua_connection_string_aqui"
JWT_SECRET="gere_um_secret_aleatorio_com_32_caracteres_minimo"
JWT_REFRESH_SECRET="gere_outro_secret_aleatorio_com_32_caracteres_minimo"
ADMIN_SECRET="admin_secret_para_api_requests"
```

### 3. Executar Migrations

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Testar

```bash
npm run dev
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Instalar dependências
- [ ] Configurar `.env` com DATABASE_URL
- [ ] Criar schema no Prisma
- [ ] Executar migrations
- [ ] Criar seed de dados iniciais
- [ ] Atualizar `lib/orders.ts`
- [ ] Atualizar APIs de admin
- [ ] Atualizar APIs de autenticação
- [ ] Testar login admin
- [ ] Testar criação de pedidos
- [ ] Testar listagem de pedidos

---

## 🔒 SEGURANÇA ADICIONAL

### Rate Limiting

Instalar:
```bash
npm install express-rate-limit
```

### Validação de Dados

Instalar:
```bash
npm install zod
```

---

## 📚 RECURSOS

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcryptjs)

---

**Pronto! Com isso você terá um sistema completo com banco de dados e autenticação segura!** 🎉



