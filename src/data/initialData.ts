import { Category, Topic, User } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-neo',
    username: 'neo',
    name: 'Neo (始皇)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    trustLevel: 4,
    trustTitle: '始皇 / 社区创始人',
    bio: '代码构建宇宙，连接思想与星辰。',
    joinedAt: '2024-01-01',
    likesReceived: 9840,
    topicsCount: 56,
    badges: ['👑 创世始皇', '🛡️ 全局版主', '🎖️ 核心贡献者'],
    location: 'Cyber Space',
    website: 'https://orion.do',
  },
  {
    id: 'user-cygnus',
    username: 'cygnus',
    name: 'Cygnus_极客',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    trustLevel: 3,
    trustTitle: '核心佬友',
    bio: '折腾一切好玩的技术，大模型应用与逆向工程实战中。',
    joinedAt: '2024-02-15',
    likesReceived: 3420,
    topicsCount: 38,
    badges: ['🌟 核心佬友', '🤖 AI 先锋', '🔥 精华作者'],
    location: '上海',
  },
  {
    id: 'user-vortix',
    username: 'vortix',
    name: 'VortiX_后端',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    trustLevel: 3,
    trustTitle: '核心佬友',
    bio: 'Golang / Rust / 分布式高并发系统探索者。',
    joinedAt: '2024-03-10',
    likesReceived: 1890,
    topicsCount: 24,
    badges: ['🌟 核心佬友', '⚡ 性能怪兽'],
    location: '北京',
  },
  {
    id: 'user-linusfan',
    username: 'linusfan',
    name: '纯血运维佬',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    trustLevel: 2,
    trustTitle: '进阶佬友',
    bio: 'Debian 精品主义者，VPS 线路评测狂魔与 BBR 调优师。',
    joinedAt: '2024-05-01',
    likesReceived: 820,
    topicsCount: 16,
    badges: ['🛡️ 进阶佬友', '🐧 Linux 极客'],
    location: '深圳',
  },
  {
    id: 'user-promptmaster',
    username: 'promptmaster',
    name: '调优大师',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    trustLevel: 2,
    trustTitle: '进阶佬友',
    bio: '研究 Claude 3.7 / DeepSeek-R1 最佳提示词结构与 Agent 工作流。',
    joinedAt: '2024-06-12',
    likesReceived: 670,
    topicsCount: 12,
    badges: ['🛡️ 进阶佬友', '✨ Prompt 调优师'],
  },
  {
    id: 'user-current',
    username: 'nan7li',
    name: 'Nan7Li (当前账号)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    trustLevel: 3,
    trustTitle: '核心佬友',
    bio: 'Orion 社区探索者，随时参与讨论与共建。',
    joinedAt: '2024-07-20',
    likesReceived: 580,
    topicsCount: 9,
    badges: ['🌟 核心佬友', '🚀 探索先锋'],
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-all',
    slug: 'all',
    name: '全部话题',
    description: '社区所有精彩话题集合',
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.1)',
    topicsCount: 142,
  },
  {
    id: 'cat-tech',
    slug: 'tech',
    name: '科技杂谈',
    description: '前沿硬件、网络拓扑、数码好物、极客折腾记录',
    color: '#0284c7',
    bgColor: 'rgba(2, 132, 199, 0.12)',
    topicsCount: 38,
  },
  {
    id: 'cat-ai',
    slug: 'ai',
    name: '人工智能',
    description: 'LLM、DeepSeek、Claude、OpenAI、本地模型部署与 Agent 实践',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    topicsCount: 46,
  },
  {
    id: 'cat-dev',
    slug: 'dev',
    name: '开发调优',
    description: '全栈架构、代码重构、Serverless、Linux 性能调优',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    topicsCount: 29,
  },
  {
    id: 'cat-perks',
    slug: 'perks',
    name: '福利羊毛',
    description: '免费 API 额度、开源公益服务、云厂商优惠券与邀请码',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
    topicsCount: 22,
  },
  {
    id: 'cat-resources',
    slug: 'resources',
    name: '资源荟萃',
    description: '开源神器、实用工具脚本、Docker 镜像与效率利器',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    topicsCount: 35,
  },
  {
    id: 'cat-lounge',
    slug: 'lounge',
    name: '搞七捻三',
    description: '生活杂谈、独立开发者日常、摸鱼吹水、思想碰撞',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    topicsCount: 51,
  },
  {
    id: 'cat-notice',
    slug: 'notice',
    name: '站务公告',
    description: 'Orion 社区治理规则、信任等级提升指南、版本迭代通知',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    topicsCount: 8,
  },
];

export const POPULAR_TAGS = [
  'DeepSeek',
  'Next.js',
  'Docker',
  'VPS线路',
  'Claude-3.7',
  '开源项目',
  'API中转',
  'Linux调优',
  '独立开发',
  'TailwindCSS',
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'topic-1',
    title: '【官方公告】欢迎来到 Orion 社区！信任等级机制（Trust Level）与社区公约',
    category: CATEGORIES.find((c) => c.slug === 'notice')!,
    tags: ['社区公约', 'Trust Level', '公告'],
    author: INITIAL_USERS[0], // Neo
    views: 12840,
    likes: 856,
    isLiked: true,
    isBookmarked: true,
    isPinned: true,
    isFeatured: true,
    createdAt: '2024-09-01T10:00:00Z',
    lastActivityAt: '2024-09-05T14:30:00Z',
    repliesCount: 4,
    participants: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[2], INITIAL_USERS[3]],
    reactions: [
      { emoji: '🚀', count: 184, users: ['user-neo', 'user-cygnus', 'user-current'] },
      { emoji: '❤️', count: 242, users: ['user-cygnus', 'user-vortix'] },
      { emoji: '👍', count: 430, users: ['user-vortix', 'user-current'] },
      { emoji: '🎉', count: 96, users: ['user-linusfan'] },
    ],
    aiSummary:
      '本帖为 Orion 社区创始公告，详细阐释了 Orion 的核心理念：真诚交流、拒绝低质灌水、鼓励开源分享。公布了从观察者 (Lv.0) 到始皇认证书童 (Lv.4) 的信任等级晋升阶梯，明确了社区技术讨论与言论边界。',
    content: `## 🌌 欢迎加入 Orion 开发者星河

**Orion** 是一个面向极客、工程师、独立创作者与 AI 探索者的开放技术社区。在这里，我们倡导**求真务实、自由开源、相互成就**的精神。

---

### 🛡️ 信任等级体系 (Trust Level)

社区沿用类似 Discourse 的分层自治体系，鼓励持续沉淀优质内容：

| 等级 | 头衔 | 达成条件 | 核心特权 |
| :--- | :--- | :--- | :--- |
| **Lv.0** | 观察者 | 刚注册 | 限制发帖频次，学习社区文化 |
| **Lv.1** | 萌新佬友 | 浏览5个话题，阅读15分钟 | 解锁日常发帖、评论、点赞 |
| **Lv.2** | 进阶佬友 | 访问15天，点赞20次，无违规 | 获得邀请码、编辑个人专属标头 |
| **Lv.3** | 核心佬友 | 连续活跃50天，发布过精华帖 | 话题标签管理、社区共治投票 |
| **Lv.4** | 始皇认证书童 | 社区特邀 / 核心技术贡献者 | 全局版主特权、技术议程发起人 |

### 📜 社区基本公约
1. **真诚友善**：技术讨论对事不对人，严禁人身攻击与恶意拉踩。
2. **拒绝无意义灌水**：请尽量提供上下文和复现步骤，代码请使用 Markdown 语法包裹。
3. **鼓励原创与开源**：引用外部资料请标明出处，分享开源项目请附带 GitHub 链接。

愿我们在 Orion 的星空下，找到同频的灵魂！🚀`,
    replies: [
      {
        id: 'reply-1-1',
        topicId: 'topic-1',
        floorNumber: 2,
        author: INITIAL_USERS[1],
        createdAt: '2024-09-01T11:20:00Z',
        likes: 86,
        isLiked: true,
        reactions: [
          { emoji: '❤️', count: 42, users: ['user-neo', 'user-current'] },
          { emoji: '👍', count: 35, users: ['user-vortix'] },
        ],
        content: `支持始皇！Orion 的界面真的太舒服了，暗色主题的对比度和排版质感完全戳中审美！
期待在 Orion 认识更多优秀的佬友，今天起常驻！🎉`,
      },
      {
        id: 'reply-1-2',
        topicId: 'topic-1',
        floorNumber: 3,
        author: INITIAL_USERS[2],
        createdAt: '2024-09-01T13:05:00Z',
        likes: 42,
        isLiked: false,
        reactions: [{ emoji: '🚀', count: 28, users: ['user-cygnus'] }],
        content: `前排支持！等级机制非常健康，能有效抵御垃圾广告和脚本号。我已经准备好把最新的分布式网关源码整理发布到开源板块了！`,
      },
      {
        id: 'reply-1-3',
        topicId: 'topic-1',
        floorNumber: 4,
        author: INITIAL_USERS[4],
        createdAt: '2024-09-02T08:15:00Z',
        likes: 29,
        isLiked: false,
        reactions: [{ emoji: '💡', count: 18, users: ['user-linusfan'] }],
        content: `前排打卡！期待 AI 相关的专区讨论，最近 DeepSeek 和新推理模型有很多可玩的地方。`,
      },
      {
        id: 'reply-1-4',
        topicId: 'topic-1',
        floorNumber: 5,
        author: INITIAL_USERS[3],
        createdAt: '2024-09-05T14:30:00Z',
        likes: 18,
        isLiked: false,
        reactions: [{ emoji: '👍', count: 12, users: ['user-current'] }],
        content: `顶一下！支持合理的社区规则，老老实实写高质量技术总结的佬友就该受到尊重！`,
      },
    ],
  },
  {
    id: 'topic-2',
    title: '【开源分享】Orion-Gateway: 高性能多模型 LLM 聚合代理与负载均衡网关，支持流式加速',
    category: CATEGORIES.find((c) => c.slug === 'ai')!,
    tags: ['开源项目', 'DeepSeek', 'Claude-3.7', 'API中转'],
    author: INITIAL_USERS[1], // Cygnus
    views: 8320,
    likes: 512,
    isLiked: false,
    isBookmarked: true,
    isPinned: true,
    isFeatured: true,
    createdAt: '2024-09-02T09:00:00Z',
    lastActivityAt: '2024-09-05T18:20:00Z',
    repliesCount: 3,
    participants: [INITIAL_USERS[1], INITIAL_USERS[2], INITIAL_USERS[0]],
    reactions: [
      { emoji: '🚀', count: 210, users: ['user-neo', 'user-vortix'] },
      { emoji: '💡', count: 140, users: ['user-linusfan'] },
      { emoji: '👍', count: 162, users: ['user-current'] },
    ],
    aiSummary:
      '作者开源了专为现代大语言模型设计的高吞吐网关 Orion-Gateway。核心亮点包括多 Key 轮询容灾、统一 OpenAI 格式转换、零内存拷贝流式转发（TTFT 缩短 40%），并提供了极简的 Docker-compose 部署方案。',
    content: `各位佬友大家好！最近在折腾多个模型 API（包括 DeepSeek-R1、Claude 3.7 Sonnet、OpenAI o3-mini），发现市面上的中转网关要么太重，要么在高并发流式推理下延迟激增。

于是利用业余时间基于 Go + Fiber 搓了一个极简、高性能的聚合中转网关：**Orion-Gateway**。

### ✨ 核心特性
- ⚡ **零拷贝流式转发**：针对 SSE 流式响应进行了内存池复用，首字时间 (TTFT) 实测降低 40%。
- 🔄 **智能故障熔断**：多 Key 轮询与阶梯重试，遇到 429 或 500 自动切换健康节点。
- 📊 **精准 Token 统计与限流**：内置基于 Redis 的滑动窗口算法。
- 🛠️ **全模型统一协议**：一键将各种异构 API 转换为标准 \`/v1/chat/completions\` 规范。

### 🚀 Docker 极速部署

只需一行命令即可拉起：

\`\`\`bash
docker run -d \\
  --name orion-gateway \\
  -p 8080:8080 \\
  -e PORT=8080 \\
  -e MASTER_KEY=sk-orion-super-secret \\
  -v $(pwd)/config.yaml:/app/config.yaml \\
  orion/gateway:latest
\`\`\`

### 配置文件示例 (config.yaml)

\`\`\`yaml
routes:
  - path: /v1/chat/completions
    model_alias: "claude-3-7-sonnet"
    targets:
      - provider: "anthropic"
        api_key: "sk-ant-xxx"
        weight: 10
      - provider: "backup-upstream"
        api_key: "sk-backup-xxx"
        weight: 5
\`\`\`

欢迎大家部署体验，求个 Star ⭐️！任何 Bug 和建议直接在本帖留言！`,
    replies: [
      {
        id: 'reply-2-1',
        topicId: 'topic-2',
        floorNumber: 2,
        author: INITIAL_USERS[2],
        createdAt: '2024-09-02T10:14:00Z',
        likes: 38,
        isLiked: true,
        reactions: [{ emoji: '💡', count: 15, users: ['user-cygnus'] }],
        content: `看了一下源码架构，Go 的 \`sync.Pool\` 配合流式管道写得很干净！请问对于大 payload 的 function call 有没有做分包边界保护？`,
      },
      {
        id: 'reply-2-2',
        topicId: 'topic-2',
        floorNumber: 3,
        author: INITIAL_USERS[1],
        createdAt: '2024-09-02T10:45:00Z',
        likes: 22,
        isLiked: false,
        replyToUser: 'VortiX_后端',
        replyToContent: '请问对于大 payload 的 function call 有没有做分包边界保护？',
        reactions: [{ emoji: '👍', count: 8, users: ['user-vortix'] }],
        content: `@VortiX_后端 感谢关注！有的，在 parser 模块有 64KB 的动态缓冲窗口，即使遇到几千行的 tool_call JSON 也能完整组装无丢包。`,
      },
      {
        id: 'reply-2-3',
        topicId: 'topic-2',
        floorNumber: 4,
        author: INITIAL_USERS[0],
        createdAt: '2024-09-02T14:30:00Z',
        likes: 64,
        isLiked: true,
        reactions: [{ emoji: '🎉', count: 32, users: ['user-current'] }],
        content: `非常优秀的项目！已安排上主站精选板块。这种专注性能的工具正是社区最推崇的硬核产出。`,
      },
    ],
  },
  {
    id: 'topic-3',
    title: '【实战干货】各大云厂商海外 VPS 线路全面实测：CN2 GIA、AS9929、CMIN2 避坑与选购指南',
    category: CATEGORIES.find((c) => c.slug === 'tech')!,
    tags: ['VPS线路', 'Linux调优', 'Docker'],
    author: INITIAL_USERS[3], // LinusFan
    views: 6120,
    likes: 445,
    isLiked: false,
    isBookmarked: false,
    isPinned: false,
    isFeatured: true,
    createdAt: '2024-09-03T15:20:00Z',
    lastActivityAt: '2024-09-05T11:10:00Z',
    repliesCount: 2,
    participants: [INITIAL_USERS[3], INITIAL_USERS[5]],
    reactions: [
      { emoji: '💡', count: 180, users: ['user-current', 'user-neo'] },
      { emoji: '👍', count: 265, users: ['user-cygnus'] },
    ],
    aiSummary:
      '作者通过真实晚高峰网络测试，深度横评了电信 CN2 GIA、联通 AS9929/4837 以及移动 CMIN2 的真实带宽、丢包率与延迟，并给出了针对不同宽带用户的最具性价比选购组合与 BBR 优化脚本。',
    content: `不少佬友在建站或跑私有服务时经常被各种“优质线路”忽悠，今天用两周的全国节点晚高峰（20:00 - 23:00）实测数据，为大家做一次硬核脱水总结。

### 1. 三大优质线路现状

1. **电信 CN2 GIA (AS4809)**：
   - *表现*：晚高峰依然是最稳的王，抖动几乎为零。
   - *缺点*：单价昂贵，防御普遍偏低，被打容易进黑洞。
2. **联通 AS9929 (CU-VIP)**：
   - *表现*：性价比神仙线路，延迟紧咬 4809，且国际出口阻断率极低。
   - *建议*：自建 Git / 代码仓库首选。
3. **移动 CMIN2 (AS58807)**：
   - *表现*：移动近两年的王牌，移动宽带用户延迟可跑进 130ms（美西）。

---

### 2. 必做内核网络优化 (BBRv3 + FQ)

无论什么线路，现代 Linux 务必开启 BBR：

\`\`\`bash
# 开启 BBR 拥塞控制
cat >> /etc/sysctl.conf << EOF
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
net.ipv4.tcp_fastopen=3
EOF
sysctl -p
\`\`\`

大家目前手里主力都在用哪家？欢迎在评论区贴测速图交流！`,
    replies: [
      {
        id: 'reply-3-1',
        topicId: 'topic-3',
        floorNumber: 2,
        author: INITIAL_USERS[5],
        createdAt: '2024-09-03T16:40:00Z',
        likes: 12,
        isLiked: false,
        reactions: [{ emoji: '👍', count: 8, users: ['user-linusfan'] }],
        content: `太及时了！正愁家里联通宽带选哪个机房，这就去下单 9929 的德国节点试试看！`,
      },
      {
        id: 'reply-3-2',
        topicId: 'topic-3',
        floorNumber: 3,
        author: INITIAL_USERS[3],
        createdAt: '2024-09-03T17:00:00Z',
        likes: 8,
        isLiked: false,
        replyToUser: 'Nan7Li (当前账号)',
        content: `@Nan7Li 9929 走德国法兰克福机房晚高峰也能保持在 150ms 左右，非常适合挂邮件服务或者私有容器仓库。`,
      },
    ],
  },
  {
    id: 'topic-4',
    title: '【福利派送】Orion 开发者体验计划：赠送 100 份 DeepSeek & Claude 逆向兼容 API 体验额度！',
    category: CATEGORIES.find((c) => c.slug === 'perks')!,
    tags: ['福利羊毛', 'DeepSeek', 'API中转'],
    author: INITIAL_USERS[0], // Neo
    views: 9540,
    likes: 778,
    isLiked: true,
    isBookmarked: true,
    isPinned: false,
    isFeatured: true,
    createdAt: '2024-09-04T12:00:00Z',
    lastActivityAt: '2024-09-05T19:50:00Z',
    repliesCount: 3,
    participants: [INITIAL_USERS[0], INITIAL_USERS[4], INITIAL_USERS[5]],
    reactions: [
      { emoji: '🎉', count: 420, users: ['user-current', 'user-promptmaster'] },
      { emoji: '❤️', count: 310, users: ['user-cygnus'] },
      { emoji: '🚀', count: 280, users: ['user-vortix'] },
    ],
    aiSummary:
      '始皇发起的社区第 1 期福利活动。回帖即可自动发放专属 API Token，内含 $20 美元等值推理额度，支持 DeepSeek-V3 / R1 与 Claude 3.5/3.7，无并发限制。',
    content: `庆祝 Orion 社区正式上线运行，特地为大家准备了一波纯粹的开发者福利！

### 🎁 福利内容
- **额度**：每个 Token 包含 $20 美元等额算力
- **支持模型**：
  - \`deepseek-chat\` (V3)
  - \`deepseek-reasoner\` (R1 深度思考模式)
  - \`claude-3-7-sonnet-20250219\`
- **速率限制**：60 RPM，支持流式并发

### 领取方式
直接在本帖**回复一句你对 Orion 的祝福或你的独立项目介绍**，系统机器人会自动私信或高亮分发您的密钥！

> **注意**：禁止脚本多开刷号，仅限 Lv.1 及以上佬友参与。`,
    replies: [
      {
        id: 'reply-4-1',
        topicId: 'topic-4',
        floorNumber: 2,
        author: INITIAL_USERS[4],
        createdAt: '2024-09-04T12:30:00Z',
        likes: 21,
        isLiked: false,
        reactions: [{ emoji: '🎉', count: 12, users: ['user-neo'] }],
        content: `祝 Orion 越办越好！最近在用 Claude 3.7 重构自己的开源自动化 Agent 框架，正好缺高并发测试额度，感恩始皇！`,
      },
      {
        id: 'reply-4-2',
        topicId: 'topic-4',
        floorNumber: 3,
        author: INITIAL_USERS[5],
        createdAt: '2024-09-04T13:10:00Z',
        likes: 15,
        isLiked: false,
        reactions: [{ emoji: '❤️', count: 8, users: ['user-promptmaster'] }],
        content: `抢前排！祝 Orion 成为国内最有极客精神的纯粹技术自留地！`,
      },
      {
        id: 'reply-4-3',
        topicId: 'topic-4',
        floorNumber: 4,
        author: INITIAL_USERS[0],
        createdAt: '2024-09-04T14:00:00Z',
        likes: 45,
        isLiked: true,
        reactions: [{ emoji: '🚀', count: 20, users: ['user-current'] }],
        content: `已为前排回帖的两位佬友下发 Token，请进入个人控制台查收！后面回复的继续有效！`,
      },
    ],
  },
  {
    id: 'topic-5',
    title: '聊聊 Next.js 14 App Router 在大型社区项目中的踩坑与 SSR 缓存调优心得',
    category: CATEGORIES.find((c) => c.slug === 'dev')!,
    tags: ['Next.js', 'TailwindCSS', '开源项目'],
    author: INITIAL_USERS[2], // VortiX
    views: 4410,
    likes: 288,
    isLiked: false,
    isBookmarked: false,
    isPinned: false,
    isFeatured: false,
    createdAt: '2024-09-04T18:00:00Z',
    lastActivityAt: '2024-09-05T09:15:00Z',
    repliesCount: 1,
    participants: [INITIAL_USERS[2], INITIAL_USERS[1]],
    reactions: [{ emoji: '💡', count: 95, users: ['user-cygnus', 'user-neo'] }],
    aiSummary:
      '深入分析 Next.js 14 App Router 下 RSC（服务端组件）与客户端状态通信、Fetch Data Cache 命中陷阱以及如何避免无意间的 Full Route Cache 失效。',
    content: `很多人吐槽 Next.js 14 的缓存机制是个黑盒。我们在将 Orion 系统的原型从传统 SPA 迁移到 App Router 时，也踩了整整一星期的坑。

总结出以下 3 条黄金铁律：

### 1. 警惕动态函数 (Dynamic Functions) 的传染性
一旦在页面顶部直接调用了 \`cookies()\` 或 \`headers()\`，整棵子树都会退化为动态渲染 (Dynamic Rendering)。

**解决方案**：
- 将必须读取用户会话的部分收敛到叶子客户端组件中，或者通过 \`Suspense\` 局部包裹。

### 2. fetch 的 revalidate 陷阱
\`\`\`typescript
// 如果你想要 ISR 效果：
export const revalidate = 60; // 60秒增量静态再生

// 注意：如果下层某个 fetch 显式指定了 { cache: 'no-store' }，页面依然不会被缓存
\`\`\`

### 3. Client Component 的边界一定要尽量下沉
很多新手一遇到需要 \`useState\`，就在根 Layout 上写 \`'use client'\`，这会彻底废掉 React Server Components 的体积优势。`,
    replies: [
      {
        id: 'reply-5-1',
        topicId: 'topic-5',
        floorNumber: 2,
        author: INITIAL_USERS[1],
        createdAt: '2024-09-04T19:22:00Z',
        likes: 14,
        isLiked: false,
        reactions: [{ emoji: '👍', count: 12, users: ['user-vortix'] }],
        content: `写得太透彻了！特别是 Suspense 隔离 dynamic function 这一点，当时排查 TTFB 慢了 800ms 就是因为根组件读取了 cookie！`,
      },
    ],
  },
  {
    id: 'topic-6',
    title: '【摸鱼杂谈】工作 8 年后，我为什么选择每天下班写 2 小时自己的独立小产品？',
    category: CATEGORIES.find((c) => c.slug === 'lounge')!,
    tags: ['独立开发', '社区公约'],
    author: INITIAL_USERS[4], // PromptMaster
    views: 7120,
    likes: 589,
    isLiked: true,
    isBookmarked: false,
    isPinned: false,
    isFeatured: false,
    createdAt: '2024-09-05T02:00:00Z',
    lastActivityAt: '2024-09-05T20:10:00Z',
    repliesCount: 2,
    participants: [INITIAL_USERS[4], INITIAL_USERS[3]],
    reactions: [
      { emoji: '❤️', count: 210, users: ['user-current'] },
      { emoji: '💡', count: 145, users: ['user-linusfan'] },
    ],
    aiSummary:
      '作者真诚分享了从大厂“螺丝钉”到找回纯粹编码快乐的心路历程。探讨了在当下大模型降低交付门槛的时代，独立开发如何让人保持对技术的好奇心与自由度。',
    content: `白天在公司写着各种为了汇报而汇报的业务代码，晚上回到家洗个热水澡，泡一杯热茶，打开 VS Code 写自己真正想用的工具——这是我过去三年对抗职业倦怠最有效的药方。

现在有了 AI 编程助手（Claude Code, Cursor），一个人真的可以顶一个完整的敏捷团队。

大家平时都在写什么独立项目？遇到了什么商业化或者推广瓶颈？来这里畅所欲言！`,
    replies: [
      {
        id: 'reply-6-1',
        topicId: 'topic-6',
        floorNumber: 2,
        author: INITIAL_USERS[3],
        createdAt: '2024-09-05T08:30:00Z',
        likes: 27,
        isLiked: false,
        reactions: [{ emoji: '👍', count: 16, users: ['user-promptmaster'] }],
        content: `共鸣拉满！自己做的东西即使一个月只有几十个活跃用户，每次看到后端日志里有请求进来，那种快乐是大厂拿绩效无法比拟的。`,
      },
      {
        id: 'reply-6-2',
        topicId: 'topic-6',
        floorNumber: 3,
        author: INITIAL_USERS[4],
        createdAt: '2024-09-05T10:15:00Z',
        likes: 19,
        isLiked: false,
        reactions: [{ emoji: '❤️', count: 14, users: ['user-current'] }],
        content: `正是这种纯粹的乐趣！希望 Orion 也能成为独立开发者们互相交流经验、结识伙伴的好地方。`,
      },
    ],
  },
];
