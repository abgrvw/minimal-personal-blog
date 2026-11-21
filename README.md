# 静态个人博客
零依赖静态个人站：单栏窄排版、头像 + 姓名、Writings / Photos / About 彩色小标题，深浅主题自适应。所有内容集中在 `content.json`，页面运行时读取它。

**线上地址（Vercel 免费域名）：** https://abgrvw.vercel.app
**GitHub 仓库：** https://github.com/abgrvw/minimal-personal-blog

## 日常更新：GitHub 方式（推荐）

仓库与 Vercel 已关联后，更新内容不需要碰命令行：

1. 打开 GitHub 仓库，进入 `content.json`，点右上角 ✏️ 编辑。
2. 改名字、简介、文章正文、相册说明等，提交（Commit changes）。
3. Vercel 检测到 push，**自动重新部署**，几十秒后线上站点更新。

也可以在本地 clone 仓库、改 `content.json`、`git push`，效果一样。

> 想加文章：在 `writings` 数组里复制一个对象，改 `slug`（英文短名）、`title`、`date`、`body`。正文里空一行分段；每行以 `1.` `2.` 开头会自动排成编号列表。
> 想加相册/照片：在 `albums` 数组里加对象，照片路径写 `assets/你的图片.jpg`，或填完整 http 网址。

## 目录结构

```
.
├── index.html / post.html / photos.html   # 页面外壳，读取 content.json 渲染
├── content.json        # ⭐ 所有内容都在这里
├── vercel.json         # Vercel 配置
├── assets/
│   ├── style.css       # 样式与主题色变量
│   ├── render.js       # 渲染函数
│   ├── site.js         # 启动脚本
│   ├── avatar.svg      # 头像（可同名替换）
│   ├── favicon.svg
│   └── photo-1..12.svg # 占位图（可换成你的 jpg/webp）
├── admin.html          # 本地可视化编辑器（可选，非必需）
├── 编辑网站.command     # 可选：本地打开编辑器
└── 更新到Vercel.command # 可选：手动部署（Git 方式通常不用）
```

## 可选：本地可视化编辑

双击 `编辑网站.command` 会在本地打开一个表单编辑器，填完保存到项目，再双击 `更新到Vercel.command` 发布。此方式不需要，但改大量文字时更直观（需 Chrome / Edge）。

## 备注

- 纯静态、无构建步骤、无后端。`vercel.json` 只启用 cleanUrls 和静态资源缓存。
- 占位 SVG 都是本地文件，不依赖外部图床。
- 主题色在 `assets/style.css` 顶部 `--blue` / `--red` / `--orange` 变量里改。
