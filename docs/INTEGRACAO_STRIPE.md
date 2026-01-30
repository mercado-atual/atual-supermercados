# 💳 Integração Stripe - Pagamentos

## 📋 Visão Geral

O sistema está integrado com o Stripe para processar pagamentos via cartão de crédito/débito e PIX.

## 🔧 Configuração

### 1. Obter Chaves da Stripe

1. Acesse: https://dashboard.stripe.com/apikeys
2. Copie a **Secret Key** (começa com `sk_test_` para testes ou `sk_live_` para produção)
3. Copie a **Publishable Key** (começa com `pk_test_` para testes ou `pk_live_` para produção)

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Importante**: 
- Use chaves de **teste** durante desenvolvimento
- Use chaves de **produção** apenas em ambiente de produção
- **NUNCA** commite o arquivo `.env.local` no Git

### 3. Configurar na Vercel

1. Acesse o dashboard da Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `STRIPE_SECRET_KEY` = sua chave secreta
   - `STRIPE_PUBLISHABLE_KEY` = sua chave pública

## 📡 Endpoint de Pagamento

### POST `/api/payments/create`

Cria um PaymentIntent na Stripe para processar o pagamento.

#### Request Body

```json
{
  "orderId": "order_1234567890",
  "amount": 100.50,
  "paymentMethod": "card" // ou "pix"
}
```

#### Parâmetros

- `orderId` (string, obrigatório): ID do pedido criado
- `amount` (number, obrigatório): Valor total em reais (ex: 100.50 = R$ 100,50)
- `paymentMethod` (string, obrigatório): Método de pagamento - `"card"` ou `"pix"`

#### Response (Sucesso)

```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "status": "requires_payment_method",
  "orderId": "order_1234567890",
  "amount": 100.50,
  "paymentMethod": "card"
}
```

#### Response (Erro)

```json
{
  "error": "Mensagem de erro"
}
```

## 🔄 Fluxo de Pagamento

### 1. Criar Pedido

Primeiro, crie o pedido usando `/api/orders/create`. O pedido será criado com status `aguardando_pagamento`.

### 2. Criar PaymentIntent

Chame `/api/payments/create` com:
- `orderId`: ID do pedido criado
- `amount`: Valor total do pedido
- `paymentMethod`: `"card"` ou `"pix"`

### 3. Processar Pagamento no Frontend

Use o `clientSecret` retornado para processar o pagamento:

#### Para Cartão:
```javascript
const { clientSecret } = await response.json();
// Usar Stripe.js no frontend para processar o cartão
```

#### Para PIX:
```javascript
const { clientSecret } = await response.json();
// Usar Stripe.js no frontend para exibir QR Code PIX
```

## 📊 Status do Pedido

O pedido inicia com status `aguardando_pagamento` e será atualizado automaticamente quando o pagamento for confirmado.

Status possíveis:
- `aguardando_pagamento`: Aguardando confirmação do pagamento
- `recebido`: Pagamento confirmado, pedido recebido
- `aceito`: Pedido aceito pelo mercado
- `em_separacao`: Produtos sendo separados
- `saiu_entrega`: Pedido saiu para entrega
- `entregue`: Pedido entregue
- `cancelado`: Pedido cancelado

## 🔒 Segurança

- **Nenhum dado de cartão é armazenado** no servidor
- Todos os dados sensíveis são processados diretamente pela Stripe
- O Stripe gerencia toda a segurança e conformidade (PCI-DSS)

## 🧪 Testes

### Cartões de Teste

Use estes cartões para testar:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Data: qualquer data futura  
CVC: qualquer 3 dígitos

### PIX de Teste

O Stripe gera automaticamente um QR Code PIX de teste quando você usa `paymentMethod: "pix"`.

## 📚 Documentação Oficial

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe PIX](https://stripe.com/docs/payments/pix)

## 🔔 Webhooks

### Configuração do Webhook

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **Add endpoint**
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/api/webhooks/stripe`
   - **Events to send**: Selecione:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Copie o **Signing secret** (começa com `whsec_`)
5. Adicione ao `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Eventos Tratados

- **`payment_intent.succeeded`**: Pagamento confirmado → Pedido atualizado para `recebido`
- **`payment_intent.payment_failed`**: Pagamento recusado → Pedido atualizado para `cancelado`

### Segurança

- O webhook valida a assinatura do Stripe antes de processar eventos
- Idempotência garantida: eventos duplicados são ignorados
- Logs detalhados para rastreamento

## ⚠️ Importante

- Em produção, configure webhooks para receber notificações de pagamento
- Monitore os pagamentos no dashboard da Stripe
- Configure logs adequados para rastrear transações
- **NUNCA** exponha o endpoint de webhook sem validação de assinatura

