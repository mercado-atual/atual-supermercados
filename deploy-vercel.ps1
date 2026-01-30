# Deploy rápido: git add, commit e push para refletir na Vercel
# Uso: .\deploy-vercel.ps1
# Uso: .\deploy-vercel.ps1 "minha mensagem de commit"

$msg = $args[0]
if (-not $msg) { $msg = "deploy: atualização para Vercel" }

Write-Host "Adicionando alterações..." -ForegroundColor Cyan
git add .
$status = git status --short
if (-not $status) {
    Write-Host "Nenhuma alteração para enviar." -ForegroundColor Yellow
    exit 0
}
Write-Host "Commit: $msg" -ForegroundColor Cyan
git commit -m "$msg"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Enviando para o remoto (Vercel fará o deploy)..." -ForegroundColor Cyan
git push
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Pronto. A Vercel deve iniciar o build em instantes." -ForegroundColor Green
