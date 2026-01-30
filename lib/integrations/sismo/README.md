# Integração SISMO PDV

Esta pasta contém a estrutura preparada para futura integração com a API da SISMO (PDV).

## ✅ Status: PRONTO PARA INTEGRAÇÃO

A estrutura está **100% validada e pronta** para receber a API real da SISMO:

- ✅ **Tipos TypeScript completos** - Cobrem Produto, Preço, Estoque e Categoria
- ✅ **Métodos com assinaturas definidas** - Prontos para receber dados reais sem alterar assinaturas
- ✅ **Totalmente desacoplado** - Nenhuma dependência com páginas ou componentes
- ✅ **Isolado do projeto** - Não interfere no funcionamento atual do site

## 📁 Estrutura

```
lib/integrations/sismo/
├── types.ts           # Interfaces TypeScript para dados da SISMO
├── sismo.service.ts   # Service com métodos placeholder/mockados
├── index.ts          # Exportações centralizadas
└── README.md         # Esta documentação
```

## 🎯 Objetivo

**NÃO integrar agora** - Apenas preparar a estrutura técnica correta para quando a API da SISMO estiver disponível.

## 📋 Interfaces Definidas

### SismoProduct
Representa um produto no sistema SISMO:
- `id`: ID único do produto
- `code`: Código interno
- `name`: Nome do produto
- `categoryId`: ID da categoria
- `unit`: Unidade de medida
- E outros campos...

### SismoPrice
Representa o preço de um produto:
- `productId`: ID do produto
- `salePrice`: Preço de venda
- `promotionalPrice`: Preço promocional (opcional)
- `priceUnit`: Unidade do preço

### SismoStock
Representa o estoque de um produto:
- `productId`: ID do produto
- `quantity`: Quantidade disponível
- `minQuantity`: Quantidade mínima
- `available`: Status de disponibilidade

### SismoCategory
Representa uma categoria:
- `id`: ID único
- `name`: Nome da categoria
- `code`: Código/sigla
- `active`: Status ativo/inativo

## 🔧 Service (sismo.service.ts)

O service contém métodos **mockados** que retornam dados simulados:

- `getProducts()` - Lista produtos
- `getProductById()` - Busca produto por ID
- `getPrices()` - Lista preços
- `getPriceByProductId()` - Preço de um produto
- `getStock()` - Lista estoques
- `getStockByProductId()` - Estoque de um produto
- `getCategories()` - Lista categorias
- `getCategoryById()` - Categoria por ID

## 🚀 Como Integrar (Futuro)

Quando a API real da SISMO estiver disponível:

1. **Configurar variáveis de ambiente:**
   ```env
   SISMO_API_URL=https://api.sismo.com.br
   SISMO_API_KEY=seu_token_aqui
   ```

2. **Substituir métodos mockados em `sismo.service.ts`:**
   - Remover os dados mockados
   - Implementar chamadas HTTP reais (fetch/axios)
   - Adicionar tratamento de erros
   - Implementar cache/retry se necessário

3. **Exemplo de implementação real:**
   ```typescript
   async getProducts(params?: {...}): Promise<SismoProductsResponse> {
     const url = new URL(`${this.config.baseUrl}/api/products`);
     // Adicionar query params...
     
     const response = await fetch(url.toString(), {
       method: 'GET',
       headers: this.config.headers,
     });
     
     if (!response.ok) {
       throw new Error('Erro ao buscar produtos');
     }
     
     return await response.json();
   }
   ```

4. **Ajustar interfaces em `types.ts` conforme documentação real da API**

## ⚠️ Importante

- **NÃO alterar páginas existentes** - Esta estrutura é isolada
- **NÃO ativar vendas/checkout** - Site continua como catálogo
- **Manter compatibilidade** - Interfaces devem ser compatíveis com `lib/products.ts`

## 📋 Dados que a API SISMO precisa fornecer

Para que a integração funcione corretamente, a API da SISMO deve retornar os seguintes dados:

### 1. **Produtos** (`GET /api/products` ou similar)
```json
{
  "products": [
    {
      "id": "string (obrigatório)",
      "code": "string (obrigatório)",
      "name": "string (obrigatório)",
      "description": "string (opcional)",
      "categoryId": "string (obrigatório)",
      "unit": "string (obrigatório: kg, un, l, etc)",
      "imageUrl": "string (opcional)",
      "barcode": "string (opcional)",
      "active": "boolean (obrigatório)",
      "createdAt": "string ISO date (opcional)",
      "updatedAt": "string ISO date (opcional)"
    }
  ],
  "total": "number",
  "page": "number (opcional)",
  "limit": "number (opcional)"
}
```

### 2. **Preços** (`GET /api/prices` ou similar)
```json
{
  "prices": [
    {
      "id": "string (obrigatório)",
      "productId": "string (obrigatório)",
      "salePrice": "number (obrigatório)",
      "costPrice": "number (opcional)",
      "promotionalPrice": "number (opcional)",
      "promotionStartDate": "string ISO date (opcional)",
      "promotionEndDate": "string ISO date (opcional)",
      "priceUnit": "string (obrigatório: un, kg, etc)",
      "updatedAt": "string ISO date (obrigatório)"
    }
  ],
  "total": "number"
}
```

### 3. **Estoque** (`GET /api/stock` ou similar)
```json
{
  "stocks": [
    {
      "id": "string (obrigatório)",
      "productId": "string (obrigatório)",
      "quantity": "number (obrigatório)",
      "minQuantity": "number (opcional)",
      "maxQuantity": "number (opcional)",
      "location": "string (opcional)",
      "available": "boolean (obrigatório)",
      "updatedAt": "string ISO date (obrigatório)"
    }
  ],
  "total": "number"
}
```

### 4. **Categorias** (`GET /api/categories` ou similar)
```json
{
  "categories": [
    {
      "id": "string (obrigatório)",
      "name": "string (obrigatório)",
      "code": "string (opcional)",
      "parentId": "string (opcional)",
      "displayOrder": "number (opcional)",
      "active": "boolean (obrigatório)"
    }
  ],
  "total": "number"
}
```

### 5. **Endpoints esperados**

A API deve fornecer os seguintes endpoints (ou equivalentes):

- `GET /api/products` - Lista produtos (com paginação opcional)
- `GET /api/products/{id}` - Produto por ID
- `GET /api/prices` - Lista preços (com filtros opcionais)
- `GET /api/prices/{productId}` - Preço por produto
- `GET /api/stock` - Lista estoques (com filtros opcionais)
- `GET /api/stock/{productId}` - Estoque por produto
- `GET /api/categories` - Lista categorias
- `GET /api/categories/{id}` - Categoria por ID

### 6. **Autenticação**

A API deve suportar autenticação via:
- Header `Authorization: Bearer {token}` ou
- Header `X-API-Key: {key}` ou
- Outro método conforme documentação da SISMO

## 📝 Notas

- As interfaces são baseadas em suposições genéricas
- Quando a documentação real da API SISMO estiver disponível, ajuste conforme necessário
- O service atual retorna dados mockados para não quebrar o build
- Todos os métodos têm comentários `TODO` indicando onde conectar a API real
- **A estrutura está validada e pronta** - apenas substitua os mocks por chamadas HTTP reais

