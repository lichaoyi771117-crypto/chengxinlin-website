$ErrorActionPreference = "SilentlyContinue"

function Test-Listening($port) {
    return [bool](netstat -ano | Select-String ":$port\s.*LISTENING")
}

function Wait-ForPort($port, $maxWait = 20) {
    for ($i = 0; $i -lt $maxWait; $i++) {
        if (Test-Listening $port) { return $true }
        Start-Sleep -Seconds 1
    }
    return $false
}

function Start-IfNeeded($name, $port, $exe, $args, $workDir) {
    if (Test-Listening $port) { return }
    Start-Process $exe -ArgumentList $args -WorkingDirectory $workDir -WindowStyle Hidden
    Wait-ForPort $port 20
}

# 只启动后端服务，不启动Next.js（由用户手动启动）
Start-IfNeeded "Qiaoxi" 8501 `
    "D:\Ai RAG\Qiaoxi\venv312\Scripts\streamlit.exe" `
    @("run","app.py","--server.port","8501","--server.headless","true") `
    "D:\Ai RAG\Qiaoxi"

Start-IfNeeded "Qiaoyuan" 8502 `
    "D:\Ai RAG\Qiaoyuan\venv312\Scripts\streamlit.exe" `
    @("run","app.py","--server.port","8502","--server.headless","true") `
    "D:\Ai RAG\Qiaoyuan"

Start-IfNeeded "CXR" 8080 `
    "D:\Ai RAG\chengxiaorong\venv312\Scripts\python.exe" `
    @("main.py") `
    "D:\Ai RAG\chengxiaorong"
