# Scanner de preços no celular (Vercel)

## Por que o scanner precisa estar na Vercel

A câmera do navegador (usada para ler código de barras) **só funciona em contexto seguro**:

- **HTTPS** (ex: `https://atual-supermercados.vercel.app`)
- ou **localhost** (só no seu PC)

Se você abrir o site por **HTTP** (ex: `http://192.168.x.x:3000`) no celular, o navegador **não** libera a câmera e o scanner não inicia.

Por isso é importante que o projeto esteja **publicado na Vercel** e que você use no celular a URL HTTPS do projeto (ex: `https://atual-supermercados.vercel.app/admin/scanner`).

## Passos para funcionar no celular

1. **Fazer deploy na Vercel**  
   Garanta que o código está no GitHub e que a Vercel fez o build com sucesso (comando: `npm run deploy`).

2. **Abrir o site em HTTPS no celular**  
   No navegador do celular, acesse:  
   `https://atual-supermercados.vercel.app`  
   (ou a URL exata do seu projeto na Vercel)

3. **Fazer login no admin**  
   Vá em **Admin** → **Login** e entre com seu usuário/senha de admin.

4. **Abrir o scanner**  
   Vá em **Dashboard** ou **Scanner** e toque em **Iniciar câmera**.  
   Quando o navegador pedir permissão para usar a câmera, toque em **Permitir**.

5. **Bipar o código de barras**  
   Aponte a câmera para o código de barras (EAN-13). O app mostra:
   - Preço Sysmo
   - Preço site
   - Estoque
   - Botões para **Ativar oferta relâmpago** e **Remover oferta**

## Se ainda não funcionar no celular

- **"Câmera bloqueada"**  
  Nas configurações do navegador (Chrome/Safari), libere o uso da câmera para o site da Vercel.

- **"Use o site em HTTPS"**  
  Confirme que a URL começa com `https://` e não `http://`.

- **iOS (Safari)**  
  Use a última versão do iOS e do Safari. Se possível, teste também no **Chrome** no iPhone.

- **Atualizar a página**  
  Às vezes é preciso recarregar a página após permitir a câmera.

## Resumo

| Onde você acessa | Câmera funciona? |
|------------------|------------------|
| `https://atual-supermercados.vercel.app` no celular | Sim (recomendado) |
| `http://...` no celular | Não |
| `localhost` no PC | Sim (desenvolvimento) |

Depois de publicar na Vercel e acessar pelo link HTTPS no celular, o scanner deve ver o valor da mercadoria e permitir conferir e mudar as promoções (ativar/remover oferta).
