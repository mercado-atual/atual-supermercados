# Colocar a versão nova no ar (Header Carrefour etc.)

O site está mostrando um deploy **antigo** ("corrige total do carrinho no checkout PIX").  
A versão com **Header Carrefour, busca, limpeza** já foi enviada para o GitHub (commit 216dd66), mas precisa ser a que está em produção.

---

## O que fazer na Vercel

### 1. Abrir a lista de Deployments

- Acesse **https://vercel.com** → projeto **projeto-atual** → aba **Deployments**.

### 2. Procurar o deploy do commit certo

- Role a lista e procure um deploy cuja **mensagem de commit** seja:
  - **"Header Carrefour, busca, limpeza, Sysmo sync, correções build e docs"**
- Ou um que mostre o **commit** **216dd66**.

**Cenário A – Esse deploy existe e está "Ready" (verde)**  
- Clique nos **três pontinhos (⋯)** ao lado desse deploy.  
- Clique em **"Promote to Production"** (ou "Promover para Produção" / "Assign to Production").  
- Confirme. Em pouco tempo esse deploy vira o **Current** e o site passa a mostrar o header novo, busca, limpeza etc.

**Cenário B – Esse deploy existe mas está "Error" (vermelho)**  
- Clique nesse deploy e abra **Build Logs** (ou "Registros de compilação").  
- Copie a **mensagem de erro** (principalmente o final) e envie para corrigirmos o build.

**Cenário C – Não existe nenhum deploy com "Header Carrefour" ou 216dd66**  
- Pode ser que o deploy ainda não tenha rodado ou que a Vercel esteja buildando outro branch.  
- Em **Deployments**, clique em **"Redeploy"** (ou "Implantar novamente") no deploy que está como **Current** e, na hora de escolher, use o branch **master** e o commit mais recente (216dd66), se a Vercel permitir.  
- Ou: em **Settings** → **Git**, confira se o **Production Branch** é **master**. Se for, um novo push em master pode disparar um novo deploy; nesse caso podemos fazer um push vazio (ex.: alterar um comentário e dar push de novo) para forçar um novo build.

---

## Resumo

| O que você vê na lista | O que fazer |
|------------------------|-------------|
| Deploy "Header Carrefour..." **Ready** | **Promote to Production** (⋯ → Promote to Production) |
| Deploy "Header Carrefour..." **Error** | Abrir Build Logs, copiar erro e enviar |
| Nenhum deploy "Header Carrefour..." | Conferir branch de produção e/ou forçar novo deploy (Redeploy ou novo push) |

Depois de **Promote to Production** no deploy certo, espere 1–2 minutos e abra **atualmercado.com.br** de novo (de preferência com **Ctrl+F5** para limpar cache).
