import os
import shutil
import pandas as pd
import json
import glob

def resgate_total():
    print('--- 🕵️‍♂️ SHERLOCK HOLMES: RESGATE DO PROJETO ---')
    
    # === 1. CAÇA ÀS IMAGENS ===
    destino_final = os.path.join('public', 'produtos')
    
    # Se a pasta destino não existe, cria
    if not os.path.exists(destino_final):
        os.makedirs(destino_final)

    # Lugares onde as imagens podem estar escondidas
    esconderijos = [
        os.path.join('public', 'produtos_finais'),
        os.path.join('public', 'produtos_originais'),
        os.path.join('public', 'produtos')
    ]
    
    contador = 0
    print('🔎 Procurando imagens perdidas nas pastas...')
    
    for pasta in esconderijos:
        if os.path.exists(pasta):
            # Pega todos os JPG e PNG
            arquivos = glob.glob(os.path.join(pasta, '*.[jp][pn]g'))
            print(f'   -> Na pasta {os.path.basename(pasta)} encontrei: {len(arquivos)} imagens.')
            
            for arq in arquivos:
                nome = os.path.basename(arq)
                caminho_destino = os.path.join(destino_final, nome)
                
                # Só move se já não estiver lá
                if os.path.abspath(arq) != os.path.abspath(caminho_destino):
                    try:
                        shutil.copy2(arq, caminho_destino)
                        contador += 1
                    except:
                        pass
    
    print(f'✅ IMAGENS RESGATADAS: Total de {len(os.listdir(destino_final))} arquivos na pasta certa (public/produtos).')

    # === 2. LIMPEZA DOS DADOS (EXTERMINAR R$ 0,00) ===
    print('\n🧹 Limpando banco de dados...')
    arquivo_csv = os.path.join('data', 'produtos_atual.csv')
    arquivo_json = os.path.join('data', 'produtos.json')
    
    # Palavras PROIBIDAS (Lixo)
    LIXO = ['LIQUIDACAO', 'USO INTERNO', 'ENERGIA', 'SERVICO', 'TAXA', 'ALUMINIO', 'CANTONEIRA', 'VALE GAS', 'IMOBILIZADO']
    
    try:
        df = pd.read_csv(arquivo_csv, dtype={'gtin': str, 'codigo': str})
        
        # Filtro 1: Preço > R$ 0,05
        df['preco'] = pd.to_numeric(df['preco'], errors='coerce')
        df = df[df['preco'] > 0.05]
        
        # Filtro 2: GTIN existe
        df = df.dropna(subset=['gtin'])
        
        # Filtro 3: Remove palavras proibidas
        mask = df['descricao'].apply(lambda x: any(p in str(x).upper() for p in LIXO))
        df = df[~mask]
        
        # Salva JSON novo
        dados = df.to_dict(orient='records')
        with open(arquivo_json, 'w', encoding='utf-8') as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
            
        print(f'✅ DADOS LIMPOS: {len(dados)} produtos válidos.')
        print('   (Se ver preço R$ 0,00 no site, é CACHE antigo!)')

    except Exception as e:
        print(f'❌ Erro: {e}')

if __name__ == '__main__':
    resgate_total()
