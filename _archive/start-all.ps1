$ErrorActionPreference = "SilentlyContinue"

Write-Host "============================================"
Write-Host "  Cheng Xin Lin Website - Starting"
Write-Host "============================================"
Write-Host ""

function Test-Listening($port) {
    return [bool](netstat -ano | Select-String ":$port\s.*LISTENING")
}

function Wait-ForPort($port, $name, $maxWait = 30) {
    for ($i = 0; $i -lt $maxWait; $i++) {
        if (Test-Listening $port) {
            Write-Host "  [OK] $name :$port started"
            return $true
        }
        Start-Sleep -Seconds 1
    }
    Write-Host "  [FAIL] $name :$port did not start within ${maxWait}s"
    return $false
}

function Start-ServiceWithRetry($name, $port, $exe, $args, $workDir, $retries = 2) {
    if (Test-Listening $port) {
        Write-Host "[SKIP] $name :$port already running"
        return
    }
    for ($attempt = 1; $attempt -le $retries; $attempt++) {
        Write-Host "[START] $name => port $port (attempt $attempt)"
        Start-Process $exe -ArgumentList $args -WorkingDirectory $workDir -WindowStyle Normal
        if (Wait-ForPort $port $name 15) { return }
        Write-Host "[RETRY] $name failed, retrying..."
        Start-Sleep -Seconds 2
    }
    Write-Host "[ERROR] $name :$port failed to start after $retries attempts"
}

# Start backend services with retry
Start-ServiceWithRetry "Qiaoxi" 8501 `
    "D:\Ai RAG\Qiaoxi\venv312\Scripts\streamlit.exe" `
    @("run","app.py","--server.port","8501","--server.headless","true") `
    "D:\Ai RAG\Qiaoxi"

Start-ServiceWithRetry "Qiaoyuan" 8502 `
    "D:\Ai RAG\Qiaoyuan\venv312\Scripts\streamlit.exe" `
    @("run","app.py","--server.port","8502","--server.headless","true") `
    "D:\Ai RAG\Qiaoyuan"

Start-ServiceWithRetry "CXR" 8080 `
    "D:\Ai RAG\chengxiaorong\venv312\Scripts\python.exe" `
    @("main.py") `
    "D:\Ai RAG\chengxiaorong"

Write-Host ""
Write-Host "--- Final Status ---"
$allOk = $true
foreach ($s in @(@{n="Qiaoxi";p=8501},@{n="Qiaoyuan";p=8502},@{n="CXR";p=8080})) {
    if (Test-Listening $s.p) {
        Write-Host "  $($s.n) :$($s.p) => OK" -ForegroundColor Green
    } else {
        Write-Host "  $($s.n) :$($s.p) => FAILED" -ForegroundColor Red
        $allOk = $false
    }
}

Write-Host ""
Write-Host "Starting Next.js on http://localhost:3000 ..."
Write-Host ""
Set-Location "D:\Ai RAG\Co.Website\co-website"
Start-Process "npx" -ArgumentList "next","dev","-p","3000" -WindowStyle Normal

Write-Host "Waiting for Next.js to start..." -ForegroundColor Yellow
if (Wait-ForPort 3000 "Next.js" 30) {
    Write-Host "Opening browser..." -ForegroundColor Green
    Start-Process "http://localhost:3000"
} else {
    Write-Host "[ERROR] Next.js failed to start on port 3000" -ForegroundColor Red
}

Write-Host ""
Write-Host "All services running. Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
