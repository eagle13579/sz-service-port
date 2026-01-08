# GitHub 部署指南

## 第一步：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/) 并登录你的账户
2. 点击右上角的 `+` 按钮，选择 `New repository`
3. 填写仓库信息：
   - Repository name: `sz-service-port` (或你喜欢的名称)
   - Description: `数智服务港官网`
   - Public/Private: 选择 `Public`（公开仓库才能使用免费的 GitHub Pages）
4. 点击 `Create repository`

## 第二步：推送代码到 GitHub

在 PowerShell 中执行以下命令（替换 YOUR_USERNAME 和 REPO_NAME）：

```powershell
cd "c:/Users/56867/CodeBuddy/数智服务港/官网"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 重命名分支为 main（GitHub 默认使用 main）
git branch -M main

# 推送代码
git push -u origin main
```

**示例：**
```powershell
git remote add origin https://github.com/johndoe/sz-service-port.git
git push -u origin main
```

## 第三步：启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击顶部的 `Settings` 标签
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分：
   - 选择 `Deploy from a branch`
   - Branch 选择 `main`
   - Folder 选择 `/ (root)`
5. 点击 `Save` 按钮

## 第四步：等待部署完成

- GitHub 会自动开始部署
- 通常需要 1-3 分钟
- 部署成功后，Pages 页面会显示你的网站 URL

## 访问你的网站

你的网站将可以通过以下地址访问：
```
https://YOUR_USERNAME.github.io/REPO_NAME
```

例如：`https://johndoe.github.io/sz-service-port`

## 使用自定义域名（可选）

如果你想使用自己的域名：

1. 在仓库的 Settings -> Pages 中设置 `Custom domain`
2. 在你的域名 DNS 设置中添加：
   - A 记录：`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
   - 或 CNAME 记录：`YOUR_USERNAME.github.io`

## 更新网站

当你在本地修改代码后，使用以下命令更新：

```powershell
cd "c:/Users/56867/CodeBuddy/数智服务港/官网"
git add .
git commit -m "Update website"
git push
```

GitHub 会自动检测到更改并重新部署。

## 故障排查

### 如果部署失败

1. 检查 `Actions` 标签页，查看部署日志
2. 确保 `.github/workflows/deploy.yml` 文件存在
3. 检查仓库设置中是否启用了 Pages

### 如果网站无法访问

1. 等待几分钟，部署需要时间
2. 清除浏览器缓存后重试
3. 检查仓库是否为 Public（私有仓库无法使用 Pages）

### 更改仓库为 Public

1. 进入仓库 Settings
2. 滚动到底部 "Danger Zone"
3. 点击 `Change repository visibility`
4. 选择 `Public` 并确认

## 常见问题

**Q: 可以使用私有仓库吗？**
A: 不可以，GitHub Pages 只支持公开仓库（除非使用付费的 GitHub Pro）。

**Q: 部署需要多长时间？**
A: 通常 1-3 分钟，首次部署可能需要更长时间。

**Q: 可以使用自定义域名吗？**
A: 可以，免费版本支持一个自定义域名。

**Q: 如何查看部署状态？**
A: 进入仓库的 Actions 标签页，可以看到所有部署记录和状态。

## 快速命令参考

```powershell
# 初始化或拉取最新代码
git pull origin main

# 查看状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到 GitHub
git push

# 查看远程仓库
git remote -v
```

祝你部署顺利！🚀
