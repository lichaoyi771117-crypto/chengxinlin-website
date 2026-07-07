# 程信霖公司网站 — 一键启动脚本
# 启动 Next.js 网站 + 3个内嵌产品服务

$ErrorActionPreference = "SilentlyContinue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  程信霖公司网站 · 一键启动" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 检查端口是否已被占用
function Test-Port($port) {
    $conn = netstat -ano | Select-String ":$port\s.*LISTENING"
    return [bool]$conn
}

# 启动服务（如未运行）
function Start-ServiceIfNotRunning($name, $port, $workDir, $cmd, $args) {
    if (Test-Port $port) {
        Write-Host "[SKIP] $name 已在端口 $port 运行" -ForegroundColor Yellow
        return
    }
    Write-Host "[START] $name => 端口 $port ..." -ForegroundColor Green
    Start-Process cmd -ArgumentList "/c cd /d `"$workDir`" & $cmd $args > `"$PSScriptRoot\logs\$name.log`" 2>&1" -WindowStyle Hidden
}

# 创建日志目录
$logDir = Join-Path $PSScriptRoot "logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

Write-Host ""
Write-Host "--- 启动内嵌产品服务 ---" -ForegroundColor White

Start-ServiceIfNotRunning "qiaoxi" 8501 `
    "D:\Ai RAG\Qiaoxi" `
    "venv312\Scripts\streamlit.exe" "run app.py --server.port 8501 --server.headless true"

Start-ServiceIfNotRunning "qiaoyuan" 8502 `
    "D:\Ai RAG\Qiaoyuan" `
    "venv312\Scripts\streamlit.exe" "run app.py --server.port 8502 --server.headless true"

Start-ServiceIfNotRunning "chengxiaorong" 8080 `
    "D:\Ai RAG\chengxiaorong" `
    "venv312\Scripts\python.exe" "main.py"

# 等待服务启动
Write-Host ""
Write-Host "等待产品服务启动..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 验证
Write-Host ""
Write-Host "--- 服务状态 ---" -ForegroundColor White
$allOk = $true
foreach ($svc in @(@{N="乔曦";P=8501}, @{N="峤远";P=8502}, @{N="程晓融";P=8080})) {
    if (Test-Port $svc.P) {
        Write-Host "  $($svc.N) :$($svc.P) => OK" -ForegroundColor Green
    } else {
        Write-Host "  $($svc.N) :$($svc.P) => FAILED" -ForegroundColor Red
        $allOk = $false
    }
}

# 启动 Next.js
Write-Host ""
Write-Host "--- 启动 Next.js 开发服务器 ---" -ForegroundColor White
Write-Host "  http://localhost:3100" -ForegroundColor Cyan
Write-Host ""

Set-Location (Join-Path $PSScriptRoot "co-website")
npx next dev -p 3100
