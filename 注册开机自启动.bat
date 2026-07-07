@echo off
:: 注册Windows开机自启动任务（需要管理员权限）
:: 运行方式：右键 -> 以管理员身份运行

schtasks /create /tn "ChengXinLin_Website" /tr "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File \"D:\Ai RAG\Co.Website\start-all-silent.ps1\"" /sc onlogon /rl highest /f

if %errorlevel%==0 (
    echo.
    echo [OK] 开机自启动任务已创建
    echo     任务名: ChengXinLin_Website
    echo     触发器: 用户登录时自动启动
    echo.
    echo 如需删除自启动，运行:
    echo     schtasks /delete /tn "ChengXinLin_Website" /f
) else (
    echo [ERROR] 创建失败，请以管理员身份运行此脚本
)
pause
