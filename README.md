# 🛒 Atual Supermercados - E-commerce

E-commerce completo desenvolvido com Next.js 15, TypeScript e Tailwind CSS para o Atual Supermercados.

## ✨ Funcionalidades

### 🛍️ E-commerce
- ✅ Sistema de carrinho global com persistência (localStorage)
- ✅ Busca de produtos em tempo real
- ✅ Páginas de categorias (Hortifruti, Açougue, Padaria, Bebidas, Ofertas)
- ✅ Página de detalhes do produto
- ✅ Sistema de notificações Toast
- ✅ Design responsivo e moderno

### 📄 Páginas Institucionais
- ✅ **Trabalhe Conosco**: Formulário completo de currículo
- ✅ **Nossas Lojas**: Informações e localização das lojas
- ✅ **Clube de Vantagens**: Cadastro e informações do programa
- ✅ **Ajuda**: Central de ajuda com FAQ
- ✅ **Sobre Nós**: História e valores da empresa
- ✅ **Fale Conosco**: Formulário de contato

### 🔌 Integração PDV
- ✅ API Routes para sincronização de produtos
- ✅ Endpoints para receber dados do PDV
- ✅ Documentação completa de integração
- ✅ Sistema preparado para banco de dados

### 👤 Sistema de Clientes
- ✅ Cadastro e autenticação de clientes
- ✅ Área do cliente (Minha Conta)
- ✅ Sistema de pontos do Clube de Vantagens
- ✅ Preferências de notificação (Email/SMS)
- ✅ Perfil e dados pessoais

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **React Context API** - Gerenciamento de estado

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

## 🌐 Deploy

O projeto está configurado para deploy no Vercel:

1. Faça push para o GitHub
2. Conecte o repositório no Vercel
3. Deploy automático!

Veja o guia completo em: [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md)

## 📁 Estrutura do Projeto

```
projeto_atual/
├── app/                    # Páginas e rotas
│   ├── api/               # API Routes
│   ├── produto/[id]/     # Página de produto
│   ├── carrinho/          # Carrinho de compras
│   └── ...
├── components/            # Componentes reutilizáveis
│   ├── AppHeader.tsx      # Header principal
│   ├── Footer.tsx         # Rodapé
│   └── ...
├── contexts/              # Contextos React
│   ├── CartContext.tsx    # Contexto do carrinho
│   └── ToastContext.tsx   # Contexto de notificações
├── lib/                   # Utilitários e dados
│   ├── products.ts       # Dados de produtos
│   └── db.ts             # Configuração de BD
└── docs/                  # Documentação
    ├── DEPLOY_VERCEL.md   # Guia de deploy
    └── ...
```

## 🔗 Links Importantes

- **Home**: `/`
- **Carrinho**: `/carrinho`
- **Produto**: `/produto/[id]`
- **Categorias**: `/hortifruti`, `/acougue`, `/padaria`, `/bebidas`, `/ofertas`
- **Institucional**: `/trabalhe-conosco`, `/nossas-lojas`, `/clube-vantagens`, `/ajuda`, `/sobre`, `/contato`

## 📚 Documentação

### Site Web
- [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md) - Guia de deploy
- [`docs/ARQUITETURA_PDV.md`](docs/ARQUITETURA_PDV.md) - Arquitetura de integração
- [`docs/INTEGRACAO_PDV.md`](docs/INTEGRACAO_PDV.md) - Guia de integração PDV
- [`docs/ACESSO_REMOTO_SERVIDOR.md`](docs/ACESSO_REMOTO_SERVIDOR.md) - Acesso remoto

### App Mobile
- [`docs/APP_MOBILE.md`](docs/APP_MOBILE.md) - Guia completo para criar apps Android/iOS
- [`docs/ROADMAP_MOBILE.md`](docs/ROADMAP_MOBILE.md) - Roadmap de desenvolvimento mobile
- [`docs/ESTRUTURA_PROJETOS.md`](docs/ESTRUTURA_PROJETOS.md) - Estrutura de projetos (web + mobile)

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` (não commitado):

```env
PDV_API_KEY=sua-chave-api-aqui
# DATABASE_URL=sua-url-de-banco
```

## 📱 App Mobile (Planejado)

- 📋 **Status**: Planejamento concluído - Aguardando conclusão do site
- 📱 **Plataformas**: Android (APK) e iOS (IPA)
- 🚀 **Tecnologia**: React Native com Expo
- 📦 **Estrutura**: **Projeto separado** que usa as mesmas APIs deste site
- 📚 **Documentação**: Veja [`docs/APP_MOBILE.md`](docs/APP_MOBILE.md)
- 🗺️ **Roadmap**: Veja [`docs/ROADMAP_MOBILE.md`](docs/ROADMAP_MOBILE.md)
- 📁 **Estrutura**: Veja [`docs/ESTRUTURA_PROJETOS.md`](docs/ESTRUTURA_PROJETOS.md)

### Funcionalidades Planejadas
- ✅ Compras online com entrega
- ✅ Rastreamento de pedidos em tempo real
- ✅ Notificações push de ofertas
- ✅ Escaneamento de código de barras
- ✅ Clube de Vantagens integrado
- ✅ Pagamentos mobile (PIX, cartão, etc.)

## 📝 Próximas Melhorias

### Site Web
- [ ] Integração com banco de dados real
- [ ] Sistema de checkout completo
- [ ] Integração com gateway de pagamento
- [ ] Dashboard administrativo
- [ ] Histórico de pedidos
- [ ] Sistema de avaliações

### App Mobile
- [ ] Desenvolvimento do app Android/iOS
- [ ] Publicação nas lojas (Play Store e App Store)
- [ ] Sistema de notificações push
- [ ] Integração com pagamentos nativos

## 👨‍💻 Desenvolvido com

- Next.js 15
- TypeScript
- Tailwind CSS
- Lucide React

---

**Atual Supermercados** - Qualidade e economia para sua família 🛒
