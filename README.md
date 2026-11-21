# 静态个人博客

零依赖静态个人站：单栏窄排版、姓名 + 日记板块，深浅主题自适应。页面运行时读取 `content.json` 渲染。

**线上地址（Vercel 免费域名）：** https://abgrvw.vercel.app
**GitHub 仓库：** https://github.com/abgrvw/minimal-personal-blog

## 日常写博客：用 GitHub Issue（推荐）

把 Issue 当编辑器，不用碰 HTML / JSON：

1. 在 GitHub 仓库点 **Issues → New issue**。
2. **Title** 就是文章标题；**正文用 Markdown 写**。
3. 打上标签 **`blog`**（第一次可直接在标签框里输入并创建）。
4. 提交（Submit new issue）。GitHub Action 会自动把文章写进 `content.json` 并 push；Vercel 检测到 push 后自动部署，几十秒后线上更新。

文章网址是 `post.html?slug=issue-<Issue编号>`。如果想自定义网址，在正文第一行写：

```
slug: my-post
```

空一行后再写正文即可，网址就变成 `post.html?slug=my-post`。

### 给文章加 tag（标签）

Issue 上除了 `blog` 之外，**再加任意自定义标签就是文章的 tag**。例如给一篇 Issue 加上 `blog` + `运行` + `民航`，同步后这篇文章就带这两个 tag。

- 首页「日记」标题下会出现标签栏（自动汇总所有 tag），点某个标签即可筛选，网址变成 `?tag=运行`，可直接分享这个筛选链接。
- 文章页标题下会显示标签胶囊，点它跳回首页并按该标签筛选。
- `blog` / `draft` 是控制标签，不会显示为文章 tag；没有自定义标签的文章不显示标签栏项。
- 新增/修改/删除标签都会触发自动同步，几十秒后生效。

### 标签与状态

| 操作 | 效果 |
| --- | --- |
| 新建并打开 Issue，带 `blog` 标签 | 文章上线 |
| 编辑 Issue 正文/标题 | 自动更新线上文章 |
| 加 `draft` 标签 | 临时下架（Issue 保留） |
| 去掉 `draft` 标签 | 重新上线 |
| 关闭 Issue | 下架 |
| 重新打开 Issue | 重新上线 |

### Issue 正文支持的 Markdown

空行分段；第一段自动作为导语。`##` / `###` 小标题、无序列表（`-`）、有序列表（`1.`）、引用（`>`）、代码块（```）、水平线（`---`）、`**加粗**`、`*斜体*`、`` `行内代码` ``、链接和图片都会渲染。以 `—` 或 `–` 开头的行会显示成右对齐签名。

## 改站点信息

首页只显示站点名（`siteName`）和日记列表；`content.json` 里的 `avatar` / `bio` / `quote` / `social` / `albums` 目前不会展示。站点名在 `content.json` 里改（GitHub 网页点 ✏️ 编辑），提交后 Vercel 自动部署。日记列表完全由带 `blog` 标签的 Issue 生成；`content.json` 里的 `writings` 会在每次同步时被覆盖，手工写入的文章会被清掉。

## 目录结构

```
.
├── index.html / post.html / photos.html   # 页面外壳，读取 content.json 渲染
├── content.json                           # 站点信息 + 相册 + 同步后的文章
├── vercel.json                            # Vercel 配置
├── .github/workflows/issues-to-blog.yml   # Issue 事件触发同步与 push
├── scripts/sync-issues.mjs                # Issue -> content.json 同步脚本
├── assets/
│   ├── style.css                          # 样式与主题色变量
│   ├── render.js                          # 渲染函数（含轻量 Markdown）
│   ├── site.js                            # 启动脚本
│   ├── avatar.svg                         # 头像（可同名替换）
│   ├── favicon.svg
│   └── photo-1..12.svg                    # 占位图（可换成你的 jpg/webp）
├── admin.html                             # 本地可视化编辑器（可选）
├── 编辑网站.command                        # 可选：本地打开编辑器
└── 更新到Vercel.command                    # 可选：手动部署
```

## 备注

- 纯静态、无构建步骤、无后端。`vercel.json` 只启用 cleanUrls 和静态资源缓存。
- 占位 SVG 都是本地文件，不依赖外部图床。
- 主题色在 `assets/style.css` 顶部 `--blue` / `--red` / `--orange` 变量里改。
- GitHub Action 使用的是仓库内置的 `GITHUB_TOKEN`，不需要额外配置密钥。
