@echo off
chcp 65001 >nul
echo ========================================
echo    数智服务港 - 自动初始化和启动
echo ========================================
echo.

echo [1/5] 检查Docker服务状态...
docker version >nul 2>&1
if errorlevel 1 (
    echo [错误] Docker未运行，请先启动Docker Desktop
    pause
    exit /b 1
)
echo [成功] Docker服务正常
echo.

echo [2/5] 检查MySQL容器状态...
docker ps -a | findstr "shuzhi-mysql" >nul 2>&1
if errorlevel 1 (
    echo [信息] MySQL容器不存在，将创建新容器
    docker run -d --name shuzhi-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=shuzhi_service_hub mysql:8.0
    if errorlevel 1 (
        echo [错误] 创建MySQL容器失败
        pause
        exit /b 1
    )
    echo [成功] MySQL容器创建成功
) else (
    docker ps | findstr "shuzhi-mysql" >nul 2>&1
    if errorlevel 1 (
        echo [信息] MySQL容器已停止，正在启动...
        docker start shuzhi-mysql
        echo [成功] MySQL容器已启动
    ) else (
        echo [成功] MySQL容器已在运行
    )
)
echo.

echo [3/5] 等待MySQL服务启动（20秒）...
timeout /t 20 >nul
echo [完成] 等待完成
echo.

echo [4/5] 初始化数据库...
docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < unified-database-init.sql 2>nul
if errorlevel 1 (
    echo [警告] 数据库初始化可能已完成或遇到问题
) else (
    echo [成功] 数据库初始化完成
)
echo.

echo [5/5] 验证数据库连接...
docker exec shuzhi-mysql mysql -uroot -proot123 -e "USE shuzhi_service_hub; SHOW TABLES;" 2>nul
if errorlevel 1 (
    echo [警告] 数据库连接验证失败
) else (
    echo [成功] 数据库连接正常
)
echo.

echo ========================================
echo    自动初始化和启动完成！
echo ========================================
echo.
echo 数据库信息:
echo   主机: localhost
echo   端口: 3306
echo   用户: root
echo   密码: root123
echo   数据库: shuzhi_service_hub
echo.
echo 下一步:
echo   1. 运行 npm run dev 启动后端服务
echo   2. 访问 http://localhost:3002/health 测试连接
echo   3. 访问 http://localhost:5173 查看前端页面
echo.
pause
