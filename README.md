# 静态个人博客（仿 ivanhzhao.notion.site）

零依赖静态个人站：单栏窄排版、头像 + 姓名、Writings / Photos / About 彩色小标题，深浅主题自适应。内容集中在 `content.json`，通过可视化编辑器修改，不需要手写 HTML。

**线上地址（Vercel 免费域名）：** https://minimal-personal-blog-coral.vercel.app

## 日常更新：最省事的三步

1. 在访达里双击 **`编辑网站.command`** —— 会启动本地服务并打开浏览器里的编辑器。
2. 浏览器里点一次「**连接项目文件夹**」，选择本目录 `vercel-blog` 并允许写入（只需一次，之后自动记住）。左边填表，右边实时预览；点「**保存到项目**」。
3. 回访达双击 **`更新到Vercel.command`** —— 自动部署，几秒后线上站点更新。

> 编辑器使用 Chrome / Edge 的文件系统访问权限；请用 Chrome 或 Edge 打开。若浏览器拒绝，可用「下载 content.json」后手动放到项目目录。

## 目录结构

```
.
├── index.html            # 首页外壳（读取 content.json 渲染）
├── post.html             # 文章页（按 ?slug= 渲染对应文章）
├── photos.html           # 相册页
├── admin.html            # 本地可视化编辑器（仅本地用，不参与站点展示）
├── content.json          # ⭐ 所有内容都在这里（编辑器保存的目标）
├── writing.html / writing-2.html  # 旧链接重定向，可忽略
├── 编辑网站.command       # 双击：启动本地服务 + 打开编辑器
├── 更新到Vercel.command   # 双击：部署到 Vercel
├── vercel.json
└── assets/
    ├── style.css         # 样式与主题色变量
    ├── render.js         # 页面渲染函数
    ├── site.js           # 页面启动脚本
    ├── avatar.svg        # 头像（可直接同名替换）
    ├── favicon.svg
    └── photo-1..12.svg   # 占位图（可换成你的 jpg/webp）
```

## 编辑器里改什么

- **基本信息**：网站名、头像路径、自我介绍、引言、GitHub / X / 邮箱。
- **文章**：每篇有标题、slug（英文短名，决定网址）、日期、正文。正文里空一行分段；若每段以 `1.` `2.` 开头会自动排成编号列表。新增文章点「+ 添加文章」。
- **相册**：每个相册可增删照片，填图片路径和说明。图片放 `assets/` 下，路径写 `assets/你的图片.jpg`；也可填完整 http 网址。
- **主题色**：在 `assets/style.css` 顶部改 `--blue` / `--red` / `--orange` 等变量（这项需手动改文件）。

## 命令行方式（可选）

```bash
cd /Users/macbookpro/WorkBuddy/2026-11-21-16-46-02/vercel-blog
python3 -m http.server 8765      # 本地预览 http://127.0.0.1:8765
vercel deploy --prod --yes       # 部署
```

Vercel CLI 已授权（账号 `bettinessi7a09-1699`，项目 `minimal-personal-blog`），不用再登录。

## 备注

- 纯静态、无构建步骤、无后端；页面运行时从 `content.json` 读内容。
- `vercel.json` 只启用 cleanUrls 和静态资源长缓存。
- 占位 SVG 均为本地文件，不依赖外部图床，不会出现破图。
