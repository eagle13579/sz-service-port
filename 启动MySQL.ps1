# 数智服务港 - MySQL 容器启动脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " 启动 MySQL 数据库容器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Docker
Write-Host "[1/5] 检查 Docker 状态..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker 已安装: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker 未安装或未启动" -ForegroundColor Red
    Write-Host "请先安装 Docker Desktop 并启动它" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 检查现有容器
Write-Host "[2/5] 检查现有容器..." -ForegroundColor Yellow
$existingContainer = docker ps -a --filter "name=shuzhi-mysql" --format "{{.Names}}"
if ($existingContainer -eq "shuzhi-mysql") {
    Write-Host "⚠️  容器已存在，正在删除..." -ForegroundColor Yellow
    docker rm -f shuzhi-mysql | Out-Null
}

# 创建并启动容器
Write-Host "[3/5] 创建并启动 MySQL 容器..." -ForegroundColor Yellow
docker run -d --name shuzhi-mysql `
    -p 3306:3306 `
    -e MYSQL_ROOT_PASSWORD=root123 `
    -e MYSQL_DATABASE=shuzhi_service_hub `
    -e MYSQL_CHARACTER_SET_SERVER=utf8mb4 `
    -e MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci `
    mysql:8.0

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 容器启动失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 等待MySQL启动
Write-Host "[4/5] 等待 MySQL 启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 检查容器状态
Write-Host "[5/5] 检查容器状态..." -ForegroundColor Yellow
$containerStatus = docker ps --filter "name=shuzhi-mysql" --format "{{.Status}}"
if ($containerStatus) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " ✅ MySQL 容器启动成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "容器名称: shuzhi-mysql" -ForegroundColor White
    Write-Host "数据库端口: 3306" -ForegroundColor White
    Write-Host "数据库名称: shuzhi_service_hub" -ForegroundColor White
    Write-Host "root密码: root123" -ForegroundColor White
    Write-Host ""
    Write-Host "容器状态: $containerStatus" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ 容器启动异常" -ForegroundColor Red
}

Read-Host "按回车键退出"
