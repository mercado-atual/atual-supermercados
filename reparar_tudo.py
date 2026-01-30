import os
import shutil
import pandas as pd
import json

def corrigir_tudo():
    print('--- INICIANDO CORREÇÃO TOTAL DO PROJETO ---')

    # --- 1. ARRUMAR AS IMAGENS ---
    pasta_oficial = os.path.join('public', 'produtos')
    pasta_novas = os.path.join('public', 'produtos_finais')
    pasta_backup = os.path.join('public', 'produtos_backup')

    # Verifica se as imagens novas existem
    if os.path.exists(pasta_novas):
        # Se já existe uma pasta oficial, move para backup (para não dar erro)
        if os.path.exists(pasta_oficial):
            if os.path.exists(pasta_backup):
                shutil.rmtree(pasta_backup) # Apaga backup antigo
            os.rename(pasta_oficial, pasta_backup)
            print(f'📦 Pasta antiga movida para backup.')
        
        # Coloca a pasta nova no lugar certo
        os.rename(pasta_novas, pasta_oficial)
        print(f'✅ IMAGENS CORRIGIDAS! Pasta oficial atualizada.')
    else:
        print('⚠️ A pasta produtos_finais não existe. Verifique se o script de imagens rodou.')

    # --- 2. ARRUMAR OS DADOS (LIVRAR-SE DO R$ 0,00) ---
    caminho_csv = os.path.join('data', 'produtos_atual.csv')
    caminho_json = os.path.join('data', 'produtos.json')
    
    # Palavras que indicam lixo
    PROIBIDOS = ['LIQUIDACAO', 'USO INTERNO', 'ENERGIA', 'SERVICO', 'TAXA', 'ALUMINIO', 'CANTONEIRA', 'VALE GAS']

    try:
        df = pd.read_csv(caminho_csv, dtype={'gtin': str, 'codigo': str})
        
        # Filtra Preço (Remove R$ 0.00)
        df['preco'] = pd.to_numeric(df['preco'], errors='coerce')
        df = df[df['preco'] > 0.05] # Só aceita maior que 5 centavos
        
        # Filtra GTIN (Remove vazios)
        df = df.dropna(subset=['gtin'])
        
        # Filtra Palavras Proibidas
        mask = df['descricao'].apply(lambda x: any(p in str(x).upper() for p in PROIBIDOS))
        df = df[~mask]
        
        # Salva o arquivo final para o site
        dados = df.to_dict(orient='records')
        with open(caminho_json, 'w', encoding='utf-8') as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
            
        print(f'✅ DADOS CORRIGIDOS! Itens R$ 0,00 removidos.')
        print(f'📦 Total de produtos válidos no site: {len(dados)}')

    except Exception as e:
        print(f'❌ Erro nos dados: {e}')

if __name__ == '__main__':
    corrigir_tudo()
