# 📝 Comandos Git - Guia Rápido

## ✅ Status Atual

Todos os arquivos foram commitados localmente. Agora você precisa fazer push para o GitHub.

## 🔄 Próximos Passos

### 1. Verificar Remote (Repositório GitHub)

```bash
git remote -v
```

Se não aparecer nada, você precisa adicionar o remote:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### 2. Fazer Push para GitHub

```bash
# Primeira vez (criar branch no GitHub)
git push -u origin master

# Ou se sua branch principal for 'main'
git push -u origin main

# Próximas vezes (após primeiro push)
git push
```

### 3. Se Der Erro de Branch

Se aparecer erro sobre branch, tente:

```bash
# Verificar qual é sua branch principal
git branch

# Se for 'main', use:
git push -u origin main

# Se for 'master', use:
git push -u origin master
```

## 🚀 Deploy no Vercel

Após fazer push, siga o guia em: [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md)

## 📋 Resumo dos Commits

Você já tem 2 commits prontos:
1. ✅ Implementação completa do e-commerce
2. ✅ Documentação (README e guia de deploy)

## 🔍 Verificar se Tudo Está Commitado

```bash
git status
```

Deve aparecer: "nothing to commit, working tree clean"

## 🆘 Se Precisar Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `atual-supermercados` (ou outro nome)
3. Deixe **público** ou **privado** (sua escolha)
4. **NÃO** marque "Initialize with README" (já temos)
5. Clique em **"Create repository"**
6. Copie a URL que aparece
7. Use no comando `git remote add origin`

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Remote configurado (`git remote -v`)
- [ ] Push feito (`git push`)
- [ ] Projeto conectado no Vercel
- [ ] Deploy realizado
- [ ] Link compartilhado com cliente

