# 🤝 Guia de Comunicação para Integração PDV

## 📋 O Que Você Precisa Saber e Pedir

Este documento contém tudo que você precisa perguntar e fornecer para a pessoa que gerencia o sistema PDV.

---

## 📧 MODELO DE EMAIL/MENSAGEM

```
Assunto: Integração PDV - Sistema E-commerce ATUAL Supermercados

Olá [Nome],

Estamos implementando nosso e-commerce e precisamos integrar com o sistema PDV 
para sincronizar produtos, preços e estoques em tempo real.

Gostaria de agendar uma conversa para alinharmos os detalhes técnicos da integração.

Segue abaixo as informações que precisamos e o que podemos fornecer:

[COLE O CONTEÚDO DESTE DOCUMENTO AQUI]

Aguardo retorno para agendarmos uma reunião.

Atenciosamente,
[Seu Nome]
```

---

## ❓ O QUE PERGUNTAR AO RESPONSÁVEL DO PDV

### 1. **Informações Técnicas do Sistema**

#### Perguntas Essenciais:

**a) Qual o nome e versão do sistema PDV?**
- Exemplo: "TOTVS PDV", "Linx", "Senior", "Sankhya", etc.
- Versão: "v10.5", "2024.1", etc.

**b) O sistema tem API (Application Programming Interface)?**
- ✅ Sim → Qual o tipo? (REST, SOAP, GraphQL)
- ❌ Não → Como fazemos a integração? (Arquivo, Banco de dados direto)

**c) Qual o formato de dados que o sistema usa?**
- JSON, XML, CSV, Banco de dados direto?

**d) O sistema tem documentação técnica?**
- Se sim, podemos ter acesso?

**e) Existe algum módulo de integração ou e-commerce já disponível?**
- Algum cliente já fez integração similar?

---

### 2. **Acesso e Autenticação**

#### Perguntas:

**a) Como fazemos autenticação na API?**
- API Key?
- Token JWT?
- Usuário e senha?
- OAuth?

**b) Precisamos de credenciais de acesso?**
- Quem fornece?
- Há algum processo de aprovação?

**c) Há limitações de acesso?**
- IPs permitidos?
- Horários específicos?
- Rate limiting (limite de requisições)?

---

### 3. **Dados dos Produtos**

#### Perguntas:

**a) Quais informações de produto podemos acessar?**
- Código/SKU
- Nome/Descrição
- Preço
- Estoque
- Categoria
- Imagens
- Código de barras
- Unidade de medida

**b) Como identificamos produtos únicos?**
- Código interno?
- SKU?
- Código de barras?

**c) Como são as categorias no PDV?**
- Estrutura hierárquica?
- Códigos específicos?

**d) Como funcionam as variações?**
- Produtos com tamanhos diferentes?
- Produtos com sabores diferentes?
- Como identificamos?

---

### 4. **Sincronização**

#### Perguntas:

**a) Como queremos sincronizar?**
- ✅ Tempo real (quando produto muda no PDV, atualiza no site)
- ✅ Por demanda (nós pedimos quando precisamos)
- ✅ Agendado (a cada X minutos/horas)
- ✅ Por arquivo (exportação periódica)

**b) Quem dispara a sincronização?**
- PDV envia para nós (webhook/push)?
- Nós consultamos o PDV (pull)?
- Ambos?

**c) Há eventos/notificações quando produto muda?**
- Produto criado
- Produto atualizado
- Preço alterado
- Estoque alterado

---

### 5. **Estoque**

#### Perguntas:

**a) Como funciona o controle de estoque?**
- Estoque físico?
- Estoque disponível (físico - reservado)?
- Múltiplos depósitos?

**b) Quando produto está sem estoque, o que acontece?**
- Desaparece do site?
- Mostra "Indisponível"?
- Permite compra com prazo?

**c) Como tratamos produtos com estoque baixo?**
- Alerta?
- Desabilita venda online?

---

### 6. **Preços**

#### Perguntas:

**a) Como funcionam os preços?**
- Preço único?
- Preço promocional?
- Preço por cliente (clube de vantagens)?
- Descontos por quantidade?

**b) Quando preço muda no PDV, atualiza no site?**
- Imediatamente?
- Com delay?
- Precisa aprovação?

**c) Há preços diferentes para e-commerce?**
- Preço online vs. loja física?

---

### 7. **Pedidos**

#### Perguntas:

**a) Como enviamos pedidos do site para o PDV?**
- API?
- Arquivo?
- Banco de dados?

**b) Qual formato de pedido o PDV espera?**
- JSON?
- XML?
- Estrutura específica?

**c) O que precisa ter em um pedido?**
- Itens (produto, quantidade, preço)
- Cliente (nome, CPF, endereço)
- Forma de pagamento
- Observações

**d) Como identificamos pedidos?**
- Número de pedido nosso?
- Código de rastreamento?

**e) Como recebemos confirmação do PDV?**
- Status do pedido?
- Número do pedido no PDV?
- Confirmação de estoque?

---

### 8. **Clientes**

#### Perguntas:

**a) Precisamos sincronizar clientes?**
- Cliente cadastra no site → vai para PDV?
- Cliente no PDV → pode usar no site?

**b) Como identificamos clientes?**
- CPF?
- Email?
- Código interno?

**c) Clube de Vantagens integra com PDV?**
- Pontos acumulados no PDV aparecem no site?
- Pontos do site podem usar no PDV?

---

### 9. **Infraestrutura**

#### Perguntas:

**a) Onde está hospedado o PDV?**
- Servidor local (na loja)?
- Cloud/Servidor remoto?

**b) Qual a URL/endereço da API?**
- Exemplo: `https://pdv.empresa.com.br/api`
- Ou IP: `192.168.1.100:8080`

**c) Há firewall ou restrições de rede?**
- Precisamos liberar IPs?
- VPN necessária?

**d) Qual o horário de funcionamento do sistema?**
- 24/7?
- Horário comercial?
- Manutenções programadas?

---

### 10. **Suporte e Manutenção**

#### Perguntas:

**a) Quem será o responsável técnico?**
- Nome e contato

**b) Como funciona o suporte?**
- Email?
- Telefone?
- Sistema de tickets?

**c) Há SLA (Service Level Agreement)?**
- Tempo de resposta?
- Disponibilidade garantida?

**d) Em caso de problemas, qual o processo?**
- Quem contatar?
- Escalação?

---

## 📤 O QUE FORNECER PARA O RESPONSÁVEL DO PDV

### 1. **Informações do Nosso Sistema**

#### Fornecer:

**a) URL da API do nosso e-commerce:**
```
https://projeto-atual-psi.vercel.app/api/pdv/sync-product
https://projeto-atual-psi.vercel.app/api/pdv/sync-batch
```

**b) Métodos HTTP que usamos:**
- `POST` - Para receber produtos
- `GET` - Para consultas (se necessário)

**c) Formato de dados que esperamos:**
- JSON (JavaScript Object Notation)

**d) Autenticação que usamos:**
- API Key no header `X-API-Key`

---

### 2. **Estrutura de Dados que Esperamos**

#### Formato JSON para Produto Individual:

```json
{
  "id": "12345",
  "title": "Tomate Italiano",
  "price": "5.99",
  "unit": "kg",
  "image": "https://exemplo.com/imagem.jpg",
  "category": "hortifruti",
  "description": "Tomate italiano fresco",
  "stock": 100,
  "barcode": "7891234567890",
  "badge": "Oferta"
}
```

#### Formato JSON para Sincronização em Lote:

```json
{
  "products": [
    {
      "id": "12345",
      "title": "Tomate Italiano",
      "price": "5.99",
      "unit": "kg",
      "image": "https://exemplo.com/imagem.jpg",
      "category": "hortifruti",
      "description": "Tomate italiano fresco",
      "stock": 100,
      "barcode": "7891234567890"
    },
    {
      "id": "12346",
      "title": "Banana Prata",
      "price": "3.49",
      "unit": "kg",
      "image": "https://exemplo.com/banana.jpg",
      "category": "hortifruti",
      "description": "Banana prata doce",
      "stock": 50,
      "barcode": "7891234567891"
    }
  ]
}
```

---

### 3. **Estrutura de Pedido que Enviamos**

#### Formato JSON para Pedido:

```json
{
  "trackingCode": "ATUAL123456",
  "items": [
    {
      "productId": "12345",
      "title": "Tomate Italiano",
      "quantity": 2,
      "price": 5.99
    }
  ],
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "cpf": "123.456.789-00"
  },
  "address": {
    "rua": "Rua Exemplo",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "paymentMethod": "pix",
  "total": 11.98,
  "notes": "Entregar após 14h"
}
```

---

### 4. **Documentação Técnica**

#### Fornecer:

**a) Documentação da nossa API:**
- Endpoints disponíveis
- Parâmetros esperados
- Respostas possíveis
- Códigos de erro

**b) Exemplos de requisições:**
- cURL
- Postman collection
- Código de exemplo

**c) Autenticação:**
- Como obter API Key
- Como usar no header

---

### 5. **Informações de Contato**

#### Fornecer:

**a) Responsável técnico:**
- Nome
- Email
- Telefone
- Horário de atendimento

**b) Suporte:**
- Email de suporte
- Sistema de tickets (se houver)

---

## 📝 CHECKLIST DE INTEGRAÇÃO

### Fase 1: Planejamento
- [ ] Reunião inicial com responsável PDV
- [ ] Coletar todas as informações acima
- [ ] Definir formato de integração
- [ ] Definir responsabilidades

### Fase 2: Desenvolvimento
- [ ] Criar credenciais de acesso
- [ ] Configurar endpoints
- [ ] Implementar sincronização de produtos
- [ ] Implementar envio de pedidos
- [ ] Testes em ambiente de desenvolvimento

### Fase 3: Testes
- [ ] Testar sincronização de produtos
- [ ] Testar atualização de preços
- [ ] Testar atualização de estoque
- [ ] Testar envio de pedidos
- [ ] Testar tratamento de erros

### Fase 4: Produção
- [ ] Deploy em produção
- [ ] Monitoramento inicial
- [ ] Ajustes finais
- [ ] Documentação final

---

## 🔐 INFORMAÇÕES DE SEGURANÇA

### O Que Precisamos:

**a) API Key para autenticação:**
- Chave única e secreta
- Não compartilhar publicamente

**b) HTTPS obrigatório:**
- Todas as comunicações criptografadas

**c) Validação de dados:**
- Validar todos os dados recebidos
- Sanitizar inputs

---

## 📊 EXEMPLO DE FLUXO DE INTEGRAÇÃO

### Sincronização de Produtos (PDV → Site):

```
1. Produto alterado no PDV
   ↓
2. PDV envia para nossa API
   POST /api/pdv/sync-product
   Headers: X-API-Key: [chave]
   Body: { produto JSON }
   ↓
3. Nossa API valida e salva
   ↓
4. Site atualizado automaticamente
```

### Criação de Pedido (Site → PDV):

```
1. Cliente finaliza compra no site
   ↓
2. Site envia pedido para PDV
   POST [API_PDV]/pedidos
   Headers: Authorization: [token]
   Body: { pedido JSON }
   ↓
3. PDV valida e cria pedido
   ↓
4. PDV retorna confirmação
   ↓
5. Site atualiza status do pedido
```

---

## 📞 TEMPLATE DE REUNIÃO

### Pauta Sugerida:

1. **Apresentação** (5 min)
   - Quem somos
   - O que queremos fazer

2. **Sistema PDV** (15 min)
   - Qual sistema?
   - Versão?
   - Capacidades de integração?

3. **Necessidades** (20 min)
   - O que precisamos do PDV
   - O que podemos fornecer
   - Formato de dados

4. **Próximos Passos** (10 min)
   - Cronograma
   - Responsabilidades
   - Contatos

---

## 📄 DOCUMENTO PARA ENTREGAR

Crie um documento com:

1. **Especificação Técnica**
   - Endpoints da nossa API
   - Formato de dados esperado
   - Autenticação

2. **Exemplos Práticos**
   - Código de exemplo
   - Requisições cURL
   - Respostas esperadas

3. **Contatos**
   - Responsável técnico
   - Suporte

---

## ✅ RESUMO DO QUE VOCÊ PRECISA

### Perguntar:
1. ✅ Nome e versão do sistema PDV
2. ✅ Se tem API e qual tipo
3. ✅ Como autenticar
4. ✅ Formato de dados
5. ✅ Como sincronizar produtos
6. ✅ Como enviar pedidos
7. ✅ Infraestrutura e acesso

### Fornecer:
1. ✅ URLs da nossa API
2. ✅ Formato JSON esperado
3. ✅ Como autenticar (API Key)
4. ✅ Exemplos práticos
5. ✅ Contatos técnicos

---

## 🎯 PRÓXIMOS PASSOS

1. **Agora:** Use este documento para se comunicar com o responsável PDV
2. **Após reunião:** Colete todas as respostas
3. **Me envie:** As informações coletadas
4. **Eu implemento:** A integração completa baseada nas respostas

---

**Este documento contém tudo que você precisa! Use como base para a comunicação.** 🚀



