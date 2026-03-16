# 第一次使用与发布博客（中文）

这份指南给第一次搭建博客的你：从写文章到上线只需要 4 步。

## 1. 新建文章

在 `src/content/blog/` 下创建一个 `.md` 或 `.mdx` 文件，例如：`my-first-post.md`。

更快方法（推荐）：

```bash
pnpm new:post --title "我的第一篇文章"
```

这条命令会自动生成带 frontmatter 的模板文件（默认 `draft: true`）。

```md
---
title: "我的第一篇文章"
description: "这是第一篇发布测试文章"
pubDatetime: 2026-03-15T10:00:00.000Z
tags: ["welcome", "notes"]
---

你好，世界。
```

## 2. 本地预览

```bash
pnpm install
pnpm dev
```

打开 `http://127.0.0.1:4321` 检查页面和样式。

## 3. 发布到线上

```bash
git add .
git commit -m "add: publish my first post"
git push origin main
```

推送后会触发部署流程；如果你使用手动发布，也可以执行 Wrangler 部署。

## 4. 使用后台

- 登录地址：`/admin/login`
- 登录密钥：`ADMIN_ACCESS_KEY`
- 登录后可以查看状态和触发相关动作

## 双语使用方式

- 顶部导航新增语言切换：`EN` / `中文`
- 语言偏好会保存到浏览器本地存储
- 会自动更新 URL 参数 `?lang=en` 或 `?lang=zh`
