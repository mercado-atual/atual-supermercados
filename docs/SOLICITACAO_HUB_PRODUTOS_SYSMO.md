# Solicitação de Liberação - HubProdutos Sysmo Integrador

**Data:** 17/01/2026  
**Cliente:** Atual Supermercados  
**Ambiente:** Produção/Teste (especificar)

---

## Situação Atual

### Autenticação
✅ **Funcionando corretamente**
- URL base: `{SISTEMA_API_URL}`
- Usuário: `{SISTEMA_API_USER}`
- Senha: `{SISTEMA_API_PASS}`
- Método: Basic Auth

### Problema Identificado
❌ **Todos os endpoints de HubProdutos retornam HTTP 404**

### Endpoints Testados (todos retornaram 404):
1. `/sysmo-integrador-api/hub/produtos`
2. `/sysmo-integrador-api/v1/hub/produtos`
3. `/sysmo-integrador-api/v1/hub/Produtos`
4. `/v1/hub/produtos`
5. `/v1/hub/Produtos`
6. `/hub/produtos`
7. `/hub/Produtos`

---

## Solicitações

### 1. Confirmação de Status
- [ ] O HubProdutos está ativo/habilitado para o cliente **Atual Supermercados**?
- [ ] Em qual ambiente (produção/teste) está disponível?

### 2. Liberação/Publicação
- [ ] Caso não esteja ativo, solicito a **liberação/publicação do HubProdutos** para este cliente
- [ ] Prazo estimado para liberação?

### 3. Endpoint Alternativo
- [ ] Caso HubProdutos não esteja disponível, qual **Hub equivalente** devo usar para buscar produtos?
- [ ] Qual a URL correta do endpoint de produtos?

---

## Informações Técnicas

### Requisição de Teste
```http
GET {SISTEMA_API_URL}/v1/hub/Produtos
Authorization: Basic {base64(user:pass)}
Accept: application/json
```

### Resposta Esperada
```json
[
  {
    "codigo": "...",
    "nome": "...",
    "preco": 0.00,
    ...
  }
]
```

### Resposta Atual (404)
```json
{
  "status": 404,
  "erro": "Not Found"
}
```

---

## Contato

**Cliente:** Atual Supermercados  
**Responsável Técnico:** [Seu Nome]  
**Email:** [Seu Email]  
**Telefone:** [Seu Telefone]

---

**Aguardando retorno para prosseguir com a integração.**
