@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 前端启动测试
echo ========================================
echo.

echo [1/2] 检查后端服务状态...
netstat -ano | findstr "3002" >nul
if errorlevel 1 (
    echo ⚠️  后端服务未启动 (端口 3002)
    echo    正在启动后端服务...
    start "数智服务港-后端服务" cmd /k "cd unified-backend && npm start"
    timeout /t 5 >nul
) else (
    echo ✅ 后端服务已启动 (端口 3002)
)
echo.

echo [2/2] 检查前端服务状态...
netstat -ano | findstr "5173" >nul
if errorlevel 1 (
    echo ⚠️  前端服务未启动 (端口 5173)
    echo    正在启动前端服务...
    start "数智服务港-前端服务" cmd /k "cd unified-frontend && npm run dev"
    timeout /t 5 >nul
) else (
    echo ✅ 前端服务已启动 (端口 5173)
)
echo.

echo ========================================
echo 服务状态检查完成
echo ========================================
echo.
echo 📌 访问地址:
echo    前端: http://localhost:5173
echo    后端: http://localhost:3002/api/health
echo    主页: http://localhost:8080 (本地预览)
echo.
echo 💡 提示:
echo    - 如需测试主页,请运行: preview-local.bat
echo    - 如需关闭服务,请关闭对应的命令行窗口
echo.
pause
