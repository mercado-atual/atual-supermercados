# 📋 Especificação Técnica - API de Integração PDV

## 🎯 Documento para Fornecer ao Responsável do PDV

Este documento contém todas as informações técnicas que o sistema PDV precisa para integrar com nosso e-commerce.

---

## 🌐 Endpoints Disponíveis

### 1. Sincronizar Produto Individual

**Endpoint:** `POST /api/pdv/sync-product`

**Descrição:** Recebe um produto individual do PDV e atualiza no e-commerce.

**URL Completa:**
```
https://projeto-atual-psi.vercel.app/api/pdv/sync-product
```

**Autenticação:**
```
Header: X-API-Key: [sua_chave_api_aqui]
```

**Corpo da Requisição (JSON):**
```json
{
  "id": "12345",
  "title": "Tomate Italiano",
  "price": "5.99",
  "unit": "kg",
  "image": "https://exemplo.com/imagem.jpg",
  "category": "hortifruti",
  "description": "Tomate italiano fresco e saboroso",
  "stock": 100,
  "barcode": "7891234567890",
  "badge": "Oferta"
}
```

**Campos Obrigatórios:**
- `id` - Código único do produto no PDV
- `title` - Nome do produto
- `price` - Preço (formato: "5.99")
- `unit` - Unidade de medida (kg, un, pct, etc)
- `category` - Categoria (hortifruti, acougue, padaria, bebidas, ofertas)

**Campos Opcionais:**
- `image` - URL da imagem do produto
- `description` - Descrição do produto
- `stock` - Quantidade em estoque
- `barcode` - Código de barras
- `badge` - Badge promocional ("Oferta", "Premium", etc)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Produto sincronizado com sucesso",
  "product": {
    "id": "12345",
    "title": "Tomate Italiano",
    "price": "5.99"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Dados inválidos",
  "details": "Campo 'title' é obrigatório"
}
```

---

### 2. Sincronizar Múltiplos Produtos (Lote)

**Endpoint:** `POST /api/pdv/sync-batch`

**Descrição:** Recebe múltiplos produtos de uma vez (mais eficiente).

**URL Completa:**
```
https://projeto-atual-psi.vercel.app/api/pdv/sync-batch
```

**Autenticação:**
```
Header: X-API-Key: [sua_chave_api_aqui]
```

**Corpo da Requisição (JSON):**
```json
{
  "products": [
    {
      "id": "12345",
      "title": "Tomate Italiano",
      "price": "5.99",
      "unit": "kg",
      "image": "https://exemplo.com/tomate.jpg",
      "category": "hortifruti",
      "description": "Tomate italiano fresco",
      "stock": 100,
      "barcode": "7891234567890"
    },
    {
      "id": "12346",
      "title": "Banana Prata",
      "price": "3.49",
      "unit": "kg",
      "image": "https://exemplo.com/banana.jpg",
      "category": "hortifruti",
      "description": "Banana prata doce",
      "stock": 50,
      "barcode": "7891234567891"
    }
  ]
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "10 produtos sincronizados com sucesso",
  "synced": 10,
  "failed": 0
}
```

---

## 📦 Categorias Aceitas

Use exatamente estes valores para o campo `category`:

- `hortifruti` - Hortifruti
- `acougue` - Açougue e Peixaria
- `padaria` - Padaria e Confeitaria
- `bebidas` - Bebidas e Adega
- `ofertas` - Ofertas e Promoções

---

## 🔐 Autenticação

### Como Obter API Key

1. Entre em contato conosco
2. Solicitamos credenciais
3. Fornecemos a API Key única

### Como Usar

Inclua no header de todas as requisições:

```
X-API-Key: sua_chave_api_aqui
```

### Exemplo cURL:

```bash
curl -X POST https://projeto-atual-psi.vercel.app/api/pdv/sync-product \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua_chave_api_aqui" \
  -d '{
    "id": "12345",
    "title": "Tomate Italiano",
    "price": "5.99",
    "unit": "kg",
    "category": "hortifruti"
  }'
```

---

## 📊 Formato de Dados

### Preço
- Formato: String com vírgula como separador decimal
- Exemplo: `"5.99"` ou `"10,50"`
- Não usar ponto como separador de milhar

### Estoque
- Formato: Número inteiro
- Exemplo: `100` (não `"100"`)

### Categoria
- Deve ser exatamente um dos valores listados acima
- Case-sensitive (minúsculas)

---

## ⚠️ Tratamento de Erros

### Códigos HTTP:

- `200` - Sucesso
- `400` - Dados inválidos
- `401` - Não autorizado (API Key inválida)
- `500` - Erro interno do servidor

### Exemplo de Erro:

```json
{
  "error": "Não autorizado",
  "message": "API Key inválida ou ausente"
}
```

---

## 🔄 Fluxo de Sincronização Recomendado

### Opção 1: Sincronização em Tempo Real
- Quando produto é criado/atualizado no PDV
- Enviar imediatamente para nossa API
- Usar endpoint `/sync-product`

### Opção 2: Sincronização em Lote
- A cada X minutos/horas
- Enviar todos os produtos alterados
- Usar endpoint `/sync-batch`
- Mais eficiente para grandes volumes

### Opção 3: Sincronização Inicial Completa
- Uma vez ao dia (ex: meia-noite)
- Enviar todos os produtos ativos
- Usar endpoint `/sync-batch`

---

## 📝 Exemplo de Implementação

### JavaScript/Node.js:

```javascript
const axios = require('axios');

async function syncProduct(product) {
  try {
    const response = await axios.post(
      'https://projeto-atual-psi.vercel.app/api/pdv/sync-product',
      product,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'sua_chave_api_aqui'
        }
      }
    );
    
    console.log('Produto sincronizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao sincronizar:', error.response.data);
    throw error;
  }
}

// Uso
syncProduct({
  id: "12345",
  title: "Tomate Italiano",
  price: "5.99",
  unit: "kg",
  category: "hortifruti"
});
```

### PHP:

```php
<?php
function syncProduct($product, $apiKey) {
    $url = 'https://projeto-atual-psi.vercel.app/api/pdv/sync-product';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($product));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Uso
$product = [
    'id' => '12345',
    'title' => 'Tomate Italiano',
    'price' => '5.99',
    'unit' => 'kg',
    'category' => 'hortifruti'
];

$result = syncProduct($product, 'sua_chave_api_aqui');
?>
```

---

## 🧪 Ambiente de Testes

### URL de Testes:
```
https://projeto-atual-psi.vercel.app/api/pdv/sync-product
```

### Dados de Teste:

```json
{
  "id": "TESTE001",
  "title": "Produto de Teste",
  "price": "10.00",
  "unit": "un",
  "category": "ofertas",
  "description": "Este é um produto de teste"
}
```

---

## 📞 Suporte Técnico

### Contato:
- **Email:** [seu_email@atual.com.br]
- **Telefone:** [seu_telefone]
- **Horário:** Segunda a Sexta, 9h às 18h

### Em caso de problemas:
1. Verifique a API Key
2. Verifique o formato JSON
3. Verifique os campos obrigatórios
4. Entre em contato conosco

---

## ✅ Checklist de Integração

- [ ] API Key recebida e configurada
- [ ] Teste de conexão realizado
- [ ] Formato JSON validado
- [ ] Categorias mapeadas corretamente
- [ ] Tratamento de erros implementado
- [ ] Sincronização inicial realizada
- [ ] Sincronização contínua configurada

---

## 🔄 Próximos Passos

1. **Receber API Key** - Entre em contato conosco
2. **Testar Conexão** - Use dados de teste acima
3. **Mapear Categorias** - Alinhe categorias do PDV com nossas
4. **Implementar Sincronização** - Use exemplos acima
5. **Testar em Produção** - Valide com produtos reais
6. **Monitorar** - Acompanhe logs e erros

---

**Este documento contém todas as informações técnicas necessárias para a integração!** 🚀



