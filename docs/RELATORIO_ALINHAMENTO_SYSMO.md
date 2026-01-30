# 📊 RELATÓRIO DE ALINHAMENTO COM SYSMO
**Data:** 17/01/2026  
**Status:** ⚠️ **NÃO ALINHADO**

---

## 🔍 DIAGNÓSTICO ATUAL

### ❌ PROBLEMA IDENTIFICADO

O site **NÃO está sincronizado** com o Sysmo. Os produtos e preços exibidos nas páginas são **dados estáticos** (hardcoded), não vêm do Sysmo.

---

## 📋 SITUAÇÃO ATUAL

### 1. **Páginas de Categorias** (❌ NÃO usa Sysmo)
- `/ofertas` → Usa `lib/products.ts` (dados estáticos)
- `/acougue` → Usa `lib/products.ts` (dados estáticos)
- `/hortifruti` → Usa `lib/products.ts` (dados estáticos)
- `/padaria` → Usa `lib/products.ts` (dados estáticos)
- `/bebidas` → Usa `lib/products.ts` (dados estáticos)

**Código usado:**
```typescript
import { getProductsByCategory } from "@/lib/products";
const products = getProductsByCategory("ofertas"); // Dados estáticos!
```

### 2. **API `/api/vitrine`** (✅ Tenta usar Sysmo, mas...)
- ✅ Tenta buscar do Sysmo primeiro (`fetchSistemaProdutos`)
- ⚠️ Se falhar, usa fallback para `data/produtos.json`
- ❌ **NÃO é usada pelas páginas de categorias**

### 3. **API `/api/products`** (❌ NÃO usa Sysmo)
- Busca de `data/produtos_db.json` (arquivo local)
- Usado por algumas APIs, mas não pelas páginas principais

### 4. **API `/api/promocoes`** (❌ NÃO usa Sysmo)
- Lê de `public/promocoes.json` (arquivo estático)
- Não busca promoções do Sysmo

---

## 🎯 O QUE PRECISA SER FEITO

### PRIORIDADE ALTA 🔴

1. **Atualizar páginas de categorias para usar API do Sysmo**
   - Modificar `/ofertas`, `/acougue`, `/hortifruti`, `/padaria`, `/bebidas`
   - Fazer fetch de `/api/vitrine` ou criar nova API que busca do Sysmo
   - Remover dependência de `lib/products.ts` (dados estáticos)

2. **Criar processo de sincronização automática**
   - Sincronizar produtos do Sysmo para `data/produtos_db.json`
   - Atualizar preços automaticamente
   - Executar periodicamente (via botão admin ou cron)

3. **Integrar promoções do Sysmo**
   - Buscar promoções do Sysmo (se houver endpoint)
   - Atualizar `public/promocoes.json` ou criar API dinâmica

### PRIORIDADE MÉDIA 🟡

4. **Implementar cache inteligente**
   - Cachear produtos do Sysmo por X minutos
   - Atualizar em background
   - Garantir que preços estejam sempre atualizados

5. **Adicionar indicador de última atualização**
   - Mostrar quando os dados foram sincronizados pela última vez
   - Alertar se dados estão desatualizados

---

## 🔧 SOLUÇÃO PROPOSTA

### Opção 1: Buscar Direto do Sysmo (Recomendado)
- Páginas fazem fetch de `/api/vitrine` (que busca do Sysmo)
- Cache no servidor (Next.js)
- Atualização automática a cada X minutos

### Opção 2: Sincronização Periódica
- Script/API que sincroniza Sysmo → `data/produtos_db.json`
- Páginas continuam usando dados locais (mais rápido)
- Sincronização via botão admin ou cron job

### Opção 3: Híbrida (Melhor)
- Buscar do Sysmo em tempo real
- Cache local para performance
- Sincronização periódica em background

---

## 📝 CHECKLIST DE ALINHAMENTO

- [ ] Páginas de categorias usando dados do Sysmo
- [ ] Preços atualizados automaticamente
- [ ] Produtos sincronizados com Sysmo
- [ ] Promoções vindo do Sysmo (se disponível)
- [ ] Processo de sincronização implementado
- [ ] Testes de integração funcionando
- [ ] Indicador de última atualização visível

---

## ⚠️ RISCOS ATUAIS

1. **Preços desatualizados** - Clientes podem ver preços errados
2. **Produtos faltando** - Novos produtos do Sysmo não aparecem no site
3. **Estoque incorreto** - Estoque pode estar desatualizado
4. **Promoções não sincronizadas** - Promoções do Sysmo não aparecem

---

## 🚀 PRÓXIMOS PASSOS

1. Testar integração atual com Sysmo (`/api/sysmo-test`)
2. Atualizar páginas para usar dados do Sysmo
3. Implementar sincronização automática
4. Testar e validar preços e produtos

---

**Status:** 🔴 **AÇÃO NECESSÁRIA - SITE NÃO ESTÁ ALINHADO COM SYSMO**
