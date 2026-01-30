# Atualizar o site em produção (Vercel)

O site está hospedado no **Vercel**. Para publicar as alterações:

---

## Opção 1: Deploy pela CLI (rápido, do seu PC)

1. **Instalar a CLI** (se ainda não tiver):
   ```bash
   npm i -g vercel
   ```

2. **Login** (uma vez):
   ```bash
   vercel login
   ```

3. **Deploy em produção**:
   ```bash
   vercel --prod
   ```
   - Se perguntar "Link to existing project?", digite **Y** e escolha o projeto **projeto-atual** (ou o nome que estiver no Vercel).
   - Ou **N** se for o primeiro deploy deste projeto.

4. **Pronto.** A URL de produção será atualizada (ex.: `https://projeto-atual-psi.vercel.app`).

---

## Opção 2: Deploy automático pelo Git

Se o repositório estiver conectado ao Vercel:

1. **Commit e push**:
   ```bash
   git add .
   git commit -m "Atualização do site"
   git push origin main
   ```
   (ou `master`, conforme o branch padrão)

2. O Vercel faz o build e o deploy automaticamente em poucos minutos.

---

## Antes de atualizar

- [ ] Rodar o build local: `npm run build` (já passou ✅)
- [ ] Variáveis de ambiente no Vercel (Settings → Environment Variables), se precisar:
  - `ADMIN_PASSWORD` (painel admin)
  - Credenciais Sysmo (se a sincronização rodar no Vercel)
  - Outras que o projeto usar

---

## URLs

- **Produção:** https://projeto-atual-psi.vercel.app (conforme documentação do projeto)
- **Dashboard Vercel:** https://vercel.com/dashboard
