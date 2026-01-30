# 📋 CHECKLIST - Integração API SISMO PDV

## ✅ O QUE JÁ ESTÁ PRONTO

### 1. Estrutura Técnica ✅
- ✅ **Tipos TypeScript completos** (`lib/integrations/sismo/types.ts`)
  - SismoProduct (Produto)
  - SismoPrice (Preço)
  - SismoStock (Estoque)
  - SismoCategory (Categoria)
  - Interfaces de resposta da API
  - Configuração e erros

- ✅ **Service preparado** (`lib/integrations/sismo/sismo.service.ts`)
  - Métodos mockados com assinaturas definidas
  - Pronto para substituir mocks por chamadas HTTP reais
  - Configuração via variáveis de ambiente

- ✅ **Estrutura isolada e desacoplada**
  - Não interfere no funcionamento atual
  - Pode ser integrada sem quebrar o site

---

## 🔧 O QUE PRECISA SER FEITO QUANDO A API ESTIVER DISPONÍVEL

### 1. Informações Necessárias da API SISMO

#### 📍 **URLs e Endpoints**
Precisamos saber:
- [ ] **URL base da API** (ex: `https://api.sismo.com.br` ou `https://pdv.sismo.com.br/api`)
- [ ] **Endpoints disponíveis:**
  - [ ] `GET /produtos` ou `/products` - Listar produtos
  - [ ] `GET /produtos/{id}` - Buscar produto por ID
  - [ ] `GET /precos` ou `/prices` - Listar preços
  - [ ] `GET /precos/{productId}` - Preço de um produto
  - [ ] `GET /estoque` ou `/stock` - Listar estoques
  - [ ] `GET /estoque/{productId}` - Estoque de um produto
  - [ ] `GET /categorias` ou `/categories` - Listar categorias
  - [ ] `GET /categorias/{id}` - Categoria por ID

#### 🔐 **Autenticação**
Precisamos saber:
- [ ] **Tipo de autenticação:**
  - [ ] Bearer Token? (`Authorization: Bearer {token}`)
  - [ ] API Key? (`X-API-Key: {key}`)
  - [ ] Basic Auth? (`Authorization: Basic {credentials}`)
  - [ ] Outro método?
- [ ] **Como obter o token/key:**
  - [ ] É fornecido pela SISMO?
  - [ ] Precisa fazer login primeiro?
  - [ ] Tem refresh token?

#### 📊 **Estrutura dos Dados**
Precisamos confirmar se a API retorna:
- [ ] **Produtos** com os campos:
  - `id` (string)
  - `code` ou `codigo` (string)
  - `name` ou `nome` (string)
  - `description` ou `descricao` (string, opcional)
  - `categoryId` ou `categoriaId` (string)
  - `unit` ou `unidade` (string: kg, un, l, etc)
  - `imageUrl` ou `imagem` (string, opcional)
  - `barcode` ou `codigoBarras` (string, opcional)
  - `active` ou `ativo` (boolean)

- [ ] **Preços** com os campos:
  - `id` (string)
  - `productId` ou `produtoId` (string)
  - `salePrice` ou `precoVenda` (number)
  - `promotionalPrice` ou `precoPromocional` (number, opcional)
  - `priceUnit` ou `unidadePreco` (string)
  - `promotionStartDate` ou `dataInicioPromocao` (string, opcional)
  - `promotionEndDate` ou `dataFimPromocao` (string, opcional)

- [ ] **Estoque** com os campos:
  - `id` (string)
  - `productId` ou `produtoId` (string)
  - `quantity` ou `quantidade` (number)
  - `available` ou `disponivel` (boolean)
  - `minQuantity` ou `quantidadeMinima` (number, opcional)

- [ ] **Categorias** com os campos:
  - `id` (string)
  - `name` ou `nome` (string)
  - `code` ou `codigo` (string, opcional)
  - `active` ou `ativo` (boolean)

#### 🔄 **Paginação e Filtros**
Precisamos saber:
- [ ] A API suporta paginação? (page, limit)
- [ ] Quais filtros são suportados? (categoria, busca, ativo/inativo)
- [ ] Como fazer busca por texto?

#### ⚠️ **Tratamento de Erros**
Precisamos saber:
- [ ] Como a API retorna erros?
- [ ] Códigos de status HTTP usados?
- [ ] Formato das mensagens de erro?

---

### 2. Configuração no Projeto

#### 📝 **Variáveis de Ambiente**
Criar arquivo `.env.local` com:
```env
# API SISMO PDV
SISMO_API_URL=https://api.sismo.com.br
SISMO_API_KEY=seu_token_aqui
SISMO_API_TIMEOUT=30000
```

#### 🔧 **Ajustes no Código**

1. **Atualizar `lib/integrations/sismo/sismo.service.ts`:**
   - [ ] Substituir métodos mockados por chamadas HTTP reais
   - [ ] Implementar tratamento de erros
   - [ ] Adicionar retry logic se necessário
   - [ ] Implementar cache se necessário

2. **Ajustar interfaces em `lib/integrations/sismo/types.ts`:**
   - [ ] Verificar se os nomes dos campos batem com a API real
   - [ ] Adicionar campos extras se necessário
   - [ ] Ajustar tipos conforme necessário

3. **Criar adaptador (se necessário):**
   - [ ] Converter dados da API SISMO para formato interno do projeto
   - [ ] Mapear categorias SISMO para categorias do site
   - [ ] Normalizar preços e unidades

---

### 3. Integração com o Site

#### 🔄 **Substituir Dados Mockados**
- [ ] Atualizar `app/api/items/route.ts` para usar `sismoService.getProducts()`
- [ ] Atualizar páginas de categoria para buscar da API SISMO
- [ ] Atualizar página de produto individual
- [ ] Integrar preços e estoque nas páginas

#### 🛒 **Carrinho e Checkout**
- [ ] Verificar estoque antes de adicionar ao carrinho
- [ ] Validar preços atualizados no checkout
- [ ] Desativar modo catálogo (`CATALOG_MODE = false` em `lib/catalog-config.ts`)

#### 🔍 **Busca e Filtros**
- [ ] Integrar busca com API SISMO
- [ ] Filtrar por categoria da SISMO
- [ ] Mostrar apenas produtos ativos e com estoque

---

### 4. Testes e Validação

#### ✅ **Testes Necessários**
- [ ] Testar busca de produtos
- [ ] Testar busca de preços
- [ ] Testar busca de estoque
- [ ] Testar busca de categorias
- [ ] Testar tratamento de erros
- [ ] Testar timeout e retry
- [ ] Testar performance (cache se necessário)
- [ ] Testar em produção

---

## 📄 DOCUMENTAÇÃO NECESSÁRIA DA SISMO

Para facilitar a integração, seria ideal ter:

1. **Documentação da API:**
   - [ ] Lista completa de endpoints
   - [ ] Exemplos de requisições e respostas
   - [ ] Códigos de erro possíveis
   - [ ] Limites de rate (quantas requisições por minuto)

2. **Credenciais de Teste:**
   - [ ] URL da API de teste/sandbox
   - [ ] Token/Key de teste
   - [ ] Dados de exemplo para testar

3. **Especificações Técnicas:**
   - [ ] Formato de autenticação
   - [ ] Formato de datas (ISO 8601?)
   - [ ] Formato de números (decimal separado por ponto ou vírgula?)
   - [ ] Encoding (UTF-8?)

---

## 🚀 PRÓXIMOS PASSOS

1. **Aguardar documentação da API SISMO**
2. **Obter credenciais de acesso (teste e produção)**
3. **Testar endpoints manualmente (Postman/Insomnia)**
4. **Ajustar interfaces TypeScript conforme API real**
5. **Implementar chamadas HTTP reais no service**
6. **Testar integração em ambiente de desenvolvimento**
7. **Atualizar páginas do site para usar dados da API**
8. **Desativar modo catálogo quando tudo estiver funcionando**
9. **Testar em produção**

---

## 📞 CONTATO

Quando tiver a documentação da API SISMO, compartilhe:
- URL base da API
- Documentação completa (PDF ou link)
- Credenciais de teste
- Exemplos de requisições/respostas

Com essas informações, a integração pode ser feita rapidamente! 🚀

