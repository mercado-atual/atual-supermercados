# Onde estamos e como continuar – passo a passo

## ✅ Situação do código (sem problema)

- **Build:** passa (`npm run build` OK).
- **Correções já feitas:** cookies (Next 15), searchParams, Suspense na busca, ordem da variável `marca` no sistema, cron ajustado para plano Hobby.
- **Site local:** pode rodar com `npm run dev` e `npm run start` normalmente.

Ou seja: **não há problema no código**. O que falta é **publicar no Vercel**.

---

## ❌ O que está travando

O **deploy no Vercel** não completa por **permissão**:

- O projeto no Vercel pertence à **equipe** `canalvideosadrenalina-ui`.
- A conta que está fazendo o deploy (**romualdo@email.com**) **não tem permissão** para criar deploys nesse projeto.
- Mensagem do Vercel: *"Git author romualdo@email.com must have access to the team canalvideosadrenalina-ui's projects on Vercel to create deployments."*

Então o “problema” é só **quem pode fazer o deploy** no projeto atual do Vercel.

---

## Passo a passo para continuar

Escolha **uma** das opções abaixo, conforme quem tem acesso ao Vercel.

---

### Opção A – Quem tem acesso ao Vercel faz o deploy (recomendado)

Quem é **dono ou membro** do projeto no Vercel (equipe canalvideosadrenalina-ui):

1. **Pegar o código atual**
   - Se o código está no Git: dar `git pull` (ou receber as alterações de quem desenvolveu).
   - Se não usa Git: receber a pasta do projeto atualizada (ex.: zip ou cópia).

2. **Garantir que o build passa**
   ```bash
   cd c:\projeto_atual
   npm install
   npm run build
   ```
   - Se der erro, corrigir antes de seguir.

3. **Fazer o deploy**
   - **Se o repositório está conectado ao Vercel:**
     ```bash
     git add .
     git commit -m "Atualização do site"
     git push origin main
     ```
     (ou `master`, conforme o branch que o Vercel usa.)
   - **Se preferir pela CLI:**
     ```bash
     npx vercel login
     npx vercel --prod
     ```
     (usando a conta que tem permissão no projeto.)

4. **Conferir**
   - Abrir a URL de produção (ex.: `https://projeto-atual-psi.vercel.app`) e testar.

---

### Opção B – Dar acesso à conta que vai fazer o deploy

Se **romualdo@email.com** (ou outra conta) deve continuar fazendo o deploy:

1. Quem é **Owner/Admin** da equipe no Vercel:
   - Acessa [vercel.com](https://vercel.com) → **Team** (canalvideosadrenalina-ui) → **Members** (ou **Settings** → **Members**).
2. **Convidar** o e-mail (ex.: romualdo@email.com) como membro da equipe.
3. Dar permissão de **deploy** (ou **Member** que permita criar deploys).
4. O convidado aceita o e-mail e, depois:
   ```bash
   cd c:\projeto_atual
   npx vercel login
   npx vercel --prod
   ```

---

### Opção C – Novo projeto no Vercel (sua conta)

Se o site pode ser **outro projeto**, na **sua conta** pessoal:

1. Criar conta em [vercel.com](https://vercel.com) (se ainda não tiver).
2. **Novo projeto:**
   - Vercel → **Add New** → **Project**.
   - Conectar o repositório Git **ou** usar “Import” e fazer deploy manual.
3. Configurar:
   - **Root Directory:** `./` (raiz do projeto).
   - **Build Command:** `npm run build`.
   - **Output:** Next.js (detectado automaticamente).
4. Adicionar variáveis de ambiente (ex.: `ADMIN_PASSWORD`, credenciais Sysmo, se precisar).
5. Fazer o primeiro deploy (pelo Git ou pela CLI com `npx vercel --prod` na pasta do projeto).

Assim você não depende da equipe atual e o “problema” de permissão some para esse novo projeto.

---

## Resumo rápido

| O que                     | Status                          |
|---------------------------|----------------------------------|
| Código / build            | ✅ OK                            |
| Deploy no projeto atual   | ❌ Bloqueado por permissão (equipe) |
| Próximo passo             | A, B ou C acima                  |

**Para continuar:** escolher A (alguém com acesso faz o deploy), B (dar acesso à conta que vai fazer deploy) ou C (criar novo projeto na sua conta) e seguir o passo a passo da opção escolhida.

Se disser qual opção você quer (A, B ou C), posso detalhar só os passos dessa opção em cima do que você já tem aí no PC (por exemplo: “só uso Git” ou “só uso CLI”).
