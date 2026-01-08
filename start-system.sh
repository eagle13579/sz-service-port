#!/bin/bash

echo "========================================"
echo "数智服务港统一系统 - 快速启动脚本"
echo "========================================"
echo ""

echo "[1/5] 检查数据库配置..."
if [ ! -f "unified-backend/.env" ]; then
    echo "⚠️  未找到 .env 文件，从 .env.example 创建..."
    cp unified-backend/.env.example unified-backend/.env
    echo "✅ 已创建 .env 文件，请编辑配置数据库连接信息"
    exit 1
fi
echo "✅ 数据库配置文件已存在"
echo ""

echo "[2/5] 检查后端依赖..."
cd unified-backend
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装后端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
    echo "✅ 后端依赖安装完成"
else
    echo "✅ 后端依赖已安装"
fi
cd ..
echo ""

echo "[3/5] 检查前端依赖..."
cd unified-frontend
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装前端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依赖安装失败"
        exit 1
    fi
    echo "✅ 前端依赖安装完成"
else
    echo "✅ 前端依赖已安装"
fi
cd ..
echo ""

echo "[4/5] 启动后端服务..."
cd unified-backend && npm start &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID, 端口 3002)"
cd ..
sleep 3
echo ""

echo "[5/5] 启动前端服务..."
cd unified-frontend && npm run dev &
FRONTEND_PID=$!
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID, 端口 5173)"
echo ""

echo "========================================"
echo "✅ 系统启动完成！"
echo "========================================"
echo "📌 访问地址:"
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:3002"
echo ""
echo "💡 提示:"
echo "   - 首次使用请先执行数据库初始化: mysql -u root -p < unified-database-init.sql"
echo "   - 停止服务请按 Ctrl+C"
echo ""
echo "按 Ctrl+C 停止所有服务"
wait
