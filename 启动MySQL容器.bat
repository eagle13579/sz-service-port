@echo off
chcp 65001 >nul
echo ========================================
echo    数智服务港 - MySQL启动器
echo ========================================
echo.

echo [1/3] 检查Docker...
docker version >nul 2>&1
if errorlevel 1 (
    echo [错误] Docker未运行
    goto :end
)
echo [成功] Docker正常运行
echo.

echo [2/3] 创建MySQL容器...
docker run -d --name shuzhi-mysql ^
  -p 3306:3306 ^
  -e MYSQL_ROOT_PASSWORD=root123 ^
  -e MYSQL_DATABASE=shuzhi_service_hub ^
  mysql:8.0

if errorlevel 1 (
    echo [错误] 容器创建失败，可能已存在
    docker ps -a | findstr shuzhi-mysql
    goto :wait
)
echo [成功] MySQL容器创建成功
echo.

:wait
echo [3/3] 等待MySQL启动（25秒）...
timeout /t 25 >nul
echo.

echo [验证] 检查容器状态...
docker ps | findstr shuzhi-mysql
echo.

:end
echo ========================================
echo    完成！
echo ========================================
echo.
pause
