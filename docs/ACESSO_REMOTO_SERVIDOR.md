# 🔐 Guia de Acesso Remoto ao Servidor do Mercado

## 📋 Opções de Acesso Remoto

### 1. **VPN (Rede Privada Virtual) - RECOMENDADO** ⭐

A forma mais segura de acessar o servidor remotamente.

#### Como Funciona:
- Você cria uma conexão segura e criptografada com a rede do mercado
- Parece que você está fisicamente na rede local
- Todos os dados são criptografados

#### Implementação:

**Opção A: VPN com Windows Server (se o mercado usa Windows)**
1. Instalar "Roteamento e Acesso Remoto" no servidor
2. Configurar VPN Server
3. Criar usuário com permissão de VPN
4. Conectar de casa usando cliente VPN do Windows

**Opção B: VPN com Router (mais comum)**
- Muitos roteadores modernos já têm VPN embutida
- Configurar OpenVPN ou WireGuard no roteador
- Conectar usando aplicativo no seu computador

**Opção C: Serviço VPN Cloud (mais fácil)**
- Usar serviços como Tailscale, ZeroTier ou Hamachi
- Instalar no servidor do mercado e no seu PC
- Conectar automaticamente

### 2. **RDP (Remote Desktop Protocol) - Windows**

Acesso direto à área de trabalho do servidor.

#### Requisitos:
- Windows Server ou Windows Pro no servidor
- RDP habilitado
- Porta 3389 aberta no firewall (ou porta customizada)

#### Como Configurar:

**No Servidor do Mercado:**
1. Abrir "Configurações do Sistema"
2. Ir em "Sistema" → "Área de Trabalho Remota"
3. Habilitar "Área de Trabalho Remota"
4. Configurar firewall para permitir porta 3389
5. Criar usuário com senha forte

**De Casa:**
1. Abrir "Conexão de Área de Trabalho Remota" (mstsc)
2. Digitar IP público do mercado ou domínio
3. Inserir usuário e senha
4. Conectar

⚠️ **IMPORTANTE**: Use VPN + RDP para maior segurança!

### 3. **SSH (Secure Shell) - Linux/Unix**

Para servidores Linux.

#### Como Funcionar:

**No Servidor:**
```bash
# Instalar SSH (se não tiver)
sudo apt install openssh-server  # Ubuntu/Debian
sudo yum install openssh-server # CentOS/RHEL

# Habilitar SSH
sudo systemctl enable ssh
sudo systemctl start ssh

# Verificar status
sudo systemctl status ssh
```

**De Casa:**
```bash
# Conectar via SSH
ssh usuario@ip-do-servidor

# Ou com porta customizada
ssh -p 2222 usuario@ip-do-servidor
```

### 4. **TeamViewer / AnyDesk (Mais Fácil para Iniciantes)**

Programas prontos que funcionam através de internet.

#### Vantagens:
- ✅ Muito fácil de usar
- ✅ Funciona através de firewall
- ✅ Não precisa configurar nada complexo
- ✅ Interface gráfica amigável

#### Como Usar:

1. **No Servidor do Mercado:**
   - Baixar TeamViewer ou AnyDesk
   - Instalar como "Serviço" (para acesso sem ninguém estar logado)
   - Anotar ID e senha

2. **De Casa:**
   - Baixar TeamViewer/AnyDesk
   - Digitar ID do servidor
   - Digitar senha
   - Conectar

⚠️ **Limitação**: Versões gratuitas têm restrições de uso comercial.

### 5. **Chrome Remote Desktop (Google)**

Gratuito e fácil, se o mercado usa Google Workspace.

## 🛡️ Segurança - CRÍTICO!

### ⚠️ NUNCA faça isso:
- ❌ Abrir portas diretamente na internet sem proteção
- ❌ Usar senhas fracas
- ❌ Deixar RDP/SSH acessível publicamente sem VPN
- ❌ Compartilhar credenciais por email/WhatsApp

### ✅ SEMPRE faça isso:
- ✅ Use VPN sempre que possível
- ✅ Senhas fortes (mínimo 12 caracteres, mistura de letras/números/símbolos)
- ✅ Autenticação de dois fatores (2FA)
- ✅ Firewall configurado corretamente
- ✅ Logs de acesso monitorados
- ✅ Atualizações de segurança em dia

## 🔧 Configuração Passo a Passo (Cenário Recomendado)

### Cenário: Mercado com Windows Server

#### Passo 1: Configurar VPN no Servidor

**Se usar Windows Server:**
1. Abrir "Gerenciador do Servidor"
2. Adicionar função "Roteamento e Acesso Remoto"
3. Configurar como VPN Server
4. Escolher interface de rede
5. Configurar intervalo de IPs para VPN (ex: 192.168.100.0/24)

**Se usar Router com VPN:**
- Acessar painel do roteador (geralmente 192.168.1.1)
- Procurar seção "VPN" ou "OpenVPN"
- Seguir instruções do fabricante

#### Passo 2: Criar Usuário para VPN

```powershell
# No Windows Server (PowerShell como Admin)
New-LocalUser -Name "vpn_usuario" -Password (ConvertTo-SecureString "SenhaForte123!" -AsPlainText -Force)
Add-LocalGroupMember -Group "Remote Desktop Users" -Member "vpn_usuario"
```

#### Passo 3: Configurar Firewall

- Permitir porta 1723 (PPTP) ou 1194 (OpenVPN)
- Permitir protocolo GRE (Protocolo 47)

#### Passo 4: Conectar de Casa

**Windows:**
1. Configurações → Rede e Internet → VPN
2. Adicionar conexão VPN
3. Tipo: PPTP ou L2TP/IPsec
4. Servidor: IP público do mercado
5. Usuário e senha criados
6. Conectar

**Mac:**
1. Preferências do Sistema → Rede
2. Adicionar VPN
3. Configurar conforme acima

#### Passo 5: Após Conectar VPN, Acessar RDP

1. Conectar VPN primeiro
2. Depois abrir Conexão de Área de Trabalho Remota
3. Usar IP interno do servidor (ex: 192.168.1.10)
4. Conectar normalmente

## 🌐 Descobrir IP Público do Mercado

Para configurar VPN/RDP, você precisa do IP público:

**No servidor do mercado:**
- Abrir navegador
- Ir em https://whatismyipaddress.com
- Anotar o IP público

**Ou via linha de comando:**
```bash
curl ifconfig.me
```

## 📱 Alternativa: Acesso via Smartphone

Se o servidor tiver TeamViewer/AnyDesk instalado:
- Baixar app no celular
- Conectar de qualquer lugar
- Útil para emergências

## 🔍 Verificar se Está Funcionando

### Teste de Conectividade:

```bash
# Testar se consegue alcançar o servidor
ping ip-do-servidor

# Testar porta específica (RDP)
telnet ip-do-servidor 3389

# Testar porta SSH
telnet ip-do-servidor 22
```

## 🆘 Problemas Comuns

### "Não consigo conectar"
- ✅ Verificar se VPN está conectada
- ✅ Verificar firewall do servidor
- ✅ Verificar se serviço está rodando
- ✅ Verificar IP/porta corretos

### "Conexão muito lenta"
- ✅ Verificar velocidade da internet do mercado
- ✅ Usar cabo em vez de WiFi
- ✅ Reduzir qualidade gráfica no RDP

### "Acesso negado"
- ✅ Verificar usuário e senha
- ✅ Verificar permissões do usuário
- ✅ Verificar se usuário está ativo

## 💡 Recomendação Final

**Para seu caso (acesso remoto ao PDV):**

1. **Curto Prazo (Rápido):**
   - Instalar TeamViewer ou AnyDesk no servidor
   - Conectar de casa quando precisar
   - Usar para configurar integração

2. **Médio Prazo (Melhor):**
   - Configurar VPN no roteador do mercado
   - Conectar via VPN + RDP
   - Mais seguro e profissional

3. **Longo Prazo (Ideal):**
   - VPN corporativa dedicada
   - Firewall profissional
   - Monitoramento de acesso
   - Backup automático

## 📞 Precisa de Ajuda?

Se precisar de ajuda específica com:
- Configuração de VPN no seu roteador específico
- Configuração de RDP no Windows Server
- Troubleshooting de conexão
- Configuração de firewall

Me avise qual é a situação específica do mercado (tipo de servidor, sistema operacional, roteador) que eu te ajudo passo a passo!

