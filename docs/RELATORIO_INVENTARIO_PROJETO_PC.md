# 📋 RELATÓRIO DE INVENTÁRIO – PROJETO NO PC/CURSOR

**Data:** 29/01/2026  
**Objetivo:** Saber exatamente o que existe no seu PC (Cursor) antes de apagar o repositório no GitHub.  
**Projeto:** Atual Supermercados (Next.js 15 + React 19)

---

## ⚠️ ANTES DE APAGAR NO GITHUB

1. **Faça backup local**  
   Copie a pasta `c:\projeto_atual` para outro disco ou compacte em `.zip` se quiser uma cópia de segurança.

2. **Confirme que está tudo commitado**  
   No terminal: `git status` — se houver arquivos não commitados, faça `git add .` e `git commit -m "backup antes de limpar github"`.

3. **O que NÃO vai para o GitHub** (por causa do `.gitignore`):  
   - `node_modules/`  
   - `.next/`  
   - `.vercel/`  
   - `.env*.local`  
   - `*.tsbuildinfo`  

   Ou seja: **código-fonte, dados, imagens, docs e scripts estão no repositório**. Só dependências e builds ficam fora.

---

## 📁 ESTRUTURA COMPLETA NO SEU PC

### Raiz do projeto (`c:\projeto_atual\`)

| Item | Tipo | Descrição |
|------|------|-----------|
| `app/` | Pasta | Next.js App Router – páginas e APIs |
| `components/` | Pasta | Componentes React reutilizáveis |
| `contexts/` | Pasta | Contextos (Auth, Cart, Toast) |
| `lib/` | Pasta | Lógica, serviços, integrações |
| `types/` | Pasta | Tipos TypeScript (Produto, Promocao) |
| `data/` | Pasta | CSV/JSON de produtos |
| `public/` | Pasta | Imagens e arquivos estáticos (~4200+ arquivos) |
| `docs/` | Pasta | 37 arquivos de documentação (.md) |
| `scripts/` | Pasta | Scripts de importação/download |
| `package.json` | Arquivo | Dependências e scripts npm |
| `next.config.ts` | Arquivo | Configuração Next.js |
| `tailwind.config.ts` | Arquivo | Configuração Tailwind |
| `tsconfig.json` | Arquivo | Configuração TypeScript |
| `middleware.ts` | Arquivo | Middleware Next.js |
| `vercel.json` | Arquivo | Configuração Vercel |
| `.gitignore` | Arquivo | Arquivos ignorados pelo Git |
| `.eslintrc.json` | Arquivo | Regras ESLint |
| Vários `.py` | Arquivos | Scripts Python (ver seção Scripts) |
| Vários `.md` / `.txt` | Arquivos | Documentação e instruções na raiz |

---

## 📄 PÁGINAS (APP ROUTER) – 45+ arquivos .tsx

### Páginas públicas
- `app/page.tsx` — Home  
- `app/busca/page.tsx` — Busca  
- `app/carrinho/page.tsx` — Carrinho  
- `app/checkout/page.tsx` — Checkout  
- `app/pedido-confirmado/page.tsx` — Confirmação  
- `app/rastrear-pedido/page.tsx` — Rastreamento  
- `app/produto/[id]/page.tsx` — Detalhe do produto  

### Categorias
- `app/hortifruti/page.tsx`  
- `app/acougue/page.tsx`  
- `app/padaria/page.tsx`  
- `app/bebidas/page.tsx`  
- `app/limpeza/page.tsx`  
- `app/cdc/page.tsx`  
- `app/ofertas/page.tsx`  

### Institucional / outros
- `app/sobre/page.tsx`  
- `app/nossas-lojas/page.tsx`  
- `app/contato/page.tsx`  
- `app/ajuda/page.tsx`  
- `app/trabalhe-conosco/page.tsx`  
- `app/clube-vantagens/page.tsx`  
- `app/termos-de-uso/page.tsx`  
- `app/pagamentos/page.tsx`  
- `app/blog/page.tsx`  
- `app/blog/[slug]/page.tsx` e `not-found.tsx`  

### Auth e conta
- `app/auth/login/page.tsx`  
- `app/auth/cadastro/page.tsx`  
- `app/minha-conta/page.tsx`  
- `app/minha-conta/complete-cpf/page.tsx`  

### Admin
- `app/admin/page.tsx`  
- `app/admin/login/page.tsx`  
- `app/admin/pedidos/page.tsx`  
- `app/admin/produtos/page.tsx`  

### Outros arquivos em `app/`
- `app/layout.tsx`  
- `app/globals.css`  
- `app/not-found.tsx`  

---

## 🔌 API ROUTES – 35 arquivos .ts

- **Produtos:** `api/products/route.ts`, `api/products/[id]/route.ts`, `api/products/public/route.ts`  
- **Admin produtos:** `api/admin/products/route.ts`, `[id]/route.ts`, `count/route.ts`, `import/route.ts`  
- **Admin auth:** `api/admin/auth/login/route.ts`, `verify/route.ts`  
- **Admin:** `api/admin/login/route.ts`, `logout/route.ts`, `orders/route.ts`, `orders/[id]/route.ts`, `status/route.ts`, `sync/route.ts`  
- **Auth:** `api/auth/login/route.ts`, `register/route.ts`, `update/route.ts`  
- **Pedidos:** `api/orders/create/route.ts`, `api/orders/track/route.ts`  
- **Pagamento:** `api/payments/create/route.ts`  
- **Webhooks:** `api/webhooks/stripe/route.ts`  
- **Outros:** `api/search/route.ts`, `api/ofertas/route.ts`, `api/promocoes/route.ts`, `api/promocoes-sync/route.ts`, `api/vitrine/route.ts`, `api/items/route.ts`  
- **Imagens:** `api/images/search/route.ts`, `api/images/sync/route.ts`  
- **PDV:** `api/pdv/sync-product/route.ts`, `api/pdv/sync-batch/route.ts`  
- **Sysmo:** `api/sync/sysmo/route.ts`, `api/sysmo-diagnostico/route.ts`, `api/sysmo-test/route.ts`  

---

## 🧩 COMPONENTES (7)

- `components/AppHeader.tsx`  
- `components/Header.tsx`  
- `components/Footer.tsx`  
- `components/SearchBar.tsx`  
- `components/Toast.tsx`  
- `components/StripePayment.tsx`  
- `components/UnderConstructionBanner.tsx`  

---

## 📦 CONTEXTOS (3)

- `contexts/AuthContext.tsx`  
- `contexts/CartContext.tsx`  
- `contexts/ToastContext.tsx`  

---

## 📚 BIBLIOTECAS E SERVIÇOS (`lib/`)

- `lib/products.ts` — Catálogo principal de produtos  
- `lib/products-db.ts`  
- `lib/orders.ts`  
- `lib/db.ts`  
- `lib/sistema.ts`  
- `lib/admin-auth.ts`, `lib/adminSession.ts`  
- `lib/catalog-config.ts`  
- `lib/categorias-ofertas.ts`  
- `lib/departamentos-nav.ts`  
- `lib/posts.ts`  
- `lib/integrations/sismo/` — image-sync.helper, index, sismo.service, types, README  
- `lib/services/image-search.service.ts`  

---

## 📂 DADOS (`data/`)

- `produtos.json`  
- `produtos_db.json`  
- `produtos_lista_precos.json`  
- `produtos_atual.csv`  
- `produtos_limpos.csv`  

---

## 🖼️ ASSETS (`public/`)

- `public/produtos/` — **~2199 arquivos .jpg** (imagens de produtos)  
- `public/produtos_originais/` — várias .jpg  
- `public/adega/` — 5 imagens (entrada, whisky, vinhos, gins, prateleira)  
- `public/promocoes.json`  
- `public/README.md`  

**Total aproximado em `public/`:** mais de 4200 arquivos (a maioria .jpg).

---

## 📜 SCRIPTS

### TypeScript/Node (em `scripts/`)
- `scripts/download-images.ts`  
- `scripts/import-csv-to-products.ts`  
- `scripts/process-excel.js`  
- `scripts/download-images.log`  

### Python (raiz e scripts)
- `atualizar_site.py`  
- `autocorrect.py`  
- `corrigir_produtos.py`  
- `limpar_csv.py`  
- `padronizar_final.py`  
- `remover_fundos_ia.py`  
- `reparar_tudo.py`  
- `sherlock.py`  
- `scripts/processar-lista-precos.py`  

---

## 📖 DOCUMENTAÇÃO (`docs/` – 37 arquivos .md)

- `COMECAR_DO_ZERO_VERCEL_GIT.md`  
- `COMO_ATUALIZAR_SITE_NA_VERCEL.md`  
- `FAZER_AGORA_PARA_CORRIGIR_BUILD.md`  
- `PASSO_A_PASSO_CONTINUAR.md`  
- `DEPLOY_VERCEL.md`, `ATUALIZAR_SITE_PRODUCAO.md`  
- `INTEGRACAO_STRIPE.md`, `INTEGRACAO_PAGAMENTOS.md`  
- `INTEGRACAO_PDV.md`, `INTEGRACAO_PDV_COMUNICACAO.md`, `ESPECIFICACAO_TECNICA_PDV.md`, `ARQUITETURA_PDV.md`  
- `PAINEL_ADMINISTRATIVO.md`  
- `IMPLEMENTACAO_BANCO_AUTH.md`, `COMO_OBTER_CONNECTION_STRING.md`  
- `APP_MOBILE.md`, `ROADMAP_MOBILE.md`, `INICIAR_APP_MOBILE.md`  
- `ESTRUTURA_IMAGENS_PRODUTOS.md`, `ESTRUTURA_PROJETOS.md`  
- `RELATORIO_ALINHAMENTO_SYSMO.md`, `RELATORIO_STATUS_PROJETO.md`  
- `RESPONSIVIDADE.md`, `REVISAO_COMPLETA.md`, `RESUMO_INTEGRACAO.md`  
- E outros 15+ .md (acesso remoto, cliente, hub Sysmo, sync Sysmo, etc.)

### Na raiz
- `README.md`  
- `RELATORIO_COMPLETO_PROJETO.md` (relatório de status de 28/12/2025)  
- `CHECKLIST_INTEGRACAO_SISMO.md`  
- `DEPLOY_AGORA.md`, `IMPLEMENTAR_AGORA.md`  
- `EXEMPLO_INTEGRACAO_IMAGENS.md`, `GUIA_DETALHADO_INTEGRACAO_SISMO.md`, `GUIA_SINCRONIZACAO_IMAGENS.md`  
- `FAZER_DEPLOY.txt`, `LINK_DO_SITE.txt`, `vercel-config.txt`  
- `site.info.json`  
- `api-workbench.http`  
- `cursor-auto.ps1`, `install-python.ps1`  
- `lista_precos_sysmo.csv`  

---

## 📊 CONTAGEM RESUMIDA

| Categoria | Quantidade |
|-----------|------------|
| Páginas (.tsx em app/) | 45+ |
| API routes (.ts) | 35 |
| Componentes | 7 |
| Contextos | 3 |
| Arquivos .ts em lib/types/ etc. | 59 .ts no projeto |
| Documentos .md (docs/ + raiz) | 37 em docs + vários na raiz |
| Scripts Python | 9 |
| Scripts TS/JS (scripts/) | 3 + 1 .js |
| Dados (data/) | 5 arquivos |
| Imagens (public/) | 4200+ arquivos |
| Types | 2 (Produto, Promocao) |

---

## ✅ O QUE ESTÁ “PRONTO” NO PC/CURSOR

- **Frontend:** páginas, categorias, carrinho, checkout, auth, admin, blog, institucional.  
- **APIs:** produtos, admin, auth, pedidos, pagamentos (Stripe), imagens, PDV, Sysmo.  
- **Estado:** Auth, Carrinho e Toast com contextos.  
- **Dados:** produtos em `lib/products.ts` + JSON/CSV em `data/` + imagens em `public/`.  
- **Integrações:** estrutura Sismo, Stripe (webhook), PDV.  
- **Deploy:** `vercel.json` e docs de Vercel/Git.  
- **Documentação:** grande quantidade de .md para deploy, integração, PDV, mobile, etc.  

Ou seja: **o projeto está completo no PC para desenvolvimento e deploy**. O que você apagar no GitHub não apaga nada da pasta `c:\projeto_atual`; só remove o repositório remoto. Depois você pode criar um novo repositório e dar push de novo a partir dessa pasta.

---

## 🗑️ APÓS APAGAR NO GITHUB

- O código continua em `c:\projeto_atual`.  
- Para subir de novo: criar novo repositório no GitHub e, na pasta do projeto, algo como:  
  `git remote remove origin` (se ainda apontar para o antigo)  
  `git remote add origin https://github.com/SEU_USUARIO/NOVO_REPO.git`  
  `git push -u origin main`  

Se quiser, no próximo passo podemos revisar juntos o que você quer manter no novo repo (por exemplo, se quer ou não subir as milhares de imagens de `public/`).

---

**Relatório de inventário gerado em:** 29/01/2026  
**Pasta do projeto:** `c:\projeto_atual`
