# Sincronização Sysmo a cada 30 minutos

## Visão geral

- **Rota:** `GET` ou `POST` `/api/sync/sysmo`
- **Cron (Vercel):** execução a cada 30 minutos (`*/30 * * * *`)
- **Efeito:** busca todos os produtos do Sysmo (HubProdutos), normaliza (incluindo marca e imagem) e persiste em `data/produtos_db.json`. Atualiza `data/last_sync_sysmo.json` com a data da última sincronização.

## O que é atualizado

- Inclusão de novos itens no catálogo
- Alteração de preços (promoção ou não)
- Estoque
- Marca (extraída da descrição quando não vier separada)
- Caminho da imagem (código + marca)

## Vitrine de ofertas

- **Rota:** `GET /api/ofertas`
- **Fonte:** `data/produtos_db.json` (dados do último sync)
- **Organização:** produtos agrupados em blocos por gênero, sem misturar alimentos com limpeza/higiene:
  1. **Cesta Básica** – arroz, feijão, óleo, açúcar, macarrão, farinha, café, leite etc.
  2. **Alimentos** – carnes, laticínios, conservas, temperos, frutas, verduras, pães, doces etc.
  3. **Bebidas** – refrigerantes, sucos, água, cerveja, café etc.
  4. **Limpeza e Casa** – sabão, detergente, desinfetante, alvejante etc.
  5. **Higiene e Beleza** – shampoo, sabonete, papel higiênico, fraldas etc.
  6. **Outros** – itens que não se encaixam nos blocos acima

## Marca dos produtos

- Sempre exibida na vitrine e na página do produto.
- Se não houver marca: exibe "—".
- A marca é obtida do Sysmo (campo separado) ou extraída da descrição (lista de marcas conhecidas em `lib/sistema.ts` e `lib/categorias-ofertas.ts`).

## Admin

- Em `/admin` há o botão **"Sincronizar Sysmo agora"**, que chama `GET /api/sync/sysmo` manualmente.
- A última sincronização é exibida na própria página e na vitrine de ofertas.

## Variáveis de ambiente

- `SISTEMA_API_URL` – base da API Sysmo
- `SISTEMA_API_USER` – usuário (Basic Auth)
- `SISTEMA_API_PASS` – senha (Basic Auth)

## Arquivos principais

- `app/api/sync/sysmo/route.ts` – sync Sysmo → `produtos_db.json`
- `app/api/ofertas/route.ts` – ofertas agrupadas por bloco
- `lib/categorias-ofertas.ts` – classificação por bloco/gênero
- `vercel.json` – cron `*/30 * * * *` para `/api/sync/sysmo`
