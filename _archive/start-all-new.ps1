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
            Write-Host "  [OK] $name :$port started" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 1
    }
    Write-Host "  [FAIL] $name :$port did not start within ${maxWait}s" -ForegroundColor Red
    return $false
}

# Start Qiaoxi
if (Test-Listening 8501) {
    Write-Host "[SKIP] Qiaoxi :8501 already running" -ForegroundColor Yellow
} else {
    Write-Host "[START] Qiaoxi => port 8501"
    Start-Process "D:\Ai RAG\Qiaoxi\venv312\Scripts\streamlit.exe" -ArgumentList "run","app.py","--server.port","8501","--server.headless","true" -WorkingDirectory "D:\Ai RAG\Qiaoxi"
    Wait-ForPort 8501 "Qiaoxi" 30
}

# Start Qiaoyuan
if (Test-Listening 8502) {
    Write-Host "[SKIP] Qiaoyuan :8502 already running" -ForegroundColor Yellow
} else {
    Write-Host "[START] Qiaoyuan => port 8502"
    Start-Process "D:\Ai RAG\Qiaoyuan\venv312\Scripts\streamlit.exe" -ArgumentList "run","app.py","--server.port","8502","--server.headless","true" -WorkingDirectory "D:\Ai RAG\Qiaoyuan"
    Wait-ForPort 8502 "Qiaoyuan" 30
}

# Start CXR
if (Test-Listening 8080) {
    Write-Host "[SKIP] CXR :8080 already running" -ForegroundColor Yellow
} else {
    Write-Host "[START] CXR => port 8080"
    Start-Process "D:\Ai RAG\chengxiaorong\venv312\Scripts\python.exe" -ArgumentList "main.py" -WorkingDirectory "D:\Ai RAG\chengxiaorong"
    Wait-ForPort 8080 "CXR" 30
}

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
Set-Location "D:\Ai RAG\Co.Website\co-website"
Start-Process "npx" -ArgumentList "next","dev","-p","3000"

Write-Host "Waiting for Next.js to start..."
if (Wait-ForPort 3000 "Next.js" 30) {
    Write-Host "Opening browser..." -ForegroundColor Green
    Start-Process "http://localhost:3000"
} else {
    Write-Host "[ERROR] Next.js failed to start on port 3000" -ForegroundColor Red
}

Write-Host ""
Write-Host "All services started. Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
