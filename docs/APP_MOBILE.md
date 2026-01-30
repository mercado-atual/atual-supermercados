# 📱 Guia para Criar Apps Mobile (Android e iOS)

## 📋 Visão Geral

Este documento descreve como criar aplicativos nativos para Android e iOS para o **ATUAL Supermercados**, permitindo compras online com entrega.

## ⚠️ IMPORTANTE: Projeto Separado

**O app mobile será um PROJETO SEPARADO**, mas usará as **mesmas APIs** do site web.

### Estrutura:
```
projeto_atual/          ← Site web (Next.js) - PROJETO ATUAL ✅
atual-mobile/          ← App mobile (React Native) - NOVO PROJETO 📱
```

**Ambos compartilham:**
- ✅ Mesmas APIs (`/api/products`, `/api/auth`, etc.)
- ✅ Mesmo backend (Next.js API Routes)
- ✅ Mesmos dados e lógica de negócio

**Veja mais detalhes em:** [`docs/ESTRUTURA_PROJETOS.md`](ESTRUTURA_PROJETOS.md)

---

## 🎯 Opções de Implementação

### **Opção 1: React Native (Recomendada)**
- ✅ Compartilha código entre Android e iOS
- ✅ Acesso às APIs nativas
- ✅ Performance nativa
- ✅ Fácil integração com o backend existente

### **Opção 2: PWA (Progressive Web App)**
- ✅ Mais rápido de implementar
- ✅ Funciona como app nativo
- ✅ Não precisa de lojas de aplicativos
- ⚠️ Limitações em funcionalidades nativas

### **Opção 3: Expo (React Native Simplificado)**
- ✅ Mais fácil para iniciantes
- ✅ Build automático
- ✅ Over-the-air updates
- ⚠️ Algumas limitações em funcionalidades avançadas

---

## 🚀 Recomendação: React Native com Expo

### **Por que Expo?**
1. **Build simplificado**: Gera APK/IPA sem configurar Android Studio/Xcode
2. **Over-the-air updates**: Atualiza o app sem passar pelas lojas
3. **APIs prontas**: Câmera, notificações push, localização, etc.
4. **Fácil deploy**: Build na nuvem do Expo

---

## 📦 Estrutura do Projeto Mobile

```
atual-mobile/
├── app/                    # Telas do app
│   ├── (auth)/            # Login/Cadastro
│   ├── (tabs)/            # Tabs principais
│   │   ├── index.tsx      # Home
│   │   ├── produtos.tsx   # Lista de produtos
│   │   ├── carrinho.tsx   # Carrinho
│   │   └── conta.tsx      # Minha conta
│   └── produto/[id].tsx   # Detalhes do produto
├── components/            # Componentes reutilizáveis
├── services/              # APIs e serviços
│   ├── api.ts            # Cliente HTTP
│   └── auth.ts           # Autenticação
├── hooks/                 # Custom hooks
├── context/               # Contextos (Auth, Cart)
├── types/                 # TypeScript types
└── app.json              # Configuração Expo
```

---

## 🔧 Funcionalidades Principais

### **1. Autenticação**
- Login/Cadastro
- Recuperação de senha
- Biometria (Face ID/Touch ID)
- Sessão persistente

### **2. Catálogo de Produtos**
- Lista de produtos por categoria
- Busca e filtros
- Detalhes do produto
- Imagens em alta qualidade

### **3. Carrinho de Compras**
- Adicionar/remover produtos
- Ajustar quantidades
- Cálculo de total
- Sincronização com backend

### **4. Checkout**
- Seleção de endereço de entrega
- Métodos de pagamento
- Cálculo de frete
- Confirmação de pedido

### **5. Rastreamento de Pedidos**
- Status do pedido em tempo real
- Mapa de localização do entregador
- Notificações push

### **6. Área do Cliente**
- Perfil e dados pessoais
- Histórico de pedidos
- Pontos do Clube de Vantagens
- Endereços salvos
- Notificações

### **7. Funcionalidades Nativas**
- **Push Notifications**: Ofertas e status de pedidos
- **Câmera**: Escanear código de barras
- **Localização**: Buscar lojas próximas
- **Compartilhamento**: Compartilhar produtos
- **Pagamento**: Integração com gateways

---

## 📱 Tecnologias Necessárias

### **Core**
- React Native
- Expo SDK
- TypeScript
- React Navigation (navegação)

### **Estado e Dados**
- React Context API (ou Zustand/Redux)
- React Query (cache e sincronização)
- AsyncStorage (persistência local)

### **UI/UX**
- React Native Paper ou NativeBase (componentes)
- React Native Reanimated (animações)
- React Native Gesture Handler

### **APIs e Serviços**
- Axios ou Fetch (HTTP)
- Expo Location (GPS)
- Expo Notifications (push)
- Expo Camera (câmera)
- React Native Maps (mapas)

### **Pagamentos**
- Mercado Pago SDK
- PagSeguro SDK
- ou Stripe

---

## 🔐 Integração com Backend

### **APIs a Criar/Adaptar**

1. **Autenticação**
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `POST /api/auth/refresh-token`

2. **Produtos**
   - `GET /api/products` (já existe)
   - `GET /api/products/[id]` (já existe)
   - `GET /api/products/search`

3. **Carrinho**
   - `GET /api/cart`
   - `POST /api/cart/add`
   - `PUT /api/cart/update`
   - `DELETE /api/cart/remove`

4. **Pedidos**
   - `POST /api/orders` (criar pedido)
   - `GET /api/orders` (listar pedidos)
   - `GET /api/orders/[id]` (detalhes)
   - `GET /api/orders/[id]/track` (rastreamento)

5. **Endereços**
   - `GET /api/addresses`
   - `POST /api/addresses`
   - `PUT /api/addresses/[id]`
   - `DELETE /api/addresses/[id]`

6. **Frete**
   - `POST /api/shipping/calculate`

7. **Notificações Push**
   - `POST /api/notifications/register-token`
   - `POST /api/notifications/send`

---

## 📲 Passos para Criar o App

### **Fase 1: Setup Inicial**

```bash
# Instalar Expo CLI
npm install -g expo-cli

# Criar novo projeto
npx create-expo-app atual-mobile --template

# Entrar no diretório
cd atual-mobile

# Instalar dependências
npm install
```

### **Fase 2: Configuração**

1. **Configurar `app.json`**:
```json
{
  "expo": {
    "name": "ATUAL Supermercados",
    "slug": "atual-supermercados",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#DC2626"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.atual.supermercados"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#DC2626"
      },
      "package": "com.atual.supermercados",
      "permissions": [
        "CAMERA",
        "LOCATION",
        "NOTIFICATIONS"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### **Fase 3: Desenvolvimento**

1. Criar estrutura de navegação
2. Implementar telas principais
3. Integrar com APIs do backend
4. Adicionar funcionalidades nativas
5. Testar em dispositivos reais

### **Fase 4: Build**

#### **Android (APK)**
```bash
# Build APK para teste
expo build:android -t apk

# Build AAB para Google Play Store
expo build:android -t app-bundle
```

#### **iOS (IPA)**
```bash
# Build para App Store
expo build:ios
```

**Nota**: Para iOS, você precisa de:
- Conta Apple Developer ($99/ano)
- Mac para build (ou usar EAS Build na nuvem)

---

## 🎨 Design e UX

### **Cores Principais**
- **Vermelho**: `#DC2626` (marca)
- **Amarelo**: `#FCD34D` (ofertas)
- **Cinza**: `#F3F4F6` (background)

### **Componentes Principais**
- Header com busca
- Cards de produtos
- Botões de ação
- Formulários
- Modais de confirmação

---

## 📊 Funcionalidades Especiais para Mobile

### **1. Escaneamento de Código de Barras**
- Usar câmera para escanear produtos
- Buscar produto automaticamente

### **2. Localização**
- Detectar localização do usuário
- Calcular frete baseado na distância
- Mostrar lojas próximas no mapa

### **3. Notificações Push**
- Ofertas relâmpago
- Status de pedidos
- Lembretes de carrinho abandonado

### **4. Modo Offline**
- Cache de produtos
- Carrinho offline
- Sincronização quando online

### **5. Pagamento Mobile**
- Integração com Apple Pay / Google Pay
- QR Code para pagamento
- PIX integrado

---

## 🔄 Sincronização com o Site

### **Estratégia**
1. **Mesmo Backend**: App e site usam as mesmas APIs
2. **Autenticação Unificada**: Login funciona em ambos
3. **Carrinho Sincronizado**: Carrinho compartilhado entre plataformas
4. **Dados Consistentes**: Mesmos produtos, preços e ofertas

---

## 📈 Próximos Passos (Quando Pronto)

1. ✅ **Backend Completo**: Garantir que todas as APIs estão funcionando
2. ✅ **Design System**: Criar componentes visuais consistentes
3. ✅ **Testes**: Testar todas as funcionalidades no site
4. ✅ **Documentação API**: Documentar todas as rotas
5. ⏳ **Setup Mobile**: Criar projeto React Native
6. ⏳ **Desenvolvimento**: Implementar telas e funcionalidades
7. ⏳ **Testes Mobile**: Testar em dispositivos reais
8. ⏳ **Publicação**: Submeter nas lojas (Play Store e App Store)

---

## 📝 Checklist de Preparação

### **Antes de Começar o App Mobile**

- [ ] Backend completo e testado
- [ ] APIs documentadas
- [ ] Sistema de autenticação funcionando
- [ ] Sistema de pagamento configurado
- [ ] Sistema de notificações configurado
- [ ] Design system definido
- [ ] Logo e assets prontos
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Conta Google Play Developer ($25 uma vez)
- [ ] Conta Apple Developer ($99/ano)

---

## 🛠️ Comandos Úteis

```bash
# Iniciar desenvolvimento
expo start

# Testar no Android
expo start --android

# Testar no iOS
expo start --ios

# Build para produção
eas build --platform android
eas build --platform ios

# Publicar atualização OTA
expo publish
```

---

## 📚 Recursos Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)

---

## 💡 Dicas Importantes

1. **Performance**: Otimizar imagens e usar lazy loading
2. **Offline First**: App deve funcionar mesmo sem internet
3. **Push Notifications**: Essencial para reengajamento
4. **Analytics**: Implementar tracking de eventos
5. **Crash Reporting**: Usar Sentry ou similar
6. **A/B Testing**: Testar diferentes versões de UI

---

**Status**: 📋 Documentação criada - Aguardando conclusão do site para iniciar desenvolvimento mobile.

