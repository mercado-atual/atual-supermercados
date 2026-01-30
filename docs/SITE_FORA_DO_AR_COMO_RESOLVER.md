# Site fora do ar – o que fazer

Siga estes passos **na ordem**. Na maioria das vezes o site volta em poucos minutos.

---

## 1. Abrir o projeto na Vercel

1. Acesse: **https://vercel.com**
2. Faça login.
3. Entre no projeto do site (**projeto-atual** ou **projetoo-real**).
4. Clique na aba **"Implantações"** (ou **Deployments**).

---

## 2. Ver o último deploy

Na lista de implantações, veja o **primeiro da lista** (o mais recente):

- **Status "Ready" ou "Concluído" (verde)**  
  → O deploy está OK. O problema pode ser domínio, cache ou rede. Vá para o **Passo 4**.

- **Status "Error" ou "Falhou" (vermelho)**  
  → O build ou o deploy falhou. Siga o **Passo 3**.

- **Status "Building" ou "Preparar"**  
  → Ainda está fazendo o deploy. Espere alguns minutos e atualize a página.

---

## 3. Se o último deploy FALHOU (Error)

**Opção A – Voltar para a versão que estava no ar (recomendado)**

1. Na mesma tela de **Implantações**, encontre um deploy antigo com status **"Ready"** (verde).
2. Clique nos **três pontinhos (⋯)** ao lado desse deploy.
3. Clique em **"Reversão instantânea"** (ou **Instant Rollback**).
4. Confirme. Em pouco tempo o site deve voltar a abrir.

**Opção B – Corrigir e fazer novo deploy**

1. Clique no deploy que falhou e abra **"Registros de compilação"** (Build Logs).
2. Veja a mensagem de erro (geralmente no final).
3. Corrija o código no seu PC conforme o erro (se precisar, peça ajuda com a mensagem).
4. Depois faça **commit e push** de novo (como no guia **COMO_ATUALIZAR_SITE_NA_VERCEL.md**). A Vercel vai tentar um novo deploy.

---

## 4. Se o último deploy está "Ready" mas o site não abre

1. **Testar a URL da Vercel**  
   Abra no navegador: **https://projeto-atual-psi.vercel.app** (ou a URL que aparece no projeto).  
   - Se **essa** URL abrir e **atualmercado.com.br** não → o problema é domínio/DNS. Veja o item 3 abaixo.  
   - Se **nenhuma** abrir → pode ser cache ou problema temporário da Vercel. Tente em outra rede ou em aba anônima.

2. **Limpar cache**  
   Tente: **Ctrl + F5** (Windows) ou **Cmd + Shift + R** (Mac). Ou abra o site em uma **aba anônima**.

3. **Domínio atualmercado.com.br**  
   No projeto na Vercel: **Configurações** → **Domínios**. Confirme se **atualmercado.com.br** está na lista e como "Válido".  
   Se estiver com erro, siga as instruções de DNS que a Vercel mostrar (geralmente um registro CNAME ou A).

---

## 5. Fazer um novo deploy manual (Redeploy)

Se quiser **gerar um novo deploy** com o mesmo código do último commit:

1. Na aba **Implantações**, clique nos **três pontinhos (⋯)** do deploy que você quer repetir.
2. Clique em **"Redeploy"** (ou **Implantar novamente**).
3. Marque **"Usar cache de compilação existente"** se quiser mais rápido, ou deixe desmarcado para build do zero.
4. Confirme. Espere o status ficar **"Ready"** e teste o site de novo.

---

## Resumo

| Situação              | O que fazer |
|-----------------------|------------|
| Último deploy falhou  | **Reversão instantânea** em um deploy antigo "Ready" |
| Deploy OK, site não abre | Testar URL da Vercel; limpar cache; conferir domínio |
| Quer tentar de novo   | **Redeploy** do último deploy |

O build do seu projeto **passa no seu PC**. Se na Vercel o deploy está "Ready" e mesmo assim o site não abre, o mais comum é cache do navegador ou configuração de domínio. Se o deploy está "Error", use a **reversão instantânea** para o site voltar rápido.
