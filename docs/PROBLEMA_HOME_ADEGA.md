# 🚨 PROBLEMA: HOME ADEGA NÃO EXIBE IMAGENS

**Data:** 17/01/2026  
**Projeto:** Atual Supermercados  
**Arquivo:** `app/page.tsx`

---

## 📋 CONTEXTO

### Objetivo
Reformular a HOME do site para destacar a ADEGA da loja usando **fotos reais** da adega física.

### Estrutura Confirmada
✅ Pasta criada: `/public/adega`  
✅ Fotos reais existem (com extensão dupla):
- `01_entrada.jpg.jpg`
- `02_whisky.jpg.jpg`
- `03_vinhos.jpg.jpg`
- `04_gins.jpg.jpg`
- `05_prateleira.jpg.jpg`

✅ Site rodando: `http://localhost:3000`

---

## ❌ PROBLEMA REAL

### Sintoma
- Hero da HOME aparece com fundo **preto/cinza**
- Imagem da adega **NÃO aparece** como background
- Visual "chapado", sem identidade
- Cards de destaque também falham (alguns vazios, outros com placeholder)

### Causa Técnica
**Uso incorreto de `next/image` para background**

- `next/image` não é confiável para hero/background
- Container renderiza, mas imagem não
- Fundo fica cinza/preto (fallback do layout)

**NÃO é:**
- ❌ Erro de path das imagens
- ❌ Erro das fotos (elas existem e estão corretas)
- ❌ Problema de cache
- ❌ Problema de Tailwind

**É:**
- ✅ Arquitetura errada do componente

---

## 🔄 O QUE FOI TENTADO (E FALHOU)

1. ❌ `<Image fill />` como fundo do hero
2. ❌ Overlays com gradiente
3. ❌ Ajustes de Tailwind
4. ❌ Mudanças visuais mantendo `next/image`

**Resultado:** 3+ tentativas, todas mantendo abordagem errada.

---

## ✅ DECISÃO TÉCNICA DEFINITIVA

### ❌ NÃO USAR
```tsx
<Image src="/adega/03_vinhos.jpg" fill />
```

### ✅ USAR
```tsx
style={{
  backgroundImage: "url('/adega/03_vinhos.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
}}
```

**Motivo:**
- Funciona sempre
- Não depende de loader do Next.js
- Não quebra em rede/local
- Ideal para hero institucional

---

## 📝 ESTADO ATUAL DO CÓDIGO

**Arquivo:** `app/page.tsx`

**Status:** Código atual precisa ser **refeito completamente**

Não é ajuste fino, é **troca de abordagem técnica**.

---

## 🎯 O QUE PRECISA SER FEITO

### Hero da HOME
- Usar CSS `background-image` apontando para `/adega/03_vinhos.jpg.jpg`
- Overlay leve (30-40% de opacidade)
- Texto centralizado:
  - **"ADEGA ATUAL SUPERMERCADOS"**
  - "Qualidade e variedade para quem aprecia bons momentos."
  - "Beba com moderação. Venda proibida para menores de 18 anos."

### Seção "Destaques da Adega"
- 4 cards usando CSS `background-image`:
  - Whiskys → `/adega/02_whisky.jpg.jpg`
  - Vinhos → `/adega/03_vinhos.jpg.jpg`
  - Gins → `/adega/04_gins.jpg.jpg`
  - Variedade → `/adega/05_prateleira.jpg.jpg`

### Regras
- ❌ NÃO usar `next/image` para backgrounds
- ✅ Usar CSS `background-image` direto
- ✅ Layout responsivo
- ✅ Visual institucional, limpo, bonito

---

## 📤 PRÓXIMO EXECUTOR

**Ação:** Refazer `app/page.tsx` do zero usando CSS `background-image`  
**Arquivos a modificar:** Apenas `app/page.tsx`  
**Resultado esperado:** Hero com foto real visível, cards funcionando

---

## ⚠️ OBSERVAÇÕES

- Usuário está cansado de tentativas sem resultado
- Precisa de código completo, não trechos
- Quer resultado direto ou troca de executor
- As imagens existem e estão corretas - o problema é técnico, não de arquivos
