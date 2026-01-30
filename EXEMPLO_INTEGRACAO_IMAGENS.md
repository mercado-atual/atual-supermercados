# 💡 EXEMPLO PRÁTICO - Integração de Imagens com SISMO

## 📝 Cenário

Quando você integrar a API SISMO, os produtos virão assim:

```json
{
  "id": "123",
  "name": "Alcatra Peça",
  "categoryId": "2",
  "price": 39.90,
  "imageUrl": null  // ❌ Sem imagem!
}
```

**Solução:** O sistema busca a imagem automaticamente! ✅

---

## 🔧 IMPLEMENTAÇÃO COMPLETA

### Passo 1: Atualizar o Service SISMO

**Arquivo:** `lib/integrations/sismo/sismo.service.ts`

```typescript
import { enrichProductsWithImages } from './image-sync.helper';

class SismoService {
  // ... código existente ...

  async getProducts(params?: {...}): Promise<SismoProductsResponse> {
    // 1. Buscar produtos da API SISMO
    const response = await fetch(`${this.config.baseUrl}/api/products`, {
      method: 'GET',
      headers: {
        ...this.config.headers,
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    
    const data: SismoProductsResponse = await response.json();
    
    // 2. Adicionar imagens automaticamente aos produtos sem imagem
    const productsWithImages = await enrichProductsWithImages(
      data.products
    );
    
    // 3. Retornar produtos com imagens
    return {
      ...data,
      products: productsWithImages,
    };
  }
}
```

### Passo 2: Atualizar API Route

**Arquivo:** `app/api/items/route.ts`

```typescript
import { sismoService } from '@/lib/integrations/sismo';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Buscar produtos da SISMO (já vêm com imagens!)
    const sismoResponse = await sismoService.getProducts({
      page,
      limit,
    });
    
    // Buscar preços
    const productIds = sismoResponse.products.map(p => p.id);
    const pricesResponse = await sismoService.getPrices({ productIds });
    
    // Combinar dados
    const items = sismoResponse.products.map(product => {
      const price = pricesResponse.prices.find(p => p.productId === product.id);
      
      return {
        id: product.id,
        title: product.name,
        price: price?.salePrice || 0,
        thumbnail: product.imageUrl || '', // ✅ Imagem já está aqui!
        available: true,
      };
    });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 RESULTADO

### Antes (sem imagem):
```json
{
  "id": "123",
  "name": "Alcatra Peça",
  "imageUrl": null
}
```

### Depois (com imagem automática):
```json
{
  "id": "123",
  "name": "Alcatra Peça",
  "imageUrl": "https://images.pexels.com/photos/123456/meat.jpg"
}
```

---

## 🚀 FLUXO COMPLETO

```
1. Produto vem da API SISMO sem imagem
   ↓
2. Sistema detecta que não tem imagem
   ↓
3. Normaliza nome: "Alcatra Peça" → "alcatra carne bovina"
   ↓
4. Busca imagem no Pexels/Unsplash
   ↓
5. Adiciona URL da imagem ao produto
   ↓
6. Salva no cache (7 dias)
   ↓
7. Retorna produto com imagem! ✅
```

---

## 📊 ESTATÍSTICAS

Após sincronização, você terá:

```typescript
const stats = {
  total: 1000,           // Total de produtos
  withImage: 950,        // Produtos com imagem encontrada
  withoutImage: 50,      // Produtos com placeholder
  cacheHits: 800,       // Imagens do cache (rápido!)
  apiCalls: 150,        // Chamadas à API de imagens
};
```

---

## ⚡ PERFORMANCE

### Com Cache:
- **Primeira busca:** ~500ms por produto
- **Busca em cache:** ~1ms (instantâneo!)

### Processamento em Lote:
- **10 produtos:** ~5 segundos
- **100 produtos:** ~50 segundos
- **1000 produtos:** ~8 minutos (com delays)

---

## 🔧 CONFIGURAÇÃO AVANÇADA

### Ajustar Mapeamento de Termos

**Arquivo:** `lib/services/image-search.service.ts`

```typescript
const termMap: Record<string, string> = {
  'alcatra': 'alcatra carne bovina',
  'picanha': 'picanha carne bovina',
  'seu produto específico': 'termo de busca otimizado',
  // Adicione mais conforme necessário
};
```

### Ajustar Cache

```typescript
// Cache por 30 dias ao invés de 7
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
```

### Ajustar Rate Limits

```typescript
// Processar 5 por vez, esperar 1 segundo entre lotes
const productsWithImages = await syncImagesForSismoProducts(products, {
  batchSize: 5,
  delayBetweenBatches: 1000,
});
```

---

## 🧪 TESTE RÁPIDO

```typescript
// Teste manual
import { searchProductImage } from '@/lib/services/image-search.service';

const result = await searchProductImage('Alcatra Peça', 'acougue');
console.log(result.url); // URL da imagem encontrada
```

---

## ✅ CHECKLIST

Quando integrar:

- [ ] Adicionar `enrichProductsWithImages()` no service SISMO
- [ ] Testar com alguns produtos
- [ ] Verificar qualidade das imagens
- [ ] Ajustar mapeamento se necessário
- [ ] Configurar Pexels API key (opcional)
- [ ] Monitorar performance

---

**Pronto!** Agora seus produtos terão imagens automaticamente! 🎉

