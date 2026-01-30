# 🚀 Guia de Deploy no Vercel

## 📋 Pré-requisitos

1. Conta no GitHub (se ainda não tiver, crie em https://github.com)
2. Conta no Vercel (gratuita em https://vercel.com)
3. Repositório Git configurado

## 🔄 Passo a Passo

### 1. Fazer Push para o GitHub

```bash
# Verificar se há um remote configurado
git remote -v

# Se não houver, adicione seu repositório GitHub
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Fazer push
git push -u origin master
# ou
git push -u origin main
```

### 2. Conectar com Vercel

1. Acesse https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"** ou **"Import Project"**
4. Selecione o repositório do projeto
5. Clique em **"Import"**

### 3. Configurações no Vercel

#### Configurações Automáticas (geralmente já detectadas):
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (raiz do projeto)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

#### Variáveis de Ambiente (se necessário):
Na seção **"Environment Variables"**, adicione:

```
PDV_API_KEY=sua-chave-api-aqui
```

(Deixe vazio por enquanto se não tiver configurado ainda)

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Pronto! Você terá uma URL como: `https://seu-projeto.vercel.app`

## 🔗 URLs Geradas

Após o deploy, você terá:

- **Produção**: `https://seu-projeto.vercel.app`
- **Preview**: Cada commit gera uma URL única de preview
- **Custom Domain**: Pode configurar domínio próprio depois

## 📱 Compartilhar com Cliente

### Opção 1: Link de Produção
```
https://seu-projeto.vercel.app
```

### Opção 2: Preview de Desenvolvimento
Cada push gera um link único que você pode compartilhar.

## ⚙️ Configurações Importantes

### Variáveis de Ambiente (Opcional)

Se precisar configurar variáveis de ambiente:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `PDV_API_KEY` (para integração futura)
   - `DATABASE_URL` (quando configurar banco)

### Domínio Customizado

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

## 🔄 Deploy Automático

O Vercel faz deploy automático quando você faz push:

```bash
git add .
git commit -m "Nova funcionalidade"
git push
```

Automaticamente:
- ✅ Build é executado
- ✅ Deploy é feito
- ✅ URL de preview é gerada
- ✅ Cliente é notificado (se configurado)

## 📊 Monitoramento

No dashboard do Vercel você pode ver:
- Logs de build
- Analytics de acesso
- Performance
- Erros em produção

## 🐛 Troubleshooting

### Build falha?
- Verifique os logs no Vercel
- Teste localmente: `npm run build`
- Verifique se todas as dependências estão no `package.json`

### Imagens não carregam?
- Verifique `next.config.ts` - domínios configurados
- Use imagens otimizadas do Next.js

### Erro de módulo não encontrado?
- Verifique imports relativos
- Use `@/` para imports absolutos

## ✅ Checklist Antes do Deploy

- [ ] Testar build local: `npm run build`
- [ ] Verificar se não há erros de lint
- [ ] Testar todas as páginas localmente
- [ ] Verificar se imagens estão configuradas
- [ ] Commit e push feitos
- [ ] Variáveis de ambiente configuradas (se necessário)

## 🎯 Próximos Passos Após Deploy

1. Testar todas as funcionalidades na URL de produção
2. Compartilhar link com cliente
3. Coletar feedback
4. Fazer ajustes conforme necessário
5. Configurar domínio customizado (opcional)

