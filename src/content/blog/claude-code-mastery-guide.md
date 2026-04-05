---
author: Kayden
pubDatetime: 2026-04-05T04:00:00Z
title: Claude Code 从入门到精通：大佬们都在用的配置与技巧
featured: true
draft: false
tags:
  - claude-code
  - ai
  - 开发工具
  - 效率
  - 教程
description: 一篇全面的 Claude Code 实战教程，包含从零建项目、接手旧项目、常用命令速查、CLAUDE.md 配置、Hooks 自动化、Skills 自定义技能等，让你真正学会用 Claude Code 高效开发。
---

## 这篇文章给谁看？

如果你是：
- 刚安装 Claude Code，不知道从哪开始
- 用了一阵子但感觉只是在"聊天"，没发挥出它的能力
- 想知道高手是怎么用 Claude Code 的，想学他们的工作流

这篇文章就是给你的。我会用**实际操作步骤**来讲，不讲空话。

---

## 一、安装与第一次启动

### 安装 Claude Code

```bash
# 方式一：npm 全局安装（推荐）
npm install -g @anthropic-ai/claude-code

# 方式二：如果你用 VS Code，直接在扩展市场搜索 "Claude Code" 安装
```

### 第一次启动

```bash
# 在你的项目目录下打开终端
cd my-project

# 启动 Claude Code
claude
```

第一次会让你登录 Anthropic 账号。登录后就可以直接和 Claude 对话了。

### 最重要的设置：选择模型

Claude Code 默认用的是 Sonnet 模型（速度快、性价比高）。如果你需要更强的推理能力：

```bash
# 切换到 Opus（最强模型，复杂任务用）
/model opus

# 切换到 Haiku（最快最便宜，简单任务用）
/model haiku
```

**建议**：日常开发用 Sonnet 就够了，遇到复杂架构设计或难 Bug 时切 Opus。

---

## 二、常用命令速查表（先收藏）

这些是你每天都会用到的命令：

### 对话管理

| 命令 | 作用 | 什么时候用 |
|------|------|-----------|
| `/clear` | 清空对话历史 | 换一个不相关的任务时 |
| `/compact` | 压缩对话历史，保留关键信息 | 对话太长、Claude 开始忘事时 |
| `/compact 只关注 API 变更` | 按指定重点压缩 | 想让 Claude 聚焦特定内容 |
| `Esc` | 停止 Claude 当前操作 | Claude 做的方向不对时 |
| `Esc + Esc` | 回退到之前的状态 | Claude 改坏了代码想撤销 |
| `/rewind` | 回退到之前的检查点 | 和 Esc+Esc 类似 |

### 模式切换

| 命令 | 作用 | 什么时候用 |
|------|------|-----------|
| `/model opus` | 切换到最强模型 | 复杂架构、难 Bug |
| `/model sonnet` | 切换到平衡模型 | 日常开发（默认） |
| `/model haiku` | 切换到最快模型 | 简单修改、格式化 |
| `Shift+Tab` | 切换 Plan Mode | 需要 Claude 先规划再动手 |

### 实用快捷操作

| 命令 | 作用 | 什么时候用 |
|------|------|-----------|
| `/help` | 查看所有命令 | 记不住命令时 |
| `/batch <指令>` | 批量并行处理 | 需要同时改很多文件 |
| `/simplify` | 审查并简化最近的代码 | 写完功能后自动优化 |
| `/debug` | 调试模式 | 遇到奇怪 Bug 时 |

---

## 三、实战：从零开始构建一个项目

这是**大佬们最常用的工作流**。不是让 Claude 一句话生成整个项目，而是分步引导：

### 第 1 步：让 Claude 采访你

```
我想做一个个人博客网站。

先不要写代码。用提问的方式采访我，了解：
- 我想用什么技术栈
- 我需要哪些功能
- 我对设计有什么偏好
- 有没有参考网站

一个一个问，不要一次问太多。直到你完全理解需求后，
把需求整理成 SPEC.md 文件给我确认。
```

**为什么这样做**：Claude 会问出很多你自己没想到的问题（比如"需要 RSS 吗？""要不要暗色模式？""评论系统选哪个？"）。最终你会得到一份比自己写的更完整的需求文档。

### 第 2 步：创建项目（Plan Mode）

按 `Shift+Tab` 进入 Plan Mode，然后说：

```
根据 SPEC.md 的需求，帮我创建项目。

要求：
1. 先列出要创建的所有文件和目录结构
2. 说明为什么选择这个架构
3. 我确认后再开始写代码
```

Claude 会输出一个详细的实施计划。你看完觉得没问题，点确认，它才开始动手。

### 第 3 步：分模块实现

**不要一次让 Claude 把整个项目写完**。分模块来：

```
先实现首页的布局和导航栏。用 Astro + Tailwind CSS。
实现后运行 dev server 确认没有报错。
```

等这步完成了，再继续：

```
现在实现博客文章列表页。从 content collection 读取 Markdown 文件。
确保分页功能正常。
```

**为什么要分步**：
1. Claude 的上下文窗口有限，一次塞太多任务容易出错
2. 每一步你都能检查，发现问题及时纠正
3. 每步完成后 `/compact` 一下，保持上下文干净

### 第 4 步：测试和部署

```
项目基本完成了。帮我：
1. 运行 pnpm build 确认构建没有错误
2. 修复所有 TypeScript 类型错误
3. 创建一个 git commit，消息格式用 feat: xxx
```

---

## 四、实战：接手一个已有的项目

接手别人的项目或者隔了很久再回来看自己的代码，大佬们是这样用 Claude 的：

### 第 1 步：让 Claude 做项目调研

```
我刚接手这个项目，对代码不熟。帮我：

1. 读 package.json 和主要配置文件，告诉我用了什么技术栈
2. 看目录结构，告诉我代码是怎么组织的
3. 找到入口文件，解释主要的执行流程
4. 列出关键的业务逻辑文件

用简洁的语言，不要读给我听，要总结给我听。
```

### 第 2 步：理解特定模块

```
我需要修改用户认证的逻辑。

1. 找到所有和认证相关的文件
2. 画一个认证流程图（用文字描述就行）
3. 告诉我 token 是怎么生成、验证、刷新的
4. 列出修改认证逻辑可能影响的其他模块
```

### 第 3 步：安全地修改代码

```
我需要把 JWT 认证改成 session-based 认证。

先不要写代码！先做以下事情：
1. 列出需要修改的所有文件
2. 每个文件需要改什么，简要说明
3. 有没有破坏性变更需要注意
4. 建议的实施顺序

我确认后再开始实施。
```

**关键技巧**：在修改前用 `git stash` 或创建新分支，确保可以随时回退：

```
帮我创建一个新分支叫 feat/session-auth，然后再开始修改。
```

---

## 五、提示词的写法：从模糊到精确

同样的任务，提示词写法差距巨大：

### 差的提示词（Claude 会瞎猜）

```
帮我写一个登录页面
```

### 好的提示词（Claude 直接到位）

```
帮我写一个登录页面。

技术要求：
- React + TypeScript
- 使用 shadcn/ui 的 Input 和 Button 组件
- 表单验证用 zod + react-hook-form
- 登录 API 地址是 POST /api/auth/login
- 成功后重定向到 /dashboard

UI 要求：
- 居中卡片布局
- 有邮箱和密码两个字段
- 密码输入框有显示/隐藏切换
- 登录按钮在请求中显示 loading 状态
- 错误信息显示在表单下方

写完后运行 tsc --noEmit 确认没有类型错误。
```

### 提示词模板

你可以用这个万能模板：

```
帮我实现 [具体功能]。

技术要求：
- [框架/库]
- [关键依赖]
- [API 接口]

具体行为：
- [输入是什么]
- [输出是什么]
- [边界情况怎么处理]

验证方式：
- [怎么确认做对了]
```

---

## 六、CLAUDE.md：给 Claude 的项目说明书

`CLAUDE.md` 是放在项目根目录的一个文件，Claude 每次启动都会自动读取。把它当成"给新同事的入职文档"。

### 实际例子

下面是一个真实项目的 CLAUDE.md（注意它很短！）：

```markdown
# Project: Personal Blog

## Tech Stack
- Astro 6 + TypeScript + Tailwind CSS v4
- Deployed on Cloudflare Workers
- Database: Cloudflare D1

## Commands
- Dev: pnpm dev
- Build: pnpm build
- Type check: pnpm astro check
- Deploy: git push (auto-deploys via Cloudflare Pages)

## Rules
- Use Chinese for all user-facing text
- Commit messages: feat/fix/refactor: description
- Never modify wrangler.toml without asking first
- Always run pnpm build after changes to verify

## Architecture
- Blog posts: src/content/blog/ (Markdown files)
- API routes: src/pages/api/
- Database operations: src/db/index.ts
- Layouts: src/layouts/
```

### 不要写什么

**不要**把 CLAUDE.md 写成一本书。这些内容**不需要**写进去：
- Claude 自己能从代码看出来的信息（"这是一个 React 项目"）
- 基本的语言规范（"变量名用 camelCase"）
- 详细的 API 文档（给一个链接就行）
- 文件逐个描述（Claude 会自己读）

### 放在哪里

```
~/.claude/CLAUDE.md          # 全局配置，所有项目都读
./CLAUDE.md                  # 项目级，和代码一起提交到 git
./src/api/CLAUDE.md          # 子目录级，只在处理该目录时读取
```

---

## 七、Hooks：让 Claude 自动守规矩

CLAUDE.md 里的指令是"建议"，Claude 有时会忽略。Hooks 是"强制"——每次都会执行。

### 最常用的 Hook：保存后自动格式化

在项目的 `.claude/settings.json` 里加：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE_PATH\"",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

这样 Claude 每次写完文件都会自动用 Prettier 格式化，不用你操心代码风格。

### 阻止危险操作

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo $FILE_PATH | grep -E '\\.(env|pem|key)$' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

`exit 2` 会阻止操作。这样 Claude 就不可能修改你的 `.env` 文件了。

---

## 八、Skills：教 Claude 新技能

Skills 是可复用的操作指南。放在 `.claude/skills/` 目录下。

### 实用 Skill：一键部署

```markdown
<!-- .claude/skills/deploy/SKILL.md -->
---
name: deploy
description: Build and deploy to production
disable-model-invocation: true
---

Deploy the project to production:

1. Run `pnpm build` - fix any errors
2. Run `pnpm astro check` - fix type errors
3. Stage all changes: `git add -A`
4. Create commit with descriptive message
5. Push to main: `git push origin main`
6. Wait 30 seconds, then check deployment status

Report the deployment result.
```

使用：直接输入 `/deploy` 即可。

### 实用 Skill：代码审查

```markdown
<!-- .claude/skills/review/SKILL.md -->
---
name: review
description: Review recent code changes
disable-model-invocation: true
---

Review the recent code changes:

1. Run `git diff HEAD~1` to see changes
2. Check for:
   - Security issues (hardcoded secrets, SQL injection, XSS)
   - Performance problems (N+1 queries, missing pagination)
   - Missing error handling
   - Code style consistency
3. Report findings as: CRITICAL / HIGH / MEDIUM / LOW
4. Suggest specific fixes for CRITICAL and HIGH issues
```

使用：`/review`

### 实用 Skill：一键修 Issue

```markdown
<!-- .claude/skills/fix-issue/SKILL.md -->
---
name: fix-issue
description: Fix a GitHub issue end-to-end
disable-model-invocation: true
---

Fix GitHub issue #$ARGUMENTS:

1. Read the issue: `gh issue view $ARGUMENTS`
2. Understand what needs to be done
3. Find relevant code files
4. Create a branch: `git checkout -b fix/issue-$ARGUMENTS`
5. Implement the fix
6. Run build and tests to verify
7. Commit and push
8. Create a PR: `gh pr create --title "fix: resolve #$ARGUMENTS"`
```

使用：`/fix-issue 42`

---

## 九、子代理：省上下文的利器

随着对话变长，Claude 的表现会下降。子代理在独立的上下文中运行，不会占用主对话的空间。

### 什么时候用子代理

```
用子代理帮我调查一下项目里所有的 API 端点，
列出每个端点的路径、方法、参数和返回值。
把结果总结成一个表格报告给我。
```

子代理会自己读文件、搜索代码，完成后把结果返回给你。整个调研过程不会占用主对话的上下文。

### 并行子代理

```
用子代理并行做三件事：
1. 审查 src/auth/ 目录的安全性
2. 检查 src/api/ 的错误处理是否完善
3. 分析 src/utils/ 有没有重复代码

三个同时跑，把结果都报告给我。
```

---

## 十、并行开发：一个人干三个人的活

### 方法一：多终端

打开两个终端窗口，同时跑两个 Claude 会话：

**终端 A**：
```bash
cd my-project
claude
# "实现用户注册 API"
```

**终端 B**：
```bash
cd my-project
claude
# "实现登录页面 UI"
```

两个任务互不干扰，同时推进。

### 方法二：/batch 命令

```
/batch 把 src/components/ 下所有的 .jsx 文件转成 .tsx，添加类型注解
```

Claude 会自动把任务拆分成多个小任务，在独立的 git worktree 中并行执行。

### 方法三：批量脚本

```bash
# 批量让 Claude 给每个文件加注释
for file in src/utils/*.ts; do
  claude -p "给 $file 中的每个导出函数添加 JSDoc 注释" \
    --allowedTools "Edit"
done
```

---

## 十一、MCP 连接外部工具

MCP（Model Context Protocol）让 Claude 可以连接外部服务。

### 必装的 MCP

```bash
# GitHub MCP（读取 Issue、创建 PR）
claude mcp add github

# 文件系统 MCP（更好的文件操作）
claude mcp add filesystem
```

安装后 Claude 就能直接操作 GitHub：

```
帮我看一下 #42 号 Issue 的需求，
然后按照需求实现功能并提交 PR。
```

### 数据库 MCP

```bash
# PostgreSQL
claude mcp add postgres --connection "postgresql://user:pass@localhost:5432/mydb"
```

然后你可以直接用自然语言查数据库：

```
帮我查一下最近 7 天注册的用户数量，按天统计。
```

---

## 十二、常见坑和解决办法

### 坑 1：Claude 越写越差

**原因**：上下文太长了，Claude 开始忘事。

**解决**：
```
/compact
```
或者如果偏离太远了：
```
/clear
```
然后重新开始，写更好的第一条提示。

### 坑 2：Claude 改坏了代码

**解决**：按两下 `Esc`（快速连按），Claude 会撤销最近的操作回到之前的状态。

或者用 git 回退：
```
帮我撤销刚才的所有修改，恢复到上一次 commit 的状态。
```

### 坑 3：Claude 不停地读文件

**原因**：你的指令太模糊，Claude 在"大海捞针"。

**解决**：给明确的范围：
```
# 差的
"帮我找到处理用户认证的代码"

# 好的
"读取 src/lib/auth.ts 和 src/middleware.ts，
告诉我认证流程是怎么工作的"
```

### 坑 4：纠正了两三次还是做错

**解决**：别继续纠正了，`/clear` 清空上下文，重新写一个更明确的提示词从头来。反复纠正只会让上下文越来越脏。

### 坑 5：Claude 添加了我没要求的东西

**原因**：Claude 有时候会"过度帮忙"，比如你让它修一个 bug，它顺手重构了周围的代码。

**解决**：在提示词里明确限制：
```
只修改 handleLogin 函数中的 token 验证逻辑。
不要改动其他任何代码，不要重构，不要添加新功能。
```

---

## 十三、我的日常工作流

分享一下我自己每天用 Claude Code 的流程：

### 开始工作

```bash
cd my-project
claude
```

```
读取 CLAUDE.md，然后看一下 git log 最近的提交，
告诉我昨天做了什么、今天可能需要继续什么。
```

### 开发新功能

```
# Step 1: 规划（Plan Mode）
我要实现 [功能描述]。先帮我规划一下需要改哪些文件。

# Step 2: 确认后实施
按计划实施。每改完一个文件就运行 build 确认没有报错。

# Step 3: 验证
运行 pnpm build 确认没有错误。
把改动 diff 给我看一下。

# Step 4: 提交
确认没问题，帮我创建一个 commit。
```

### 修 Bug

```
# 粘贴错误信息
构建失败了，错误是：
[粘贴完整错误信息]

帮我修复这个问题。找到根本原因，不要 suppress 错误。
修复后运行 build 确认问题解决了。
```

### 代码审查

```
/review
```

### 结束工作

```
帮我把今天的改动整理成一个 commit，
消息格式是 feat/fix: 描述。
```

---

## 总结

Claude Code 的核心就是三件事：

1. **管理上下文**：用 `/clear`、`/compact`、子代理，别让对话变臃肿
2. **写好提示词**：给具体的技术要求、验证方式、范围限制
3. **建立规则**：CLAUDE.md 给建议，Hooks 强制执行，Skills 封装操作

从今天开始，试着用上面的方法来开发你的下一个项目。不需要一次全学会，先掌握"分步实施 + /clear + 好的提示词"这三个就够入门了。

---

## 参考资料

- [Claude Code 官方最佳实践](https://code.claude.com/docs/zh-CN/best-practices)
- [Claude Code Hooks 指南](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code Skills 文档](https://code.claude.com/docs/zh-CN/skills)
- [Claude Code MCP 配置](https://code.claude.com/docs/en/mcp)
- [Claude Code Hooks 深度解析（腾讯云）](https://cloud.tencent.com/developer/article/2649082)
- [Claude Code + Git Worktree + Agent Teams（知乎）](https://zhuanlan.zhihu.com/p/2017290839030784536)
- [claude-skills-suite 技能合集（GitHub）](https://github.com/joneqian/claude-skills-suite)
