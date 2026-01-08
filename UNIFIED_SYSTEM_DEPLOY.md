# 数智服务港统一系统部署指南

**版本**: v1.0  
**日期**: 2026-01-08  
**状态**: ✅ 已完成

---

## 📋 系统概述

数智服务港统一系统整合了：
- ✅ **供应链平台**: 供应商管理、产品发布、任务发布
- ✅ **会员体系**: 会员管理、技能认证、信用评级
- ✅ **任务系统**: 任务认领、进度追踪、回报结算

### 技术架构

```
┌─────────────────────────────────────────────────┐
│                   前端层                        │
│  Vue 3 + Vue Router + Pinia + Tailwind CSS    │
│  Port: 5173                                    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              API 网关 (Nginx 可选)              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              后端服务层                         │
│  Express.js + JWT + Bcrypt                      │
│  Port: 3002                                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              数据存储层                           │
│  MySQL (统一数据库: shuzhi_service_hub)         │
│  Port: 3306                                     │
└─────────────────────────────────────────────────┘
```

---

## 🚀 部署步骤

### 1. 数据库部署

#### 1.1 安装 MySQL

**Windows:**
```bash
# 下载并安装 MySQL Installer
# https://dev.mysql.com/downloads/installer/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

#### 1.2 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本
source /path/to/unified-database-init.sql

# 或者直接执行
mysql -u root -p < /path/to/unified-database-init.sql
```

#### 1.3 创建数据库用户（可选）

```sql
-- 创建专用数据库用户
CREATE USER 'shuzhi_hub'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON shuzhi_service_hub.* TO 'shuzhi_hub'@'localhost';
FLUSH PRIVILEGES;
```

### 2. 后端服务部署

#### 2.1 安装依赖

```bash
cd unified-backend
npm install
```

#### 2.2 配置环境变量

```bash
# 复制环境变量示例
cp .env.example .env

# 编辑 .env 文件
notepad .env  # Windows
# 或
vim .env  # Linux/macOS
```

**.env 配置示例：**

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shuzhi_service_hub

# JWT配置
JWT_SECRET=your_very_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

# 服务器配置
PORT=3002
NODE_ENV=production

# 文件上传配置
UPLOAD_PATH=./uploads
```

#### 2.3 启动后端服务

**开发模式:**
```bash
npm run dev
```

**生产模式:**
```bash
npm start
```

**使用 PM2 管理（推荐）:**

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start unified-backend/app.js --name "shuzhi-hub-backend"

# 查看状态
pm2 status

# 查看日志
pm2 logs shuzhi-hub-backend

# 重启
pm2 restart shuzhi-hub-backend

# 开机自启
pm2 startup
pm2 save
```

#### 2.4 验证后端服务

```bash
# 健康检查
curl http://localhost:3002/health

# 预期响应
{
  "status": "ok",
  "message": "数智服务港统一后端服务运行正常",
  "database": "connected"
}
```

### 3. 前端部署

#### 3.1 安装依赖

```bash
cd unified-frontend
npm install
```

#### 3.2 开发模式启动

```bash
npm run dev
```

访问: http://localhost:5173

#### 3.3 生产构建

```bash
# 构建生产版本
npm run build

# 生成的文件在 dist 目录
```

#### 3.4 部署到静态服务器

**方式 1: 使用 Vite Preview**

```bash
npm run preview
```

**方式 2: 使用 Nginx**

1. 构建项目:
```bash
npm run build
```

2. 配置 Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/unified-frontend/dist;
    index index.html;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Vue Router history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理到后端
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. 重启 Nginx:

```bash
nginx -t
nginx -s reload
```

**方式 3: 部署到 GitHub Pages**

```bash
# 安装 gh-pages
npm install -g gh-pages

# 构建
npm run build

# 部署
gh-pages -d dist
```

### 4. Nginx 完整配置（生产环境推荐）

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 前端静态文件
    location / {
        root /path/to/unified-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 缓存配置
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## 📊 部署检查清单

### 数据库

- [ ] MySQL 已安装并启动
- [ ] 数据库 `shuzhi_service_hub` 已创建
- [ ] 所有表已创建
- [ ] 触发器已创建
- [ ] 视图已创建
- [ ] 数据库连接测试通过

### 后端

- [ ] Node.js 已安装 (v14+)
- [ ] 依赖已安装
- [ ] 环境变量已配置
- [ ] 后端服务已启动
- [ ] 健康检查接口正常
- [ ] API 接口可访问
- [ ] JWT 密钥已修改
- [ ] PM2 进程管理已配置（可选）

### 前端

- [ ] Node.js 已安装
- [ ] 依赖已安装
- [ ] 开发环境可正常访问
- [ ] 生产构建成功
- [ ] 静态服务器已配置
- [ ] HTTPS 已配置（生产）
- [ ] API 代理已配置

### 安全

- [ ] 密码使用 bcrypt 加密
- [ ] JWT 密钥已修改为强密钥
- [ ] 数据库密码已修改
- [ ] HTTPS 已启用
- [ ] 安全头部已配置
- [ ] CORS 已正确配置

---

## 🧪 测试

### 1. 后端 API 测试

```bash
# 健康检查
curl http://localhost:3002/health

# 注册用户
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "phone": "13800000000",
    "password": "password123",
    "role": "member"
  }'

# 登录
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "password123"
  }'

# 获取任务列表（需要 token）
curl http://localhost:3002/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. 前端功能测试

**测试账号:**

1. **管理员账号**
   - 用户名: admin
   - 密码: 需要先注册

2. **供应商账号**
   - 注册时选择"供应商"角色
   - 可以发布产品和任务

3. **会员账号**
   - 注册时选择"会员"角色
   - 可以认领任务和参加活动

**测试流程:**

1. **注册会员**
   - 访问 /register
   - 选择"会员"角色
   - 填写信息并提交

2. **浏览任务**
   - 访问 /member/tasks
   - 查看任务列表
   - 筛选和搜索

3. **认领任务**
   - 点击任务查看详情
   - 点击"认领任务"
   - 填写认领理由

4. **登录供应商**
   - 注册或登录供应商账号
   - 访问 /supplier
   - 发布产品和任务

5. **审核认领**
   - 供应商查看任务认领申请
   - 审核通过或拒绝

6. **更新进度**
   - 会员访问 /member/my-tasks
   - 更新任务进度
   - 提交交付物

---

## 🔧 故障排除

### 数据库连接失败

**问题:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**解决方案:**
1. 检查 MySQL 是否启动
2. 检查端口是否正确
3. 检查数据库用户名和密码
4. 检查防火墙设置

### 前端无法访问后端 API

**问题:** `Network Error` 或 `404 Not Found`

**解决方案:**
1. 检查后端服务是否启动
2. 检查 API 代理配置
3. 检查 CORS 设置
4. 检查网络连接

### JWT Token 无效

**问题:** `401 Unauthorized`

**解决方案:**
1. 检查 JWT_SECRET 是否一致
2. 检查 token 是否过期
3. 清除 localStorage 重新登录

---

## 📝 生产环境优化

### 1. 性能优化

- [ ] 启用 Gzip 压缩
- [ ] 配置 CDN 加速
- [ ] 使用 Redis 缓存
- [ ] 数据库查询优化
- [ ] 图片懒加载
- [ ] 代码分割

### 2. 安全加固

- [ ] 启用 HTTPS
- [ ] 配置防火墙
- [ ] 限制 API 请求频率
- [ ] 定期备份数据库
- [ ] 配置 WAF
- [ ] 定期更新依赖

### 3. 监控告警

- [ ] 配置日志收集
- [ ] 设置性能监控
- [ ] 配置错误告警
- [ ] 监控服务器资源
- [ ] 监控数据库性能

---

## 📞 技术支持

如遇到部署问题，请参考：

- **开发需求文档**: `开发需求文档.md`
- **整合完成报告**: `三大系统整合完成报告.md`
- **后端 API 文档**: `unified-backend/README.md`
- **数据库脚本**: `unified-database-init.sql`

---

## ✅ 部署完成

部署完成后，您将拥有：

1. **完整的统一后端服务**
   - 30 个 API 接口
   - 统一认证和授权
   - 完整的数据关联

2. **现代化的前端界面**
   - Vue 3 + Tailwind CSS
   - 响应式设计
   - 流畅的用户体验

3. **三大系统完全打通**
   - 供应链平台
   - 会员体系
   - 任务系统

**祝您使用愉快！** 🎉
