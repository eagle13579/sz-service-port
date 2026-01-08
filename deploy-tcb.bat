@echo off
chcp 65001 >nul
echo ========================================
echo 数智服务港 - 云开发部署脚本
echo ========================================
echo.

set STATIC_DOMAIN=customer-8g4cr1e455633774-1355446610.tcloudbaseapp.com

echo [1/3] 准备前端文件...
if not exist "dist" mkdir dist

if exist "unified-frontend\index.html" (
    xcopy /E /I /Y unified-frontend\* dist\ >nul 2>&1
    echo ✅ 复制前端文件
)

if not exist "dist\index.html" (
    echo 创建简单的索引页面...
    (
        echo ^<!DOCTYPE html^>
        echo ^<html lang="zh-CN"^>
        echo ^<head^>
        echo     ^<meta charset="UTF-8"^>
        echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
        echo     ^<title^>数智服务港 - 统一系统^</title^>
        echo     ^<script src="https://cdn.tailwindcss.com"^>^</script^>
        echo ^</head^>
        echo ^<body class="bg-gray-50"^>
        echo     ^<div id="app"^>
        echo         ^<div class="min-h-screen flex items-center justify-center"^>
        echo             ^<div class="max-w-2xl mx-auto text-center px-4"^>
        echo                 ^<h1 class="text-4xl font-bold text-gray-900 mb-6"^>数智服务港^</h1^>
        echo                 ^<p class="text-xl text-gray-600 mb-8"^>产业带企业的一站式数智化出海助手^</p^>
        echo                 ^<div class="bg-blue-500 p-6 rounded-lg text-white mb-6"^>
        echo                     ^<h2 class="text-2xl font-bold mb-4"^>统一系统已部署^</h2^>
        echo                     ^<p class="text-blue-100"^>整合供应链平台、会员体系、会员任务系统^</p^>
        echo                 ^</div^>
        echo             ^</div^>
        echo         ^</div^>
        echo     ^</div^>
        echo ^</body^>
        echo ^</html^>
    ) > dist\index.html
    echo ✅ 创建索引页面
)

echo.
echo [2/3] 部署到静态托管...
echo 静态托管域名: %STATIC_DOMAIN%
echo.
echo 💡 手动部署步骤:
echo    1. 安装云开发CLI: npm install -g @cloudbase/cli
echo    2. 登录: tcb login
echo    3. 部署: cd dist ^&^& tcb hosting deploy .
echo.

echo [3/3] 访问信息...
echo ========================================
echo ✅ 准备完成！
echo ========================================
echo.
echo 📌 访问地址:
echo    http://%STATIC_DOMAIN%/
echo.
echo ⚠️  请按照上述步骤手动部署到云开发
echo.
pause
