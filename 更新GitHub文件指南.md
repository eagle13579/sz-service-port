# 📝 GitHub 文件更新指南

## ⚠️ 重要提示

远程仓库中已经存在 `gh-pages/index.html` 和 `README.md` 文件，所以您需要**编辑现有文件**，而不是创建新文件。

---

## 📋 **第二步：更新 gh-pages/index.html**

### 操作步骤：

1. **访问文件**
   - 直接访问：https://github.com/eagle13579/sz-service-port/blob/main/gh-pages/index.html
   - 或在仓库首页进入 `gh-pages` 文件夹，点击 `index.html`

2. **点击编辑**
   - 点击右上角的铅笔图标 ✏️ "Edit this file"

3. **替换内容**
   - 选中编辑器中的所有内容（Ctrl+A）
   - 删除现有内容
   - 打开本地文件：`c:/Users/56867/CodeBuddy/数智服务港/官网/gh-pages/index.html`
   - 复制本地文件内容（Ctrl+A → Ctrl+C）
   - 粘贴到GitHub编辑器（Ctrl+V）

4. **提交更改**
   - 在页面底部找到 "Commit changes"
   - 提交信息：
     ```
     feat: 更新GitHub Pages优化版主页

     - 更新为最新版本的主页代码
     - 包含完整的三大系统介绍
     - 包含业务流程展示
     - 包含技术特性和统计数据
     ```
   - 选择：`Commit directly to the main branch`
   - 点击绿色按钮：`Commit changes`

---

## 📋 **第三步：更新 README.md**

### 操作步骤：

1. **访问文件**
   - 直接访问：https://github.com/eagle13579/sz-service-port/blob/main/README.md
   - 或在仓库首页直接点击 `README.md`

2. **点击编辑**
   - 点击右上角的铅笔图标 ✏️ "Edit this file"

3. **替换内容**
   - 选中编辑器中的所有内容（Ctrl+A）
   - 删除现有内容
   - 打开本地文件：`c:/Users/56867/CodeBuddy/数智服务港/官网/README.md`
   - 复制本地文件内容（Ctrl+A → Ctrl+C）
   - 粘贴到GitHub编辑器（Ctrl+V）

4. **提交更改**
   - 在页面底部找到 "Commit changes"
   - 提交信息：
     ```
     docs: 更新项目说明文档

     - 更新项目介绍
     - 更新技术栈说明
     - 更新快速开始指南
     - 更新项目结构说明
     - 添加部署文档链接
     ```
   - 选择：`Commit directly to the main branch`
   - 点击绿色按钮：`Commit changes`

---

## ✅ **第四步：启用 GitHub Pages**

更新完文件后，继续以下步骤：

### 1. 访问 Pages 设置
```
https://github.com/eagle13579/sz-service-port/settings/pages
```

### 2. 配置 GitHub Pages
- **Source**: 选择 `Deploy from a branch`
- **Branch**: 选择 `main`
- **Folder**: 选择 `/ (root)`
- 点击 `Save` 按钮

### 3. 等待部署
- 部署需要 1-3 分钟
- 您可以点击页面顶部的 "Actions" 标签查看部署进度

### 4. 访问网站
```
https://eagle13579.github.io/sz-service-port/
```

---

## 💡 **快捷操作技巧**

### 复制本地文件内容

**Windows:**
```powershell
# 使用记事本
notepad "c:/Users/56867/CodeBuddy/数智服务港/官网/gh-pages/index.html"
# Ctrl+A 全选，Ctrl+C 复制
```

**使用 VS Code (推荐):**
```powershell
code "c:/Users/56867/CodeBuddy/数智服务港/官网/gh-pages/index.html"
# Ctrl+A 全选，Ctrl+C 复制
```

### 批量更新提示

如果GitHub允许，您可以一次性更新多个文件：
1. 编辑第一个文件
2. 点击 "Commit changes"
3. 立即继续编辑下一个文件

---

## 🎯 **完成检查清单**

- [ ] 更新 gh-pages/index.html
- [ ] 更新 README.md
- [ ] 启用 GitHub Pages
- [ ] 等待部署完成（1-3分钟）
- [ ] 访问网站验证效果
- [ ] 检查所有功能是否正常

---

## 🔧 **常见问题**

### Q: 提示文件已被修改怎么办？
**A:** 先点击页面顶部的 "Pull request" 或 "Sync fork" 同步最新代码，然后重新编辑。

### Q: 如何查看更新历史？
**A:** 点击文件右上角的时钟图标 `History` 可以查看所有修改历史。

### Q: 想撤销更新怎么办？
**A:** 
1. 点击文件右上角的时钟图标 `History`
2. 点击旧版本左侧的 `...`
3. 选择 `Revert this commit`

---

**现在可以开始更新文件了！** 🚀
