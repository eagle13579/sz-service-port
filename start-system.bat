@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港统一系统 - 快速启动脚本
echo ========================================
echo.

echo [1/5] 检查数据库配置...
if not exist "unified-backend\.env" (
    echo ⚠️  未找到 .env 文件，从 .env.example 创建...
    copy unified-backend\.env.example unified-backend\.env
    echo ✅ 已创建 .env 文件，请编辑配置数据库连接信息
    pause
    exit /b 1
)
echo ✅ 数据库配置文件已存在
echo.

echo [2/5] 检查后端依赖...
cd unified-backend
if not exist "node_modules" (
    echo 📦 正在安装后端依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 后端依赖安装完成
) else (
    echo ✅ 后端依赖已安装
)
cd ..
echo.

echo [3/5] 检查前端依赖...
cd unified-frontend
if not exist "node_modules" (
    echo 📦 正在安装前端依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 前端依赖安装完成
) else (
    echo ✅ 前端依赖已安装
)
cd ..
echo.

echo [4/5] 启动后端服务...
start "数智服务港-后端服务" cmd /k "cd unified-backend && npm start"
timeout /t 3 >nul
echo ✅ 后端服务已启动 (端口 3002)
echo.

echo [5/5] 启动前端服务...
start "数智服务港-前端服务" cmd /k "cd unified-frontend && npm run dev"
echo ✅ 前端服务已启动 (端口 5173)
echo.

echo ========================================
echo ✅ 系统启动完成！
echo ========================================
echo 📌 访问地址:
echo    前端: http://localhost:5173
echo    后端: http://localhost:3002
echo.
echo 💡 提示:
echo    - 首次使用请先执行数据库初始化: mysql -u root -p < unified-database-init.sql
echo    - 关闭服务请关闭对应的命令行窗口
echo.
pause
