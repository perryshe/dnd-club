Write-Host "=== g21-club rebuild ===" -ForegroundColor Cyan

# 1. Stop & remove old container
Write-Host "[1/4] Stopping old container..." -NoNewline
docker stop g21-club 2>$null; docker rm g21-club 2>$null
Write-Host " done" -ForegroundColor Green

# 2. Remove cached nginx:alpine image
Write-Host "[2/4] Removing cached image..." -NoNewline
docker image rm nginx:alpine 2>$null
Write-Host " done" -ForegroundColor Green

# 3. Pull fresh image
Write-Host "[3/4] Pulling fresh nginx:alpine..." -NoNewline
docker pull nginx:alpine
Write-Host " done" -ForegroundColor Green

# 4. Start container
Write-Host "[4/4] Starting container..." -NoNewline
docker-compose -f "$PSScriptRoot\docker-compose.yml" up -d
if ($?) {
    Write-Host " done" -ForegroundColor Green
    Write-Host "=== g21-club ready at http://localhost:8021 ===" -ForegroundColor Cyan
} else {
    Write-Host " FAILED" -ForegroundColor Red
}
