# 部署说明

## 本地开发

### 1. 克隆项目
```bash
git clone https://github.com/your-username/sudoku-master.git
cd sudoku-master
```

### 2. 启动本地服务器
```bash
# 使用 Python 3
python3 -m http.server 8080

# 使用 Node.js
npx serve . -p 8080

# 使用 PHP
php -S localhost:8080
```

### 3. 访问游戏
打开浏览器访问 `http://localhost:8080`

## 生产环境部署

### 1. 静态网站托管

#### GitHub Pages
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main或gh-pages）
4. 访问 `https://your-username.github.io/sudoku-master`

#### Netlify
1. 将代码推送到GitHub/GitLab/Bitbucket
2. 在Netlify中连接仓库
3. 设置构建命令：`echo "Static site"`
4. 设置发布目录：`./`
5. 部署完成后获得访问链接

#### Vercel
1. 安装Vercel CLI：`npm i -g vercel`
2. 在项目目录运行：`vercel`
3. 按提示配置项目
4. 部署完成后获得访问链接

### 2. 传统虚拟主机
1. 将所有文件上传到web目录
2. 确保index.html在根目录
3. 配置Web服务器支持HTML5历史模式（可选）

### 3. CDN加速（可选）
- 使用CloudFlare等CDN服务
- 配置缓存策略
- 启用压缩和优化

## 域名配置

### 1. 自定义域名
1. 购买域名
2. 配置DNS解析到部署平台
3. 在部署平台添加自定义域名
4. 配置SSL证书（大多数平台自动配置）

### 2. 子域名配置
```
sudoku.yourdomain.com → 部署平台IP/CNAME
```

## 性能优化

### 1. 文件压缩
- 启用Gzip压缩
- 压缩CSS和JavaScript文件
- 优化图片资源

### 2. 缓存策略
```
# Apache .htaccess 示例
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

### 3. CDN配置
- 静态资源使用CDN
- 字体文件优化加载
- 图片延迟加载

## 监控和分析

### 1. Google Analytics
在index.html中添加跟踪代码：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 2. 错误监控
添加错误跟踪：
```javascript
window.addEventListener('error', function(e) {
    console.error('游戏错误:', e.error);
    // 发送错误报告到监控服务
});
```

## 安全配置

### 1. 内容安全策略 (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    font-src 'self' fonts.gstatic.com;
    script-src 'self';
    connect-src 'self';
">
```

### 2. 其他安全头
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 备份和恢复

### 1. 代码备份
- 使用Git版本控制
- 定期推送到远程仓库
- 创建发布标签

### 2. 用户数据
- LocalStorage数据由用户浏览器管理
- 考虑添加云同步功能（未来版本）

## 更新部署

### 1. 版本更新
1. 更新版本号（package.json）
2. 更新更新日志（README.md）
3. 提交代码并推送
4. 创建发布标签
5. 部署平台自动更新

### 2. 热修复
1. 快速修复关键问题
2. 最小化更改
3. 立即部署
4. 通知用户刷新页面

## 多环境管理

### 1. 开发环境
- 本地开发服务器
- 开启详细日志
- 未压缩文件

### 2. 测试环境
- 模拟生产环境
- 集成测试
- 性能测试

### 3. 生产环境
- 压缩文件
- 启用缓存
- 错误监控

## 故障排除

### 1. 常见问题
- **页面空白**：检查JavaScript错误
- **样式异常**：检查CSS加载
- **功能异常**：检查浏览器控制台
- **性能问题**：使用开发者工具分析

### 2. 调试工具
- 浏览器开发者工具
- 网络面板检查资源加载
- 控制台查看错误信息
- Application面板检查LocalStorage

### 3. 用户反馈
- 收集用户问题报告
- 提供联系方式
- 维护FAQ文档 