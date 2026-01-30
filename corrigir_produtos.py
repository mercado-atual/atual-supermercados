import pandas as pd
import json
import os
import glob

def corrigir_produtos():
    print('=== CORRIGINDO PRODUTOS E IMAGENS ===\n')
    
    # 1. LER CSV
    csv_path = 'data/produtos_atual.csv'
    json_path = 'data/produtos.json'
    imagens_dir = 'public/produtos'
    
    print('1. Lendo CSV...')
    df = pd.read_csv(csv_path, dtype={'gtin': str, 'codigo': str})
    total_inicial = len(df)
    print(f'   Total inicial: {total_inicial} produtos')
    
    # 2. REMOVER PRODUTOS COM PREÇO 0,00
    print('\n2. Removendo produtos com preço R$ 0,00...')
    df['preco'] = pd.to_numeric(df['preco'], errors='coerce')
    df_limpo = df[df['preco'] > 0.01].copy()
    removidos_preco = total_inicial - len(df_limpo)
    print(f'   Removidos por preço zero: {removidos_preco} produtos')
    
    # 3. REMOVER PRODUTOS SEM GTIN
    print('\n3. Removendo produtos sem GTIN...')
    df_limpo = df_limpo.dropna(subset=['gtin'])
    df_limpo = df_limpo[df_limpo['gtin'].str.strip() != '']
    removidos_gtin = len(df[df['preco'] > 0.01]) - len(df_limpo)
    print(f'   Removidos por falta de GTIN: {removidos_gtin} produtos')
    
    # 4. REMOVER PRODUTOS INVÁLIDOS (cabeçalhos, categorias, etc)
    print('\n4. Removendo produtos inválidos...')
    palavras_proibidas = [
        'DEPARTAMENTO', 'CATEGORIA', 'MERCADO FROZZA', 'TABELA DA LISTA',
        'Estado:', 'Código - Descrição', 'CANTONEIRA', 'ALUMINIO',
        'ENERGIA ELETRICA', 'VALE GAS', 'LIQUIDACAO', 'USO INTERNO',
        'SERVICO', 'TAXA', 'TRANSFORMADOR', 'FONTE', 'ELETRODO'
    ]
    
    mask_invalidos = df_limpo['descricao'].apply(
        lambda x: any(palavra in str(x).upper() for palavra in palavras_proibidas)
    )
    df_limpo = df_limpo[~mask_invalidos]
    removidos_invalidos = len(df[df['preco'] > 0.01].dropna(subset=['gtin'])) - len(df_limpo)
    print(f'   Removidos produtos inválidos: {removidos_invalidos} produtos')
    
    # 5. VERIFICAR IMAGENS DISPONÍVEIS
    print('\n5. Verificando imagens disponíveis...')
    imagens_disponiveis = set()
    if os.path.exists(imagens_dir):
        arquivos = glob.glob(os.path.join(imagens_dir, '*.jpg'))
        for arquivo in arquivos:
            nome = os.path.basename(arquivo)
            codigo = nome.replace('.jpg', '')
            imagens_disponiveis.add(codigo)
    print(f'   Imagens encontradas: {len(imagens_disponiveis)}')
    
    # 6. ASSOCIAR IMAGENS AOS PRODUTOS
    print('\n6. Associando imagens aos produtos...')
    produtos_com_imagem = 0
    produtos_sem_imagem = 0
    
    produtos_finais = []
    for _, row in df_limpo.iterrows():
        codigo = str(row['codigo']).strip()
        imagem_path = ''
        
        # Verifica se existe imagem para este código
        if codigo in imagens_disponiveis:
            imagem_path = f'/produtos/{codigo}.jpg'
            produtos_com_imagem += 1
        else:
            produtos_sem_imagem += 1
        
        produto = {
            'codigo': codigo,
            'descricao': str(row['descricao']).strip(),
            'gtin': str(row['gtin']).strip(),
            'preco': float(row['preco']),
            'estoque': int(row['estoque']) if pd.notna(row['estoque']) else 0,
            'imagem': imagem_path
        }
        produtos_finais.append(produto)
    
    print(f'   Produtos com imagem: {produtos_com_imagem}')
    print(f'   Produtos sem imagem: {produtos_sem_imagem}')
    
    # 7. SALVAR JSON (formato produtos_db.json)
    print('\n7. Salvando JSON limpo...')
    import datetime
    
    # Converter para formato do banco de dados
    produtos_db = []
    for produto in produtos_finais:
        now = datetime.datetime.now().isoformat()
        produto_db = {
            'codigo': produto['codigo'],
            'descricao': produto['descricao'],
            'gtin': produto['gtin'],
            'preco': produto['preco'],
            'estoque': produto['estoque'],
            'createdAt': now,
            'updatedAt': now,
            'imagem': produto['imagem']  # Adicionar campo imagem
        }
        produtos_db.append(produto_db)
    
    # Salvar produtos_db.json (usado pelo sistema)
    db_path = 'data/produtos_db.json'
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(produtos_db, f, indent=2, ensure_ascii=False)
    print(f'   Arquivo salvo: {db_path}')
    
    # Também salvar produtos.json (backup)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(produtos_finais, f, indent=2, ensure_ascii=False)
    print(f'   Backup salvo: {json_path}')
    
    # 8. RESUMO FINAL
    print('\n' + '='*50)
    print('RESUMO DA CORREÇÃO:')
    print('='*50)
    print(f'Produtos iniciais: {total_inicial}')
    print(f'Produtos removidos (preço zero): {removidos_preco}')
    print(f'Produtos removidos (sem GTIN): {removidos_gtin}')
    print(f'Produtos removidos (inválidos): {removidos_invalidos}')
    print(f'Produtos finais válidos: {len(produtos_finais)}')
    print(f'Produtos com imagem: {produtos_com_imagem}')
    print(f'Produtos sem imagem: {produtos_sem_imagem}')
    print('='*50)
    print('\nCORRECAO CONCLUIDA!')
    print('   Agora reinicie o servidor: npm run dev')

if __name__ == '__main__':
    corrigir_produtos()
