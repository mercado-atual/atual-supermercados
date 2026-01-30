# 🛠️ Painel Administrativo - Atual Supermercados

## 📋 Visão Geral

O painel administrativo permite gerenciar produtos do site através de importação de arquivos CSV.

## 🔐 Acesso ao Admin

### URL de Acesso
```
http://localhost:3000/admin
```

### Credenciais

As credenciais são configuradas através de variáveis de ambiente:

**Arquivo:** `.env.local` (criar na raiz do projeto)

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SECRET=admin_secret_123
```

**⚠️ IMPORTANTE:** 
- Crie o arquivo `.env.local` na raiz do projeto
- Não commite este arquivo no Git (já está no .gitignore)
- Use credenciais fortes em produção

### Credenciais Padrão (se não configurado)
- **Usuário:** `admin`
- **Senha:** `admin123`

## 📦 Importação de Produtos

### Passo 1: Preparar o Arquivo CSV

O arquivo CSV deve ter o seguinte formato:

```csv
codigo,descricao,gtin,preco,estoque
1554,CANTONEIRA BANHEIRO BRANCA,7896779609574,21.89,3000
1555,CANTONEIRA P/ BANHEIRO PRETA 38CM,7896779609512,0.00,3000
```

**Colunas obrigatórias:**
- `codigo` - Código único do produto
- `descricao` - Nome/descrição do produto (obrigatório)
- `gtin` - Código de barras/EAN (opcional, pode ser vazio)
- `preco` - Preço de venda (formato: 12.90 ou 12,90)
- `estoque` - Quantidade em estoque (inteiro)

### Passo 2: Acessar a Página de Importação

1. Faça login em `/admin`
2. Clique em "Importar Produtos" ou acesse `/admin/produtos`
3. Selecione o arquivo CSV
4. Escolha se deseja limpar produtos existentes antes de importar
5. Clique em "Importar Produtos"

### Passo 3: Verificar Resultado

Após a importação, você verá:
- ✅ Total de produtos processados
- ✅ Quantos foram importados (novos)
- ✅ Quantos foram atualizados (já existiam)
- ⚠️ Erros encontrados (se houver)

## 🔄 Como Funciona

### Armazenamento

Os produtos são salvos em:
```
/data/produtos_db.json
```

Este arquivo é criado automaticamente na primeira importação.

### Atualização do Site

Após importar produtos:
1. Os produtos são salvos no arquivo JSON
2. O site público (`/api/products`) lê automaticamente do JSON
3. Os produtos aparecem imediatamente no site

### Validações

O sistema valida:
- ✅ Descrição obrigatória
- ✅ Preço como número decimal válido
- ✅ Estoque como inteiro válido
- ✅ Código único do produto

## 📁 Estrutura de Arquivos

```
app/
  admin/
    page.tsx              # Dashboard
    login/
      page.tsx            # Login
    produtos/
      page.tsx            # Importação CSV
  api/
    admin/
      auth/
        login/route.ts    # API de login
        verify/route.ts   # API de verificação
      products/
        import/route.ts   # API de importação
        count/route.ts    # API de contagem
    products/
      route.ts            # API pública de produtos

lib/
  admin-auth.ts           # Autenticação admin
  products-db.ts          # Persistência em JSON

data/
  produtos_db.json        # Banco de dados JSON (criado automaticamente)
  produtos_atual.csv      # CSV de exemplo
```

## 🚀 Uso Rápido

### 1. Configurar Credenciais

Crie `.env.local`:
```env
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha_segura
ADMIN_SECRET=seu_secret_aleatorio
```

### 2. Iniciar o Servidor

```bash
npm run dev
```

### 3. Acessar o Admin

1. Abra: `http://localhost:3000/admin`
2. Faça login com suas credenciais
3. Vá em "Importar Produtos"
4. Selecione o arquivo CSV
5. Clique em "Importar"

### 4. Verificar no Site

Os produtos importados aparecerão automaticamente em:
- Home (`/`)
- Páginas de categoria (`/hortifruti`, `/acougue`, etc.)
- Busca de produtos

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `ADMIN_USERNAME` | Usuário do admin | `admin` |
| `ADMIN_PASSWORD` | Senha do admin | `admin123` |
| `ADMIN_SECRET` | Secret para tokens | `admin_secret_123` |

## 🔒 Segurança

- ✅ Autenticação obrigatória para todas as rotas admin
- ✅ Tokens baseados em timestamp e secret
- ✅ Validação de arquivos CSV
- ✅ Sanitização de dados de entrada

## 📝 Notas

- O sistema usa arquivo JSON para simplicidade
- Em produção, considere migrar para banco de dados (PostgreSQL, MongoDB, etc.)
- O arquivo CSV pode ser gerado automaticamente pelo script `scripts/process-excel.js`
