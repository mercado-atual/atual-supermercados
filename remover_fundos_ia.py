import os
from rembg import remove
from PIL import Image
import io
import time

# CONFIGURAÇÕES
PASTA_ORIGEM = 'public/produtos'
# Salva em pasta separada para não perder as originais
PASTA_DESTINO = 'public/produtos_png_top' 

def remover_fundo_ia():
    if not os.path.exists(PASTA_DESTINO):
        os.makedirs(PASTA_DESTINO)
    
    arquivos = [f for f in os.listdir(PASTA_ORIGEM) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    total = len(arquivos)
    
    print(f'--- INICIANDO TRATAMENTO IA EM {total} IMAGENS ---')
    print('Isso vai demorar. O processador vai aquecer. Pode minimizar.')

    sucessos = 0
    inicio_geral = time.time()

    for i, arquivo in enumerate(arquivos):
        try:
            caminho_origem = os.path.join(PASTA_ORIGEM, arquivo)
            nome_sem_ext = os.path.splitext(arquivo)[0]
            nome_novo = f'{nome_sem_ext}.png'
            caminho_destino = os.path.join(PASTA_DESTINO, nome_novo)

            # Pula se já existir (para caso pare e continue depois)
            if os.path.exists(caminho_destino):
                print(f'[{i+1}/{total}] Já existe, pulando...')
                continue

            print(f'[{i+1}/{total}] Processando IA: {arquivo}...')
            
            # --- MÁGICA DA IA ---
            with open(caminho_origem, 'rb') as entrada:
                input_data = entrada.read()
                subject = remove(input_data) # Remove o fundo
            
            # Salva o PNG transparente
            with open(caminho_destino, 'wb') as saida:
                saida.write(subject)
            # --------------------

            sucessos += 1

        except Exception as e:
            print(f'ERRO na imagem {arquivo}: {e}')

    tempo_total = (time.time() - inicio_geral) / 60
    print('\n' + '='*30)
    print(f'✅ FINALIZADO! {sucessos} imagens processadas.')
    print(f'⏱ Tempo total: {tempo_total:.1f} minutos')
    print(f'📂 Imagens TOP salvas em: {PASTA_DESTINO}')
    print('='*30)

if __name__ == '__main__':
    remover_fundo_ia()
