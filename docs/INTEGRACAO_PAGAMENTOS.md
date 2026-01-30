# 💳 Integração com Gateways de Pagamento

## 📋 Visão Geral

Este documento descreve como integrar gateways de pagamento no sistema de checkout do ATUAL Supermercados.

---

## 🎯 Gateways Recomendados

### **1. Mercado Pago** (Recomendado)
- ✅ Mais popular no Brasil
- ✅ Suporta PIX, Cartão, Boleto
- ✅ API bem documentada
- ✅ SDK oficial para Node.js
- ✅ Taxas competitivas

### **2. PagSeguro**
- ✅ Confiável e estabelecido
- ✅ Boa integração
- ✅ Suporta múltiplos métodos

### **3. Stripe**
- ✅ Internacional
- ✅ Excelente documentação
- ⚠️ Menos comum no Brasil

---

## 🔧 Implementação: Mercado Pago

### **Passo 1: Instalar SDK**

```bash
npm install mercadopago
```

### **Passo 2: Configurar Credenciais**

Criar arquivo `.env.local`:
```env
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
```

### **Passo 3: Criar API de Pagamento**

```typescript
// app/api/payments/create/route.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  const { orderId, paymentMethod, amount, cardData } = await request.json();

  if (paymentMethod === 'pix') {
    // Criar pagamento PIX
    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        payment_method_id: 'pix',
        payer: {
          email: user.email,
        },
      },
    });
    
    return NextResponse.json({
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
    });
  }

  if (paymentMethod === 'credit' || paymentMethod === 'debit') {
    // Processar cartão
    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        token: cardData.token,
        installments: cardData.installments,
        payment_method_id: paymentMethod === 'credit' ? 'visa' : 'debit_card',
        payer: {
          email: user.email,
        },
      },
    });

    return NextResponse.json({ status: result.status });
  }
}
```

---

## 📱 Fluxo de Pagamento

### **1. PIX**
```
Cliente escolhe PIX
  ↓
Backend cria pagamento PIX
  ↓
Retorna QR Code
  ↓
Cliente escaneia e paga
  ↓
Webhook confirma pagamento
  ↓
Pedido atualizado para "aceito"
```

### **2. Cartão de Crédito/Débito**
```
Cliente escolhe Cartão
  ↓
Preenche dados do cartão
  ↓
Backend valida e processa
  ↓
Gateway aprova/rejeita
  ↓
Pedido criado ou erro exibido
```

### **3. Boleto**
```
Cliente escolhe Boleto
  ↓
Backend gera boleto
  ↓
Cliente recebe PDF
  ↓
Cliente paga no banco
  ↓
Webhook confirma pagamento
```

---

## 🔔 Webhooks

### **Configurar Webhook no Mercado Pago**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Configure URL do webhook: `https://seu-site.com/api/payments/webhook`
3. Criar rota de webhook:

```typescript
// app/api/payments/webhook/route.ts
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  if (data.type === 'payment') {
    const paymentId = data.data.id;
    
    // Buscar pagamento no Mercado Pago
    const payment = await mercadoPago.payment.findById(paymentId);
    
    if (payment.status === 'approved') {
      // Atualizar pedido no banco
      await db.orders.update({
        where: { paymentId },
        data: { status: 'aceito' }
      });
      
      // Enviar notificação ao cliente
      await sendNotification(userId, 'Pedido confirmado!');
    }
  }
  
  return NextResponse.json({ received: true });
}
```

---

## 🛡️ Segurança

### **Boas Práticas**

1. **Nunca armazenar dados de cartão**
   - Use tokens do gateway
   - Processe no servidor

2. **Validar webhooks**
   - Verificar assinatura
   - Validar origem

3. **HTTPS obrigatório**
   - Todas as comunicações criptografadas

4. **Rate limiting**
   - Limitar tentativas de pagamento

---

## 📊 Status de Pagamento

| Status | Descrição | Ação |
|--------|-----------|------|
| `pending` | Aguardando pagamento | Aguardar confirmação |
| `approved` | Pagamento aprovado | Criar pedido |
| `rejected` | Pagamento rejeitado | Mostrar erro |
| `refunded` | Reembolsado | Cancelar pedido |

---

## 💰 Taxas Estimadas

### **Mercado Pago**
- PIX: ~0.99% por transação
- Débito: ~1.99% por transação
- Crédito: ~4.99% por transação
- Boleto: ~R$ 2,00 por transação

### **PagSeguro**
- Similar ao Mercado Pago
- Taxas variam por volume

---

## 🚀 Próximos Passos

1. ✅ Estrutura de checkout criada
2. ⏳ Integrar SDK do gateway escolhido
3. ⏳ Configurar credenciais
4. ⏳ Implementar processamento de pagamento
5. ⏳ Configurar webhooks
6. ⏳ Testar em ambiente sandbox
7. ⏳ Fazer deploy em produção

---

## 📚 Recursos

- [Mercado Pago Docs](https://www.mercadopago.com.br/developers/pt/docs)
- [PagSeguro Docs](https://dev.pagseguro.uol.com.br/)
- [Stripe Docs](https://stripe.com/docs)

---

**Status**: 📋 Estrutura criada - Aguardando escolha do gateway e configuração



