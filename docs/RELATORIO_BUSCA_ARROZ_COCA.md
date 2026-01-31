# Relatório de dados – Como Arroz e Coca-Cola estão escritos no banco

Consulta feita em `data/produtos_db.json` (campo `descricao`).

---

## Arroz – 3 exemplos exatos

| # | Descrição exata no banco |
|---|---------------------------|
| 1 | **ARROZ PRATO FINO 1KG PARB** |
| 2 | **ARROZ NAMORADO 5KG BRANCO** |
| 3 | **ARROZ NAMORADO 1KG BRANCO** |

Outros exemplos: "ARROZ TIO JOAO 5KG BRANCO", "ARROZ PRATO FINO 5KG PARBO", "ARROZ NAMORADO 5KG PARBOILIZADO 503063".

---

## Coca-Cola – 3 exemplos exatos

| # | Descrição exata no banco |
|---|---------------------------|
| 1 | **REFR COCA COLA 1.5L TRAD** (refrigerante) |
| 2 | **REFR COCA COLA 2L TRAD** (refrigerante) |
| 3 | **COPO CRISTAL COCA-COLA 470ML** (copo) |

Outros: "REFR COCA COLA VIDRO RET 1LT", "COPO COCA COLA VERDE 470ML", "COCA COLA 2L RETORNAVEL", "REFR COCA COLA LT 310ML ORIG".

---

## Observações

- **Arroz:** tudo em MAIÚSCULAS; "Arroz" no início; "Branco" no final em alguns (ex.: "ARROZ NAMORADO 5KG BRANCO"). Por isso "Arroz Branco" ou "Arroz t1 Branco" precisam de busca por **todas as palavras** (Arroz E Branco), sem depender da ordem.
- **Coca-Cola:** refrigerantes aparecem como "REFR COCA COLA ..."; copos como "COPO ... COCA-COLA ..." ou "COPO COCA COLA ...". Com a busca por termos e o **ranking** (nome que começa com o que foi digitado no topo), "Coca-Cola" ou "coca" tende a trazer primeiro os que têm "COCA" mais no início (ex.: "REFR COCA COLA 1.5L" antes de "COPO CRISTAL COCA-COLA 470ML").
- A busca agora **ignora acentos e maiúsculas** e **separa as palavras**, então "Arroz Branco", "coca", "COCA" e "Coca" funcionam corretamente.
