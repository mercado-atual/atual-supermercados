# Testar scanner nas prateleiras

## URL no celular

- **Scanner:** https://projeto-atual-psi.vercel.app/admin/scanner  
- **Login admin:** https://projeto-atual-psi.vercel.app/admin/login  

Use HTTPS e permita câmera e microfone/som quando o navegador pedir.

---

## Se o código de barras não encontrar o produto

1. **Buscar pelo nome**  
   Abaixo da câmera há o campo **"Não achou pelo código? Busque pelo nome"**.  
   Digite parte do nome (ex: **Supino**, **Abacaxi**, **Barra Fruta**) e toque em **Buscar**.  
   Toque no produto na lista para ver preço, estoque e ativar oferta.

2. **Barra Supino Banana e Abacaxi (Bio Brasil)**  
   - Na embalagem o código pode ser **7896798603434**.  
   - No cadastro (Sysmo) está como **BARRA FRUTA SUPINO 24G**, código **524900**, GTIN **7896798600040**.  
   - O sistema aceita os dois GTINs (alias). Se ainda não achar, use a busca por nome **Supino**.

3. **Novo código que não existe no cadastro**  
   Se o produto não aparecer nem por nome, ele não está nos ~16k itens sincronizados do Sysmo.  
   Inclua no Sysmo ou faça uma nova sincronização depois de cadastrar.

---

## Checklist rápido na loja

- [ ] Abrir o link do scanner no celular (HTTPS).
- [ ] Fazer login admin.
- [ ] Iniciar câmera e bipar o código de barras.
- [ ] Se não achar: buscar por nome (ex: Supino) e escolher o produto na lista.
- [ ] Conferir preço e estoque; ativar oferta se quiser.
