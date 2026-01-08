@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 本地预览服务器
echo ========================================
echo.

echo [信息] 启动本地HTTP服务器...
echo [信息] 服务地址: http://localhost:8080
echo [信息] 按 Ctrl+C 停止服务
echo.

cd /d "%~dp0"
python -m http.server 8080

pause
