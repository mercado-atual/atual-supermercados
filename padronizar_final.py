import os
from PIL import Image

# --- CONFIGURAÇÕES ---
PASTA_ORIGEM = 'public/produtos'
# Salva em pasta separada para segurança
PASTA_DESTINO = 'public/produtos_finais'
TAMANHO = (800, 800)
COR_FUNDO = (255, 255, 255) # Branco Puro

def padronizar_imagens():
    if not os.path.exists(PASTA_DESTINO):
        os.makedirs(PASTA_DESTINO)
    
    arquivos = [f for f in os.listdir(PASTA_ORIGEM) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    total = len(arquivos)
    print(f'--- INICIANDO PADRONIZAÇÃO DE {total} IMAGENS ---')
    print('Estilo: Quadrado 800x800 com Fundo Branco (Padrão Magalu)')

    sucessos = 0
    for i, arquivo in enumerate(arquivos):
        try:
            caminho_origem = os.path.join(PASTA_ORIGEM, arquivo)
            
            # Abre a imagem
            img = Image.open(caminho_origem)
            
            # Converte para RGB (evita erro se tiver transparência)
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')

            # Cria o quadrado branco
            nova_img = Image.new('RGB', TAMANHO, COR_FUNDO)

            # Redimensiona a imagem original para caber no quadrado (sem esticar)
            img.thumbnail(TAMANHO, Image.LANCZOS)

            # Calcula posição para centralizar
            x = (TAMANHO[0] - img.width) // 2
            y = (TAMANHO[1] - img.height) // 2
            
            # Cola a imagem no centro
            nova_img.paste(img, (x, y))

            # Salva na pasta nova
            nova_img.save(os.path.join(PASTA_DESTINO, arquivo), quality=95)
            sucessos += 1
            
            if sucessos % 100 == 0:
                print(f'Processado: {sucessos}/{total}...')

        except Exception as e:
            print(f'Erro na imagem {arquivo}: {e}')

    print('\n' + '='*30)
    print(f'✅ CONCLUÍDO! {sucessos} imagens prontas.')
    print(f'📂 As imagens novas estão em: {PASTA_DESTINO}')
    print('='*30)

if __name__ == '__main__':
    padronizar_imagens()
