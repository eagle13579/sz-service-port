# 数智服务港 - 自动初始化和启动脚本 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   数智服务港 - 自动初始化和启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Docker服务状态
Write-Host "[1/5] 检查Docker服务状态..." -ForegroundColor Yellow
try {
    $dockerVersion = docker version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] Docker未运行，请先启动Docker Desktop" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "[成功] Docker服务正常" -ForegroundColor Green
} catch {
    Write-Host "[错误] Docker命令执行失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host ""

# 检查MySQL容器状态
Write-Host "[2/5] 检查MySQL容器状态..." -ForegroundColor Yellow
$containerExists = docker ps -a --filter "name=shuzhi-mysql" --format "{{.Names}}" 2>$null

if ($containerExists -eq "shuzhi-mysql") {
    $containerRunning = docker ps --filter "name=shuzhi-mysql" --format "{{.Names}}" 2>$null
    if ($containerRunning -eq "shuzhi-mysql") {
        Write-Host "[成功] MySQL容器已在运行" -ForegroundColor Green
    } else {
        Write-Host "[信息] MySQL容器已停止，正在启动..." -ForegroundColor Yellow
        docker start shuzhi-mysql 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[成功] MySQL容器已启动" -ForegroundColor Green
        } else {
            Write-Host "[错误] 启动MySQL容器失败" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[信息] MySQL容器不存在，将创建新容器" -ForegroundColor Yellow
    docker run -d --name shuzhi-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=shuzhi_service_hub mysql:8.0 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[成功] MySQL容器创建成功" -ForegroundColor Green
    } else {
        Write-Host "[错误] 创建MySQL容器失败" -ForegroundColor Red
    }
}
Write-Host ""

# 等待MySQL服务启动
Write-Host "[3/5] 等待MySQL服务启动（20秒）..." -ForegroundColor Yellow
Start-Sleep -Seconds 20
Write-Host "[完成] 等待完成" -ForegroundColor Green
Write-Host ""

# 初始化数据库
Write-Host "[4/5] 初始化数据库..." -ForegroundColor Yellow
$initFile = "unified-database-init.sql"
if (Test-Path $initFile) {
    docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[成功] 数据库初始化完成" -ForegroundColor Green
    } else {
        Write-Host "[警告] 数据库初始化可能已完成或遇到问题" -ForegroundColor Yellow
    }
} else {
    Write-Host "[警告] 未找到数据库初始化文件: $initFile" -ForegroundColor Yellow
}
Write-Host ""

# 验证数据库连接
Write-Host "[5/5] 验证数据库连接..." -ForegroundColor Yellow
docker exec shuzhi-mysql mysql -uroot -proot123 -e "USE shuzhi_service_hub; SHOW TABLES;" 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[成功] 数据库连接正常" -ForegroundColor Green
} else {
    Write-Host "[警告] 数据库连接验证失败" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   自动初始化和启动完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "数据库信息:" -ForegroundColor Cyan
Write-Host "  主机: localhost"
Write-Host "  端口: 3306"
Write-Host "  用户: root"
Write-Host "  密码: root123"
Write-Host "  数据库: shuzhi_service_hub"
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "  1. 运行 npm run dev 启动后端服务"
Write-Host "  2. 访问 http://localhost:3002/health 测试连接"
Write-Host "  3. 访问 http://localhost:5173 查看前端页面"
Write-Host ""
Read-Host "按回车键退出"
