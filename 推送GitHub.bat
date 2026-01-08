@echo off
chcp 65001 >nul
echo ========================================
echo 推送到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 检查网络连接...
ping github.com -n 2 | find "TTL" >nul
if %errorlevel% neq 0 (
    echo ❌ 无法连接到 GitHub！
    echo.
    echo 请检查网络连接或代理设置
    pause
    exit /b 1
)
echo ✅ 网络连接正常
echo.

echo [2/5] 检查 Git 配置...
git remote -v | find "github.com" >nul
if %errorlevel% neq 0 (
    echo ❌ 未配置 GitHub 远程仓库
    pause
    exit /b 1
)
echo ✅ 远程仓库已配置
echo.

echo [3/5] 检查当前状态...
git status
echo.

echo [4/5] 取消可能存在的代理配置...
git config --global --unset http.proxy 2>nul
git config --global --unset https.proxy 2>nul
echo ✅ 代理配置已清理
echo.

echo [5/5] 推送所有提交到 GitHub...
echo.
echo 💡 提示: 可能需要输入 GitHub 凭据
echo    用户名: your_github_username
echo    密码: 使用 Personal Access Token（推荐）
echo.
echo 📖 详细指南请查看: 手动推送指南.md
echo.

git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 可能的原因:
    echo 1. 网络连接问题
    echo 2. GitHub 需要认证
    echo 3. Token 权限不足
    echo 4. 推送超时
    echo.
    echo 解决方案:
    echo 1. 检查网络连接
    echo 2. 使用 GitHub Personal Access Token
    echo 3. 使用 SSH 方式推送
    echo 4. 查看 手动推送指南.md 获取详细帮助
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 推送成功！
echo ========================================
echo.
echo 您可以在 GitHub 查看更新:
echo https://github.com/eagle13579/sz-service-port
echo.

git status
echo.
pause
