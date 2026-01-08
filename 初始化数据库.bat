@echo off
chcp 65001 >nul
echo ========================================
echo  初始化数据库
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 MySQL 容器...
docker ps | findstr shuzhi-mysql >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL 容器未运行
    echo 请先运行: 启动MySQL容器.bat
    pause
    exit /b 1
)

echo [2/3] 等待 MySQL 完全启动...
timeout /t 10 /nobreak >nul

echo [3/3] 导入数据库结构...
docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < unified-database-init.sql

if errorlevel 1 (
    echo ❌ 数据库导入失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✅ 数据库初始化成功！
echo ========================================
echo.
pause
