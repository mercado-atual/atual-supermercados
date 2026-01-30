# 🖼️ GUIA - Sincronização Automática de Imagens

## 🎯 Problema Resolvido

Quando os produtos vierem da API SISMO, eles terão **nomes mas não terão imagens**. Este sistema busca imagens automaticamente baseado no nome do produto.

---

## ✅ O QUE FOI CRIADO

### 1. **Serviço de Busca de Imagens** (`lib/services/image-search.service.ts`)
- Busca imagens automaticamente por nome do produto
- Usa múltiplas fontes (Unsplash, Pexels, Placeholder)
- Sistema de cache para evitar requisições repetidas
- Mapeamento inteligente de termos (ex: "Alcatra Peça" → "alcatra carne")

### 2. **API Routes**
- `GET /api/images/search?name=Alcatra&category=acougue` - Buscar imagem de um produto
- `POST /api/images/sync` - Sincronizar imagens em lote

### 3. **Helper de Integração SISMO** (`lib/integrations/sismo/image-sync.helper.ts`)
- Funções prontas para adicionar imagens aos produtos SISMO
- Processamento em lote otimizado

---

## 🚀 COMO USAR

### Opção 1: Automático (Recomendado)

Quando você integrar a API SISMO, use o helper:

```typescript
import { enrichProductsWithImages } from '@/lib/integrations/sismo/image-sync.helper';
import { sismoService } from '@/lib/integrations/sismo';

// Buscar produtos da API SISMO
const sismoProducts = await sismoService.getProducts();

// Adicionar imagens automaticamente
const productsWithImages = await enrichProductsWithImages(sismoProducts.products);

// Agora todos os produtos têm imagens! 🎉
```

### Opção 2: Manual (API Route)

```typescript
// Buscar imagem de um produto específico
const response = await fetch('/api/images/search?name=Alcatra&category=acougue');
const { url } = await response.json();
// url = "https://source.unsplash.com/400x400/?alcatra+carne+bovina"
```

### Opção 3: Sincronização em Lote

```typescript
// Sincronizar imagens para múltiplos produtos
const response = await fetch('/api/images/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    products: [
      { id: '1', name: 'Alcatra Peça', categoryId: '2' },
      { id: '2', name: 'Picanha', categoryId: '2' },
      // ...
    ],
    options: {
      batchSize: 10,        // Processar 10 por vez
      delayBetweenBatches: 500, // Esperar 500ms entre lotes
    }
  })
});

const { products, stats } = await response.json();
// products = produtos com imagens adicionadas
// stats = { total, processed, withImage, withoutImage }
```

---

## 🔧 CONFIGURAÇÃO

### Pexels API (Opcional, mas Recomendado)

Para melhor qualidade de imagens, obtenha uma API key gratuita do Pexels:

1. Acesse: https://www.pexels.com/api/
2. Crie uma conta (gratuita)
3. Obtenha sua API key
4. Adicione no `.env.local`:

```env
PEXELS_API_KEY=sua_chave_aqui
```

**Sem API key:** O sistema usa Unsplash (gratuito, sem autenticação)

**Com API key:** O sistema usa Pexels primeiro (melhor qualidade), depois Unsplash como fallback

---

## 📊 COMO FUNCIONA

### 1. Normalização do Nome

```
"Alcatra Peça" → "alcatra carne bovina"
"Tomate Italiano" → "tomate"
"Pão Francês" → "pao frances"
```

### 2. Busca em Múltiplas Fontes

```
1. Pexels (se tiver API key) → Melhor qualidade
2. Unsplash (sempre disponível) → Boa qualidade
3. Placeholder (fallback) → Se não encontrar nada
```

### 3. Cache Inteligente

- Imagens são cacheadas por 7 dias
- Evita requisições repetidas
- Acelera carregamento

---

## 🎨 EXEMPLOS DE USO

### Exemplo 1: Integração com API SISMO

```typescript
// app/api/items/route.ts
import { sismoService } from '@/lib/integrations/sismo';
import { enrichProductsWithImages } from '@/lib/integrations/sismo/image-sync.helper';

export async function GET() {
  // Buscar produtos da SISMO
  const sismoResponse = await sismoService.getProducts();
  
  // Adicionar imagens automaticamente
  const productsWithImages = await enrichProductsWithImages(
    sismoResponse.products
  );
  
  // Converter para formato do site
  const items = productsWithImages.map(product => ({
    id: product.id,
    title: product.name,
    price: /* buscar preço */,
    thumbnail: product.imageUrl, // ✅ Imagem já está aqui!
  }));
  
  return NextResponse.json(items);
}
```

### Exemplo 2: Sincronização Manual

```typescript
// Script para sincronizar imagens de produtos existentes
import { syncImagesForSismoProducts } from '@/lib/integrations/sismo/image-sync.helper';

const products = [
  { id: '1', name: 'Alcatra Peça', categoryId: '2' },
  { id: '2', name: 'Picanha', categoryId: '2' },
  // ...
];

const productsWithImages = await syncImagesForSismoProducts(products, {
  batchSize: 10,
  delayBetweenBatches: 500,
});

console.log(`${productsWithImages.length} produtos processados`);
```

---

## ⚡ PERFORMANCE

### Otimizações Implementadas:

1. **Cache em Memória**
   - Imagens são cacheadas por 7 dias
   - Evita buscas repetidas

2. **Processamento em Lote**
   - Processa múltiplos produtos de uma vez
   - Delay configurável entre lotes

3. **Fallback Inteligente**
   - Tenta múltiplas fontes
   - Sempre retorna algo (mesmo que seja placeholder)

---

## 🧪 TESTES

### Testar Busca de Imagem:

```bash
# Buscar imagem de um produto
curl "http://localhost:3000/api/images/search?name=Alcatra&category=acougue"
```

### Testar Sincronização em Lote:

```bash
curl -X POST http://localhost:3000/api/images/sync \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      { "id": "1", "name": "Alcatra Peça", "categoryId": "2" },
      { "id": "2", "name": "Picanha", "categoryId": "2" }
    ]
  }'
```

---

## 📋 CHECKLIST DE INTEGRAÇÃO

Quando integrar a API SISMO:

- [ ] Adicionar `PEXELS_API_KEY` no `.env.local` (opcional)
- [ ] Usar `enrichProductsWithImages()` ao buscar produtos
- [ ] Testar com alguns produtos primeiro
- [ ] Verificar qualidade das imagens
- [ ] Ajustar mapeamento de termos se necessário

---

## 🔍 MAPEAMENTO DE TERMOS

O sistema já tem mapeamento para termos comuns:

```typescript
'alcatra' → 'alcatra carne bovina'
'picanha' → 'picanha carne bovina'
'tomate italiano' → 'tomate'
'banana prata' → 'banana'
'pão francês' → 'pao frances'
```

**Para adicionar mais termos**, edite `lib/services/image-search.service.ts`:

```typescript
const termMap: Record<string, string> = {
  'seu termo': 'termo de busca',
  // ...
};
```

---

## ⚠️ LIMITAÇÕES

1. **Rate Limits**
   - Unsplash: Sem limite (mas pode ser lento)
   - Pexels: 200 requisições/hora (plano gratuito)

2. **Qualidade das Imagens**
   - Depende da busca
   - Pode não ser 100% precisa
   - Placeholder se não encontrar

3. **Cache**
   - Cache em memória (perde ao reiniciar servidor)
   - Em produção, considerar Redis

---

## 🚀 PRÓXIMOS PASSOS

1. **Quando integrar SISMO:**
   - Use `enrichProductsWithImages()` automaticamente
   - Imagens serão adicionadas automaticamente

2. **Para melhorar qualidade:**
   - Obtenha API key do Pexels
   - Ajuste mapeamento de termos conforme necessário

3. **Em produção:**
   - Considere usar Redis para cache
   - Configure rate limiting adequado

---

## 💡 DICAS

- **Teste primeiro** com poucos produtos
- **Ajuste o mapeamento** conforme necessário
- **Use Pexels API key** para melhor qualidade
- **Cache é seu amigo** - não busque a mesma imagem duas vezes

---

**Pronto!** Agora quando os produtos vierem do PDV SISMO, as imagens serão buscadas automaticamente! 🎉

