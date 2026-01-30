# Começar do zero: novo Git + novo Vercel

Este guia leva você a criar um **novo repositório no GitHub** e um **novo projeto na Vercel**, usando o código que está na pasta `c:\projeto_atual`. No final, o site sobe do zero, sem depender do projeto antigo.

---

## Visão geral

1. Criar um **novo repositório** no GitHub (vazio).
2. No seu PC, **enviar o código atual** para esse repositório novo.
3. Na Vercel, criar um **novo projeto** importando esse repositório.
4. (Opcional) Apontar o domínio **atualmercado.com.br** para o novo projeto.

---

## Parte 1: Novo repositório no GitHub

1. Acesse **https://github.com** e faça login.
2. Clique no **+** no canto superior direito → **New repository**.
3. Preencha:
   - **Repository name:** por exemplo `atual-supermercado` ou `projeto-atual-novo`.
   - **Description:** (opcional) Site Atual Supermercados.
   - Deixe **Public**.
   - **Não** marque "Add a README file", "Add .gitignore" nem "Choose a license" (repositório vazio).
4. Clique em **Create repository**.
5. Na página do repositório novo, copie a **URL** do repositório. Ela será algo como:
   - `https://github.com/SEU_USUARIO/atual-supermercado.git`

Guarde essa URL; você vai usar no próximo passo.

---

## Parte 2: Enviar o código do seu PC para o repositório novo

Abra o **terminal** na pasta do projeto (no Cursor: Terminal → Novo Terminal) e rode os comandos **na ordem**, um por vez.

### 2.1 Ir para a pasta do projeto

```bash
cd c:\projeto_atual
```

### 2.2 Adicionar o repositório novo como “remote”

Use a URL que você copiou no passo 1. No lugar de `SEU_USUARIO/atual-supermercado`, use seu usuário e o nome do repositório que você criou.

```bash
git remote add novo https://github.com/SEU_USUARIO/atual-supermercado.git
```

Exemplo, se o usuário for `joao` e o repo `atual-supermercado`:

```bash
git remote add novo https://github.com/joao/atual-supermercado.git
```

### 2.3 Enviar o código para o repositório novo

```bash
git push novo master
```

Se o GitHub pedir **usuário e senha**, use sua conta. Se pedir **token**, use um Personal Access Token (GitHub → Settings → Developer settings → Personal access tokens).

- Se der erro dizendo que o branch não existe no outro lado, tente:
  ```bash
  git push novo master:main
  ```
  (isso envia o seu `master` para o branch `main` no repositório novo.)

Pronto: o código atual está no **repositório novo** no GitHub.

---

## Parte 3: Novo projeto na Vercel

1. Acesse **https://vercel.com** e faça login.
2. Clique em **Add New…** → **Project** (ou **Import Project**).
3. Em **Import Git Repository**, escolha **GitHub** e **autorize** a Vercel (se pedir).
4. Na lista, clique em **Import** no repositório que você acabou de criar (ex.: `atual-supermercado`).
5. Na tela de configuração:
   - **Framework Preset:** Next.js (deve detectar sozinho).
   - **Root Directory:** deixe em branco (`.`).
   - **Build Command:** `npm run build` (padrão).
   - Não precisa mudar mais nada.
6. Clique em **Deploy**.
7. Espere o build terminar (alguns minutos). Quando aparecer **Ready**, o site estará no ar em uma URL tipo `https://atual-supermercado-xxx.vercel.app`.

Esse é o seu **novo** projeto Vercel, do zero.

---

## Parte 4: Usar o domínio atualmercado.com.br (opcional)

Se quiser que **atualmercado.com.br** aponte para esse novo projeto:

1. No **projeto novo** na Vercel, vá em **Settings** → **Domains**.
2. Clique em **Add** e digite **atualmercado.com.br**.
3. Siga as instruções da Vercel para configurar os registros **DNS** no painel onde você gerencia o domínio (onde comprou o domínio). Geralmente é um registro do tipo **CNAME** ou **A** que a Vercel indica.

Enquanto o DNS não propagar, o site continua acessível pela URL `https://....vercel.app` do projeto novo.

---

## Resumo dos comandos (Parte 2)

Substitua `SEU_USUARIO` e `NOME_DO_REPO` pelo que você criou no GitHub:

```bash
cd c:\projeto_atual
git remote add novo https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git push novo master
```

Se precisar enviar para o branch `main` no repo novo:

```bash
git push novo master:main
```

---

## Depois que estiver no ar

- Para **atualizar o site** no futuro: faça suas alterações no código, depois:
  ```bash
  git add .
  git commit -m "Sua mensagem"
  git push novo master
  ```
  (ou `git push novo master:main` se tiver usado `main`).

- O repositório **antigo** (`origin` → canalvideosadrenalina-ui/projeto_atual) continua como está; você não apagou nada. Só passou a ter um **remote** a mais (`novo`) apontando para o repositório novo.

Se em algum passo aparecer uma mensagem de erro, copie a mensagem e o comando que você usou e envie para ajustarmos o próximo passo.
