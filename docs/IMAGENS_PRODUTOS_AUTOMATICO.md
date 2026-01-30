# Imagens de produtos em escala (automático)

Para 16 mil itens, procurar foto manualmente não é viável. Abaixo estão opções **automáticas** por código de barras (EAN/GTIN).

---

## 1. Open Food Facts (já no projeto – gratuito)

- **O que é:** base aberta com milhões de produtos (principalmente alimentos). API gratuita, sem limite rígido de chamadas; pede-se só uso educado (ex.: 1 requisição a cada 0,5–1 s).
- **Como funciona:** você envia o GTIN (código de barras) e recebe dados do produto, incluindo URL da imagem da frente.
- **No seu projeto:**
  - **Script por CSV:** `npm run download-images` usa `data/produtos_atual.csv` e baixa imagens em `public/produtos/{codigo}.jpg`.
  - **Script por JSON (16k itens):** use o script que lê direto do `data/produtos_db.json`:
    ```bash
    npx tsx scripts/download-images-from-db.ts
    ```
    Para gravar no `produtos_db.json` o campo `imagem` quando encontrar foto (recomendado):
    ```bash
    set UPDATE_DB=1
    npx tsx scripts/download-images-from-db.ts
    ```
    (No PowerShell: `$env:UPDATE_DB="1"; npx tsx scripts/download-images-from-db.ts`)
  - O front já usa fallback: se não houver `imagem` no produto, tenta `/produtos/{id}.jpg` e `/fotos-produtos/{gtin}.jpg`; se não achar, mostra ícone da categoria.
- **Tempo estimado (16k itens):** com ~0,5 s por requisição, ~2–2,5 horas. Pode rodar em segundo plano (no PC ou em um job).
- **Cobertura:** muitos alimentos e bebidas estão no Open Food Facts; itens de limpeza/higiene às vezes também. O que não existir na base simplesmente não terá foto automática (e o site mostra o placeholder por categoria).

**Referência:** [Open Food Facts – API](https://world.openfoodfacts.org/data) e [como obter imagens](https://github.com/openfoodfacts/openfoodfacts-server/blob/main/docs/api/how-to-download-images.md).

---

## 2. EAN-DB (pago após cota gratuita)

- **O que é:** base comercial com ~69 milhões de produtos; ~39% têm imagem.
- **Grátis:** 250 consultas após cadastro.
- **Em escala:** plano pago (ex.: €0,005 por código para bulk). Para 16k itens, sai um valor fixo por mês/uso.
- **Uso:** você chama a API com o EAN e recebe dados + URL da imagem; aí pode baixar e salvar em `public/produtos/{codigo}.jpg` ou `public/fotos-produtos/{gtin}.jpg` com um script parecido com o do Open Food Facts.

---

## 3. Outras opções (resumo)

| Fonte              | Custo        | Escala     | Observação                          |
|--------------------|-------------|------------|-------------------------------------|
| Open Food Facts    | Grátis      | Alta       | Já integrado no projeto (scripts)   |
| EAN-DB             | 250 grátis, depois pago | Alta | Bom para não-alimentos              |
| Barcode Lookup API | Depende do plano | Alta | API REST, retorna imagens           |
| Baixar dump OFF    | Grátis      | Massivo    | CSV/JSON + imagens no AWS; cruzar por GTIN no seu lado |

Para a maioria dos supermercados (alimentos + bebidas + parte de higiene), **Open Food Facts + o script por `produtos_db.json`** costuma cobrir uma boa parte dos 16k itens de forma automática; o resto continua com ícone por categoria até você ter foto real ou outra API.

---

## 4. O que fazer na prática

1. **Rodar o script por JSON (recomendado):**
   ```bash
   npx tsx scripts/download-images-from-db.ts
   ```
   - Lê `data/produtos_db.json`.
   - Para cada produto com GTIN e sem imagem (ou sem arquivo em `public/produtos`), consulta o Open Food Facts e baixa em `public/produtos/{codigo}.jpg`.
   - Pode atualizar o JSON com `imagem: "/produtos/{codigo}.jpg"` quando baixar, para não repetir trabalho.

2. **Manter fallback no site:** já está no `ProductImage`: tenta `imagem` → `/fotos-produtos/{gtin}.jpg` → `/produtos/{id}.jpg` → ícone da categoria. Nada de foto aleatória.

3. **Se quiser mais cobertura:** para itens que não existem no Open Food Facts, você pode contratar EAN-DB (ou similar) e adicionar um segundo script que, para GTINs ainda sem arquivo, chame essa API e baixe em `public/produtos/{codigo}.jpg` ou `public/fotos-produtos/{gtin}.jpg`.

Resumindo: **sim, dá para automatizar** – o meio mais simples e gratuito é o Open Food Facts com o script que lê o `produtos_db.json`; para 16k fotos, o gargalo é tempo de rede (~2–3 h), não falta de ferramenta.
