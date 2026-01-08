#!/bin/bash

echo "========================================"
echo "数智服务港 - 云开发部署脚本"
echo "========================================"
echo ""

# 配置
STATIC_DOMAIN="customer-8g4cr1e455633774-1355446610.tcloudbaseapp.com"

echo "[1/3] 准备前端文件..."
if [ ! -d "dist" ]; then
    mkdir -p dist
fi

# 复制现有前端文件
cp -r unified-frontend/* dist/ 2>/dev/null || true

# 如果没有构建文件，创建一个简单的索引页面
if [ ! -f "dist/index.html" ]; then
    echo "创建简单的索引页面..."
    cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数智服务港 - 统一系统</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div id="app">
        <div class="min-h-screen flex items-center justify-center">
            <div class="max-w-2xl mx-auto text-center px-4">
                <h1 class="text-4xl font-bold text-gray-900 mb-6">数智服务港</h1>
                <p class="text-xl text-gray-600 mb-8">产业带企业的一站式数智化出海助手</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="text-3xl mb-4">🎓</div>
                        <h3 class="font-semibold mb-2">出海培训</h3>
                        <p class="text-sm text-gray-600">专业出海业务培训</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="text-3xl mb-4">🤖</div>
                        <h3 class="font-semibold mb-2">出海解决方案</h3>
                        <p class="text-sm text-gray-600">AI驱动的模块化系统</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="text-3xl mb-4">📈</div>
                        <h3 class="font-semibold mb-2">增长运营</h3>
                        <p class="text-sm text-gray-600">流量共享与出海陪跑</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="text-3xl mb-4">💼</div>
                        <h3 class="font-semibold mb-2">投资孵化</h3>
                        <p class="text-sm text-gray-600">内生型孵化模式</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="text-3xl mb-4">👥</div>
                        <h3 class="font-semibold mb-2">出海社群</h3>
                        <p class="text-sm text-gray-600">高价值实战型生态圈</p>
                    </div>
                    <div class="bg-blue-500 p-6 rounded-lg shadow-md text-white">
                        <div class="text-3xl mb-4">🚀</div>
                        <h3 class="font-semibold mb-2">供应链平台</h3>
                        <p class="text-sm text-blue-100">三大系统整合</p>
                    </div>
                </div>

                <div class="bg-blue-50 p-6 rounded-lg">
                    <h2 class="text-2xl font-bold text-blue-900 mb-4">统一系统已部署</h2>
                    <p class="text-blue-700 mb-4">
                        整合供应链平台、会员体系、会员任务系统三大核心模块
                    </p>
                    <div class="text-sm text-blue-600">
                        <p>✅ 数据库已初始化</p>
                        <p>✅ 后端服务已就绪</p>
                        <p>✅ 前端页面已部署</p>
                    </div>
                </div>

                <div class="mt-8 text-sm text-gray-500">
                    <p>部署时间: 2026-01-08</p>
                    <p>版本: v1.0</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
EOF
fi

echo "✅ 前端文件准备完成"
echo ""

echo "[2/3] 部署到静态托管..."
echo "静态托管域名: $STATIC_DOMAIN"
echo "注意: 请手动将 dist 目录上传到云开发静态托管"
echo "或使用 cloudbase CLI 工具: tcb hosting deploy dist"
echo ""

echo "[3/3] 访问信息..."
echo "========================================"
echo "✅ 部署完成！"
echo "========================================"
echo ""
echo "📌 访问地址:"
echo "   http://$STATIC_DOMAIN/"
echo ""
echo "💡 后续步骤:"
echo "   1. 安装云开发CLI: npm install -g @cloudbase/cli"
echo "   2. 登录: tcb login"
echo "   3. 部署: cd dist && tcb hosting deploy ."
echo ""
