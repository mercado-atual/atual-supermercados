import pandas as pd
import numpy as np

# CONFIGURAÇÕES
ARQUIVO_ENTRADA = 'data/produtos_atual.csv'
ARQUIVO_SAIDA = 'data/produtos_limpos.csv'

# Lista de palavras para remover (itens de construção/uso interno)
PALAVRAS_PROIBIDAS = [
    'CANTONEIRA', 'ALUMINIO', 'ELETRODO', 'ENERGIA', 'TRANSFORMADOR', 
    'FONTE', 'SPRAY', 'USO INTERNO', 'LIQUIDACAO NO MCP', 'VALE GAS',
    'SERVICO', 'TAXA', 'IMOBILIZADO', 'MANUTENCAO', 'LUVA', 'JOELHO',
    'TUBO', 'LIXA', 'DISCO', 'BROCA', 'PARAFUSO', 'BUCHA'
]

def limpar_dados():
    print('--- INICIANDO LIMPEZA AUTOMÁTICA ---')
    
    try:
        # Carrega o arquivo
        df = pd.read_csv(ARQUIVO_ENTRADA, dtype={'gtin': str, 'codigo': str})
        total_inicial = len(df)
        print(f'Lendo {total_inicial} produtos...')

        # Remove sem GTIN
        df = df.dropna(subset=['gtin'])
        df = df[df['gtin'].str.strip() != '']

        # Remove preço zero
        df['preco'] = pd.to_numeric(df['preco'], errors='coerce')
        df = df[df['preco'] > 0.01]

        # Remove palavras proibidas
        mask_proibidos = df['descricao'].apply(lambda x: any(palavra in str(x).upper() for palavra in PALAVRAS_PROIBIDAS))
        df_final = df[~mask_proibidos]

        # Salva
        df_final.to_csv(ARQUIVO_SAIDA, index=False)
        
        print('\n' + '='*30)
        print(f'SUCESSO! Arquivo LIMPO criado: {ARQUIVO_SAIDA}')
        print(f'Total final de produtos válidos: {len(df_final)}')
        print('='*30)

    except FileNotFoundError:
        print(f'ERRO: O arquivo {ARQUIVO_ENTRADA} não foi encontrado na pasta.')
    except Exception as e:
        print(f'ERRO: {e}')

if __name__ == '__main__':
    limpar_dados()
