# RELATÓRIO – INFRAESTRUTURA PC REMOTO DO MERCADO
## Projeto: Atual Supermercados

### CONTEXTO GERAL
Este projeto **NÃO começou agora**.  
Toda a infraestrutura abaixo já foi instalada, configurada e utilizada no **PC remoto do mercado**, acessado via AnyDesk.

Qualquer continuação do projeto **DEVE** considerar este ambiente como existente e funcional.

---

## PC REMOTO DO MERCADO
- **Acesso:** AnyDesk
- **Uso:**
  - Integrações
  - Banco de dados
  - Testes de API
  - Comunicação com sistemas do mercado (Sysmo / PDV)

---

## SOFTWARES INSTALADOS NO PC REMOTO

### BANCO DE DADOS
- **PostgreSQL 18**
- **pgAdmin 4**
- Banco criado e acessível localmente
- Usado para testes e estrutura de dados do projeto

### CONECTIVIDADE / API
- **Postman** – testes de endpoints e integração
- **psqlODBC (x64)** – driver ODBC do PostgreSQL para integração com sistemas externos

### DESENVOLVIMENTO / SUPORTE
- **Python 3.14**
- **Python Launcher**
- **Node.js** (em outras máquinas do projeto)
- **Git / GitHub CLI** (no ambiente de desenvolvimento)

### SISTEMA / RUNTIME
- Microsoft Visual C++ Redistributables (x64 / x86)
- Microsoft .NET Runtime
- Drivers de rede e dispositivos corretamente instalados

---

## O QUE JÁ FOI FEITO NESSE AMBIENTE
- Instalação completa do PostgreSQL
- Configuração e acesso via pgAdmin
- Testes de conexão local
- Instalação de Postman para APIs
- Instalação de ODBC para futuras integrações
- Ambiente preparado para integração com sistemas do mercado

---

## O QUE NÃO DEVE SER REFEITO
- Reinstalar PostgreSQL
- Reinstalar pgAdmin
- Reinstalar Postman
- Reinstalar ODBC
- Tratar esse PC como “novo”

Tudo isso **JÁ EXISTE** e **JÁ FOI USADO**.

---

## STATUS ATUAL
- Infraestrutura do PC remoto: **PRONTA**
- Projeto segue focado em:
  - Site (Next.js)
  - Integração com dados
  - Consumo de APIs
  - Frontend e lógica de negócio

---

## INSTRUÇÃO PARA A IA
Sempre assumir que:
- Existe um **PC remoto do mercado**
- Ele já possui **PostgreSQL + ferramentas**
- O projeto é **contínuo**
- **NÃO** é um ambiente do zero
