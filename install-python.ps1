# Instalar Python 3.12+ via winget
Write-Host "Instalando Python 3.12..." -ForegroundColor Cyan

# Verificar se winget está disponível
if (Get-Command winget -ErrorAction SilentlyContinue) {
    winget install Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    Write-Host "Python instalado. Reinicie o terminal e execute: python --version" -ForegroundColor Green
} else {
    Write-Host "winget não encontrado. Instale manualmente de: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Ou instale winget primeiro: https://aka.ms/getwinget" -ForegroundColor Yellow
}

