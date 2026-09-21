# stop_demo.ps1
Write-Host "Stopping SentinelTrace Demo..." -ForegroundColor Red

# 1. Stop Python Processes
Write-Host "Killing background Python services..." -ForegroundColor Yellow
Stop-Process -Name "python" -Force -ErrorAction SilentlyContinue

# 2. Stop Docker
Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "Demo stopped cleanly." -ForegroundColor Green
