# Depois do upgrade para Vercel Pro

Quando você fizer o upgrade para **Vercel Pro**, faça o seguinte.

---

## 1. Reativar o cron do Sysmo (a cada 30 minutos)

No plano **Hobby** tivemos que deixar o cron rodando **1 vez por dia** (6h UTC). No **Pro** você pode voltar a rodar **a cada 30 minutos**.

**O que fazer:**

1. Abra o arquivo **`vercel.json`** na raiz do projeto.
2. Troque a linha do `schedule` de:
   ```json
   "schedule": "0 6 * * *"
   ```
   para:
   ```json
   "schedule": "*/30 * * * *"
   ```
3. Salve o arquivo.
4. Envie para o repositório (commit + push no `master`). A Vercel vai fazer um novo deploy e o cron passará a rodar a cada 30 min.

Assim a sincronização dos produtos com o Sysmo volta a ser automática a cada 30 minutos.

---

## 2. (Opcional) Conferir no dashboard da Vercel

Depois do upgrade:

- **Settings** → **Cron Jobs**: conferir se o cron está listado e com a expressão `*/30 * * * *`.
- **Usage**: ver limites e uso (Pro tem mais recursos).

---

## Resumo

| Antes (Hobby)     | Depois (Pro)        |
|-------------------|---------------------|
| Cron 1x por dia   | Cron a cada 30 min  |
| Limite de cron    | Cron ilimitado      |

Só precisa alterar o `vercel.json` e dar push. O resto a Vercel ajusta no upgrade.
