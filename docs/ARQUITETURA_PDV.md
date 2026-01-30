# Arquitetura de Integração PDV ↔ Site

## 📋 Visão Geral

Este documento descreve como o sistema PDV (Ponto de Venda) se integra com o site e-commerce para sincronização de dados em tempo real.

## 🔄 Fluxo de Dados

```
PDV (Loja Física) 
    ↓
API Backend (Next.js API Routes)
    ↓
Banco de Dados (PostgreSQL/MongoDB)
    ↓
Site E-commerce (Next.js Frontend)
```

## 🏗️ Arquitetura Proposta

### 1. **Sincronização de Produtos**

**Fluxo:**
- PDV atualiza produto (preço, estoque, descrição)
- PDV envia webhook/API call para o backend
- Backend valida e atualiza banco de dados
- Site consulta API e atualiza cache

**Frequência:**
- **Tempo Real**: Preços e estoque críticos
- **A cada 5 minutos**: Produtos gerais
- **A cada 1 hora**: Dados secundários (descrições, categorias)

### 2. **Sincronização de Estoque**

**Regras:**
- Estoque do site sempre ≤ Estoque físico
- Reserva automática ao adicionar no carrinho (15 minutos)
- Liberação automática se não finalizar compra
- Atualização em tempo real quando produto vendido no PDV

### 3. **Sincronização de Preços**

**Regras:**
- Preços promocionais sincronizados automaticamente
- Histórico de preços mantido para análise
- Validação de preços antes de exibir no site

## 🔌 Integração com PDV

### Opção 1: API REST (Recomendado)

O PDV faz requisições HTTP para o backend:

```http
POST /api/pdv/sync-product
Content-Type: application/json
Authorization: Bearer {PDV_API_KEY}

{
  "productId": "12345",
  "price": 29.90,
  "stock": 150,
  "category": "acougue",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Opção 2: Webhook

PDV configura webhook que é chamado automaticamente:

```http
POST /api/pdv/webhook
Content-Type: application/json
X-PDV-Signature: {HMAC_SHA256}

{
  "event": "product.updated",
  "data": { ... }
}
```

### Opção 3: Sincronização por Arquivo (Fallback)

PDV exporta arquivo CSV/JSON periodicamente:
- Upload via FTP/SFTP
- Processamento automático pelo backend
- Importação em lote

## 📊 Estrutura de Dados

### Produto no Banco de Dados

```typescript
{
  id: string;
  pdvId: string;           // ID no sistema PDV
  title: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description: string;
  lastSync: Date;          // Última sincronização
  syncStatus: 'synced' | 'pending' | 'error';
}
```

## 🔐 Segurança

1. **Autenticação**: API Key única por PDV/loja
2. **Validação**: Todos os dados validados antes de salvar
3. **Rate Limiting**: Limite de requisições por minuto
4. **Logs**: Todas as sincronizações registradas

## ⚡ Performance

1. **Cache**: Dados em cache Redis (5 minutos)
2. **CDN**: Imagens servidas via CDN
3. **Incremental Updates**: Apenas mudanças sincronizadas
4. **Queue System**: Processamento assíncrono para grandes volumes

## 🚀 Próximos Passos

1. Implementar API Routes no Next.js
2. Configurar banco de dados
3. Criar sistema de autenticação PDV
4. Implementar webhook handlers
5. Criar dashboard de monitoramento

