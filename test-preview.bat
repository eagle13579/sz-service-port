@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 本地预览测试
echo ========================================
echo.

echo 正在启动本地HTTP服务器...
echo.
echo 📌 访问地址: http://localhost:8080
echo 💡 按 Ctrl+C 可停止服务器
echo.

cd /d "%~dp0"
python -m http.server 8080 2>nul || (
    echo Python未安装或端口被占用,尝试使用Node.js...
    npx http-server -p 8080 -o
)

pause
