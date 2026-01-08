@echo off
chcp 65001 >nul
echo ========================================
echo  测试后端API服务
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 测试健康检查接口...
curl -s http://localhost:3002/health
echo.
echo.

echo [2/3] 测试统计数据接口...
curl -s http://localhost:3002/api/stats/overview
echo.
echo.

echo [3/3] 测试产品列表接口...
curl -s http://localhost:3002/api/products
echo.
echo.

echo ========================================
echo  测试完成
echo ========================================
echo.
pause
