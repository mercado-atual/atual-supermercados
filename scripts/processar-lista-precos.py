#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para processar lista de preços do Sysmo e gerar produtos formatados
"""

import csv
import json
import re
import sys

def limpar_texto(texto):
    """Remove espaços extras e normaliza"""
    if not texto:
        return ""
    return " ".join(texto.split()).strip()

def formatar_nome(descricao, unidade):
    """Formata o nome do produto combinando descrição + unidade"""
    desc = limpar_texto(descricao)
    unid = limpar_texto(unidade)
    
    if not desc:
        return ""
    
    # Se a unidade já está na descrição, não duplicar
    desc_upper = desc.upper()
    unid_upper = unid.upper() if unid else ""
    
    # Verificar se unidade já está na descrição
    if unid_upper and unid_upper in desc_upper:
        return desc
    
    # Se unidade é "UN" e não é óbvio, pode omitir
    if unid_upper in ["UN", "UN.", "UNIDADE", "UNID"]:
        # Verificar se descrição já indica unidade
        if any(x in desc_upper for x in ["UN", "UN.", "UNIDADE", "UNID", "PC", "PÇ", "PECA"]):
            return desc
        # Para itens como "DETERGENTE", não precisa adicionar "UN"
        return desc
    
    # Adicionar unidade se for KG, L, ou outras unidades importantes
    if unid_upper in ["KG", "L", "ML", "G", "GR", "LT", "LITRO", "QUILO"]:
        return f"{desc} {unid}"
    
    # Para outros casos, adicionar unidade
    if unid:
        return f"{desc} {unid}"
    
    return desc

def parse_preco(preco_str):
    """Converte preço de string para número"""
    if not preco_str:
        return None
    
    # Remove espaços e substitui vírgula por ponto
    preco_limpo = preco_str.strip().replace(',', '.')
    
    try:
        return float(preco_limpo)
    except:
        return None

def processar_csv(arquivo_csv):
    """Processa o arquivo CSV e retorna lista de produtos"""
    produtos = []
    
    with open(arquivo_csv, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f, delimiter=';')
        linhas = list(reader)
    
    # Encontrar linha de cabeçalho (geralmente linha 4 ou 5)
    cabecalho_idx = None
    for i, linha in enumerate(linhas[:10]):
        if len(linha) > 1:
            primeira_col = linha[0].upper() if linha[0] else ""
            segunda_col = linha[1].upper() if len(linha) > 1 and linha[1] else ""
            if 'CODIGO' in primeira_col or 'CÓDIGO' in primeira_col:
                if 'DESCRI' in segunda_col or 'DESCRIÇÃO' in segunda_col:
                    cabecalho_idx = i
                    break
    
    if cabecalho_idx is None:
        # Tentar linha 4 diretamente
        if len(linhas) > 4:
            cabecalho_idx = 4
    
    if cabecalho_idx is None:
        print("Erro: Nao foi possivel encontrar cabecalho")
        return produtos
    
    print(f"Cabecalho encontrado na linha {cabecalho_idx + 1}")
    
    # Processar linhas de dados
    for i, linha in enumerate(linhas[cabecalho_idx + 2:], start=cabecalho_idx + 2):
        # Pular linhas vazias ou de cabeçalho
        if len(linha) < 3:
            continue
        
        codigo = limpar_texto(linha[0]) if len(linha) > 0 else ""
        # Descrição pode estar na coluna 1 ou 2
        descricao = ""
        if len(linha) > 2 and linha[2]:
            descricao = limpar_texto(linha[2])
        elif len(linha) > 1 and linha[1]:
            descricao = limpar_texto(linha[1])
        
        # Unidade está na coluna 4 (índice 4)
        unidade = limpar_texto(linha[4]) if len(linha) > 4 else ""
        
        # Pular linhas que são cabeçalhos de departamento/categoria
        if not codigo or codigo.startswith("DEPARTAMENTO") or codigo.startswith("CATEGORIA") or codigo.startswith("      "):
            continue
        
        # Pular se não tem descrição
        if not descricao:
            continue
        
        # Tentar encontrar preço (geralmente na coluna 8 ou 9 - Tab1)
        preco = None
        # Procurar preço nas colunas 8, 9, 10
        for j in range(8, min(11, len(linha))):
            if j < len(linha) and linha[j]:
                preco_str = linha[j].strip()
                preco = parse_preco(preco_str)
                if preco and preco > 0:
                    break
        
        # Se não encontrou preço, pular
        if not preco or preco <= 0:
            continue
        
        # Formatar nome
        nome_formatado = formatar_nome(descricao, unidade)
        
        if nome_formatado:
            produtos.append({
                "codigo": codigo,
                "nome": nome_formatado,
                "preco": f"R$ {preco:.2f}".replace('.', ',')
            })
    
    return produtos

if __name__ == "__main__":
    arquivo_csv = "lista_precos_sysmo.csv"
    
    print(f"Processando arquivo: {arquivo_csv}")
    produtos = processar_csv(arquivo_csv)
    
    print(f"\nTotal de produtos processados: {len(produtos)}")
    print(f"\nPrimeiros 10 produtos:")
    for i, p in enumerate(produtos[:10], 1):
        print(f"{i}. {p['nome']} - {p['preco']}")
    
    # Salvar em JSON
    arquivo_json = "data/produtos_lista_precos.json"
    with open(arquivo_json, 'w', encoding='utf-8') as f:
        json.dump(produtos, f, ensure_ascii=False, indent=2)
    
    print(f"\nProdutos salvos em: {arquivo_json}")
    print(f"Total: {len(produtos)} produtos")
