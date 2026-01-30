# O que fazer para o site voltar a publicar na Vercel

O código do site já está corrigido no seu computador. Falta **enviar** esse código para o lugar onde a Vercel pega o projeto (o GitHub). Quando você enviar, a Vercel vai construir de novo e o erro some.

---

## Em uma frase

Você vai **abrir uma janela de texto onde se digita comandos** (o "terminal"), **digitar 4 frases** (comandos) uma atrás da outra e apertar Enter depois de cada uma. Isso envia o arquivo corrigido para o GitHub e a Vercel atualiza sozinha.

---

## Passo 1: Abrir o terminal

- No **Cursor** (onde você está agora), olhe no **menu de cima**.
- Clique em **Terminal**.
- Clique em **Novo Terminal** (ou "New Terminal").
- Vai aparecer uma **janela embaixo** com uma linha onde dá para digitar (geralmente com um texto tipo `c:\projeto_atual` ou `PS C:\...`). Essa janela é o **terminal**.

---

## Passo 2: Digitar o primeiro comando

Na linha do terminal, digite **exatamente** isto (pode copiar e colar):

```
cd c:\projeto_atual
```

Depois aperte **Enter** no teclado.

- Não precisa entender o que é "cd" — é só o comando que coloca você na pasta certa do projeto.
- Se aparecer de novo a linha para digitar (sem mensagem de erro), está certo. Siga para o Passo 3.

---

## Passo 3: Digitar o segundo comando

Na nova linha que apareceu, digite (ou cole):

```
git add app/api/payments/create/route.ts
```

Aperte **Enter**.

- Isso diz ao Git: "prepare esse arquivo para ser enviado".
- De novo, se voltar a aparecer a linha para digitar, está certo. Vá para o Passo 4.

---

## Passo 4: Digitar o terceiro comando

Digite (ou cole):

```
git commit -m "Corrige erro de build no pagamento"
```

Aperte **Enter**.

- Isso "empacota" a correção com uma mensagem.
- Pode aparecer algo como "1 file changed". Está certo. Vá para o Passo 5.

---

## Passo 5: Digitar o quarto comando

Digite (ou cole):

```
git push origin master
```

Aperte **Enter**.

- Isso **envia** o que você preparou nos passos 3 e 4 para o GitHub.
- Pode pedir **usuário e senha do GitHub**. Aí é sua conta do GitHub (e-mail e senha). Se o GitHub pedir um "token" em vez de senha, você cria um em: GitHub → Configurações → Developer settings → Personal access tokens.
- Quando terminar, deve aparecer algo como "Writing objects" e depois a linha de comando de novo. **Pronto.** O código corrigido já está no GitHub.

---

## Passo 6: Deixar a Vercel fazer o resto

- Abra o navegador e vá em **https://vercel.com**.
- Entre no projeto do site (**projeto-atual**).
- Clique na aba **Deployments** (ou "Implantações").
- Em 1–2 minutos deve aparecer um **novo deploy** (Building e depois Ready).
- Quando estiver **Ready**, o site está atualizado e o erro de build sumiu.

---

## Se der erro no meio do caminho

- **"git não é reconhecido"**  
  O Git não está instalado. Instale em: https://git-scm.com/download/win  
  Depois feche e abra de novo o terminal e repita a partir do Passo 2.

- **Pediu usuário/senha e deu "erro de autenticação"**  
  Use o mesmo e-mail e senha da sua conta do GitHub. Se tiver autenticação em dois fatores, o GitHub pode pedir um **token** em vez da senha (crie um token em GitHub → Settings → Developer settings → Personal access tokens e use no lugar da senha).

- **"branch 'master' não existe"**  
  Tente o mesmo comando trocando `master` por `main`:
  ```
  git push origin main
  ```

---

## Resumo (só os 4 comandos)

Copie e cole **um por vez** no terminal, apertando Enter depois de cada um:

1. `cd c:\projeto_atual`
2. `git add app/api/payments/create/route.ts`
3. `git commit -m "Corrige erro de build no pagamento"`
4. `git push origin master`

Depois é só esperar a Vercel terminar o deploy.
