import pandas as pd
import json
import os

# Caminhos
CSV_LIMPO = os.path.join('data', 'produtos_limpos.csv')
JSON_SITE = os.path.join('data', 'produtos.json')

def atualizar_site():
    print('--- ATUALIZANDO O SITE ---')
    
    if not os.path.exists(CSV_LIMPO):
        print(f'ERRO: Não achei o arquivo {CSV_LIMPO}. Rode a limpeza antes.')
        return

    try:
        # Lê o CSV limpo
        df = pd.read_csv(CSV_LIMPO, dtype={'gtin': str, 'codigo': str})
        
        # Garante que não tem 'Sujeira' (NaN)
        df = df.fillna('')
        
        # Converte para JSON (formato que o site entende)
        # orient='records' cria uma lista de objetos: [{...}, {...}]
        dados_json = df.to_dict(orient='records')
        
        # Salva o JSON
        with open(JSON_SITE, 'w', encoding='utf-8') as f:
            json.dump(dados_json, f, indent=2, ensure_ascii=False)
            
        print(f'✅ SUCESSO! Site atualizado.')
        print(f'📦 Total de produtos ativos: {len(dados_json)}')
        print(f'📂 Arquivo gerado: {JSON_SITE}')
        print('Agora verifique o navegador!')

    except Exception as e:
        print(f'ERRO CRÍTICO: {e}')

if __name__ == '__main__':
    atualizar_site()
