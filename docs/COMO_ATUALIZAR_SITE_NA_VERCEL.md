# Como atualizar o site na Vercel – guia para iniciantes

Este guia explica **passo a passo**, em linguagem simples, como publicar as alterações do seu projeto para o site **atualmercado.com.br**.

---

## Sua situação agora (resumo)

- Sua pasta **é** um repositório Git.
- O Git está apontando para: **https://github.com/canalvideosadrenalina-ui/projeto_atual.git** (o mesmo da Vercel).
- Você está na branch **master**.
- Há **muitas alterações** ainda não enviadas (header novo, correções, Sysmo, páginas de busca e limpeza, etc.).
- O servidor tem **1 commit** que você ainda não puxou. Por isso, antes de enviar, é importante fazer um **pull** para evitar conflito.

**Ordem dos comandos para você seguir:**

1. `git pull origin master`  ← puxar o que está no GitHub
2. `git add .`             ← preparar todas as alterações
3. `git commit -m "Sua mensagem"`  ← criar o pacote
4. `git push origin master`        ← enviar e atualizar o site

Detalhes de cada passo estão abaixo.

---

## O que vamos fazer (em uma frase)

Você vai **enviar o código da sua pasta** para o **GitHub** (ou outro repositório). A **Vercel** está ligada a esse repositório: quando você envia o código, ela **atualiza o site sozinha**.

---

## Antes de começar

- [ ] Você está na pasta do projeto no PC (ex.: `c:\projeto_atual`).
- [ ] O **Git** está instalado (veja “Como saber se o Git está instalado” mais abaixo).
- [ ] Você tem **conta no GitHub** (ou no repositório que a Vercel usa).

---

## Passo 1: Abrir o terminal na pasta do projeto

1. Abra o **Cursor** (ou o VS Code) e abra a pasta **projeto_atual**.
2. Abra o terminal:
   - **Atalho:** `` Ctrl + ` `` (a tecla crase, perto do 1)
   - Ou no menu: **Terminal** → **Novo Terminal**
3. Confirme que está na pasta certa. Digite:

   ```bash
   cd c:\projeto_atual
   ```

   e pressione **Enter**.

4. Depois digite:

   ```bash
   dir
   ```

   (no Mac/Linux seria `ls`).  
   Você deve ver pastas como `app`, `components`, `lib` e o arquivo `package.json`.  
   Se ver isso, está na pasta certa.

---

## Passo 2: Ver se o Git está instalado

No mesmo terminal, digite:

```bash
git --version
```

e pressione **Enter**.

- Se aparecer algo como `git version 2.43.0` → o Git está instalado. Siga para o **Passo 3**.
- Se aparecer “comando não encontrado” ou erro → instale o Git: https://git-scm.com/download/win  
  Depois feche e abra o terminal de novo e repita o comando.

---

## Passo 3: Ver se a pasta é um repositório Git

Digite:

```bash
git status
```

e pressione **Enter**.

**Cenário A – Funcionou e mostrou arquivos “modificados” ou “novos”:**  
A pasta já é um repositório Git. Anote o que apareceu e vá para o **Passo 4**.

**Cenário B – Deu erro “not a git repository”:**  
A pasta ainda não é um repositório. Vá para a seção **“Se a pasta NÃO for um repositório Git”** no final do guia.

**Cenário C – Mostrou “nothing to commit, working tree clean”:**  
Não há alterações novas. Ou já está tudo enviado, ou você não mudou nada ainda. Se você fez alterações e quer publicar, volte ao Passo 1 e confira se está na pasta `c:\projeto_atual`.

---

## Passo 4: Ver para onde o Git está “enviando” (remote)

Digite:

```bash
git remote -v
```

e pressione **Enter**.

Você deve ver **duas linhas** com a mesma URL, algo como:

```text
origin  https://github.com/canalvideosadrenalina-ui/projeto-atual.git (fetch)
origin  https://github.com/canalvideosadrenalina-ui/projeto-atual.git (push)
```

- **origin** = nome do “lugar” no qual o Git envia o código.
- A **URL** deve ser do repositório que está **conectado ao projeto na Vercel** (o mesmo que aparece na tela da Vercel em “Source” / repositório).

**Se a URL for outra** (por exemplo outro usuário ou outro nome de repositório), então esse projeto no PC não é o que a Vercel está usando. Aí você precisa:
- ou clonar o repositório correto e colar suas alterações lá, ou  
- ou alterar o `remote` (isso a gente pode fazer em outro guia).

**Se a URL for a esperada**, siga para o **Passo 4b**.

---

## Passo 4b: Puxar o que está no servidor (evitar conflito)

Antes de enviar, é bom **puxar** o que outras pessoas (ou você em outro PC) já enviaram. Assim evitamos conflito.

Digite:

```bash
git pull origin master
```

e pressione **Enter**.

- Se aparecer “Already up to date” → não havia nada novo. Tudo certo, vá para o **Passo 5**.
- Se aparecer “Merge” ou “Fast-forward” e listar arquivos → o Git juntou as alterações. Tudo certo, vá para o **Passo 5**.
- Se aparecer **conflito** ( “CONFLICT” em algum arquivo) → não faça push ainda. Avise e te explico como resolver o conflito.

---

## Passo 5: Adicionar todas as alterações

No terminal, digite:

```bash
git add .
```

e pressione **Enter**.

- O **ponto (.)** significa “todos os arquivos alterados nesta pasta”.
- Nada vai aparecer na tela se der certo; isso é normal.

---

## Passo 6: Criar um “commit” (pacote com uma mensagem)

Digite (pode copiar e colar):

```bash
git commit -m "Atualização do site: header, correções e melhorias"
```

e pressione **Enter**.

- **commit** = um “pacote” das alterações com uma mensagem.
- **-m "..."** = a mensagem que aparece no histórico (e na Vercel). Você pode mudar o texto entre aspas.

Se aparecer algo como “X files changed” ou “X insertions”, o commit foi criado. Siga para o **Passo 7**.

Se aparecer “nothing to commit” ou “no changes”, não havia nada novo para commitar. Confira o **Passo 3** de novo.

---

## Passo 7: Enviar para a branch master (e atualizar o site)

Digite:

```bash
git push origin master
```

e pressione **Enter**.

- **push** = enviar os commits para o servidor (GitHub etc.).
- **origin** = o “lugar” que você viu no Passo 4.
- **master** = a branch que a Vercel usa para produção (como na tela que você mostrou).

**O que pode acontecer:**

1. **Pedir usuário e senha do GitHub:**  
   Digite seu usuário e senha (ou token, se usar).  
   Se usar **autenticação em dois fatores**, o GitHub pode pedir um **Personal Access Token** em vez da senha (você cria em GitHub → Settings → Developer settings → Personal access tokens).

2. **Aparecer “Everything up-to-date”:**  
   Não havia nada novo para enviar (já estava tudo no servidor).

3. **Aparecer algo como “Counting objects... Writing objects... done”:**  
   O envio deu certo. A Vercel vai detectar o push e começar um novo deploy.

---

## Passo 8: Confirmar que o site atualizou

1. Abra no navegador: **https://vercel.com** e entre no projeto **projeto-atual**.
2. Clique na aba **“Implantações”** (Deployments).
3. Deve aparecer um **novo deploy** “Building” ou “In Progress”. Espere alguns minutos.
4. Quando o status ficar **“Ready”** ou **“Concluído”**, abra **https://atualmercado.com.br** e confira se as alterações aparecem (por exemplo o novo header, ofertas, etc.).

---

## Resumo dos comandos (para copiar e colar)

Use na ordem, **um por vez**:

```bash
cd c:\projeto_atual
git pull origin master
git add .
git commit -m "Atualização do site: header, correções e melhorias"
git push origin master
```

(Opcional: antes do `git add`, use `git status` e `git remote -v` para conferir.)

---

## Se a pasta NÃO for um repositório Git

Se no **Passo 3** deu “not a git repository”:

1. Você precisa **conectar** esta pasta a um repositório que já exista na Vercel, **ou**
2. **Criar** um repositório no GitHub e conectar esta pasta a ele.

**Opção simples (criar e conectar):**

1. Crie um repositório novo no GitHub (ex.: `projeto-atual`), **sem** marcar “Add README”.
2. No terminal, na pasta `c:\projeto_atual`, digite:

   ```bash
   git init
   git remote add origin https://github.com/SEU_USUARIO/projeto-atual.git
   ```

   (troque `SEU_USUARIO` e `projeto-atual` pelo seu usuário e nome do repositório.)

3. Depois faça o **Passo 5, 6 e 7** (add, commit, push).  
   Na primeira vez pode ser:

   ```bash
   git branch -M master
   git push -u origin master
   ```

4. No site da Vercel: **Add New Project** → importe esse repositório e conecte o domínio **atualmercado.com.br** (se for o caso).

---

## Problemas comuns

| Problema | O que fazer |
|----------|-------------|
| “git não é reconhecido” | Instalar o Git (link acima) e reiniciar o terminal. |
| “Permission denied” ou “Authentication failed” | Verificar usuário/senha ou usar Personal Access Token no GitHub. |
| “branch 'master' não existe” | Tentar: `git push origin main` (se o branch se chamar `main`). |
| “remote origin already exists” | O remote já está configurado; use `git remote -v` para ver e siga do Passo 5. |

---

Se em algum passo aparecer uma mensagem de erro, copie a mensagem **exata** e o comando que você digitou e envie; aí dá para te dizer o próximo passo certo.
