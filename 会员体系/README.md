# 会员体系 - 开发项目

## 📋 项目概述

会员体系是数智服务港平台的核心功能之一，实现会员注册、任务认领、回报分配、产品对接等核心功能。

### 核心功能

1. **会员注册与认证**
   - 会员注册/登录
   - 实名认证
   - 技能认证
   - 会员等级体系

2. **会员个人中心**
   - 个人资料管理
   - 任务管理
   - 收益管理

3. **产品浏览与认领**
   - 产品列表展示
   - 任务认领功能
   - 任务执行与交付

4. **任务回报机制**
   - 回报类型管理
   - 回报计算与发放
   - 收益统计

5. **信用评价系统**
   - 信用评分
   - 评价管理
   - 申诉机制

### 技术栈

- **前端**: Vue 3 + Element Plus
- **后端**: Node.js + Express
- **数据库**: MySQL

---

## 📁 项目结构

```
会员体系/
├── backend/                   # 后端项目
│   ├── config/               # 配置文件
│   ├── controllers/          # 控制器
│   ├── middleware/           # 中间件
│   ├── models/               # 数据模型
│   ├── routes/               # 路由
│   ├── utils/                # 工具函数
│   ├── app.js                # 主文件
│   └── package.json
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # 组件
│   │   ├── layouts/         # 布局
│   │   ├── router/          # 路由
│   │   ├── stores/          # 状态管理
│   │   ├── utils/           # 工具函数
│   │   ├── views/           # 页面
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
├── database/                # 数据库脚本
│   └── init.sql
├── docs/                    # 文档
│   └── API文档.md
└── README.md
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 2. 配置数据库

```sql
CREATE DATABASE member_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p member_system < database/init.sql
```

### 3. 配置环境变量

编辑 `backend/.env` 文件：

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=member_system

JWT_SECRET=your_jwt_secret_key
```

### 4. 启动项目

```bash
# 启动后端
cd backend
npm run dev

# 启动前端
cd frontend
npm run dev
```

---

## 📊 数据库设计

### 核心数据表

1. **members** - 会员表
2. **member_skills** - 会员技能表
3. **member_certifications** - 会员认证表
4. **member_portfolios** - 会员作品集表
5. **task_claims** - 任务认领表
6. **reward_records** - 回报记录表
7. **credit_scores** - 信用评分表
8. **reviews** - 评价表

---

## 📝 API 接口

### 会员管理

- `POST /api/members/register` - 会员注册
- `POST /api/members/login` - 会员登录
- `GET /api/members/profile` - 获取会员信息
- `PUT /api/members/profile` - 更新会员信息

### 任务管理

- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks/:id/claim` - 认领任务
- `PUT /api/tasks/:id/progress` - 更新任务进度
- `POST /api/tasks/:id/deliver` - 提交交付物

### 回报管理

- `GET /api/rewards` - 获取回报记录
- `POST /api/rewards/withdraw` - 申请提现

### 信用评价

- `GET /api/credit/score` - 获取信用评分
- `POST /api/reviews` - 提交评价

---

## 🛠️ 开发规范

### 代码规范

- 使用 ES6+ 语法
- 遵循 Airbnb JavaScript Style Guide
- 使用 async/await 处理异步操作

### Git 规范

- 分支命名：feature/功能描述、bugfix/问题描述
- 提交信息：type: subject

---

**开始开发吧！** 🚀
