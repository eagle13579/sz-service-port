# 数智服务港 - 数据库手动配置指南

## 📋 数据库配置步骤

### 步骤 1: 检查 MySQL 安装

#### 检查 MySQL 是否已安装

**方法 1: 命令行检查**
```powershell
mysql --version
```

**方法 2: 检查常见安装位置**
- `C:\Program Files\MySQL\`
- `C:\Program Files (x86)\MySQL\`
- `C:\xampp\mysql\`
- `C:\wamp64\mysql\`

#### 如果 MySQL 未安装

**选项 A: 安装 MySQL Community Server**
1. 下载地址: https://dev.mysql.com/downloads/mysql/
2. 选择 MySQL Community Server
3. 下载 Windows 版本
4. 安装时设置 root 密码
5. 安装完成后将 MySQL bin 目录添加到系统 PATH

**选项 B: 使用 XAMPP (推荐初学者)**
1. 下载地址: https://www.apachefriends.org/
2. 安装 XAMPP
3. 启动 XAMPP Control Panel
4. 点击 Apache 和 MySQL 的 Start 按钮

**选项 C: 使用 Docker**
```powershell
docker run -d -p 3306:3306 --name mysql ^
  -e MYSQL_ROOT_PASSWORD=root123 ^
  -e MYSQL_DATABASE=shuzhi_service_hub ^
  mysql:8.0
```

---

### 步骤 2: 创建数据库

#### 方法 A: 使用命令行

```bash
# 登录 MySQL (替换 root_password 为您的密码)
mysql -u root -p

# 创建数据库
CREATE DATABASE shuzhi_service_hub
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

# 退出
exit
```

#### 方法 B: 使用 phpMyAdmin (XAMPP)

1. 访问: http://localhost/phpmyadmin
2. 点击"新建"
3. 数据库名: `shuzhi_service_hub`
4. 排序规则: `utf8mb4_unicode_ci`
5. 点击"创建"

#### 方法 C: 使用脚本

```powershell
cd "c:/Users/56867/CodeBuddy/数智服务港/官网"
setup-database.bat
```

---

### 步骤 3: 执行初始化脚本

#### 方法 A: 命令行执行

```bash
mysql -u root -p shuzhi_service_hub < unified-database-init.sql
```

#### 方法 B: phpMyAdmin 导入

1. 访问: http://localhost/phpmyadmin
2. 选择数据库 `shuzhi_service_hub`
3. 点击"导入"
4. 选择文件: `unified-database-init.sql`
5. 点击"执行"

---

### 步骤 4: 导入测试数据 (可选)

```bash
mysql -u root -p shuzhi_service_hub < test-data.sql
```

---

### 步骤 5: 配置后端 .env 文件

1. 复制配置模板
```bash
cd unified-backend
copy .env.example .env
```

2. 编辑 `.env` 文件，配置数据库连接

#### 使用 XAMPP 时的配置:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=shuzhi_service_hub
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h
PORT=3002
NODE_ENV=development
UPLOAD_PATH=./uploads
API_PREFIX=/api
```

#### 使用 Docker 时的配置:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root123
DB_NAME=shuzhi_service_hub
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h
PORT=3002
NODE_ENV=development
UPLOAD_PATH=./uploads
API_PREFIX=/api
```

#### 使用独立 MySQL 时的配置:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=shuzhi_service_hub
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h
PORT=3002
NODE_ENV=development
UPLOAD_PATH=./uploads
API_PREFIX=/api
```

---

### 步骤 6: 验证数据库连接

#### 测试后端服务

```bash
cd unified-backend
npm start
```

在另一个终端测试:
```bash
curl http://localhost:3002/health
```

应该返回:
```json
{
  "status": "ok",
  "message": "数智服务港统一后端服务运行正常",
  "database": "connected"
}
```

---

### 步骤 7: 启动前端开发服务器

#### 安装依赖
```bash
cd unified-frontend
npm install
```

#### 启动开发服务器
```bash
npm run dev
```

访问: http://localhost:5173

---

## 🔧 常见问题

### 问题 1: MySQL 命令未找到

**解决方案**:
1. 找到 MySQL 安装路径
2. 将 `bin` 目录添加到系统 PATH
3. 例如: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

**添加到 PATH 的步骤**:
1. 右键"此电脑" → "属性"
2. 点击"高级系统设置"
3. 点击"环境变量"
4. 在"系统变量"中找到 Path，点击"编辑"
5. 点击"新建"，添加 MySQL bin 目录路径
6. 点击"确定"保存

### 问题 2: 访问被拒绝 (Access denied)

**解决方案**:
1. 确认用户名和密码正确
2. 重置 MySQL root 密码

```bash
# 停止 MySQL 服务
net stop mysql

# 启动 MySQL 跳过权限检查
mysqld --skip-grant-tables

# 在新窗口连接 MySQL
mysql -u root

# 重置密码
USE mysql;
UPDATE user SET authentication_string = PASSWORD('new_password')
WHERE User = 'root';
FLUSH PRIVILEGES;
exit

# 重启 MySQL 服务
net start mysql
```

### 问题 3: 端口 3306 已被占用

**解决方案**:
```powershell
# 查找占用端口的进程
netstat -ano | findstr "3306"

# 结束进程 (替换 PID)
taskkill /PID <进程ID> /F
```

### 问题 4: 后端连接数据库失败

**检查项**:
1. MySQL 服务是否启动
2. 数据库是否创建
3. .env 配置是否正确
4. 防火墙是否阻止连接

---

## 🚀 快速启动脚本

已为您创建自动化脚本:
- `setup-database.bat` - 数据库初始化脚本
- `start-system.bat` - 系统启动脚本

---

## ✅ 配置完成检查清单

- [ ] MySQL 已安装
- [ ] MySQL 服务正在运行
- [ ] 数据库 `shuzhi_service_hub` 已创建
- [ ] 初始化脚本已执行
- [ ] 测试数据已导入 (可选)
- [ ] .env 文件已配置
- [ ] 后端服务启动成功
- [ ] 前端服务启动成功

---

**按照以上步骤完成配置后，即可运行完整的开发环境！** 🎉
