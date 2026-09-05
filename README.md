# 🌌 Orion Community (仿 Linux.do 风格全栈极客社区)

> 连接思想 · 星辰大海 —— 面向开发者、独立创作者与 AI 探索者的高品质开放技术社区。

![Orion Banner](https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80)

---

## ✨ 核心亮点

- 🎨 **高仿 Linux.do / Discourse 视觉体验**：精致的暗色/亮色主题切换、专区彩色微标、信任等级体系（Lv.1 ~ Lv.4 始皇认证）。
- 📝 **全功能 Markdown 编辑器**：支持代码语法高亮与一键复制、表格、引用块、公式、以及实时分屏预览。
- ⚡ **Discourse AI 智能摘要**：一键提炼话题核心脉络与社区共识。
- 🔍 **全局即时搜索**：支持快捷键 `Ctrl + K` 秒级检索标题、标签、内容与佬友。
- 🚀 **Cloudflare Pages 原生支持**：基于 Next.js 14 静态导出架构，全球 Anycast CDN 极速分发，0 成本永久免费托管。

---

## ☁️ Cloudflare Pages 一键上线指南

### 1. 连接 GitHub 仓库
1. 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 进入左侧菜单 **Compute (Workers & Pages)** ➔ **Create Application** ➔ 点击 **Pages** 标签页。
3. 选择 **Connect to Git**（连接到 Git 存储库）。
4. 选择你的仓库：**`Nan7Li/orion`**。

### 2. 构建配置 (Build Settings)
- **Framework preset (框架预设)**: `Next.js (Static HTML Export)`
- **Build command (构建命令)**: `npm run build`
- **Build output directory (输出目录)**: `out`
- **Root directory (根目录)**: `/`（留空默认）

### 3. 点击部署
点击 **Save and Deploy**，Cloudflare 会在 1 分钟内自动完成构建，并生成类似 `https://orion-xxx.pages.dev` 的正式公网 HTTPS 域名！

---

## 💻 本地运行

\`\`\`bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打包导出
npm run build
\`\`\`
