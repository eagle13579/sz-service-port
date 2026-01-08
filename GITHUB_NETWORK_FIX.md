# GitHub网络连接问题解决方案

## 问题描述

```
fatal: unable to access 'https://github.com/eagle13579/sz-service-port.git/': 
Failed to connect to github.com port 443 after 21073 ms: Could not connect to server
```

## 解决方案

### 方案一：使用代理（推荐）

如果您使用代理工具（如Clash、V2Ray等），可以配置Git使用代理：

#### Windows

```bash
# 设置HTTP代理（根据您的代理端口修改）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 查看代理配置
git config --global --get http.proxy
git config --global --get https.proxy

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

#### 常见代理端口

| 代理工具 | 默认端口 |
|----------|----------|
| Clash | 7890 |
| V2Ray | 10809 |
| Shadowsocks | 1080 |

### 方案二：修改hosts文件

通过修改系统hosts文件直接解析GitHub域名：

#### 1. 查询GitHub IP地址

访问以下网站查询最新的GitHub IP：
- https://www.ipaddress.com/
- 搜索：github.com, github.global.ssl.fastly.net, assets-cdn.github.com

#### 2. 修改hosts文件

1. 以管理员身份运行记事本
2. 打开文件：`C:\Windows\System32\drivers\etc\hosts`
3. 添加以下内容（使用查询到的IP）：

```
# GitHub
140.82.112.4 github.com
140.82.113.3 github.com
140.82.112.5 github.global.ssl.fastly.net
185.199.108.133 assets-cdn.github.com
185.199.109.133 assets-cdn.github.com
185.199.110.133 assets-cdn.github.com
185.199.111.133 assets-cdn.github.com
```

4. 保存文件
5. 刷新DNS缓存：
   ```powershell
   ipconfig /flushdns
   ```

### 方案三：使用GitHub镜像站点

修改Git远程地址使用镜像站点：

```bash
# 使用国内镜像
git remote set-url origin https://github.com.cnpmjs.org/eagle13579/sz-service-port.git

# 或使用其他镜像
git remote set-url origin https://hub.fastgit.org/eagle13579/sz-service-port.git
git remote set-url origin https://ghproxy.com/https://github.com/eagle13579/sz-service-port.git
```

**常用镜像站点**：
- `https://github.com.cnpmjs.org/` - CNPM镜像
- `https://hub.fastgit.org/` - FastGit
- `https://ghproxy.com/` - GitHub代理

### 方案四：使用SSH方式（需要配置SSH密钥）

1. 生成SSH密钥：
   ```bash
   ssh-keygen -t rsa -C "your_email@example.com"
   ```

2. 添加SSH密钥到GitHub：
   - 复制 `~/.ssh/id_rsa.pub` 内容
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴密钥并保存

3. 修改远程地址：
   ```bash
   git remote set-url origin git@github.com:eagle13579/sz-service-port.git
   ```

### 方案五：使用Gitee镜像（推荐国内用户）

1. 在Gitee创建仓库：https://gitee.com/
2. 从GitHub导入仓库到Gitee
3. 克隆Gitee仓库：
   ```bash
   git clone https://gitee.com/your_username/sz-service-port.git
   ```

### 方案六：使用Git LFS加速

如果使用GitHub Enterprise，可以配置：

```bash
git config --global http.postBuffer 524288000
```

## 临时解决方案：手动上传

如果网络问题持续，可以手动上传文件：

1. 访问GitHub仓库：https://github.com/eagle13579/sz-service-port
2. 点击 "Add file" → "Upload files"
3. 拖拽文件上传
4. 提交更改

## 测试连接

```bash
# 测试GitHub连接
telnet github.com 443

# 或使用PowerShell
Test-NetConnection -ComputerName github.com -Port 443
```

## 推荐操作顺序

1. **先尝试方案一（代理）** - 如果已有代理
2. **再尝试方案二（hosts）** - 较为稳定
3. **然后尝试方案三（镜像）** - 立即生效
4. **最后考虑方案四（SSH）** - 需要配置

## 联系支持

如果以上方案都无效：
- 检查网络防火墙设置
- 联系网络管理员
- 尝试切换网络环境（如使用手机热点）
