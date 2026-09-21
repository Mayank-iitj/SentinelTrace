# start_demo.ps1
Write-Host "Starting SentinelTrace V2 Demo..." -ForegroundColor Cyan

# 1. Start Infrastructure
Write-Host "1. Starting Kafka and Zookeeper..." -ForegroundColor Yellow
docker-compose up -d
Start-Sleep -Seconds 10 # Wait for Kafka to become healthy

# 2. Start Pipeline Services
Write-Host "2. Starting Pipeline Services (Normalizer, Moss, Classifier)..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "C:\Users\MS\.venv\Scripts\python.exe" -ArgumentList "-m src.normalizer.normalizer"
Start-Process -NoNewWindow -FilePath "C:\Users\MS\.venv\Scripts\python.exe" -ArgumentList "-m src.moss.filter"
Start-Process -NoNewWindow -FilePath "C:\Users\MS\.venv\Scripts\python.exe" -ArgumentList "-m src.classifier.classifier"

Start-Sleep -Seconds 3

# 3. Start Dashboard
Write-Host "3. Starting Real-time Dashboard..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "C:\Users\MS\.venv\Scripts\python.exe" -ArgumentList "-m src.dashboard.app"

Start-Sleep -Seconds 3

# 4. Open Browser
Write-Host "4. Opening Dashboard..." -ForegroundColor Green
Start-Process "http://localhost:8000"

Write-Host "Demo Environment is LIVE! Run 'python -m src.harness.agent' to trigger attacks." -ForegroundColor Cyan
