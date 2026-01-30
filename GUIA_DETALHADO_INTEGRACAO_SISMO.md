# 🎓 GUIA DETALHADO - Integração API SISMO PDV

## 📚 ÍNDICE

1. [Visão Geral da Integração](#visão-geral)
2. [Como Funciona Atualmente (Mock)](#como-funciona-atualmente)
3. [Como Será Após a Integração](#como-será-após-integracao)
4. [Passo a Passo da Implementação](#passo-a-passo)
5. [Exemplos de Código](#exemplos-de-código)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Cache e Performance](#cache-e-performance)
8. [Testes](#testes)

---

## 🎯 VISÃO GERAL DA INTEGRAÇÃO

### O que vai acontecer:

```
┌─────────────────┐
│   Site Next.js  │
│  (Frontend)     │
└────────┬────────┘
         │
         │ 1. Usuário busca produto
         ▼
┌─────────────────┐
│  API Route      │
│  /api/items     │
└────────┬────────┘
         │
         │ 2. Chama sismoService
         ▼
┌─────────────────┐
│ SismoService    │
│ (lib/integrations/sismo) │
└────────┬────────┘
         │
         │ 3. HTTP Request
         ▼
┌─────────────────┐
│  API SISMO PDV  │
│  (Backend)      │
└─────────────────┘
         │
         │ 4. Retorna JSON
         ▼
┌─────────────────┐
│  Site Next.js   │
│  Exibe produtos │
└─────────────────┘
```

---

## 🔍 COMO FUNCIONA ATUALMENTE (MOCK)

### Estado Atual:

**Arquivo:** `lib/integrations/sismo/sismo.service.ts`

```typescript
// ❌ ATUALMENTE: Retorna dados mockados
async getProducts() {
  const mockProducts = [
    {
      id: '1',
      code: 'PROD001',
      name: 'Produto Exemplo',
      // ...
    }
  ];
  return { products: mockProducts, total: 1 };
}
```

**O que acontece:**
- ✅ Site funciona normalmente
- ✅ Não depende de API externa
- ❌ Dados são fictícios
- ❌ Não reflete produtos reais do PDV

---

## 🚀 COMO SERÁ APÓS A INTEGRAÇÃO

### Estado Futuro:

```typescript
// ✅ DEPOIS: Retorna dados reais da API SISMO
async getProducts() {
  const response = await fetch(`${this.config.baseUrl}/api/products`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }
  
  return await response.json();
}
```

**O que vai acontecer:**
- ✅ Dados reais do PDV SISMO
- ✅ Preços atualizados em tempo real
- ✅ Estoque sincronizado
- ✅ Produtos reais do supermercado

---

## 📝 PASSO A PASSO DA IMPLEMENTAÇÃO

### PASSO 1: Configurar Variáveis de Ambiente

**Arquivo:** `.env.local` (criar na raiz do projeto)

```env
SISMO_API_URL=https://api.sismo.com.br
SISMO_API_KEY=seu_token_aqui_123456
SISMO_API_TIMEOUT=30000
```

**Por que?**
- ✅ Segurança: credenciais não vão para o Git
- ✅ Flexibilidade: fácil mudar entre ambientes (teste/produção)
- ✅ Configuração centralizada

---

### PASSO 2: Atualizar o Service com Chamadas HTTP Reais

**Arquivo:** `lib/integrations/sismo/sismo.service.ts`

#### ANTES (Mock):
```typescript
async getProducts(params?: {...}): Promise<SismoProductsResponse> {
  // MOCK: Retornando dados simulados
  const mockProducts = [{ id: '1', name: 'Produto Exemplo' }];
  return { products: mockProducts, total: 1 };
}
```

#### DEPOIS (Real):
```typescript
async getProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<SismoProductsResponse> {
  // Construir URL com query parameters
  const url = new URL(`${this.config.baseUrl}/api/products`);
  
  if (params?.page) url.searchParams.append('page', params.page.toString());
  if (params?.limit) url.searchParams.append('limit', params.limit.toString());
  if (params?.categoryId) url.searchParams.append('categoryId', params.categoryId);
  if (params?.search) url.searchParams.append('search', params.search);
  
  // Fazer requisição HTTP
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      ...this.config.headers,
      'Authorization': `Bearer ${this.config.apiKey}`,
    },
    signal: AbortSignal.timeout(this.config.timeout || 30000),
  });
  
  // Verificar se a resposta foi OK
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(`Erro ao buscar produtos: ${error.message}`);
  }
  
  // Retornar dados parseados
  return await response.json();
}
```

---

### PASSO 3: Ajustar Interfaces TypeScript (se necessário)

**Arquivo:** `lib/integrations/sismo/types.ts`

**Quando ajustar?**
- Se a API SISMO usar nomes diferentes (ex: `nome` ao invés de `name`)
- Se houver campos extras que precisamos
- Se o formato de resposta for diferente

**Exemplo de ajuste:**
```typescript
// Se a API retornar em português:
export interface SismoProduct {
  id: string;
  codigo: string;        // ao invés de 'code'
  nome: string;          // ao invés de 'name'
  descricao?: string;    // ao invés de 'description'
  categoriaId: string;  // ao invés de 'categoryId'
  unidade: string;      // ao invés de 'unit'
  // ...
}
```

---

### PASSO 4: Criar Adaptador (se necessário)

**Por quê?**
- A API SISMO pode retornar dados em formato diferente
- Precisamos converter para o formato interno do projeto

**Arquivo:** `lib/integrations/sismo/adapter.ts` (criar se necessário)

```typescript
import type { SismoProduct } from './types';
import type { Product } from '@/lib/products';

/**
 * Converte produto da API SISMO para formato interno
 */
export function adaptSismoProductToProduct(sismoProduct: SismoProduct): Product {
  return {
    id: sismoProduct.id,
    title: sismoProduct.name,
    price: formatPrice(sismoProduct.price?.salePrice || 0),
    unit: sismoProduct.unit,
    category: mapCategory(sismoProduct.categoryId),
    image: sismoProduct.imageUrl || '',
    description: sismoProduct.description,
  };
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

function mapCategory(categoryId: string): string {
  // Mapear IDs de categoria SISMO para categorias do site
  const categoryMap: Record<string, string> = {
    '1': 'hortifruti',
    '2': 'acougue',
    '3': 'padaria',
    '4': 'bebidas',
    '5': 'ofertas',
  };
  return categoryMap[categoryId] || 'ofertas';
}
```

---

### PASSO 5: Atualizar API Routes para Usar SismoService

**Arquivo:** `app/api/items/route.ts`

#### ANTES:
```typescript
export async function GET() {
  // Dados mockados locais
  const items = [
    { id: "1", nome: "Arroz", preco: 24.90 },
    // ...
  ];
  return NextResponse.json(items);
}
```

#### DEPOIS:
```typescript
import { sismoService } from '@/lib/integrations/sismo';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Buscar parâmetros da query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || undefined;
    
    // Buscar produtos da API SISMO
    const response = await sismoService.getProducts({
      page,
      limit,
      categoryId,
      search,
    });
    
    // Buscar preços e estoque (se necessário)
    const productIds = response.products.map(p => p.id);
    const [prices, stocks] = await Promise.all([
      sismoService.getPrices({ productIds }),
      sismoService.getStock({ productIds }),
    ]);
    
    // Combinar dados
    const items = response.products.map(product => {
      const price = prices.prices.find(p => p.productId === product.id);
      const stock = stocks.stocks.find(s => s.productId === product.id);
      
      return {
        id: product.id,
        title: product.name,
        price: price?.salePrice || 0,
        thumbnail: product.imageUrl,
        available: stock?.available ?? false,
        quantity: stock?.quantity || 0,
      };
    });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Erro ao buscar produtos da SISMO:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
```

---

### PASSO 6: Desativar Modo Catálogo

**Arquivo:** `lib/catalog-config.ts`

```typescript
// ANTES (modo catálogo):
export const CATALOG_MODE = true;

// DEPOIS (vendas ativas):
export const CATALOG_MODE = false;
```

**O que muda:**
- ✅ Botões "Adicionar" funcionam de verdade
- ✅ Carrinho permite checkout
- ✅ Usuários podem finalizar compras

---

## 💻 EXEMPLOS DE CÓDIGO

### Exemplo 1: Buscar Produto por ID

```typescript
// Em uma página de produto: app/produto/[id]/page.tsx
import { sismoService } from '@/lib/integrations/sismo';

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    // Buscar produto
    const product = await sismoService.getProductById(params.id);
    
    if (!product) {
      return <div>Produto não encontrado</div>;
    }
    
    // Buscar preço e estoque
    const [price, stock] = await Promise.all([
      sismoService.getPriceByProductId(params.id),
      sismoService.getStockByProductId(params.id),
    ]);
    
    return (
      <div>
        <h1>{product.name}</h1>
        <p>Preço: R$ {price?.salePrice.toFixed(2)}</p>
        <p>Estoque: {stock?.quantity || 0}</p>
        <p>Disponível: {stock?.available ? 'Sim' : 'Não'}</p>
      </div>
    );
  } catch (error) {
    return <div>Erro ao carregar produto</div>;
  }
}
```

### Exemplo 2: Buscar Produtos por Categoria

```typescript
// Em uma página de categoria: app/hortifruti/page.tsx
import { sismoService } from '@/lib/integrations/sismo';

export default async function HortifrutiPage() {
  try {
    // Buscar categoria "Hortifruti" primeiro
    const categories = await sismoService.getCategories();
    const hortifrutiCategory = categories.categories.find(
      cat => cat.name.toLowerCase() === 'hortifruti'
    );
    
    if (!hortifrutiCategory) {
      return <div>Categoria não encontrada</div>;
    }
    
    // Buscar produtos da categoria
    const products = await sismoService.getProducts({
      categoryId: hortifrutiCategory.id,
      limit: 50,
    });
    
    return (
      <div>
        <h1>Hortifruti</h1>
        <div className="grid">
          {products.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <div>Erro ao carregar produtos</div>;
  }
}
```

### Exemplo 3: Busca com Filtros

```typescript
// Em uma página de busca
import { sismoService } from '@/lib/integrations/sismo';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  if (!query) {
    return <div>Digite algo para buscar</div>;
  }
  
  try {
    const results = await sismoService.getProducts({
      search: query,
      limit: 20,
    });
    
    return (
      <div>
        <h1>Resultados para: {query}</h1>
        <p>Encontrados {results.total} produtos</p>
        <div className="grid">
          {results.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <div>Erro ao buscar produtos</div>;
  }
}
```

---

## ⚠️ TRATAMENTO DE ERROS

### Estratégias de Tratamento:

#### 1. Erros de Rede (Timeout, Sem Conexão)
```typescript
try {
  const products = await sismoService.getProducts();
} catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    // Erro de rede
    console.error('Sem conexão com a API SISMO');
    // Retornar dados em cache ou mensagem amigável
  }
}
```

#### 2. Erros de Autenticação (401, 403)
```typescript
if (response.status === 401) {
  throw new Error('Token de autenticação inválido');
}
if (response.status === 403) {
  throw new Error('Sem permissão para acessar este recurso');
}
```

#### 3. Erros do Servidor (500, 502, 503)
```typescript
if (response.status >= 500) {
  // Servidor SISMO com problemas
  // Retornar dados em cache ou mensagem de manutenção
  console.error('API SISMO temporariamente indisponível');
}
```

#### 4. Retry Logic (Tentar Novamente)
```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Esperar 1s, 2s, 3s
    }
  }
  throw new Error('Falha após múltiplas tentativas');
}
```

---

## 🚀 CACHE E PERFORMANCE

### Por que usar Cache?
- ✅ Reduz chamadas à API SISMO
- ✅ Melhora velocidade do site
- ✅ Reduz custos de API
- ✅ Funciona mesmo se API estiver lenta

### Implementação de Cache:

```typescript
// lib/integrations/sismo/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function getCached(key: string) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// No service:
async getProducts(params?: {...}): Promise<SismoProductsResponse> {
  const cacheKey = `products-${JSON.stringify(params)}`;
  
  // Verificar cache
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  // Buscar da API
  const response = await fetch(...);
  const data = await response.json();
  
  // Salvar no cache
  setCache(cacheKey, data);
  
  return data;
}
```

### Cache no Next.js (Revalidation):

```typescript
// app/api/items/route.ts
export async function GET() {
  const products = await sismoService.getProducts();
  
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      // Cache por 5 minutos, aceita dados antigos por até 10 minutos
    },
  });
}
```

---

## 🧪 TESTES

### Teste Manual (Postman/Insomnia):

1. **Testar Autenticação:**
   ```
   GET https://api.sismo.com.br/api/products
   Headers:
     Authorization: Bearer seu_token_aqui
   ```

2. **Testar Busca de Produtos:**
   ```
   GET https://api.sismo.com.br/api/products?page=1&limit=10
   ```

3. **Testar Filtros:**
   ```
   GET https://api.sismo.com.br/api/products?categoryId=1&search=arroz
   ```

### Teste no Código:

```typescript
// __tests__/sismo.service.test.ts
import { sismoService } from '@/lib/integrations/sismo';

describe('SismoService', () => {
  it('deve buscar produtos da API', async () => {
    const response = await sismoService.getProducts();
    expect(response.products).toBeDefined();
    expect(Array.isArray(response.products)).toBe(true);
  });
  
  it('deve tratar erros de autenticação', async () => {
    // Testar com token inválido
  });
});
```

---

## 📋 CHECKLIST FINAL

Antes de colocar em produção:

- [ ] Variáveis de ambiente configuradas
- [ ] Service atualizado com chamadas HTTP reais
- [ ] Interfaces TypeScript ajustadas
- [ ] Tratamento de erros implementado
- [ ] Cache configurado (se necessário)
- [ ] Testes manuais realizados
- [ ] Performance validada
- [ ] Modo catálogo desativado
- [ ] Testado em ambiente de produção

---

## 🎯 RESUMO

**O que já temos:**
- ✅ Estrutura completa preparada
- ✅ Tipos TypeScript definidos
- ✅ Service com métodos mockados

**O que falta:**
- ⏳ Documentação da API SISMO
- ⏳ Credenciais de acesso
- ⏳ Implementar chamadas HTTP reais
- ⏳ Testar e validar

**Quando tiver a API:**
1. Configurar `.env.local`
2. Atualizar `sismo.service.ts`
3. Ajustar interfaces se necessário
4. Testar
5. Desativar modo catálogo
6. Pronto! 🚀

---

**Dúvidas?** Consulte o `CHECKLIST_INTEGRACAO_SISMO.md` ou me pergunte! 😊

