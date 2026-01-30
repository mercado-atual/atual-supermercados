# 📊 Resumo: Como Funciona a Integração PDV ↔ Site

## 🎯 Objetivo

Sincronizar automaticamente produtos, preços e estoque entre o sistema PDV (loja física) e o site e-commerce.

## 🔄 Fluxo Completo

```
┌─────────────────┐
│   PDV (Loja)    │
│                 │
│ 1. Atualiza     │
│    produto      │
└────────┬────────┘
         │
         │ HTTP POST
         │ /api/pdv/sync-product
         ▼
┌─────────────────┐
│  API Backend    │
│  (Next.js)      │
│                 │
│ 2. Valida dados │
│ 3. Salva no BD  │
│ 4. Atualiza cache│
└────────┬────────┘
         │
         │ Query
         ▼
┌─────────────────┐
│ Banco de Dados  │
│ (PostgreSQL/    │
│  MongoDB)       │
└────────┬────────┘
         │
         │ API GET
         │ /api/products
         ▼
┌─────────────────┐
│   Site Web      │
│  (Frontend)     │
│                 │
│ 5. Exibe        │
│    produtos     │
│    atualizados  │
└─────────────────┘
```

## ⚡ Quando Sincronizar?

### Tempo Real (Imediato)
- ✅ Preços promocionais
- ✅ Estoque crítico (< 10 unidades)
- ✅ Produtos em oferta

### A cada 5 minutos
- ✅ Preços normais
- ✅ Estoque geral
- ✅ Novos produtos

### A cada 1 hora
- ✅ Descrições
- ✅ Categorias
- ✅ Imagens

## 🛠️ Como Implementar no PDV

### Opção 1: Trigger no Banco de Dados
Quando produto é atualizado no PDV, dispara função que chama a API:

```sql
CREATE TRIGGER sync_to_website
AFTER UPDATE ON produtos
FOR EACH ROW
BEGIN
  -- Chama API do site
  CALL sync_product_api(NEW.id, NEW.preco, NEW.estoque);
END;
```

### Opção 2: Código no PDV
Adicionar código que chama API após salvar produto:

```php
// Após salvar produto no PDV
if ($produto->save()) {
    syncToWebsite($produto);
}
```

### Opção 3: Job Agendado
Script que roda periodicamente e sincroniza mudanças:

```bash
# Cron job a cada 5 minutos
*/5 * * * * /usr/bin/php /path/to/sync-pdv-to-website.php
```

## 📋 Checklist de Implementação

- [ ] Configurar API Key no PDV
- [ ] Implementar chamada de API no PDV
- [ ] Configurar banco de dados no site
- [ ] Testar sincronização de produto individual
- [ ] Testar sincronização em lote
- [ ] Configurar cache (Redis)
- [ ] Implementar logs e monitoramento
- [ ] Configurar alertas de erro
- [ ] Testar em produção com dados reais

## 🔍 Monitoramento

Acompanhe:
- Quantidade de produtos sincronizados
- Taxa de sucesso/erro
- Tempo de resposta da API
- Produtos com erro de sincronização

## 🚨 Tratamento de Problemas

**Produto não aparece no site?**
1. Verificar se sincronização foi bem-sucedida
2. Verificar logs da API
3. Verificar cache (limpar se necessário)
4. Verificar se produto está ativo no PDV

**Preço diferente?**
1. Verificar última sincronização
2. Verificar se há promoção ativa
3. Forçar nova sincronização manual

## 💡 Próximas Melhorias

1. **WebSocket**: Atualização em tempo real sem refresh
2. **Fila de Processamento**: Para grandes volumes
3. **Dashboard Admin**: Visualizar status de sincronização
4. **Histórico de Preços**: Rastrear mudanças
5. **Sincronização Bidirecional**: Site → PDV também

