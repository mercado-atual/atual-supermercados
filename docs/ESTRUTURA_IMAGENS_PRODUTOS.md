# 📸 ESTRUTURA DE IMAGENS DE PRODUTOS

## 🎯 Como Funciona

O sistema busca imagens de produtos de forma inteligente, considerando **código** e **marca** do produto.

---

## 📁 Estrutura de Pastas

As imagens devem estar em: `public/produtos/`

### Padrões de Nomenclatura

1. **Por Código (sem marca):**
   ```
   /produtos/{codigo}.jpg
   ```
   Exemplo: `/produtos/12345.jpg`

2. **Por Código + Marca:**
   ```
   /produtos/{codigo}_{marca_normalizada}.jpg
   ```
   Exemplo: `/produtos/12345_TIO_JOAO.jpg`

3. **Por Marca (pasta):**
   ```
   /produtos/{marca_normalizada}/{codigo}.jpg
   ```
   Exemplo: `/produtos/TIO_JOAO/12345.jpg`
   *(Ainda não implementado, mas pode ser usado no futuro)*

---

## 🔍 Prioridade de Busca

O sistema tenta encontrar a imagem na seguinte ordem:

1. **Imagem explícita do Sysmo** (se vier no campo `imagem`, `image`, `foto`, etc.)
2. **Código + Marca:** `/produtos/{codigo}_{marca}.jpg`
3. **Apenas Código:** `/produtos/{codigo}.jpg`
4. **Placeholder:** "Sem imagem" (se não encontrar nenhuma)

---

## 📝 Normalização de Marca

A marca é normalizada para nome de arquivo:
- Maiúsculas: `TIO JOAO` → `TIO_JOAO`
- Remove acentos: `TIO JOÃO` → `TIO_JOAO`
- Remove espaços: `TIO JOAO` → `TIO_JOAO`
- Remove caracteres especiais

**Exemplos:**
- `TIO JOAO` → `TIO_JOAO`
- `CAMIL` → `CAMIL`
- `PRATO FINO` → `PRATO_FINO`

---

## 🎨 Exemplos Práticos

### Arroz Branco - Tio João
- **Código:** `12345`
- **Marca:** `TIO JOAO`
- **Caminho tentado:** `/produtos/12345_TIO_JOAO.jpg`

### Arroz Branco - Camil
- **Código:** `12346`
- **Marca:** `CAMIL`
- **Caminho tentado:** `/produtos/12346_CAMIL.jpg`

### Arroz Branco (sem marca)
- **Código:** `12347`
- **Marca:** (não informada)
- **Caminho tentado:** `/produtos/12347.jpg`

---

## ✅ Como Organizar as Imagens

### Opção 1: Por Código + Marca (Recomendado)
```
public/produtos/
  ├── 12345_TIO_JOAO.jpg
  ├── 12346_CAMIL.jpg
  ├── 12347_PRATO_FINO.jpg
  └── ...
```

### Opção 2: Por Código (se não tiver marca)
```
public/produtos/
  ├── 12345.jpg
  ├── 12346.jpg
  └── ...
```

### Opção 3: Por Pasta de Marca (Futuro)
```
public/produtos/
  ├── TIO_JOAO/
  │   ├── 12345.jpg
  │   └── 12350.jpg
  ├── CAMIL/
  │   ├── 12346.jpg
  │   └── 12351.jpg
  └── ...
```

---

## 🔧 Implementação Técnica

A função `construirCaminhoImagem()` está em:
- `lib/sistema.ts` - Para produtos do Sysmo
- `app/api/products/route.ts` - Para produtos do banco local

**Código:**
```typescript
function construirCaminhoImagem(codigo: string, marca: string): string {
  if (!codigo) return "";
  
  const normalizarParaArquivo = (texto: string): string => {
    return texto
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, "_") // Espaços vira underscore
      .replace(/[^A-Z0-9_]/g, ""); // Remove caracteres especiais
  };
  
  const codigoLimpo = codigo.trim();
  
  if (marca) {
    const marcaNormalizada = normalizarParaArquivo(marca);
    return `/produtos/${codigoLimpo}_${marcaNormalizada}.jpg`;
  }
  
  return `/produtos/${codigoLimpo}.jpg`;
}
```

---

## 📋 Checklist para Adicionar Imagens

- [ ] Verificar código do produto no Sysmo
- [ ] Verificar marca do produto (se houver)
- [ ] Normalizar nome da marca (maiúsculas, sem acentos, underscore)
- [ ] Nomear arquivo: `{codigo}_{marca}.jpg` ou `{codigo}.jpg`
- [ ] Colocar em `public/produtos/`
- [ ] Testar se a imagem aparece no site

---

## ⚠️ Observações

1. **Extensão:** Por padrão, o sistema busca `.jpg`. Se usar outra extensão, precisa vir explícita do Sysmo.

2. **Case Sensitive:** Os nomes de arquivo são case-sensitive. Use maiúsculas para marcas.

3. **Fallback:** Se não encontrar imagem, o sistema mostra placeholder "Sem imagem".

4. **Performance:** O sistema não verifica se o arquivo existe antes de retornar o caminho. O navegador tentará carregar e mostrará erro se não existir.

---

**Última atualização:** 17/01/2026
