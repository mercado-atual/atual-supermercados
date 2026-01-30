# Deploy rápido para Vercel

Sempre que o Cursor (ou você) terminar uma **alteração importante**, use um destes comandos para enviar tudo para o GitHub e disparar o deploy na Vercel:

## Comando único (recomendado)

No terminal, na pasta do projeto:

```bash
npm run deploy
```

Isso executa: `git add .` → `git commit -m "deploy: atualização para Vercel"` → `git push`.

## Com mensagem personalizada

```powershell
.\deploy-vercel.ps1 "descrição da alteração"
```

Exemplo:

```powershell
.\deploy-vercel.ps1 "scanner admin e botão no dashboard"
```

## Lembrete para o Cursor

Ao finalizar alterações importantes no projeto, avisar o usuário e sugerir:

**"Para refletir na Vercel, rode no terminal: `npm run deploy`"**
