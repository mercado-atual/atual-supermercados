# Erro 404 ao abrir o site ou o admin – como resolver

Quando **projeto-atual-psi.vercel.app** (ou /admin, /admin/scanner) dá **404 – DEPLOYMENT_NOT_FOUND**, o domínio não está apontando para um deploy ativo. Siga os passos abaixo.

---

## 1. Descobrir a URL que funciona

O código está no repositório **mercado-atual/atual-supermercados**. O deploy só aparece na URL do **projeto da Vercel** que está conectado a esse repositório.

1. Acesse **https://vercel.com** e faça login.
2. Na lista de projetos, abra o que for o do site (ex.: **atual-supermercados**).
3. Vá em **Configurações** → **Git** e confira se está conectado a **mercado-atual/atual-supermercados**.
4. Vá em **Implantações** (Deployments). Abra o deploy mais recente com status **Ready** (verde).
5. Clique em **Visit** (ou no domínio que aparecer). Essa é a **URL que está no ar**.

Use sempre essa URL, por exemplo:
- Site: `https://[SUA-URL-AQUI].vercel.app`
- Admin login: `https://[SUA-URL-AQUI].vercel.app/admin/login`
- Scanner: `https://[SUA-URL-AQUI].vercel.app/admin/scanner`

---

## 2. Testar a URL alternativa (se você tem dois projetos)

Se na Vercel existir o projeto **atual-supermercados** (em canalvideosadrenalina-uis-projects), a URL costuma ser:

- **https://atual-supermercados.vercel.app**

Teste no navegador:
- **https://atual-supermercados.vercel.app**
- **https://atual-supermercados.vercel.app/admin/login**
- **https://atual-supermercados.vercel.app/admin/scanner**

Se abrir (sem 404), use essa URL daqui pra frente.

---

## 3. Fazer projeto-atual-psi.vercel.app funcionar (opcional)

Se você **precisa** usar o domínio **projeto-atual-psi.vercel.app**:

1. Na Vercel, abra o projeto que tem esse domínio (pode ter outro nome, ex. "projeto-atual-psi").
2. Vá em **Configurações** → **Git**.
3. Conecte o repositório **mercado-atual/atual-supermercados** (ou reconecte, se já estiver errado).
4. Salve e faça um **Redeploy** em **Implantações** (⋯ no último deploy → Redeploy).
5. Espere o status ficar **Ready** e teste de novo **projeto-atual-psi.vercel.app**.

---

## 4. Resumo

| Situação | O que fazer |
|----------|-------------|
| 404 em projeto-atual-psi.vercel.app | Usar a URL do projeto que está conectado ao repo (passo 1) ou testar atual-supermercados.vercel.app (passo 2). |
| Quer que projeto-atual-psi funcione | Conectar esse projeto ao repo mercado-atual/atual-supermercados e fazer Redeploy (passo 3). |
| Admin / Scanner não abre | Usar a **mesma** URL que abre a home, só mudando o caminho: `/admin/login` e `/admin/scanner`. |

Depois de descobrir a URL que abre (passo 1 ou 2), use sempre ela para o site e para o admin.
