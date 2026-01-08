# 后端API连接测试和配置指南

## 🔧 快速开始

### 方案1: 使用模拟数据（推荐新手）

**适用场景**:
- 前端UI开发
- 不需要真实后端
- 快速开始开发

**配置步骤**:

1. **编辑API配置文件**
   
   文件: `unified-frontend/src/utils/api.js`
   
   修改第3行:
   ```javascript
   const USE_MOCK_DATA = true  // 改为 true
   ```

2. **重启前端服务**
   ```bash
   cd unified-frontend
   npm run dev
   ```

3. **开始开发**
   - 访问 http://localhost:5173
   - 所有页面都会使用模拟数据
   - 修改数据，查看 `mockData.js`

---

### 方案2: 使用真实API（推荐）

**适用场景**:
- 完整功能开发
- 需要数据持久化
- 后端API测试

#### 步骤1: 启动MySQL数据库

**方法A: 使用启动脚本**
```cmd
# 双击运行
启动MySQL容器.bat

# 等待25秒让MySQL启动完成
```

**方法B: 手动启动**
```cmd
# 1. 检查Docker是否运行
docker version

# 2. 创建MySQL容器
docker run -d --name shuzhi-mysql ^
  -p 3306:3306 ^
  -e MYSQL_ROOT_PASSWORD=root123 ^
  -e MYSQL_DATABASE=shuzhi_service_hub ^
  mysql:8.0

# 3. 等待25秒让MySQL启动
timeout /t 25

# 4. 验证容器状态
docker ps | findstr shuzhi-mysql
```

#### 步骤2: 初始化数据库

```cmd
# 初始化数据库结构
docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < unified-database-init.sql

# 导入测试数据
docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < test-init.sql
```

#### 步骤3: 启动后端服务

```bash
cd unified-backend
npm install  # 首次运行
npm run dev
```

后端服务将在 http://localhost:3002 启动

#### 步骤4: 测试后端API

**方法A: 使用浏览器**
- 访问: http://localhost:3002/health
- 应该看到: `{"status":"ok","database":"connected"}`

**方法B: 使用curl**
```bash
curl http://localhost:3002/health
```

**方法C: 使用测试系统**
- 访问: http://localhost:5173/测试系统.html
- 点击"测试API连接"按钮

#### 步骤5: 配置前端使用真实API

1. **编辑API配置文件**
   
   文件: `unified-frontend/src/utils/api.js`
   
   确保第3行为:
   ```javascript
   const USE_MOCK_DATA = false  // 使用真实API
   ```

2. **重启前端服务**
   ```bash
   cd unified-frontend
   npm run dev
   ```

3. **测试完整数据流**
   - 访问 http://localhost:5173
   - 所有页面将从后端API获取数据

---

## 📊 API接口文档

### 1. 认证接口

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "member"
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### 获取当前用户
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 2. 统计数据接口

#### 获取概览统计
```http
GET /api/stats/overview
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "users": 3,
    "suppliers": 2,
    "members": 2,
    "tasks": 5,
    "products": 4,
    "activities": 3
  }
}
```

### 3. 产品接口

#### 获取产品列表
```http
GET /api/products?page=1&limit=10&category=技术服务
```

#### 创建产品
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_name": "新产品",
  "description": "产品描述",
  "category": "技术服务",
  "price": 10000,
  "stock": 100
}
```

### 4. 任务接口

#### 获取任务列表
```http
GET /api/tasks?page=1&limit=10&status=open
```

#### 创建任务
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新任务",
  "description": "任务描述",
  "task_type": "development",
  "reward_points": 500,
  "budget": 50000,
  "deadline": "2026-03-01"
}
```

### 5. 活动接口

#### 获取活动列表
```http
GET /api/activities?page=1&limit=10&status=active
```

#### 参加活动
```http
POST /api/activities/:id/join
Authorization: Bearer <token>
```

---

## 🧪 测试数据

### 测试账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin | admin123 | 管理员 | 系统管理员 |
| testuser | user123 | 会员 | 普通会员 |
| testsupplier | supplier123 | 供应商 | 企业供应商 |

### 测试数据统计

- 用户: 3个
- 会员: 2个
- 供应商: 2个
- 产品: 4个
- 任务: 5个
- 活动: 3个
- 订单: 3个

---

## 🔍 故障排除

### 问题1: MySQL连接失败

**错误**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**解决步骤**:
1. 检查MySQL容器是否运行
   ```cmd
   docker ps | findstr shuzhi-mysql
   ```

2. 如果未运行，启动容器
   ```cmd
   docker start shuzhi-mysql
   timeout /t 10
   ```

3. 验证数据库是否存在
   ```cmd
   docker exec shuzhi-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"
   ```

### 问题2: 后端启动失败

**错误**: `Error: Database connection failed`

**解决步骤**:
1. 检查 `.env` 配置
   ```cmd
   type unified-backend\.env
   ```

2. 确保配置正确
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root123
   DB_NAME=shuzhi_service_hub
   ```

3. 测试数据库连接
   ```cmd
   docker exec -it shuzhi-mysql mysql -uroot -proot123 -e "SELECT 1"
   ```

### 问题3: 前端无法连接后端

**错误**: `Network Error` 或 `ERR_CONNECTION_REFUSED`

**解决步骤**:
1. 确认后端正在运行
   ```cmd
   curl http://localhost:3002/health
   ```

2. 检查前端API配置
   ```javascript
   // unified-frontend/src/utils/api.js
   const BASE_URL = 'http://localhost:3002/api'
   ```

3. 检查是否使用模拟数据
   ```javascript
   // 确保使用真实API
   const USE_MOCK_DATA = false
   ```

### 问题4: CORS错误

**错误**: `Access-Control-Allow-Origin`

**解决**: 后端已配置CORS，确保后端正常运行

---

## 📝 配置文件说明

### 后端配置 (unified-backend/.env)

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root123
DB_NAME=shuzhi_service_hub

# JWT配置
JWT_SECRET=shuzhi_service_hub_jwt_secret_key_2026_change_in_production
JWT_EXPIRES_IN=24h

# 服务器配置
PORT=3002
NODE_ENV=development
```

### 前端配置 (unified-frontend/src/utils/api.js)

```javascript
// 数据模式切换
const USE_MOCK_DATA = false  // true=模拟数据, false=真实API

// API地址
const BASE_URL = 'http://localhost:3002/api'
const TIMEOUT = 10000
```

---

## 🚀 开发流程

### 完整开发流程

```bash
# 1. 启动MySQL
启动MySQL容器.bat

# 2. 等待25秒

# 3. 初始化数据库（首次运行）
docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < unified-database-init.sql
docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < test-init.sql

# 4. 启动后端（新终端）
cd unified-backend
npm run dev

# 5. 启动前端（新终端）
cd unified-frontend
npm run dev

# 6. 测试
# 浏览器访问: http://localhost:5173
# API测试: http://localhost:3002/health
```

### 快速重启

```bash
# 停止MySQL
docker stop shuzhi-mysql

# 启动MySQL
docker start shuzhi-mysql

# 等待10秒
timeout /t 10

# 重启后端
# Ctrl+C 停止后端
# npm run dev 重新启动

# 重启前端
# Ctrl+C 停止前端
# npm run dev 重新启动
```

---

## 📊 测试检查清单

### 后端测试

- [ ] MySQL容器正常运行
- [ ] 数据库初始化成功
- [ ] 后端服务启动成功
- [ ] 健康检查接口正常
- [ ] API接口返回数据

### 前端测试

- [ ] 页面正常加载
- [ ] API配置正确
- [ ] 数据正确显示
- [ ] 表单提交正常
- [ ] 错误处理正常

### 集成测试

- [ ] 用户注册流程
- [ ] 用户登录流程
- [ ] 产品列表显示
- [ ] 任务列表显示
- [ ] 活动列表显示
- [ ] 数据持久化

---

## 🎯 最佳实践

1. **开发阶段**: 先使用模拟数据开发UI，再切换到真实API
2. **测试阶段**: 使用真实API进行完整功能测试
3. **生产环境**: 确保数据库安全，使用环境变量管理密钥
4. **错误处理**: 前端添加完善的错误提示
5. **日志记录**: 后端添加详细的日志输出

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| `自动配置完成-使用说明.md` | 自动配置脚本使用指南 |
| `使用模拟数据开发指南.md` | 模拟数据使用方法 |
| `完整功能测试报告.md` | 功能测试报告 |
| `当前开发状态和下一步指南.md` | 开发状态和指南 |

---

## 💡 快速命令参考

```cmd
# 启动所有服务
启动MySQL容器.bat

# 检查MySQL状态
docker ps | findstr shuzhi-mysql

# 查看MySQL日志
docker logs shuzhi-mysql

# 测试数据库连接
docker exec -it shuzhi-mysql mysql -uroot -proot123 -e "SELECT 1"

# 查看数据表
docker exec shuzhi-mysql mysql -uroot -proot123 -e "USE shuzhi_service_hub; SHOW TABLES;"

# 测试后端健康检查
curl http://localhost:3002/health

# 访问前端
start http://localhost:5173

# 访问测试系统
start http://localhost:5173/测试系统.html
```

---

## 🎉 总结

**已完成的配置**:
- ✅ 自动启动MySQL脚本
- ✅ 数据库初始化脚本
- ✅ 测试数据导入脚本
- ✅ 完整的API连接指南
- ✅ 详细的故障排除

**两种开发模式**:
1. **模拟数据模式**: 无需数据库，快速开发UI
2. **真实API模式**: 完整功能，数据持久化

**下一步**: 选择适合的模式，开始开发！🚀
