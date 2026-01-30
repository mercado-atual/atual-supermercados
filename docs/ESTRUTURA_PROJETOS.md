# 📁 Estrutura de Projetos - ATUAL Supermercados

## 🎯 Visão Geral

O sistema completo será dividido em **3 projetos separados** que trabalham juntos:

```
atual-supermercados/
├── atual-web/          # Site web (Next.js) - PROJETO ATUAL ✅
├── atual-mobile/       # App mobile (React Native) - NOVO PROJETO 📱
└── atual-backend/      # Backend/APIs (opcional, se separar) - FUTURO 🔧
```

---

## 📦 Projeto 1: Site Web (ATUAL) ✅

### **Localização**: `projeto_atual/` (atual)

**Tecnologias:**
- Next.js 15
- TypeScript
- Tailwind CSS
- React Context API

**Status**: ✅ **Já está pronto e funcionando**

**O que faz:**
- Site completo de e-commerce
- Páginas institucionais
- Carrinho de compras
- Sistema de autenticação
- APIs para produtos e autenticação

**Deploy**: Vercel
**URL**: https://projeto-atual-psi.vercel.app

---

## 📱 Projeto 2: App Mobile (NOVO) 📱

### **Localização**: `atual-mobile/` (será criado)

**Tecnologias:**
- React Native
- Expo
- TypeScript
- React Navigation

**Status**: 📋 **Planejado - Será criado depois**

**O que fará:**
- App Android (APK)
- App iOS (IPA)
- Compras online
- Rastreamento de pedidos
- Notificações push

**Deploy**: 
- Android: Google Play Store
- iOS: App Store

**Como será criado:**
```bash
# Quando estiver pronto, criar novo projeto:
npx create-expo-app atual-mobile --template
cd atual-mobile
```

---

## 🔧 Projeto 3: Backend (OPCIONAL) 🔧

### **Status**: ⚠️ **Opcional - Pode não ser necessário**

**Por quê opcional?**
- O Next.js já tem API Routes (`app/api/`)
- As APIs já estão funcionando no projeto web
- Pode continuar usando as APIs do Next.js

**Quando criar backend separado?**
- Se precisar escalar muito
- Se quiser separar frontend de backend
- Se precisar de serviços específicos (filas, workers, etc.)

**Tecnologias sugeridas:**
- Node.js + Express
- ou NestJS
- ou Next.js API Routes (atual)

---

## 🔗 Como Eles Se Conectam

### **Compartilhamento de APIs**

```
┌─────────────────┐         ┌──────────────────┐
│   Site Web      │         │   App Mobile     │
│  (Next.js)      │         │ (React Native)   │
└────────┬────────┘         └────────┬─────────┘
         │                            │
         │    HTTP Requests           │
         │    (REST API)              │
         │                            │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │   APIs do Next.js         │
         │   (app/api/*)             │
         │                           │
         │   - /api/products         │
         │   - /api/auth/login       │
         │   - /api/auth/register    │
         │   - /api/orders           │
         │   - etc.                  │
         └──────────────────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │   Banco de Dados         │
         │   (PostgreSQL/MongoDB)   │
         └──────────────────────────┘
```

---

## 📂 Estrutura Recomendada

### **Opção 1: Monorepo (Recomendada para começar)**

```
atual-supermercados/
├── web/                    # Site Next.js
│   ├── app/
│   ├── components/
│   └── ...
├── mobile/                 # App React Native
│   ├── app/
│   ├── components/
│   └── ...
└── shared/                 # Código compartilhado (opcional)
    ├── types/              # Types TypeScript
    └── utils/              # Funções utilitárias
```

**Vantagens:**
- ✅ Tudo em um lugar
- ✅ Compartilha tipos TypeScript
- ✅ Fácil de gerenciar

**Como criar:**
```bash
# Criar estrutura
mkdir atual-supermercados
cd atual-supermercados

# Mover projeto atual
mv ../projeto_atual web

# Criar app mobile
npx create-expo-app mobile --template
```

---

### **Opção 2: Repositórios Separados (Recomendada para produção)**

```
GitHub:
├── atual-web/              # Repositório separado
├── atual-mobile/           # Repositório separado
└── atual-backend/          # Repositório separado (se necessário)
```

**Vantagens:**
- ✅ Deploys independentes
- ✅ Equipes separadas podem trabalhar
- ✅ Versões independentes

---

## 🚀 Recomendação: Começar Separado

### **Por quê?**

1. **Simplicidade**: Cada projeto tem suas próprias dependências
2. **Deploy independente**: Site e app podem ser atualizados separadamente
3. **Escalabilidade**: Fácil adicionar mais projetos depois
4. **Manutenção**: Mais fácil de manter projetos separados

### **Estrutura Inicial:**

```
projeto_atual/              # Site web (JÁ EXISTE) ✅
├── app/
├── components/
├── contexts/
└── ...

atual-mobile/               # App mobile (SERÁ CRIADO) 📱
├── app/
├── components/
├── services/
└── ...
```

---

## 🔄 Compartilhamento de Código

### **O que pode ser compartilhado:**

1. **Types TypeScript**
   - Interfaces de produtos
   - Tipos de usuário
   - Tipos de pedidos

2. **Constantes**
   - URLs das APIs
   - Configurações
   - Mensagens

3. **Lógica de Negócio**
   - Cálculo de frete
   - Validações
   - Formatação de dados

### **Como compartilhar:**

#### **Opção A: Pacote NPM Privado**
```bash
# Criar pacote compartilhado
atual-shared/
├── package.json
├── src/
│   ├── types/
│   └── utils/
```

#### **Opção B: Git Submodule**
```bash
# Adicionar como submodule
git submodule add https://github.com/atual/shared.git shared
```

#### **Opção C: Copiar tipos (mais simples)**
- Manter tipos sincronizados manualmente
- Ou usar ferramentas de sincronização

---

## 📱 Criando o App Mobile

### **Quando estiver pronto:**

```bash
# 1. Criar novo projeto
npx create-expo-app atual-mobile --template

# 2. Configurar
cd atual-mobile
npm install

# 3. Configurar URL da API
# Criar arquivo .env
API_URL=https://projeto-atual-psi.vercel.app/api

# 4. Desenvolver
expo start
```

### **Configuração da API:**

```typescript
// mobile/services/api.ts
const API_URL = process.env.API_URL || 'https://projeto-atual-psi.vercel.app/api';

export const api = {
  products: `${API_URL}/products`,
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
  },
  // ...
};
```

---

## ✅ Resumo

### **Agora:**
- ✅ Site web funcionando (`projeto_atual/`)
- ✅ APIs funcionando no Next.js
- ✅ Tudo deployado no Vercel

### **Depois (quando estiver pronto):**
- 📱 Criar novo projeto: `atual-mobile/`
- 📱 Usar as mesmas APIs do site web
- 📱 Desenvolver app React Native
- 📱 Publicar nas lojas

### **Não precisa:**
- ❌ Criar backend separado agora
- ❌ Mover código existente
- ❌ Mudar estrutura atual

---

## 🎯 Conclusão

**Resposta direta**: 
- ✅ **Projeto separado** para o app mobile
- ✅ **Mesmas APIs** do site web
- ✅ **Não precisa** criar backend novo agora
- ✅ **Pode começar** quando quiser, seguindo a documentação

**Estrutura final:**
```
projeto_atual/          ← Site web (ATUAL) ✅
atual-mobile/           ← App mobile (NOVO) 📱
```

Ambos usam as mesmas APIs em: `https://projeto-atual-psi.vercel.app/api`

