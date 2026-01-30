# Guia de Integração PDV → Site

## 🔑 Autenticação

Todas as requisições do PDV devem incluir o header de autenticação:

```http
X-PDV-API-Key: sua-chave-api-aqui
```

## 📡 Endpoints Disponíveis

### 1. Sincronizar Produto Individual

**POST** `/api/pdv/sync-product`

Atualiza ou cria um produto no sistema.

**Request:**
```json
{
  "pdvId": "PROD-001",
  "title": "Tomate Italiano",
  "price": 5.99,
  "stock": 150,
  "category": "hortifruti",
  "unit": "kg",
  "image": "https://exemplo.com/tomate.jpg",
  "description": "Tomate fresco e saboroso",
  "badge": "Oferta",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Produto sincronizado com sucesso",
  "productId": "PROD-001",
  "syncedAt": "2024-01-15T10:30:15Z"
}
```

### 2. Sincronização em Lote

**POST** `/api/pdv/sync-batch`

Sincroniza múltiplos produtos de uma vez (até 1000 por requisição).

**Request:**
```json
{
  "products": [
    {
      "pdvId": "PROD-001",
      "title": "Tomate",
      "price": 5.99,
      "stock": 150,
      "category": "hortifruti",
      "unit": "kg"
    },
    {
      "pdvId": "PROD-002",
      "title": "Banana",
      "price": 3.49,
      "stock": 200,
      "category": "hortifruti",
      "unit": "kg"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "total": 2,
    "success": 2,
    "errors": 0,
    "errorsList": []
  },
  "syncedAt": "2024-01-15T10:30:15Z"
}
```

### 3. Consultar Status de Sincronização

**GET** `/api/pdv/sync-product?pdvId=PROD-001`

Verifica quando foi a última sincronização de um produto.

**Response:**
```json
{
  "pdvId": "PROD-001",
  "lastSync": "2024-01-15T10:30:15Z",
  "status": "synced"
}
```

## 🔄 Exemplo de Integração (PHP/PDV)

```php
<?php
// Exemplo de código para o PDV enviar atualização

function syncProductToWebsite($product) {
    $apiUrl = 'https://seusite.com/api/pdv/sync-product';
    $apiKey = 'sua-chave-api';
    
    $data = [
        'pdvId' => $product['codigo'],
        'title' => $product['nome'],
        'price' => $product['preco'],
        'stock' => $product['estoque'],
        'category' => $product['categoria'],
        'unit' => $product['unidade'],
        'updatedAt' => date('c')
    ];
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-PDV-API-Key: ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "Produto sincronizado com sucesso!\n";
    } else {
        echo "Erro na sincronização: " . $response . "\n";
    }
}

// Chamar quando produto for atualizado no PDV
syncProductToWebsite([
    'codigo' => 'PROD-001',
    'nome' => 'Tomate Italiano',
    'preco' => 5.99,
    'estoque' => 150,
    'categoria' => 'hortifruti',
    'unidade' => 'kg'
]);
?>
```

## 🔄 Exemplo de Integração (Python/PDV)

```python
import requests
import json
from datetime import datetime

def sync_product_to_website(product):
    api_url = 'https://seusite.com/api/pdv/sync-product'
    api_key = 'sua-chave-api'
    
    data = {
        'pdvId': product['codigo'],
        'title': product['nome'],
        'price': product['preco'],
        'stock': product['estoque'],
        'category': product['categoria'],
        'unit': product['unidade'],
        'updatedAt': datetime.now().isoformat()
    }
    
    headers = {
        'Content-Type': 'application/json',
        'X-PDV-API-Key': api_key
    }
    
    response = requests.post(api_url, json=data, headers=headers)
    
    if response.status_code == 200:
        print("Produto sincronizado com sucesso!")
    else:
        print(f"Erro: {response.text}")

# Usar quando produto for atualizado
sync_product_to_website({
    'codigo': 'PROD-001',
    'nome': 'Tomate Italiano',
    'preco': 5.99,
    'estoque': 150,
    'categoria': 'hortifruti',
    'unidade': 'kg'
})
```

## ⚙️ Configuração

1. **Definir API Key**: Configure a variável de ambiente `PDV_API_KEY`
2. **Configurar Banco de Dados**: Conecte seu banco de dados preferido
3. **Configurar Cache**: Configure Redis para cache de produtos
4. **Monitoramento**: Configure logs e alertas

## 📊 Monitoramento

Todas as sincronizações são logadas. Você pode monitorar:
- Taxa de sucesso/erro
- Tempo de resposta
- Produtos sincronizados por hora
- Erros de validação

## 🚨 Tratamento de Erros

O sistema retorna códigos HTTP apropriados:
- `200`: Sucesso
- `400`: Dados inválidos
- `401`: Não autorizado (API Key inválida)
- `500`: Erro interno do servidor

## 🔒 Segurança

- Use HTTPS sempre
- Mantenha a API Key segura
- Implemente rate limiting
- Valide todos os dados recebidos
- Use logs para auditoria

