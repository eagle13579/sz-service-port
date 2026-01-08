@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 快速启动
echo ========================================
echo.

echo 请选择操作:
echo.
echo [1] 启动所有服务 (数据库+后端+前端)
echo [2] 仅启动数据库 (Docker MySQL)
echo [3] 仅启动后端和前端
echo [4] 检查服务状态
echo [5] 打开浏览器
echo [6] 停止所有服务
echo [0] 退出
echo.

set /p choice="请输入选项 (0-6): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_db
if "%choice%"=="3" goto start_apps
if "%choice%"=="4" goto check_status
if "%choice%"=="5" goto open_browser
if "%choice%"=="6" goto stop_all
if "%choice%"=="0" goto end
goto invalid

:start_all
echo.
echo [1/3] 启动 MySQL 数据库...
docker ps -a | findstr shuzhi-mysql >nul
if errorlevel 1 (
    echo 正在创建 MySQL 容器...
    docker run -d --name shuzhi-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=shuzhi_service_hub mysql:8.0
) else (
    docker ps | findstr shuzhi-mysql >nul
    if errorlevel 1 (
        echo 启动现有容器...
        docker start shuzhi-mysql
    ) else (
        echo ✅ MySQL 已运行
    )
)
echo 等待 MySQL 启动...
timeout /t 5 >nul
echo ✅ MySQL 已启动
echo.

echo [2/3] 启动后端服务...
start "数智服务港-后端" cmd /k "cd unified-backend && npm start"
timeout /t 3 >nul
echo ✅ 后端服务已启动 (端口 3002)
echo.

echo [3/3] 启动前端服务...
start "数智服务港-前端" cmd /k "cd unified-frontend && npm run dev"
timeout /t 3 >nul
echo ✅ 前端服务已启动 (端口 5173)
echo.

echo 所有服务已启动！
goto open_links

:start_db
echo.
echo 启动 MySQL 容器...
docker ps -a | findstr shuzhi-mysql >nul
if errorlevel 1 (
    echo 正在创建新容器...
    docker run -d --name shuzhi-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=shuzhi_service_hub mysql:8.0
) else (
    docker ps | findstr shuzhi-mysql >nul
    if errorlevel 1 (
        docker start shuzhi-mysql
        echo ✅ MySQL 容器已启动
    ) else (
        echo ✅ MySQL 已在运行
    )
)
goto end

:start_apps
echo.
echo [1/2] 启动后端服务...
start "数智服务港-后端" cmd /k "cd unified-backend && npm start"
timeout /t 3 >nul
echo ✅ 后端服务已启动

echo [2/2] 启动前端服务...
start "数智服务港-前端" cmd /k "cd unified-frontend && npm run dev"
timeout /t 3 >nul
echo ✅ 前端服务已启动
goto open_links

:check_status
echo.
echo ========================================
echo 服务状态检查
echo ========================================
echo.

echo MySQL 容器:
docker ps -a | findstr shuzhi-mysql
if errorlevel 1 (
    echo ❌ MySQL 容器未创建
) else (
    docker ps | findstr shuzhi-mysql >nul
    if errorlevel 1 (
        echo ⏸️  MySQL 容器已停止
    ) else (
        echo ✅ MySQL 容器正在运行
    )
)
echo.

echo 后端服务 (端口 3002):
netstat -ano | findstr ":3002" >nul
if errorlevel 1 (
    echo ❌ 后端服务未运行
) else (
    echo ✅ 后端服务正在运行
)
echo.

echo 前端服务 (端口 5173):
netstat -ano | findstr ":5173" >nul
if errorlevel 1 (
    echo ❌ 前端服务未运行
) else (
    echo ✅ 前端服务正在运行
)
echo.

goto end

:open_browser
:open_links
echo.
echo 打开浏览器...
start "" http://localhost:5173
start "" http://localhost:8080
goto end

:stop_all
echo.
echo [1/3] 停止前端和后端服务...
taskkill /f /im node.exe 2>nul
echo ✅ 应用服务已停止

echo [2/3] 停止 MySQL 容器...
docker ps | findstr shuzhi-mysql >nul
if not errorlevel 1 (
    docker stop shuzhi-mysql
    echo ✅ MySQL 容器已停止
) else (
    echo ℹ️  MySQL 容器未运行
)
echo.

echo [3/3] 清理 (可选)...
set /p cleanup="是否删除MySQL容器? (y/N): "
if /i "%cleanup%"=="y" (
    docker rm shuzhi-mysql
    echo ✅ MySQL 容器已删除
)
goto end

:invalid
echo.
echo ❌ 无效选项
goto end

:end
echo.
pause
