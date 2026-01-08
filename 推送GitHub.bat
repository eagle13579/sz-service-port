@echo off
chcp 65001 >nul
echo ========================================
echo 推送到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查当前状态...
git status
echo.

echo [2/3] 推送所有提交到 GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ❌ 推送失败！请检查网络连接或GitHub凭据
    echo.
    echo 可能的原因:
    echo 1. 网络连接问题
    echo 2. GitHub需要认证
    echo 3. 仓库地址错误
    echo.
    echo 建议解决方案:
    echo 1. 检查网络连接
    echo 2. 使用 GitHub Personal Access Token
    echo 3. 使用 SSH 方式推送
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] 检查推送结果...
git status
echo.

echo ========================================
echo ✅ 推送完成！
echo ========================================
echo.
echo 您可以在 GitHub 查看更新:
echo https://github.com/eagle13579/sz-service-port
echo.
pause
