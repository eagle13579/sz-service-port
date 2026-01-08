@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 服务状态检查
echo ========================================
echo.

echo [1/4] 检查前端服务 (端口 5173)...
netstat -ano | findstr ":5173" >nul
if errorlevel 1 (
    echo ❌ 前端服务未运行
) else (
    echo ✅ 前端服务正在运行
    echo    访问地址: http://localhost:5173
)
echo.

echo [2/4] 检查后端服务 (端口 3002)...
netstat -ano | findstr ":3002" >nul
if errorlevel 1 (
    echo ❌ 后端服务未运行
) else (
    echo ✅ 后端服务正在运行
    echo    访问地址: http://localhost:3002
    echo    健康检查: http://localhost:3002/health
)
echo.

echo [3/4] 检查本地预览 (端口 8080)...
netstat -ano | findstr ":8080" >nul
if errorlevel 1 (
    echo ❌ 本地预览服务未运行
) else (
    echo ✅ 本地预览服务正在运行
    echo    访问地址: http://localhost:8080
)
echo.

echo [4/4] 检查 MySQL 数据库 (端口 3306)...
netstat -ano | findstr ":3306" >nul
if errorlevel 1 (
    echo ⚠️  MySQL 未检测到
    echo    请确保 MySQL 已安装并启动
) else (
    echo ✅ MySQL 正在运行
    echo    端口: 3306
)
echo.

echo ========================================
echo 服务访问地址汇总
echo ========================================
echo.
echo 📌 可访问的服务:
if not errorlevel 1 (netstat -ano | findstr ":5173" >nul) (
    echo    ✅ 前端开发环境: http://localhost:5173
)
if not errorlevel 1 (netstat -ano | findstr ":3002" >nul) (
    echo    ✅ 后端 API 服务: http://localhost:3002
)
if not errorlevel 1 (netstat -ano | findstr ":8080" >nul) (
    echo    ✅ 本地预览页面: http://localhost:8080
)
if not errorlevel 1 (netstat -ano | findstr ":3306" >nul) (
    echo    ✅ phpMyAdmin (如使用XAMPP): http://localhost/phpmyadmin
)
echo.

echo 💡 提示:
echo    - 如需启动服务,请运行: start-system.bat
echo    - 如需配置数据库,请查看: 完整开发环境配置指南.md
echo    - 如需预览主页,请运行: preview-local.bat
echo.
pause
