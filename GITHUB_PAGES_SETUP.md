# GitHub Pages 快速设置指南

## 📌 重要提示

GitHub Pages需要您在GitHub仓库中手动启用。请按照以下步骤操作。

---

## 🚀 快速启用步骤（2分钟）

### 步骤1: 访问GitHub仓库

打开浏览器，访问：
```
https://github.com/eagle13579/sz-service-port
```

### 步骤2: 进入Settings页面

1. 点击仓库顶部的 **"Settings"** 标签
2. 在左侧菜单中找到 **"Pages"**（在"Code and automation"部分）
3. 点击进入Pages设置页面

### 步骤3: 配置GitHub Pages

在Pages设置页面：

**Build and deployment** 部分：
- **Source**: 选择 "Deploy from a branch"
- **Branch**: 选择 "main"
- **Folder**: 选择 "/ (root)"
- 点击 **"Save"** 按钮

### 步骤4: 等待部署

- 保存后，GitHub会自动开始部署
- 通常需要1-3分钟
- 页面会显示 "Your site is live at: https://eagle13579.github.io/sz-service-port/"

---

## 🌐 部署完成后的访问地址

```
https://eagle13579.github.io/sz-service-port/
```

**或者**：

```
https://eagle13579.github.io/sz-service-port/gh-pages/
```

---

## 🔧 高级配置（可选）

### 自定义域名

如果您有自己的域名，可以配置自定义域名：

1. **在GitHub Pages设置中**：
   - 进入Settings → Pages
   - 在"Custom domain"部分输入您的域名
   - 例如：`www.yourdomain.com`

2. **DNS配置**：
   - 登录您的域名DNS管理
   - 添加CNAME记录：
     ```
     主机记录: www
     记录值: eagle13579.github.io
     ```

3. **等待生效**：
   - DNS解析通常需要10分钟-24小时
   - 生效后即可通过自定义域名访问

### HTTPS设置

GitHub Pages自动为自定义域名提供Let's Encrypt SSL证书：

1. 在GitHub Pages设置中启用"Enforce HTTPS"
2. 等待证书签发（通常几分钟）
3. HTTPS即可生效

---

## 📂 验证部署

部署完成后，访问以下地址验证：

### 1. 主页面
```
https://eagle13579.github.io/sz-service-port/
```

### 2. 优化页面（gh-pages子目录）
```
https://eagle13579.github.io/sz-service-port/gh-pages/
```

### 3. GitHub Pages状态
```
https://github.com/eagle13579/sz-service-port/actions
```

---

## 🔄 自动部署

配置完成后，每次推送到main分支会自动触发部署：

```bash
git add .
git commit -m "Update content"
git push origin main
```

等待1-3分钟，GitHub会自动部署您的更改。

---

## ❌ 常见问题

### Q1: 部署后显示404

**原因**：GitHub Pages还在构建中

**解决**：
1. 等待2-3分钟
2. 刷新浏览器
3. 清除浏览器缓存

### Q2: 页面显示不正常

**原因**：可能需要指定正确的子目录

**解决**：
```
https://eagle13579.github.io/sz-service-port/gh-pages/
```

### Q3: 如何更新网站？

**步骤**：
```bash
# 1. 修改文件
# 2. 提交更改
git add .
git commit -m "Update website"

# 3. 推送到GitHub
git push origin main

# 4. 等待GitHub自动部署（1-3分钟）
```

### Q4: 部署失败怎么办？

**原因**：可能是文件过大或路径问题

**解决**：
1. 检查GitHub Actions日志：仓库 → Actions
2. 确保index.html在根目录
3. 检查文件大小（GitHub Pages限制1GB）

### Q5: 想要使用自定义域名但没有备案

**GitHub Pages不需要备案**：
- 可以直接使用自定义域名
- 自动提供HTTPS
- 完全免费

---

## 📋 检查清单

启用GitHub Pages前，确认：

- [x] 代码已推送到GitHub ✅
- [x] 仓库为公开（public）✅
- [x] 根目录有index.html文件 ✅
- [x] 已在仓库Settings中找到Pages选项
- [ ] **在Pages中配置Source和Branch** ← 您需要完成这一步
- [ ] 等待部署完成
- [ ] 验证访问地址

---

## 🎯 推荐配置

### 最佳实践

1. **使用main分支**
   - 生产环境使用main分支
   - 开发使用其他分支

2. **启用HTTPS**
   - 在Pages设置中勾选"Enforce HTTPS"
   - 确保安全访问

3. **配置自定义域名**
   - 更专业的网站形象
   - 更好的SEO优化

4. **定期更新**
   - 保持代码同步
   - 及时修复bug

---

## 📞 需要帮助？

### GitHub Pages官方文档
https://docs.github.com/en/pages

### 项目文档
- [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md) - 完整部署文档
- [README.md](./README.md) - 项目说明
- [备用部署方案.md](./备用部署方案.md) - 其他部署方案

### 联系方式
- 邮箱: contact@szserviceport.com
- 电话: 400-888-6666

---

## ✅ 完成确认

当您完成以下操作后，GitHub Pages就成功启用了：

1. ✅ 在GitHub仓库Settings中启用Pages
2. ✅ 配置Source和Branch
3. ✅ 看到部署成功消息
4. ✅ 能够访问网站地址

**预期访问地址**：
```
https://eagle13579.github.io/sz-service-port/
```

---

**立即操作**：
1. 访问 https://github.com/eagle13579/sz-service-port
2. 点击 "Settings"
3. 左侧菜单找到 "Pages"
4. 配置并保存
5. 等待部署完成
6. 访问您的网站！

**预计时间**：2-3分钟即可完成部署 🚀
