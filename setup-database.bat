@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 数据库初始化脚本
echo ========================================
echo.

echo [1/5] 检查 MySQL 是否已安装...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL 未安装或未在 PATH 中
    echo.
    echo 请先安装 MySQL:
    echo 1. 下载地址: https://dev.mysql.com/downloads/mysql/
    echo 2. 安装时请记住 root 密码
    echo 3. 安装后将 MySQL 添加到系统 PATH
    echo.
    echo 或者使用 Docker:
    echo docker run -d -p 3306:3306 --name mysql ^
    echo   -e MYSQL_ROOT_PASSWORD=root123 ^
    echo   -e MYSQL_DATABASE=shuzhi_service_hub ^
    echo   mysql:8.0
    echo.
    pause
    exit /b 1
)
echo ✅ MySQL 已安装
mysql --version
echo.

echo [2/5] 测试数据库连接...
set /p DB_PASSWORD="请输入 MySQL root 密码 (默认为空直接回车): "

echo 正在测试连接...
echo %DB_PASSWORD% | mysql -u root -p%DB_PASSWORD% -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ❌ 数据库连接失败，请检查密码
    pause
    exit /b 1
)
echo ✅ 数据库连接成功
echo.

echo [3/5] 创建数据库...
echo %DB_PASSWORD% | mysql -u root -p%DB_PASSWORD% -e "DROP DATABASE IF EXISTS shuzhi_service_hub; CREATE DATABASE shuzhi_service_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo ❌ 创建数据库失败
    pause
    exit /b 1
)
echo ✅ 数据库创建成功
echo.

echo [4/5] 执行初始化脚本...
echo %DB_PASSWORD% | mysql -u root -p%DB_PASSWORD% shuzhi_service_hub < "%~dp0unified-database-init.sql"
if errorlevel 1 (
    echo ❌ 执行初始化脚本失败
    pause
    exit /b 1
)
echo ✅ 初始化脚本执行成功
echo.

echo [5/5] 导入测试数据...
if exist "%~dp0test-data.sql" (
    echo %DB_PASSWORD% | mysql -u root -p%DB_PASSWORD% shuzhi_service_hub < "%~dp0test-data.sql"
    if errorlevel 1 (
        echo ⚠️  测试数据导入失败 (可选)
    ) else (
        echo ✅ 测试数据导入成功
    )
) else (
    echo ℹ️  未找到测试数据文件
)
echo.

echo ========================================
echo ✅ 数据库初始化完成！
echo ========================================
echo.
echo 📌 数据库信息:
echo    数据库名: shuzhi_service_hub
echo    字符集: utf8mb4
echo    排序规则: utf8mb4_unicode_ci
echo.
echo 下一步:
echo    1. 配置 unified-backend/.env 文件
echo    2. 启动后端服务: cd unified-backend ^&^& npm start
echo    3. 启动前端服务: cd unified-frontend ^&^& npm install ^&^& npm run dev
echo.
pause
