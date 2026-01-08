# 数智服务港统一后端服务

## 📋 项目概述

这是数智服务港的统一后端服务，整合了供应链平台、会员体系和会员任务系统三大模块，实现了数据打通和功能协同。

## 🎯 核心特性

### 1. 统一数据库架构
- 单一 MySQL 数据库 `shuzhi_service_hub`
- 统一的用户认证系统
- 完整的外键关联和数据完整性约束

### 2. 三大模块协同
- **供应链平台**: 供应商管理、产品发布、任务发布
- **会员体系**: 会员管理、技能认证、作品集
- **任务系统**: 任务认领、进度追踪、回报结算

### 3. 核心功能流程
```
供应商发布任务 → 会员浏览任务 → 会员认领任务 → 供应商审核 → 会员执行任务 → 任务完成 → 回报结算 → 评价
```

### 4. 安全增强
- 密码 bcrypt 加密（已修复明文存储问题）
- JWT Token 认证
- 基于角色的权限控制（RBAC）
- SQL 注入防护

## 📁 项目结构

```
unified-backend/
├── app.js                 # 主应用文件
├── package.json           # 项目依赖
├── .env.example          # 环境变量示例
├── config/
│   └── database.js       # 数据库配置
├── middleware/
│   └── auth.js          # 认证中间件
├── utils/
│   └── auth.js          # 密码加密工具
└── routes/
    ├── auth.js          # 认证路由
    ├── suppliers.js     # 供应商路由
    ├── members.js       # 会员路由
    ├── products.js      # 产品路由
    ├── tasks.js         # 任务路由
    ├── activities.js    # 活动路由
    ├── rewards.js       # 回报路由
    ├── reviews.js       # 评价路由
    └── admin.js         # 管理员路由
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd unified-backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shuzhi_service_hub

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h

PORT=3002
NODE_ENV=development
```

### 3. 初始化数据库

运行统一数据库初始化脚本：

```bash
mysql -u root -p < ../unified-database-init.sql
```

### 4. 启动服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3002` 启动

## 📡 API 接口文档

### 认证相关

#### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "test_user",
  "email": "test@example.com",
  "phone": "13800000000",
  "password": "password123",
  "role": "member"  // supplier 或 member
}
```

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "test_user",
  "password": "password123"
}
```

返回：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": 1,
    "username": "test_user",
    "email": "test@example.com",
    "phone": "13800000000",
    "role": "member",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 任务相关（核心协同功能）

#### 获取任务列表
```
GET /api/tasks?page=1&pageSize=10&status=published&task_type=market
Authorization: Bearer <token>
```

#### 获取任务详情
```
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### 供应商发布任务
```
POST /api/tasks
Authorization: Bearer <token>

{
  "task_title": "市场营销推广",
  "task_desc": "需要为新品进行市场推广",
  "task_type": "market",
  "budget": 5000.00,
  "deadline": "2026-12-31",
  "skill_requirements": "市场营销经验，社交媒体运营",
  "delivery_standards": "提供详细的推广方案和数据报告"
}
```

#### 会员认领任务（关键流程）
```
POST /api/tasks/:id/claim
Authorization: Bearer <token>

{
  "claim_reason": "我有5年市场营销经验，曾成功推广多个品牌",
  "quote": 4500.00,
  "estimated_time": "2周"
}
```

#### 供应商审核认领
```
POST /api/tasks/:taskId/claims/:claimId/approve
Authorization: Bearer <token>

{
  "status": "approved",  // approved 或 rejected
  "remark": "同意认领"
}
```

#### 更新任务进度
```
PUT /api/tasks/:id/progress
Authorization: Bearer <token>

{
  "progress": 50,
  "delivery_url": "https://example.com/delivery.pdf"
}
```

### 供应商相关

#### 获取供应商列表
```
GET /api/suppliers?page=1&pageSize=10&verification_status=approved
Authorization: Bearer <token>
```

#### 获取供应商详情
```
GET /api/suppliers/:id
Authorization: Bearer <token>
```

### 会员相关

#### 获取会员列表
```
GET /api/members?page=1&pageSize=10&member_type=excellent
Authorization: Bearer <token>
```

#### 获取会员详情
```
GET /api/members/:id
Authorization: Bearer <token>
```

#### 添加会员技能
```
POST /api/members/:id/skills
Authorization: Bearer <token>

{
  "skill_name": "市场营销",
  "skill_level": 4,
  "certificate_url": "https://example.com/cert.pdf"
}
```

### 产品相关

#### 获取产品列表
```
GET /api/products?page=1&pageSize=10&category_id=1&supplier_id=1
Authorization: Bearer <token>
```

#### 供应商发布产品
```
POST /api/products
Authorization: Bearer <token>

{
  "product_name": "智能手表",
  "product_desc": "高端智能手表，支持健康监测",
  "price": 2999.00,
  "stock": 100,
  "category_id": 1,
  "product_images": ["https://example.com/image1.jpg"]
}
```

### 活动相关

#### 获取活动列表
```
GET /api/activities?page=1&pageSize=10&activity_type=lunch
Authorization: Bearer <token>
```

#### 会员报名活动
```
POST /api/activities/:id/register
Authorization: Bearer <token>
```

### 回报相关

#### 获取回报记录
```
GET /api/rewards?page=1&pageSize=10&status=pending
Authorization: Bearer <token>
```

#### 结算回报
```
PUT /api/rewards/:id/settle
Authorization: Bearer <token>
```

### 评价相关

#### 获取评价列表
```
GET /api/reviews?page=1&pageSize=10&reviewee_id=1
Authorization: Bearer <token>
```

#### 创建评价
```
POST /api/reviews
Authorization: Bearer <token>

{
  "reviewee_id": 2,
  "supplier_id": 1,
  "task_claim_id": 1,
  "rating": 5,
  "content": "非常满意，任务完成质量很高",
  "is_anonymous": false
}
```

### 管理员相关

#### 仪表盘数据
```
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### 审核供应商
```
PUT /api/admin/suppliers/:id/verify
Authorization: Bearer <token>

{
  "verification_status": "approved",
  "verification_remark": "审核通过"
}
```

## 🔐 安全特性

### 1. 密码加密
使用 bcrypt 加密，盐值轮次为 10：

```javascript
const hashedPassword = await hashPassword('password123');
// $2a$10$...
```

### 2. JWT 认证
Token 包含用户 ID、用户名、邮箱、角色等信息：

```javascript
const token = generateToken({
  id: userId,
  username,
  email,
  role
});
```

### 3. 角色权限控制
- **admin**: 管理员，拥有所有权限
- **supplier**: 供应商，可以发布产品和任务
- **member**: 会员，可以认领任务和报名活动

### 4. 请求验证
使用 express-validator 进行参数验证：

```javascript
router.post('/register', [
  body('username').isLength({ min: 3, max: 50 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  // 处理逻辑
});
```

## 📊 数据库设计

### 核心表关系

```
users (统一用户表)
  ├── suppliers (供应商表)
  │     ├── products (产品表)
  │     └── tasks (任务表)
  │           └── task_claims (任务认领表)
  └── members (会员表)
        ├── member_skills (会员技能表)
        ├── member_certifications (会员认证表)
        ├── member_portfolios (会员作品集表)
        └── reward_records (回报记录表)

activities (活动表)
  └── activity_registrations (活动报名表)

reviews (统一评价表)
```

### 数据库触发器

1. **after_task_claim_insert**: 任务认领时自动更新任务状态
2. **after_task_update**: 任务完成时自动更新会员信用分和任务数
3. **after_reward_settle**: 回报结算时自动更新会员总收益和积分

### 数据库视图

1. **v_supplier_detail**: 供应商完整信息视图
2. **v_member_detail**: 会员完整信息视图
3. **v_task_detail**: 任务详情视图（包含供应商和会员信息）

## 🧪 测试

### 测试账号

使用以下测试账号进行功能测试：

```bash
# 管理员
username: admin
password: admin123
role: admin

# 供应商
username: supplier_test
password: supplier123
role: supplier

# 会员
username: member_test
password: member123
role: member
```

### 测试流程

1. **注册/登录三个不同角色的用户**
2. **供应商发布产品和任务**
3. **会员浏览任务并认领**
4. **供应商审核任务认领**
5. **会员更新任务进度**
6. **任务完成后创建回报记录**
7. **结算回报**
8. **创建评价**

## 🐛 已修复的问题

### 1. 密码明文存储问题
- **问题**: 会员任务系统使用明文存储密码
- **修复**: 统一使用 bcrypt 加密存储

### 2. 数据库隔离问题
- **问题**: 三个系统使用三个独立的数据库
- **修复**: 统一使用 `shuzhi_service_hub` 数据库

### 3. 任务流程断裂问题
- **问题**: 供应商发布的任务无法被会员认领
- **修复**: 实现了完整的任务发布-认领-审核-完成流程

### 4. 用户表重复问题
- **问题**: 三个系统各自维护独立的用户表
- **修复**: 统一用户表，通过 role 字段区分角色

### 5. RLS 策略过于宽松
- **问题**: Supabase RLS 策略允许所有用户读写
- **修复**: 统一使用 MySQL 和中间件进行权限控制

## 📝 注意事项

1. **生产环境部署前**:
   - 修改 `JWT_SECRET` 为强密钥
   - 修改数据库密码
   - 启用 HTTPS
   - 配置跨域白名单

2. **数据备份**:
   - 定期备份数据库
   - 保留备份历史

3. **性能优化**:
   - 为高频查询添加索引
   - 使用 Redis 缓存热点数据
   - 实现分页查询

4. **监控告警**:
   - 监控 API 响应时间
   - 监控数据库连接池
   - 设置错误告警

## 🔧 开发建议

1. **API 版本控制**: 建议在路由中添加版本号，如 `/api/v1/tasks`
2. **日志记录**: 添加请求日志和错误日志
3. **单元测试**: 为关键业务逻辑添加单元测试
4. **API 文档**: 使用 Swagger 自动生成 API 文档
5. **限流**: 添加 API 限流中间件防止滥用

## 📞 技术支持

如有问题，请参考：
- 项目文档: `../开发需求文档.md`
- 问题报告: `../三大系统协同性问题报告.md`
- 统一数据库: `../unified-database-init.sql`

## 📄 许可证

MIT License
