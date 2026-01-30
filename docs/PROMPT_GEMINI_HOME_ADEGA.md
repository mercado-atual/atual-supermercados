# 📤 PROMPT PARA GEMINI — CORRIGIR HOME ADEGA

**Copie e cole este prompt completo no Gemini.**

---

## Contexto: Você está assumindo um projeto Next.js que já está rodando, mas a home da Adega está quebrada visualmente. Leia com atenção antes de gerar código.

### 🔹 CONTEXTO DO PROJETO

Estou desenvolvendo o site Atual Supermercados em Next.js (App Router).

**Objetivo atual:**
- Reformular a HOME
- Começar destacando a ADEGA da loja
- Usar FOTOS REAIS DA ADEGA (já existentes no projeto)

### 🔹 ESTRUTURA DE PASTAS (CONFIRMADA)

As imagens já estão no projeto, exatamente aqui:

```
/public/adega
```

**Arquivos existentes e válidos (com extensão dupla):**
- `01_entrada.jpg.jpg`
- `02_whisky.jpg.jpg`
- `03_vinhos.jpg.jpg`
- `04_gins.jpg.jpg`
- `05_prateleira.jpg.jpg`

⚠️ **Não inventar imagens, paths ou placeholders**

### 🔹 PROBLEMA REAL (IMPORTANTE)

O hero da HOME NÃO EXIBE A IMAGEM quando usamos `next/image`.

**👉 DECISÃO TÉCNICA DEFINITIVA:**

❌ **NÃO usar `next/image` para background**

✅ **USAR CSS `background-image` direto**

Exemplo esperado:
```tsx
style={{
  backgroundImage: "url('/adega/03_vinhos.jpg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
}}
```

### 🔹 ESTADO ATUAL

- Projeto roda em: `http://localhost:3000`
- Arquivo a ser modificado: `app/page.tsx`
- O código atual do hero está inutilizável
- Precisa ser substituído por completo

### 🔹 O QUE VOCÊ (GEMINI) DEVE FAZER

**Gerar TODO o código completo de `app/page.tsx`**

1. **Criar um HERO com foto real da adega como fundo (CSS background)**
   - Imagem: `/adega/03_vinhos.jpg.jpg`
   - Texto centralizado:
     - **"ADEGA ATUAL SUPERMERCADOS"**
     - "Qualidade e variedade para quem aprecia bons momentos."
     - "Beba com moderação. Venda proibida para menores de 18 anos."
   - Overlay escuro leve (30-40%)
   - Layout bonito, institucional, limpo

2. **Logo abaixo do hero, criar "Destaques da Adega" com 4 cards:**
   - Whiskys → `/adega/02_whisky.jpg.jpg`
   - Vinhos → `/adega/03_vinhos.jpg.jpg`
   - Gins → `/adega/04_gins.jpg.jpg`
   - Variedade → `/adega/05_prateleira.jpg.jpg`
   - Cards também devem usar CSS `background-image`, não `<Image />`

### 🔹 REGRAS OBRIGATÓRIAS

- ❌ NÃO usar `next/image` para background
- ❌ NÃO responder com explicação longa
- ✅ ENTREGAR APENAS O CÓDIGO FINAL COMPLETO
- ✅ Código deve funcionar imediatamente após colar

### 🔹 RESULTADO ESPERADO

- A HOME deve abrir com a foto real da adega como fundo
- Texto legível, bonito, sem fundo cinza/preto chapado
- Cards com imagens reais funcionando

---

**FIM DO PROMPT**
