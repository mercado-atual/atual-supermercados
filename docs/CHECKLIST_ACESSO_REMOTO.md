# ✅ Checklist: Preparar Acesso Remoto

## 📋 Antes de Começar

### Informações que Você Precisa:

- [ ] Sistema operacional do servidor (Windows/Linux)
- [ ] IP público do mercado
- [ ] Modelo do roteador do mercado
- [ ] Se tem acesso físico ao servidor agora
- [ ] Se tem alguém no mercado que pode ajudar

## 🔧 Opção 1: TeamViewer/AnyDesk (Mais Rápido)

### No Servidor do Mercado:
- [ ] Baixar TeamViewer ou AnyDesk
- [ ] Instalar como "Serviço" (opção durante instalação)
- [ ] Anotar ID e senha
- [ ] Testar conexão localmente

### De Casa:
- [ ] Baixar mesmo programa
- [ ] Conectar usando ID e senha
- [ ] Testar acesso ao banco de dados do PDV
- [ ] Testar acesso aos arquivos do sistema

**Tempo estimado:** 15-30 minutos

## 🔧 Opção 2: VPN + RDP (Mais Seguro)

### No Servidor/Router:
- [ ] Verificar se router suporta VPN
- [ ] Configurar VPN (OpenVPN/WireGuard)
- [ ] Criar usuário VPN
- [ ] Testar conexão VPN

### Configurar RDP:
- [ ] Habilitar Área de Trabalho Remota
- [ ] Configurar firewall
- [ ] Criar usuário com permissões
- [ ] Testar RDP localmente

### De Casa:
- [ ] Instalar cliente VPN
- [ ] Conectar VPN
- [ ] Conectar RDP usando IP interno
- [ ] Testar acesso completo

**Tempo estimado:** 2-4 horas (primeira vez)

## 🔧 Opção 3: SSH (Se Linux)

### No Servidor:
- [ ] Instalar OpenSSH Server
- [ ] Configurar firewall (porta 22)
- [ ] Criar usuário SSH
- [ ] Configurar chave SSH (opcional mas recomendado)

### De Casa:
- [ ] Instalar cliente SSH (PuTTY no Windows)
- [ ] Conectar via SSH
- [ ] Testar acesso

**Tempo estimado:** 1-2 horas

## 🎯 Para Integração PDV → Site

### Após Ter Acesso Remoto:

- [ ] Acessar banco de dados do PDV
- [ ] Identificar tabela de produtos
- [ ] Ver estrutura dos dados
- [ ] Criar script de sincronização
- [ ] Testar envio de dados para API
- [ ] Configurar execução automática

## 📝 Scripts Úteis

### Verificar se Servidor Está Acessível:

```bash
# Windows (PowerShell)
Test-NetConnection -ComputerName ip-do-servidor -Port 3389

# Linux/Mac
nc -zv ip-do-servidor 3389
```

### Ver IP Público:

```bash
# Windows
curl ifconfig.me

# Linux/Mac
curl ifconfig.me
```

## ⚠️ Segurança

- [ ] Senha forte configurada
- [ ] Firewall ativado
- [ ] Logs de acesso habilitados
- [ ] Backup antes de mudanças
- [ ] Documentar credenciais (em local seguro)

## 🆘 Se Não Conseguir Acesso

### Alternativas:

1. **Acesso Físico Temporário:**
   - Ir ao mercado uma vez
   - Configurar tudo
   - Depois usar remoto

2. **Ajuda de Alguém no Mercado:**
   - Instruir por telefone/videochamada
   - Pessoa instala TeamViewer
   - Você conecta e configura

3. **Serviço de TI:**
   - Contratar técnico para configurar
   - Mais rápido mas tem custo

## 📞 Próximos Passos

1. Escolher método de acesso
2. Configurar acesso remoto
3. Testar conectividade
4. Acessar banco de dados PDV
5. Implementar sincronização

---

**Dica:** Comece com TeamViewer/AnyDesk para ter acesso rápido, depois configure VPN para solução permanente mais segura.

