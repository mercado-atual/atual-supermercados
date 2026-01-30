import os
import shutil
import pandas as pd
import json
import glob

def auto_fix():
    print('--- INICIANDO AUTO-CORRECAO DO SITE ---')
    
    # --- 1. RESOLVER AS IMAGENS (Aonde quer que estejam) ---
    pasta_oficial = os.path.join('public', 'produtos')
    
    # Pastas onde as imagens podem estar perdidas
    locais_possiveis = [
        os.path.join('public', 'produtos_finais'),
        os.path.join('public', 'produtos_originais'),
        os.path.join('public', 'produtos') # A própria pasta
    ]
    
    imagens_encontradas = []
    
    # Varre todas as pastas procurando JPG/PNG
    print('Procurando imagens perdidas...')
    for pasta in locais_possiveis:
        if os.path.exists(pasta):
            arquivos = glob.glob(os.path.join(pasta, '*.[jp][pn]g')) # Pega jpg e png
            if len(arquivos) > 0:
                print(f'   -> Achei {len(arquivos)} imagens em: {pasta}')
                imagens_encontradas.extend(arquivos)
    
    if len(imagens_encontradas) == 0:
        print('ERRO CRITICO: Nenhuma imagem encontrada em lugar nenhum!')
        return

    # Recria a pasta oficial limpa
    if not os.path.exists(pasta_oficial):
        os.makedirs(pasta_oficial)
        
    # Move as imagens encontradas para a pasta oficial (se já não estiverem lá)
    print(f'Movendo/Consolidando {len(imagens_encontradas)} imagens para {pasta_oficial}...')
    count_movidos = 0
    for img_path in imagens_encontradas:
        nome_arquivo = os.path.basename(img_path)
        destino = os.path.join(pasta_oficial, nome_arquivo)
        
        # Só copia se não for o mesmo arquivo
        if os.path.abspath(img_path) != os.path.abspath(destino):
            try:
                shutil.copy2(img_path, destino)
                count_movidos += 1
            except:
                pass

    total_imagens = len([f for f in os.listdir(pasta_oficial) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    print(f'IMAGENS PRONTAS: {total_imagens} arquivos na pasta do site.')

    # --- 2. LIMPAR OS DADOS (Tirar o R$ 0,00) ---
    print('\nLimpando banco de dados...')
    caminho_csv = os.path.join('data', 'produtos_atual.csv')
    caminho_json = os.path.join('data', 'produtos.json')
    
    try:
        df = pd.read_csv(caminho_csv, dtype={'gtin': str, 'codigo': str})
        
        # Regras de Limpeza
        # 1. Preço deve ser maior que 0.05 centavos
        df['preco'] = pd.to_numeric(df['preco'], errors='coerce')
        df = df[df['preco'] > 0.05]
        
        # 2. GTIN não pode ser vazio
        df = df.dropna(subset=['gtin'])
        
        # 3. Remover palavras proibidas (Lixo do sistema)
        LIXO = ['LIQUIDACAO', 'USO INTERNO', 'ENERGIA', 'SERVICO', 'TAXA', 'ALUMINIO', 'CANTONEIRA', 'VALE GAS']
        mask = df['descricao'].apply(lambda x: any(p in str(x).upper() for p in LIXO))
        df = df[~mask]
        
        # Salva o JSON para o site
        dados = df.to_dict(orient='records')
        with open(caminho_json, 'w', encoding='utf-8') as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
            
        print(f'DADOS PRONTOS: {len(dados)} produtos validos (Sem R$ 0,00).')
        
    except Exception as e:
        print(f'ERRO ao limpar dados: {e}')

    print('\n' + '='*40)
    print('PROCESSO CONCLUIDO! AGORA REINICIE O SITE.')
    print('='*40)

if __name__ == '__main__':
    auto_fix()
