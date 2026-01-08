# GitHub手动部署完整指南

## 📋 当前状况

由于网络连接问题，Git无法自动推送到GitHub。您需要手动完成以下步骤。

## 🎯 手动部署步骤（3个方案）

---

## 方案一：修复网络后使用Git（推荐）

### 步骤1：配置代理（如果有）

如果您使用VPN或代理软件：

```powershell
# 设置代理（根据您的代理端口修改）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 然后尝试推送
git push -u origin main
```

**常见代理端口**：
- Clash: 7890
- V2Ray: 10809
- Shadowsocks: 1080

### 步骤2：修改hosts文件（无代理推荐）

1. **以管理员身份运行记事本**
   - 右键记事本 → 以管理员身份运行

2. **打开hosts文件**
   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

3. **添加以下内容到文件末尾**
   ```
   # GitHub CDN加速
   140.82.112.4 github.com
   140.82.113.3 github.com
   140.82.112.5 github.global.ssl.fastly.net
   185.199.108.133 assets-cdn.github.com
   185.199.109.133 assets-cdn.github.com
   185.199.110.133 assets-cdn.github.com
   185.199.111.133 assets-cdn.github.com
   140.82.112.3 codeload.github.com
   140.82.112.9 raw.githubusercontent.com
   ```

4. **保存文件**

5. **刷新DNS缓存**
   ```powershell
   ipconfig /flushdns
   ```

6. **恢复Git远程地址并推送**
   ```powershell
   cd "c:/Users/56867/CodeBuddy/数智服务港/官网"
   git remote set-url origin https://github.com/eagle13579/sz-service-port.git
   git push -u origin main
   ```

---

## 方案二：使用GitHub网页界面上传（无需Git）

### 步骤1：准备压缩包

```powershell
# 在项目目录运行
cd "c:/Users/56867/CodeBuddy/数智服务港/官网"
```

**需要上传的文件和文件夹**：

**核心文件**（必须）：
- `index.html` - 主页
- `gh-pages/` - GitHub Pages专用页面
- `README.md` - 项目说明

**完整项目**（推荐）：
- `unified-backend/` - 后端服务
- `unified-frontend/` - 前端应用
- `unified-database-init.sql` - 数据库脚本
- `test-data.sql` - 测试数据
- `start-system.bat` - Windows启动脚本
- `start-system.sh` - Linux启动脚本

**文档文件**（推荐）：
- `DEPLOYMENT_COMPLETE.md`
- `UNIFIED_SYSTEM_DEPLOY.md`
- `SYSTEM_TEST_REPORT.md`
- `GITHUB_PAGES_SETUP.md`
- `GITHUB_PAGES_DEPLOY.md`
- `域名配置指南.md`
- `备用部署方案.md`
- `GITHUB_NETWORK_FIX.md`

### 步骤2：通过GitHub网页上传

1. **访问GitHub仓库**
   ```
   https://github.com/eagle13579/sz-service-port
   ```

2. **上传单个文件**
   - 点击 "Add file" → "Upload files"
   - 拖拽文件到上传区域
   - 在 "Commit changes" 中输入提交信息：
     ```
     feat: 添加数智服务港完整系统
     ```
   - 点击 "Commit changes"

3. **上传多个文件**
   - 创建文件夹（如：`gh-pages/`）
   - 进入文件夹后上传文件
   - 或上传ZIP压缩包后解压

**注意**：GitHub网页上传限制：
- 单个文件最大 25MB
- 建议分批次上传
- 优先上传核心文件（index.html、README.md等）

---

## 方案三：使用Gitee镜像（国内推荐）

### 步骤1：注册Gitee账号

访问：https://gitee.com/ 并注册账号

### 步骤2：创建新仓库

1. 点击右上角 "+" → "新建仓库"
2. 仓库名：`sz-service-port`
3. 设置为公开仓库
4. 点击 "创建"

### 步骤3：从GitHub导入

1. 在新创建的仓库中
2. 点击 "从GitHub导入仓库"
3. 输入GitHub仓库地址：
   ```
   https://github.com/eagle13579/sz-service-port.git
   ```

或者直接在Gitee创建并手动上传文件（同方案二）

### 步骤4：启用Gitee Pages

1. 进入仓库页面
2. 点击 "服务" → "Gitee Pages"
3. 选择 "main" 分支
4. 点击 "启动"

### 步骤5：访问网站

```
https://your-username.gitee.io/sz-service-port/
```

---

## ✅ 部署验证清单

完成部署后，请验证以下项目：

- [ ] 代码已上传到GitHub/Gitee
- [ ] 可以看到 `index.html` 文件
- [ ] 文档文件都已上传
- [ ] 可以访问仓库页面
- [ ] （GitHub）已启用Pages服务
- [ ] （GitHub）配置了正确的分支和目录
- [ ] 可以访问部署的网站

---

## 🌐 最终访问地址

### GitHub Pages
```
https://eagle13579.github.io/sz-service-port/
```

### Gitee Pages
```
https://your-username.gitee.io/sz-service-port/
```

---

## 📞 需要帮助？

如果遇到问题：

1. **查看详细网络解决方案**
   - 打开 `GITHUB_NETWORK_FIX.md`

2. **尝试其他部署方式**
   - 查看 `备用部署方案.md`

3. **使用本地运行**
   ```powershell
   start-system.bat
   ```
   访问：http://localhost:5173

---

## 🎉 部署成功后

部署成功后，您的网站将：
- ✅ 可以通过互联网访问
- ✅ 支持HTTPS加密
- ✅ 自动CDN加速
- ✅ 永久免费使用

---

**推荐操作顺序**：
1. 先尝试**方案一**（修复网络）
2. 再尝试**方案二**（网页上传）
3. 最后考虑**方案三**（Gitee镜像）

选择最适合您的方案即可！
