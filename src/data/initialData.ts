import { Category, Topic, User } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    "id": "user-neo",
    "username": "neo",
    "name": "Neo (星舰引航者)",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 4,
    "trustTitle": "猎户座主权官 / 创世领航员",
    "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
    "joinedAt": "2024-01-01",
    "likesReceived": 9840,
    "topicsCount": 56,
    "badges": [
      "🪐 创世领航",
      "🛸 全局主权",
      "☄️ 核心贡献者"
    ],
    "location": "Orion Nebula (猎户星云)",
    "website": "https://orion.nan77a.com"
  },
  {
    "id": "user-current",
    "username": "nan7li",
    "name": "Nan7Li (星舰领航员)",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 4,
    "trustTitle": "猎户座主权官",
    "bio": "Orion 猎户星云探索者，全栈工程师，终身学习者。",
    "joinedAt": "2024-07-20",
    "likesReceived": 580,
    "topicsCount": 10,
    "badges": [
      "🪐 创世领航",
      "🛸 全局主权",
      "🚀 探索先锋"
    ],
    "location": "",
    "website": "https://nan77a.com"
  },
  {
    "id": "user-cygnus",
    "username": "cygnus",
    "name": "Cygnus_极客",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 3,
    "trustTitle": "星域巡航舰长",
    "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
    "joinedAt": "2024-02-15",
    "likesReceived": 3420,
    "topicsCount": 38,
    "badges": [
      "🌟 恒星守望者",
      "🤖 AI 先锋",
      "🔥 精华星录"
    ],
    "location": "上海",
    "website": ""
  },
  {
    "id": "user-cfninja",
    "username": "cloudflare_ninja",
    "name": "边缘黑客_Ray",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 3,
    "trustTitle": "星域巡航舰长",
    "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
    "joinedAt": "2024-03-22",
    "likesReceived": 3120,
    "topicsCount": 31,
    "badges": [
      "🌟 恒星守望者",
      "⚡ 边缘计算宗师"
    ],
    "location": "广州",
    "website": ""
  },
  {
    "id": "user-matrix",
    "username": "matrix_walker",
    "name": "矩阵漫步者",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 3,
    "trustTitle": "星域巡航舰长",
    "bio": "从微服务折腾到模块化单体，云原生架构、K8s与网络协议爱好者。",
    "joinedAt": "2024-04-10",
    "likesReceived": 2150,
    "topicsCount": 19,
    "badges": [
      "🌟 恒星守望者",
      "🧩 架构师勋章"
    ],
    "location": "杭州",
    "website": ""
  },
  {
    "id": "user-vortix",
    "username": "vortix",
    "name": "VortiX_后端",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 3,
    "trustTitle": "星域巡航舰长",
    "bio": "Golang / Rust / 分布式高并发微服务与单体重构践行者。",
    "joinedAt": "2024-03-10",
    "likesReceived": 1890,
    "topicsCount": 24,
    "badges": [
      "🌟 恒星守望者",
      "⚡ 性能怪兽"
    ],
    "location": "北京",
    "website": ""
  },
  {
    "id": "user-indie",
    "username": "indie_nomad",
    "name": "星轨独立创作者",
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 2,
    "trustTitle": "深空探索先锋",
    "bio": "全栈出海独立开发第 2 年，分享 MRR 增长实战与踩坑记录。",
    "joinedAt": "2024-05-18",
    "likesReceived": 1640,
    "topicsCount": 15,
    "badges": [
      "🚀 深空探索先锋",
      "💰 独立黑客"
    ],
    "location": "清迈 / 大理",
    "website": ""
  },
  {
    "id": "user-rust",
    "username": "rust_stellar",
    "name": "锈迹星辰",
    "avatar": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 2,
    "trustTitle": "深空探索先锋",
    "bio": "Rustaceans. 追求极致性能与内存安全，开源反代与并发工具维护者。",
    "joinedAt": "2024-06-01",
    "likesReceived": 1290,
    "topicsCount": 14,
    "badges": [
      "🚀 深空探索先锋",
      "🦀 Rust 先锋"
    ],
    "location": "武汉",
    "website": ""
  },
  {
    "id": "user-terminal",
    "username": "terminal_poet",
    "name": "终端极客_Echo",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 2,
    "trustTitle": "深空探索先锋",
    "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
    "joinedAt": "2024-07-02",
    "likesReceived": 940,
    "topicsCount": 11,
    "badges": [
      "🚀 深空探索先锋",
      "⌨️ 终端诗人"
    ],
    "location": "南京",
    "website": ""
  },
  {
    "id": "user-linusfan",
    "username": "linusfan",
    "name": "纯血运维漫游者",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 2,
    "trustTitle": "深空探索先锋",
    "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
    "joinedAt": "2024-05-01",
    "likesReceived": 820,
    "topicsCount": 16,
    "badges": [
      "🚀 深空探索先锋",
      "🐧 Linux 极客"
    ],
    "location": "深圳",
    "website": ""
  },
  {
    "id": "user-promptmaster",
    "username": "promptmaster",
    "name": "调优漫游者",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "trustLevel": 2,
    "trustTitle": "深空探索先锋",
    "bio": "研究 Claude 3.7 / DeepSeek-R1 最佳提示词结构与 Agentic 工作流。",
    "joinedAt": "2024-06-12",
    "likesReceived": 670,
    "topicsCount": 12,
    "badges": [
      "🚀 深空探索先锋",
      "✨ Prompt 调优师"
    ],
    "location": "",
    "website": ""
  },
  {
    "id": "user-1788616266570",
    "username": "starlight",
    "name": "星光远航者",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=starlight",
    "trustLevel": 1,
    "trustTitle": "星际漫游者",
    "bio": "热爱开源，前端 Next.js 与全栈爱好者。",
    "joinedAt": "2026-09-05",
    "likesReceived": 0,
    "topicsCount": 0,
    "badges": [
      "🛸 星际漫游者"
    ],
    "location": "",
    "website": ""
  },
  {
    "id": "user-1788616276702",
    "username": "novastar",
    "name": "超新星探险家",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=novastar",
    "trustLevel": 1,
    "trustTitle": "星际漫游者",
    "bio": "刚跃迁进入 Orion 星系的探索新秀，正在吸收社区知识！",
    "joinedAt": "2026-09-05",
    "likesReceived": 0,
    "topicsCount": 0,
    "badges": [
      "🛸 星际漫游者"
    ],
    "location": "",
    "website": ""
  }
];

export const CATEGORIES: Category[] = [
  {
    "id": "cat-all",
    "slug": "all",
    "name": "全部星域",
    "description": "社区全星域精彩话题集合",
    "color": "#6366f1",
    "bgColor": "rgba(99, 102, 241, 0.1)",
    "topicsCount": 25
  },
  {
    "id": "cat-tech",
    "slug": "tech",
    "name": "深空科技",
    "description": "前沿硬件、网络拓扑、数码好物、极客折腾记录",
    "color": "#0284c7",
    "bgColor": "rgba(2, 132, 199, 0.12)",
    "topicsCount": 4
  },
  {
    "id": "cat-ai",
    "slug": "ai",
    "name": "人工智能",
    "description": "LLM、DeepSeek、Claude、OpenAI、本地模型部署与 Agent 实践",
    "color": "#8b5cf6",
    "bgColor": "rgba(139, 92, 246, 0.12)",
    "topicsCount": 5
  },
  {
    "id": "cat-dev",
    "slug": "dev",
    "name": "开发调优",
    "description": "全栈架构、代码重构、Serverless、Linux 性能调优",
    "color": "#10b981",
    "bgColor": "rgba(16, 185, 129, 0.12)",
    "topicsCount": 4
  },
  {
    "id": "cat-perks",
    "slug": "perks",
    "name": "星际补给",
    "description": "免费 API 额度、开源公益服务、云厂商优惠券与邀请码",
    "color": "#ec4899",
    "bgColor": "rgba(236, 72, 153, 0.12)",
    "topicsCount": 4
  },
  {
    "id": "cat-resources",
    "slug": "resources",
    "name": "星图资源",
    "description": "开源神器、实用工具脚本、Docker 镜像与效率利器",
    "color": "#06b6d4",
    "bgColor": "rgba(6, 182, 212, 0.12)",
    "topicsCount": 3
  },
  {
    "id": "cat-lounge",
    "slug": "lounge",
    "name": "星际酒馆",
    "description": "生活杂谈、独立开发者日常、摸鱼吹水、思想碰撞",
    "color": "#f59e0b",
    "bgColor": "rgba(245, 158, 11, 0.12)",
    "topicsCount": 3
  },
  {
    "id": "cat-notice",
    "slug": "notice",
    "name": "星舰通标",
    "description": "Orion 社区治理规则、宇宙星阶进阶指南、版本迭代通知",
    "color": "#ef4444",
    "bgColor": "rgba(239, 68, 68, 0.12)",
    "topicsCount": 2
  }
];

export const POPULAR_TAGS = [
  "DeepSeek",
  "Next.js",
  "Docker",
  "VPS线路",
  "Claude-3.7",
  "开源项目",
  "API中转",
  "Linux调优",
  "独立开发",
  "TailwindCSS",
  "Go语言",
  "Rust",
  "Cloudflare",
  "Homelab",
  "WireGuard"
];

export const INITIAL_TOPICS: Topic[] = [
  {
    "id": "topic-1",
    "title": "【官方星标】欢迎降落 Orion 猎户座社区！宇宙星阶体系（Cosmic Levels）与公约",
    "category": {
      "id": "cat-notice",
      "slug": "notice",
      "name": "星舰通标",
      "description": "Orion 社区治理规则、宇宙星阶进阶指南、版本迭代通知",
      "color": "#ef4444",
      "bgColor": "rgba(239, 68, 68, 0.12)",
      "topicsCount": 2
    },
    "tags": [
      "社区公约",
      "宇宙星阶",
      "星舰公告"
    ],
    "author": {
      "id": "user-neo",
      "username": "neo",
      "name": "Neo (星舰引航者)",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 4,
      "trustTitle": "猎户座主权官 / 创世领航员",
      "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
      "joinedAt": "2024-01-01",
      "likesReceived": 9840,
      "topicsCount": 56,
      "badges": [
        "🪐 创世领航",
        "🛸 全局主权",
        "☄️ 核心贡献者"
      ],
      "location": "Orion Nebula (猎户星云)",
      "website": "https://orion.nan77a.com"
    },
    "content": "## 🌌 欢迎加入 Orion 猎户座开发者星河\n\n**Orion** 是一个面向极客、工程师、独立创作者与 AI 探索者的开放宇宙社区。在这里，我们倡导**求真务实、自由开源、相互成就**的精神。\n\n---\n\n### 🪐 宇宙星阶体系 (Cosmic Hierarchy)\n\n社区告别陈旧等级机制，采用纯正的天体引力进阶体系，鼓励持续沉淀优质内容：\n\n| 星阶等级 | 天体头衔 | 英文标识 | 达成条件 | 核心特权 |\n| :--- | :--- | :--- | :--- | :--- |\n| **Lv.0** | **星尘观测者** | Stardust Observer | 刚抵达星系 | 观察引力轨道，学习社区文化 |\n| **Lv.1** | **星际漫游者** | Cosmos Voyager | 浏览5个话题，阅读15分钟 | 解锁日常发帖、评论、星标互动 |\n| **Lv.2** | **深空探索先锋** | Deep-Space Scout | 活跃15天，点赞20次，无违规 | 获得跃迁邀请码、编辑个人星际标头 |\n| **Lv.3** | **星域巡航舰长** | Sector Captain | 连续在轨50天，发布过精选话题 | 话题标签管理、星域共治投票 |\n| **Lv.4** | **猎户座主权官** | Orion Sovereign | 核心技术贡献者 / 创世领航员 | 全局守护特权、技术议程发起人 |\n\n### 📜 星舰基本公约\n1. **真诚友善**：技术讨论对事不对人，严禁人身攻击与恶意拉踩。\n2. **拒绝无意义灌水**：请尽量提供上下文和复现步骤，代码请使用 Markdown 语法包裹。\n3. **鼓励原创与开源**：引用外部资料请标明出处，分享开源项目请附带 GitHub 链接。\n\n愿我们在 Orion 的浩瀚星海中，找到同频共振的智慧！🚀",
    "createdAt": "2026-09-03T14:01:50.375Z",
    "lastActivityAt": "2026-09-05T13:49:50.375Z",
    "views": 14820,
    "likes": 924,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": true,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 4,
    "participants": [
      {
        "id": "user-neo",
        "username": "neo",
        "name": "Neo (星舰引航者)",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 4,
        "trustTitle": "猎户座主权官 / 创世领航员",
        "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
        "joinedAt": "2024-01-01",
        "likesReceived": 9840,
        "topicsCount": 56,
        "badges": [
          "🪐 创世领航",
          "🛸 全局主权",
          "☄️ 核心贡献者"
        ],
        "location": "Orion Nebula (猎户星云)",
        "website": "https://orion.nan77a.com"
      },
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      },
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      },
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      },
      {
        "id": "user-current",
        "username": "nan7li",
        "name": "Nan7Li (星舰领航员)",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 4,
        "trustTitle": "猎户座主权官"
      }
    ],
    "replies": [],
    "aiSummary": "本帖为 Orion 社区创始通标，详细阐释了猎户座（Orion）的核心理念：仰望星空、求真务实、自由开源、相互成就。公布了从星尘观测者 (Lv.0) 到猎户座主权官 (Lv.4) 的宇宙星阶晋升体系，明确了社区技术讨论准则。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-2",
    "title": "【官方公告】Orion 全线接入 Cloudflare D1 边缘 SQL 数据库与实时多节点流架构",
    "category": {
      "id": "cat-notice",
      "slug": "notice",
      "name": "星舰通标",
      "description": "Orion 社区治理规则、宇宙星阶进阶指南、版本迭代通知",
      "color": "#ef4444",
      "bgColor": "rgba(239, 68, 68, 0.12)",
      "topicsCount": 2
    },
    "tags": [
      "Cloudflare",
      "D1数据库",
      "边缘计算",
      "架构升级"
    ],
    "author": {
      "id": "user-neo",
      "username": "neo",
      "name": "Neo (星舰引航者)",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 4,
      "trustTitle": "猎户座主权官 / 创世领航员",
      "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
      "joinedAt": "2024-01-01",
      "likesReceived": 9840,
      "topicsCount": 56,
      "badges": [
        "🪐 创世领航",
        "🛸 全局主权",
        "☄️ 核心贡献者"
      ],
      "location": "Orion Nebula (猎户星云)",
      "website": "https://orion.nan77a.com"
    },
    "content": "各位在轨星友，\n\n经过技术组两周的紧密演进，Orion 社区正式宣布完成**全站边缘化基础设施迁移**！\n\n### 🚀 核心架构亮点\n- **全球边缘分布**：基于 Cloudflare D1 (SQLite at the edge) 实现多地区毫秒级冷启动与就近读取。\n- **纯边缘无服务器 (Serverless)**：所有认证鉴权、议题投递、实时点赞均由 Cloudflare Pages Edge Functions 支撑。\n- **加盐密码哈希**：引入 SHA-256 + 专属星际 Salt 安全存储体系，捍卫每一位星友的通信安全。\n- **多端同步**：本地 Storage 预取与远端 Edge SQL 实时校验并存，保障极致丝滑的页面切换。\n\n如果在探索过程中发现任何异常跃迁，请随时在评论区留言反馈！",
    "createdAt": "2026-09-04T14:01:50.375Z",
    "lastActivityAt": "2026-09-05T13:36:50.375Z",
    "views": 8940,
    "likes": 672,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": true,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 3,
    "participants": [
      {
        "id": "user-neo",
        "username": "neo",
        "name": "Neo (星舰引航者)",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 4,
        "trustTitle": "猎户座主权官 / 创世领航员",
        "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
        "joinedAt": "2024-01-01",
        "likesReceived": 9840,
        "topicsCount": 56,
        "badges": [
          "🪐 创世领航",
          "🛸 全局主权",
          "☄️ 核心贡献者"
        ],
        "location": "Orion Nebula (猎户星云)",
        "website": "https://orion.nan77a.com"
      },
      {
        "id": "user-cfninja",
        "username": "cloudflare_ninja",
        "name": "边缘黑客_Ray",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      },
      {
        "id": "user-matrix",
        "username": "matrix_walker",
        "name": "矩阵漫步者",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "官方宣布 Orion 社区底层数据库已完成向 Cloudflare D1 边缘分布式 SQL 引擎的迁移，消除了传统单机数据库的高昂维护成本，实现了全球多边缘节点的低延迟读写与数据强一致性。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-6",
    "title": "【星际补给】Orion 开发者体验计划：免费领取 100 份 DeepSeek & Claude 逆向兼容 API 体验额度！",
    "category": {
      "id": "cat-perks",
      "slug": "perks",
      "name": "星际补给",
      "description": "免费 API 额度、开源公益服务、云厂商优惠券与邀请码",
      "color": "#ec4899",
      "bgColor": "rgba(236, 72, 153, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "星际补给",
      "福利活动",
      "API额度",
      "DeepSeek"
    ],
    "author": {
      "id": "user-neo",
      "username": "neo",
      "name": "Neo (星舰引航者)",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 4,
      "trustTitle": "猎户座主权官 / 创世领航员",
      "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
      "joinedAt": "2024-01-01",
      "likesReceived": 9840,
      "topicsCount": 56,
      "badges": [
        "🪐 创世领航",
        "🛸 全局主权",
        "☄️ 核心贡献者"
      ],
      "location": "Orion Nebula (猎户星云)",
      "website": "https://orion.nan77a.com"
    },
    "content": "庆祝 Orion 猎户座社区边缘数据库全面升级，特地为大家准备了一波纯粹的开发者星际补给！\n\n### 🎁 补给内容\n- **额度**：每个 Token 包含 $20 美元等额算力\n- **支持模型**：\n  - `deepseek-chat` (V3)\n  - `deepseek-reasoner` (R1 深度思考模式)\n  - `claude-3-7-sonnet-20250219`\n- **速率限制**：60 RPM，支持流式并发\n\n### 领取方式\n直接在本帖**回复一句你对 Orion 的祝福或你的独立项目介绍**，系统机器人会自动分发您的专属补给密钥！\n\n> **注意**：禁止脚本多开刷号，仅限 Lv.1 星际漫游者及以上星友参与。",
    "createdAt": "2026-09-04T08:01:50.375Z",
    "lastActivityAt": "2026-09-05T13:56:50.375Z",
    "views": 14200,
    "likes": 1350,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 3,
    "participants": [
      {
        "id": "user-neo",
        "username": "neo",
        "name": "Neo (星舰引航者)",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 4,
        "trustTitle": "猎户座主权官 / 创世领航员",
        "bio": "代码构建宇宙，连接思想与星辰。专注于分布式架构与边缘计算。",
        "joinedAt": "2024-01-01",
        "likesReceived": 9840,
        "topicsCount": 56,
        "badges": [
          "🪐 创世领航",
          "🛸 全局主权",
          "☄️ 核心贡献者"
        ],
        "location": "Orion Nebula (猎户星云)",
        "website": "https://orion.nan77a.com"
      },
      {
        "id": "user-promptmaster",
        "username": "promptmaster",
        "name": "调优漫游者",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      },
      {
        "id": "user-indie",
        "username": "indie_nomad",
        "name": "星轨独立创作者",
        "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "Orion 社区第 1 期专属福利：回帖即可领取包含 $20 美元算力的全协议兼容 API Key，支持 DeepSeek-R1、V3 与 Claude 3.7，无并发限制。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-3",
    "title": "【深度测评】DeepSeek-R1 本地私有化量化部署：4-bit AWQ vs GGUF 速度与显存对比实测",
    "category": {
      "id": "cat-ai",
      "slug": "ai",
      "name": "人工智能",
      "description": "LLM、DeepSeek、Claude、OpenAI、本地模型部署与 Agent 实践",
      "color": "#8b5cf6",
      "bgColor": "rgba(139, 92, 246, 0.12)",
      "topicsCount": 5
    },
    "tags": [
      "DeepSeek",
      "本地部署",
      "vLLM",
      "量化调优"
    ],
    "author": {
      "id": "user-cygnus",
      "username": "cygnus",
      "name": "Cygnus_极客",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
      "joinedAt": "2024-02-15",
      "likesReceived": 3420,
      "topicsCount": 38,
      "badges": [
        "🌟 恒星守望者",
        "🤖 AI 先锋",
        "🔥 精华星录"
      ],
      "location": "上海",
      "website": ""
    },
    "content": "DeepSeek-R1 爆火之后，很多人想在企业私有云或个人双卡工作站上本地跑起来。今天做一次干货实测：\n\n### 🖥️ 测试环境\n- **GPU**: 2x RTX 4090 24GB (共 48GB 显存)\n- **CPU**: AMD EPYC 7763 64-Core\n- **模型**: `DeepSeek-R1-Distill-Qwen-32B` 与 `DeepSeek-R1-671B-Q4_K_M`\n\n---\n\n### 1. 32B 蒸馏版本：vLLM AWQ 实测\n\n启动命令推荐：\n```bash\nvllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B \\\n  --tensor-parallel-size 2 \\\n  --gpu-memory-utilization 0.92 \\\n  --max-model-len 16384 \\\n  --quantization awq \\\n  --enforce-eager\n```\n\n- **显存占用**：单卡约 18.5GB，两张 4090 毫无压力。\n- **生成速度**：单请求能跑出 **42 tokens/sec**，思考链 (Thinking Phase) 极其流畅！\n\n### 2. 671B 完整版：llama.cpp CPU+GPU 混合卸载\n\n671B 完整模型 4-bit 尺寸约 380GB，必须靠巨量内存 + 少量 GPU 算力卸载。实测在 512GB DDR4 内存下，推理速度约为 3.5 tokens/sec，勉强可用但延迟较高。个人玩家首选还是 32B 或 70B 蒸馏版！",
    "createdAt": "2026-09-05T02:01:50.375Z",
    "lastActivityAt": "2026-09-05T13:43:50.375Z",
    "views": 16540,
    "likes": 1120,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 3,
    "participants": [
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
        "joinedAt": "2024-02-15",
        "likesReceived": 3420,
        "topicsCount": 38,
        "badges": [
          "🌟 恒星守望者",
          "🤖 AI 先锋",
          "🔥 精华星录"
        ],
        "location": "上海",
        "website": ""
      },
      {
        "id": "user-promptmaster",
        "username": "promptmaster",
        "name": "调优漫游者",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      },
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "作者使用双路 RTX 4090 深度横评了 DeepSeek-R1 在 vLLM AWQ 与 llama.cpp GGUF 格式下的显存占用、首字延迟 (TTFT) 以及并发吞吐表现，并附上了最佳启动脚本配置。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-10",
    "title": "收集分享大家在 Cursor / Claude Code 中最常用的 Prompt Rules 规则库与 Agent 提效姿势",
    "category": {
      "id": "cat-ai",
      "slug": "ai",
      "name": "人工智能",
      "description": "LLM、DeepSeek、Claude、OpenAI、本地模型部署与 Agent 实践",
      "color": "#8b5cf6",
      "bgColor": "rgba(139, 92, 246, 0.12)",
      "topicsCount": 5
    },
    "tags": [
      "Cursor",
      "ClaudeCode",
      "AI编程",
      "Prompt调优"
    ],
    "author": {
      "id": "user-promptmaster",
      "username": "promptmaster",
      "name": "调优漫游者",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "研究 Claude 3.7 / DeepSeek-R1 最佳提示词结构与 Agentic 工作流。",
      "joinedAt": "2024-06-12",
      "likesReceived": 670,
      "topicsCount": 12,
      "badges": [
        "🚀 深空探索先锋",
        "✨ Prompt 调优师"
      ],
      "location": "",
      "website": ""
    },
    "content": "越来越多人将 AI 辅助编程深度融入日常流中。很多同学反馈模型总是“自作聪明”改动不相干的已有代码。\n\n分享我们在团队 `.cursorrules` 里打磨出的几条黄金指令：\n\n```markdown\n# 核心行为规范\n1. **最小侵入原则**：只修改实现任务所必需的代码，严禁无故重写其他函数或随意改变原有变量名。\n2. **严格保留原有注释**：非本次改动相关的代码注释必须完整保留。\n3. **TypeScript 强制无 any**：所有新增加的方法必须具备完整类型定义，禁止直接使用 any 逃避类型检查。\n4. **错误处理要求**：异步代码必须包裹 try-catch 或标准 Result 模式，不得静默捕获异常。\n```\n\n大家平时在项目中还有哪些独家 Rules？欢迎评论区交流补充！",
    "createdAt": "2026-09-04T11:21:50.375Z",
    "lastActivityAt": "2026-09-05T13:26:50.375Z",
    "views": 13500,
    "likes": 1040,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-promptmaster",
        "username": "promptmaster",
        "name": "调优漫游者",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "研究 Claude 3.7 / DeepSeek-R1 最佳提示词结构与 Agentic 工作流。",
        "joinedAt": "2024-06-12",
        "likesReceived": 670,
        "topicsCount": 12,
        "badges": [
          "🚀 深空探索先锋",
          "✨ Prompt 调优师"
        ],
        "location": "",
        "website": ""
      },
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "作者汇总了编写 .cursorrules 与系统提示词时的核心准则：指定角色、约束破坏性修改、强制类型安全检查与统一代码风格。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-4",
    "title": "聊聊我们为什么把微服务全部迁回单体 Go 架构（经历 3 年拆分的痛定思痛）",
    "category": {
      "id": "cat-dev",
      "slug": "dev",
      "name": "开发调优",
      "description": "全栈架构、代码重构、Serverless、Linux 性能调优",
      "color": "#10b981",
      "bgColor": "rgba(16, 185, 129, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Go语言",
      "架构设计",
      "微服务",
      "单体架构"
    ],
    "author": {
      "id": "user-matrix",
      "username": "matrix_walker",
      "name": "矩阵漫步者",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "从微服务折腾到模块化单体，云原生架构、K8s与网络协议爱好者。",
      "joinedAt": "2024-04-10",
      "likesReceived": 2150,
      "topicsCount": 19,
      "badges": [
        "🌟 恒星守望者",
        "🧩 架构师勋章"
      ],
      "location": "杭州",
      "website": ""
    },
    "content": "三年前，团队核心业务只有 4 个人维护，却脑子发热把系统拆成了 16 个微服务：用户服务、鉴权服务、内容服务、计费服务、通知服务……\n\n### 经历的恶梦：\n1. **分布式事务折磨**：为了保证订单和库存一致，写了两套复杂的 Saga 补偿，不仅代码晦涩，线上脏数据排查令人崩溃。\n2. **本地调试地狱**：新人入职第一周根本跑不起来本地环境，必须在 Minikube 里面起 20 个容器，电脑风扇狂转。\n3. **运维成本吞噬利润**：K8s 集群月度账单几千刀，但其实总 QPS 也就 200 出头！\n\n---\n\n### 重构后的模块化单体 (Modular Monolith)\n我们花了三个月，用 Go 语言将所有服务合并回一个仓库（Monorepo）：\n- 模块之间通过严格定义的 Go interface 交互，**禁止跨包直接查表**。\n- 单个二进制文件 `server`，编译时间 6 秒，Docker 镜像仅 24MB。\n- 一台 4核8G 的云服务器搞定全部，CPU 占用率常年低于 15%！\n\n**心得**：没有淘宝的流量，别生微服务的病！",
    "createdAt": "2026-09-04T20:01:50.375Z",
    "lastActivityAt": "2026-09-05T13:16:50.375Z",
    "views": 12400,
    "likes": 980,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 3,
    "participants": [
      {
        "id": "user-matrix",
        "username": "matrix_walker",
        "name": "矩阵漫步者",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "从微服务折腾到模块化单体，云原生架构、K8s与网络协议爱好者。",
        "joinedAt": "2024-04-10",
        "likesReceived": 2150,
        "topicsCount": 19,
        "badges": [
          "🌟 恒星守望者",
          "🧩 架构师勋章"
        ],
        "location": "杭州",
        "website": ""
      },
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      },
      {
        "id": "user-rust",
        "username": "rust_stellar",
        "name": "锈迹星辰",
        "avatar": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "作者深度复盘了创业团队从最初追求时髦拆分 16 个微服务，到后来被跨服务事务、链路追踪和部署编排拖垮，最终历时三个月重构成一个高性能模块化单体 Go 系统的惨痛经验。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-5",
    "title": "【实战干货】各大云厂商海外 VPS 线路全面实测：CN2 GIA、AS9929、CMIN2 避坑与选购指南",
    "category": {
      "id": "cat-tech",
      "slug": "tech",
      "name": "深空科技",
      "description": "前沿硬件、网络拓扑、数码好物、极客折腾记录",
      "color": "#0284c7",
      "bgColor": "rgba(2, 132, 199, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "VPS线路",
      "网络测评",
      "CN2",
      "AS9929"
    ],
    "author": {
      "id": "user-linusfan",
      "username": "linusfan",
      "name": "纯血运维漫游者",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
      "joinedAt": "2024-05-01",
      "likesReceived": 820,
      "topicsCount": 16,
      "badges": [
        "🚀 深空探索先锋",
        "🐧 Linux 极客"
      ],
      "location": "深圳",
      "website": ""
    },
    "content": "不少星友在建站或跑私有服务时经常被各种“优质线路”忽悠，今天用两周的全国节点晚高峰（20:00 - 23:00）实测数据，为大家做一次硬核脱水总结。\n\n### 1. 三大优质线路现状\n\n1. **电信 CN2 GIA (AS4809)**：\n   - *表现*：晚高峰依然是最稳的王，丢包率 < 0.5%，延迟极低。\n   - *缺点*：单价昂贵，防御普遍偏低，容易被打进黑洞。\n2. **联通 AS9929 (CU-VIP)**：\n   - *表现*：性价比神仙线路，延迟紧咬 4809，且国际出口阻断率极低。\n   - *建议*：自建 Git / 代码仓库首选，特别是美西洛杉矶或德国法兰克福机房。\n3. **移动 CMIN2 (AS58807)**：\n   - *表现*：移动近两年的王牌，移动宽带用户延迟可跑进 130ms（美西）。\n\n---\n\n### 2. 必做内核网络优化 (BBRv3 + FQ)\n\n```bash\n# 开启 BBR 拥塞控制与 FastOpen\ncat >> /etc/sysctl.conf << EOF\nnet.core.default_qdisc=fq\nnet.ipv4.tcp_congestion_control=bbr\nnet.ipv4.tcp_fastopen=3\nEOF\nsysctl -p\n```\n\n大家目前手里主力都在用哪家？欢迎贴测速图交流！",
    "createdAt": "2026-09-04T02:01:50.375Z",
    "lastActivityAt": "2026-09-05T13:01:50.375Z",
    "views": 18900,
    "likes": 1420,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 3,
    "participants": [
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
        "joinedAt": "2024-05-01",
        "likesReceived": 820,
        "topicsCount": 16,
        "badges": [
          "🚀 深空探索先锋",
          "🐧 Linux 极客"
        ],
        "location": "深圳",
        "website": ""
      },
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "作者通过真实晚高峰网络测试，深度横评了电信 CN2 GIA、联通 AS9929 以及移动 CMIN2 的真实带宽、丢包率与延迟，并给出了最具性价比的机房选购组合与 Linux BBR 调优脚本。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-12",
    "title": "Docker 26+ 国内镜像拉取全失效后的生产级应对方案与自建 Cloudflare Worker 反代",
    "category": {
      "id": "cat-dev",
      "slug": "dev",
      "name": "开发调优",
      "description": "全栈架构、代码重构、Serverless、Linux 性能调优",
      "color": "#10b981",
      "bgColor": "rgba(16, 185, 129, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Docker",
      "镜像加速",
      "CloudflareWorkers",
      "运维实战"
    ],
    "author": {
      "id": "user-matrix",
      "username": "matrix_walker",
      "name": "矩阵漫步者",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "从微服务折腾到模块化单体，云原生架构、K8s与网络协议爱好者。",
      "joinedAt": "2024-04-10",
      "likesReceived": 2150,
      "topicsCount": 19,
      "badges": [
        "🌟 恒星守望者",
        "🧩 架构师勋章"
      ],
      "location": "杭州",
      "website": ""
    },
    "content": "国内主流 Docker Hub 镜像加速站全面关停后，很多服务器一拉镜像就 `dial tcp: lookup registry-1.docker.io: i/o timeout`。\n\n### 最优生产解决方案：CF Worker 个人反代\n1. 在 Cloudflare 免费申请一个 Worker。\n2. 绑定一个自己的泛域名，例如 `docker.yourdomain.com`。\n3. 部署开源的反代代码，配置缓存规则与路径重写。\n\n客户端只需在 `/etc/docker/daemon.json` 中写入：\n```json\n{\n  \"registry-mirrors\": [\"https://docker.yourdomain.com\"]\n}\n```\n\n`systemctl daemon-reload && systemctl restart docker`，秒级拉取官方镜像！",
    "createdAt": "2026-09-03T15:21:50.375Z",
    "lastActivityAt": "2026-09-05T12:51:50.375Z",
    "views": 15400,
    "likes": 1180,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-matrix",
        "username": "matrix_walker",
        "name": "矩阵漫步者",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "从微服务折腾到模块化单体，云原生架构、K8s与网络协议爱好者。",
        "joinedAt": "2024-04-10",
        "likesReceived": 2150,
        "topicsCount": 19,
        "badges": [
          "🌟 恒星守望者",
          "🧩 架构师勋章"
        ],
        "location": "杭州",
        "website": ""
      },
      {
        "id": "user-cfninja",
        "username": "cloudflare_ninja",
        "name": "边缘黑客_Ray",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      },
      {
        "id": "user-rust",
        "username": "rust_stellar",
        "name": "锈迹星辰",
        "avatar": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "由于国内公共 Docker Hub 镜像站基本关停，作者开源了一份基于 Cloudflare Worker 的个人私有 Docker Registry 镜像反代代码。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-13",
    "title": "【星际杂谈】工作 8 年后，我为什么选择每天下班写 2 小时自己的独立小产品？",
    "category": {
      "id": "cat-lounge",
      "slug": "lounge",
      "name": "星际酒馆",
      "description": "生活杂谈、独立开发者日常、摸鱼吹水、思想碰撞",
      "color": "#f59e0b",
      "bgColor": "rgba(245, 158, 11, 0.12)",
      "topicsCount": 3
    },
    "tags": [
      "独立开发",
      "程序员生活",
      "职业反思",
      "心路历程"
    ],
    "author": {
      "id": "user-indie",
      "username": "indie_nomad",
      "name": "星轨独立创作者",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "全栈出海独立开发第 2 年，分享 MRR 增长实战与踩坑记录。",
      "joinedAt": "2024-05-18",
      "likesReceived": 1640,
      "topicsCount": 15,
      "badges": [
        "🚀 深空探索先锋",
        "💰 独立黑客"
      ],
      "location": "清迈 / 大理",
      "website": ""
    },
    "content": "白天在公司写着各种为了汇报而汇报的业务代码，晚上回到家洗个热水澡，泡一杯热茶，打开编辑器写自己真正想用的工具——这是我过去三年对抗职业倦怠最有效的药方。\n\n现在有了 AI 编程助手，一个人真的可以顶一个完整的敏捷团队。从前端 UI 到后端 API，再到产品文案与落地页，一天就能做出 MVP。\n\n大家平时都在写什么独立项目？遇到了什么商业化或者推广瓶颈？来这里畅所欲言！",
    "createdAt": "2026-09-03T05:21:50.375Z",
    "lastActivityAt": "2026-09-05T12:41:50.375Z",
    "views": 11800,
    "likes": 950,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-indie",
        "username": "indie_nomad",
        "name": "星轨独立创作者",
        "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "全栈出海独立开发第 2 年，分享 MRR 增长实战与踩坑记录。",
        "joinedAt": "2024-05-18",
        "likesReceived": 1640,
        "topicsCount": 15,
        "badges": [
          "🚀 深空探索先锋",
          "💰 独立黑客"
        ],
        "location": "清迈 / 大理",
        "website": ""
      },
      {
        "id": "user-promptmaster",
        "username": "promptmaster",
        "name": "调优漫游者",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      },
      {
        "id": "user-current",
        "username": "nan7li",
        "name": "Nan7Li (星舰领航员)",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 4,
        "trustTitle": "猎户座主权官"
      }
    ],
    "replies": [],
    "aiSummary": "作者真诚分享了从大厂“螺丝钉”到找回纯粹编码快乐的心路历程。探讨了在当下大模型降低交付门槛的时代，独立开发如何让人保持对技术的好奇心与自由度。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-7",
    "title": "【开源分享】Orion-Gateway: 高性能多模型 LLM 聚合代理与负载均衡网关，支持流式加速",
    "category": {
      "id": "cat-ai",
      "slug": "ai",
      "name": "人工智能",
      "description": "LLM、DeepSeek、Claude、OpenAI、本地模型部署与 Agent 实践",
      "color": "#8b5cf6",
      "bgColor": "rgba(139, 92, 246, 0.12)",
      "topicsCount": 5
    },
    "tags": [
      "开源项目",
      "Go语言",
      "API网关",
      "负载均衡"
    ],
    "author": {
      "id": "user-cygnus",
      "username": "cygnus",
      "name": "Cygnus_极客",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
      "joinedAt": "2024-02-15",
      "likesReceived": 3420,
      "topicsCount": 38,
      "badges": [
        "🌟 恒星守望者",
        "🤖 AI 先锋",
        "🔥 精华星录"
      ],
      "location": "上海",
      "website": ""
    },
    "content": "市面上的中转网关要么太重，要么在高并发流式推理下延迟激增。于是利用业余时间基于 Go 搓了一个极简、高性能的聚合网关：**Orion-Gateway**。\n\n### ✨ 核心特性\n- ⚡ **零拷贝流式转发**：针对 SSE 流式响应进行了内存池复用，首字时间 (TTFT) 实测降低 40%。\n- 🔄 **智能故障熔断**：多 Key 轮询与阶梯重试，遇到 429 或 500 自动切换健康节点。\n- 📊 **滑动窗口限流**：内置基于 Redis 的高性能 Token 桶。\n\n```bash\n# 极速运行\ndocker run -d \\\n  --name orion-gateway \\\n  -p 8080:8080 \\\n  -e MASTER_KEY=sk-orion-gateway-key \\\n  orion/gateway:latest\n```\n\n欢迎各位星友体验并提 PR！",
    "createdAt": "2026-09-03T08:41:50.375Z",
    "lastActivityAt": "2026-09-05T12:31:50.375Z",
    "views": 9400,
    "likes": 680,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": true,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
        "joinedAt": "2024-02-15",
        "likesReceived": 3420,
        "topicsCount": 38,
        "badges": [
          "🌟 恒星守望者",
          "🤖 AI 先锋",
          "🔥 精华星录"
        ],
        "location": "上海",
        "website": ""
      },
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "作者开源了基于 Go + Fiber 编写的轻量级多模型代理网关，具备零内存拷贝流式转发、多 Key 轮询健康容灾与统一 OpenAI 格式转换。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-8",
    "title": "为什么我把所有私有服务都挂到了 Cloudflare Zero Trust 后面？（附完整 Tunnel 配置指南）",
    "category": {
      "id": "cat-tech",
      "slug": "tech",
      "name": "深空科技",
      "description": "前沿硬件、网络拓扑、数码好物、极客折腾记录",
      "color": "#0284c7",
      "bgColor": "rgba(2, 132, 199, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Cloudflare",
      "ZeroTrust",
      "Tunnel",
      "网络安全"
    ],
    "author": {
      "id": "user-cfninja",
      "username": "cloudflare_ninja",
      "name": "边缘黑客_Ray",
      "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
      "joinedAt": "2024-03-22",
      "likesReceived": 3120,
      "topicsCount": 31,
      "badges": [
        "🌟 恒星守望者",
        "⚡ 边缘计算宗师"
      ],
      "location": "广州",
      "website": ""
    },
    "content": "过去自建服务，最头疼的就是端口暴露给公网。就算改了 SSH 端口，`auth.log` 里每天依然有成千上万次来自全球的暴力破解。\n\n### 现在的终极方案：Cloudflare Tunnel\n1. **服务器完全不需要公网 IP，不开放任何公网入站端口**（连 80/443 都不用开）。\n2. 在服务器上运行 `cloudflared` 守护进程，主动与 Cloudflare 边缘建立双向 TLS 加密隧道。\n3. 外网访问时，必须通过 Cloudflare Access 的邮箱验证码、GitHub OAuth 或员工 SSO。\n\n```bash\n# 安装并创建隧道\ncloudflared tunnel create my-homelab\n# 配置 ingress 路由\ncloudflared tunnel run my-homelab\n```\n\n从此不管是家里没有公网 IPv4 的软路由，还是便宜的内网小鸡，都能安全暴露给指定域名！",
    "createdAt": "2026-09-04T06:21:50.375Z",
    "lastActivityAt": "2026-09-05T12:11:50.375Z",
    "views": 11200,
    "likes": 840,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-cfninja",
        "username": "cloudflare_ninja",
        "name": "边缘黑客_Ray",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
        "joinedAt": "2024-03-22",
        "likesReceived": 3120,
        "topicsCount": 31,
        "badges": [
          "🌟 恒星守望者",
          "⚡ 边缘计算宗师"
        ],
        "location": "广州",
        "website": ""
      },
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      },
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "作者详述了彻底关闭云主机所有入站公网端口，改用 Cloudflare Tunnel + Zero Trust 进行身份验证的方案，告别暴破扫描与证书维护。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-11",
    "title": "Oracle Cloud 甲骨文永久免费云主机防封号指南与 ARM 4C24G 闲置保活自动化脚本",
    "category": {
      "id": "cat-perks",
      "slug": "perks",
      "name": "星际补给",
      "description": "免费 API 额度、开源公益服务、云厂商优惠券与邀请码",
      "color": "#ec4899",
      "bgColor": "rgba(236, 72, 153, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "OracleCloud",
      "甲骨文云",
      "免费VPS",
      "保活脚本"
    ],
    "author": {
      "id": "user-cfninja",
      "username": "cloudflare_ninja",
      "name": "边缘黑客_Ray",
      "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
      "joinedAt": "2024-03-22",
      "likesReceived": 3120,
      "topicsCount": 31,
      "badges": [
        "🌟 恒星守望者",
        "⚡ 边缘计算宗师"
      ],
      "location": "广州",
      "website": ""
    },
    "content": "甲骨文云的 4核 24GB ARM 免费实例堪称云厂商最大方羊毛，但许多人因为 CPU 长期利用率低于 20% 被官方自动收回。\n\n### 防回收规则官方要求：\n- 7天内 CPU 利用率 95 百分位数低于 20%\n- 网络利用率低于 20%\n- 内存利用率低于 20%（针对 ARM 资源池）\n\n### 轻量保活脚本（利用 Python 间歇性计算）：\n```bash\n# 避免使用死循环把机器跑死，采用定时轻量计算\ncurl -sSL https://raw.githubusercontent.com/orion-nebula/keepalive/main/setup.sh | bash\n```\n\n**切记**：千万不要去注册几十个号或者频繁更换信用卡，甲骨文风控主要靠支付网关与 IP 关联！",
    "createdAt": "2026-09-03T02:01:50.375Z",
    "lastActivityAt": "2026-09-05T12:01:50.375Z",
    "views": 17800,
    "likes": 1290,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-cfninja",
        "username": "cloudflare_ninja",
        "name": "边缘黑客_Ray",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
        "joinedAt": "2024-03-22",
        "likesReceived": 3120,
        "topicsCount": 31,
        "badges": [
          "🌟 恒星守望者",
          "⚡ 边缘计算宗师"
        ],
        "location": "广州",
        "website": ""
      },
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      },
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "深度解析甲骨文云免费层回收机制，提供安全合规的 CPU/内存轻量负载模拟脚本，防止实例因长期闲置被系统强行终止。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-14",
    "title": "【开源推荐】Tailscale + Headscale 自建全平台私有异地组网实战指南",
    "category": {
      "id": "cat-resources",
      "slug": "resources",
      "name": "星图资源",
      "description": "开源神器、实用工具脚本、Docker 镜像与效率利器",
      "color": "#06b6d4",
      "bgColor": "rgba(6, 182, 212, 0.12)",
      "topicsCount": 3
    },
    "tags": [
      "Tailscale",
      "Headscale",
      "组网神器",
      "WireGuard"
    ],
    "author": {
      "id": "user-terminal",
      "username": "terminal_poet",
      "name": "终端极客_Echo",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
      "joinedAt": "2024-07-02",
      "likesReceived": 940,
      "topicsCount": 11,
      "badges": [
        "🚀 深空探索先锋",
        "⌨️ 终端诗人"
      ],
      "location": "南京",
      "website": ""
    },
    "content": "Tailscale 凭借其基于 WireGuard 的自动化 NAT 打洞与点对点虚拟网络征服了无数极客。然而官方免费版有节点数量限制，且控制器架设在海外。\n\n**Headscale** 是 Tailscale 控制服务器的纯开源实现：\n- 节点数无上限\n- 客户端完全复用官方跨平台 App（iOS, Android, macOS, Windows, Linux）\n- 数据完全自主掌控\n\n只需一台带公网 IP 的便宜轻量云主机，跑一个 Docker 镜像即可搞定！",
    "createdAt": "2026-09-02T16:01:50.375Z",
    "lastActivityAt": "2026-09-05T11:41:50.375Z",
    "views": 8900,
    "likes": 670,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
        "joinedAt": "2024-07-02",
        "likesReceived": 940,
        "topicsCount": 11,
        "badges": [
          "🚀 深空探索先锋",
          "⌨️ 终端诗人"
        ],
        "location": "南京",
        "website": ""
      },
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "手把手教你使用轻量开源控制器 Headscale 替代官方服务，零成本组建基于 WireGuard 的私有虚拟内网，实现多设备互通与 DERP 中继搭建。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-9",
    "title": "Linux 生产服务器高并发内核网络参数终极优化配置（sysctl.conf 复制即用）",
    "category": {
      "id": "cat-dev",
      "slug": "dev",
      "name": "开发调优",
      "description": "全栈架构、代码重构、Serverless、Linux 性能调优",
      "color": "#10b981",
      "bgColor": "rgba(16, 185, 129, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Linux调优",
      "sysctl",
      "高并发",
      "TCP优化"
    ],
    "author": {
      "id": "user-linusfan",
      "username": "linusfan",
      "name": "纯血运维漫游者",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
      "joinedAt": "2024-05-01",
      "likesReceived": 820,
      "topicsCount": 16,
      "badges": [
        "🚀 深空探索先锋",
        "🐧 Linux 极客"
      ],
      "location": "深圳",
      "website": ""
    },
    "content": "默认的 Linux 内核参数主要是面向桌面与低配机器的。一旦面对数万级并发连接，常出现 `TCP: drop open request from...` 错误。\n\n分享一份我们生产环境压测验证过的 `/etc/sysctl.conf`：\n\n```ini\n# 提高文件句柄与队列上限\nfs.file-max = 2097152\nnet.core.somaxconn = 32768\nnet.core.netdev_max_backlog = 16384\n\n# TCP 端口范围与 TIME_WAIT 快速回收\nnet.ipv4.ip_local_port_range = 1024 65535\nnet.ipv4.tcp_tw_reuse = 1\nnet.ipv4.tcp_fin_timeout = 15\n\n# 内存与拥塞算法 (BBR)\nnet.core.default_qdisc = fq\nnet.ipv4.tcp_congestion_control = bbr\nnet.ipv4.tcp_max_syn_backlog = 16384\n```\n\n生效命令：`sysctl -p`，立竿见影！",
    "createdAt": "2026-09-03T20:21:50.375Z",
    "lastActivityAt": "2026-09-05T11:31:50.375Z",
    "views": 8700,
    "likes": 640,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
        "joinedAt": "2024-05-01",
        "likesReceived": 820,
        "topicsCount": 16,
        "badges": [
          "🚀 深空探索先锋",
          "🐧 Linux 极客"
        ],
        "location": "深圳",
        "website": ""
      },
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "总结了面向高并发 Web 服务器与反向代理节点的常用 Linux 内核 TCP 参数配置，解决 TIME_WAIT 过多、端口耗尽与连接队列溢出问题。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-17",
    "title": "Claude 3.7 Sonnet 混合思考模式体验：Agent 架构设计与复杂任务表现",
    "category": {
      "id": "cat-ai",
      "slug": "ai",
      "name": "人工智能",
      "description": "LLM、DeepSeek、Claude、OpenAI、本地模型部署与 Agent 实践",
      "color": "#8b5cf6",
      "bgColor": "rgba(139, 92, 246, 0.12)",
      "topicsCount": 5
    },
    "tags": [
      "Claude3.7",
      "AI大模型",
      "思考模式",
      "Agent开发"
    ],
    "author": {
      "id": "user-promptmaster",
      "username": "promptmaster",
      "name": "调优漫游者",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "研究 Claude 3.7 / DeepSeek-R1 最佳提示词结构与 Agentic 工作流。",
      "joinedAt": "2024-06-12",
      "likesReceived": 670,
      "topicsCount": 12,
      "badges": [
        "🚀 深空探索先锋",
        "✨ Prompt 调优师"
      ],
      "location": "",
      "website": ""
    },
    "content": "Claude 3.7 Sonnet 最大的革新在于“混合模式”：用户可以自由控制思考预算 (Thinking Budget)，从快速问答到深度推演无缝切换。\n\n在进行大型单测补全任务时，给它配置 8,000 tokens 的 thinking budget，它会主动对潜在的竞态条件进行反向推演，代码一次通过率达到了惊人的 89%！",
    "createdAt": "2026-09-02T21:01:50.375Z",
    "lastActivityAt": "2026-09-05T11:21:50.375Z",
    "views": 12100,
    "likes": 910,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-promptmaster",
        "username": "promptmaster",
        "name": "调优漫游者",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "研究 Claude 3.7 / DeepSeek-R1 最佳提示词结构与 Agentic 工作流。",
        "joinedAt": "2024-06-12",
        "likesReceived": 670,
        "topicsCount": 12,
        "badges": [
          "🚀 深空探索先锋",
          "✨ Prompt 调优师"
        ],
        "location": "",
        "website": ""
      },
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "实测 Claude 3.7 Sonnet 动态扩展思维（Hybrid Reasoning）在长跨度代码重构和多工具链编排场景下的表现，探讨何时启用深度思考。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-15",
    "title": "打造万兆家庭内网与 Homelab 拓扑架构：从二手企业交换机到 PVE 虚拟化",
    "category": {
      "id": "cat-tech",
      "slug": "tech",
      "name": "深空科技",
      "description": "前沿硬件、网络拓扑、数码好物、极客折腾记录",
      "color": "#0284c7",
      "bgColor": "rgba(2, 132, 199, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Homelab",
      "PVE",
      "万兆内网",
      "软路由"
    ],
    "author": {
      "id": "user-linusfan",
      "username": "linusfan",
      "name": "纯血运维漫游者",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
      "joinedAt": "2024-05-01",
      "likesReceived": 820,
      "topicsCount": 16,
      "badges": [
        "🚀 深空探索先锋",
        "🐧 Linux 极客"
      ],
      "location": "深圳",
      "website": ""
    },
    "content": "折腾 Homelab 是一条没有尽头的快乐之路。\n\n### 目前核心设备清单：\n1. **主算力机**：AMD 5950X + 128G ECC RAM + Intel X520 双口万兆光卡，运行 Proxmox VE 8.x。\n2. **交换机**：二手华为 S5720 24口千兆 + 4口万兆 SFP+，咸鱼 280 包邮。\n3. **存储机**：8 盘位定制 NAS，TrueNAS SCALE，RAIDZ2 阵列。\n\n内网各机器之间备份大文件跑满 1.1GB/s，剪辑 4K 视频直接在 NAS 上剪毫无卡顿！",
    "createdAt": "2026-09-02T02:41:50.375Z",
    "lastActivityAt": "2026-09-05T10:41:50.375Z",
    "views": 10600,
    "likes": 820,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 2,
    "participants": [
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
        "joinedAt": "2024-05-01",
        "likesReceived": 820,
        "topicsCount": 16,
        "badges": [
          "🚀 深空探索先锋",
          "🐧 Linux 极客"
        ],
        "location": "深圳",
        "website": ""
      },
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "作者分享了历时半年迭代的家庭万兆网络与 Homelab 私有云机柜，包括 Proxmox VE 多节点集群、ZFS 阵列扩容与低功耗散热心得。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-16",
    "title": "Next.js 14 App Router 在大型社区项目中的踩坑与 SSR 缓存调优心得",
    "category": {
      "id": "cat-dev",
      "slug": "dev",
      "name": "开发调优",
      "description": "全栈架构、代码重构、Serverless、Linux 性能调优",
      "color": "#10b981",
      "bgColor": "rgba(16, 185, 129, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Next.js",
      "React",
      "SSR",
      "前端架构"
    ],
    "author": {
      "id": "user-vortix",
      "username": "vortix",
      "name": "VortiX_后端",
      "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "Golang / Rust / 分布式高并发微服务与单体重构践行者。",
      "joinedAt": "2024-03-10",
      "likesReceived": 1890,
      "topicsCount": 24,
      "badges": [
        "🌟 恒星守望者",
        "⚡ 性能怪兽"
      ],
      "location": "北京",
      "website": ""
    },
    "content": "我们在重构 Orion 社区前端时，踩了一周 Next.js App Router 缓存的坑。\n\n### 黄金经验：\n1. **Dynamic Functions 传染性**：一旦在页面根部调用 `cookies()` 或 `headers()`，整棵子树退化为动态计算。尽量将这类逻辑下沉到 Client 叶子组件中。\n2. **正确利用 Suspense**：把慢请求和用户登入态独立包裹在 `<Suspense fallback={...}>` 中，实现核心页面框架的瞬间首屏秒开。",
    "createdAt": "2026-09-02T06:01:50.375Z",
    "lastActivityAt": "2026-09-05T10:01:50.375Z",
    "views": 7800,
    "likes": 540,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "Golang / Rust / 分布式高并发微服务与单体重构践行者。",
        "joinedAt": "2024-03-10",
        "likesReceived": 1890,
        "topicsCount": 24,
        "badges": [
          "🌟 恒星守望者",
          "⚡ 性能怪兽"
        ],
        "location": "北京",
        "website": ""
      }
    ],
    "replies": [],
    "aiSummary": "深入分析 Next.js 14 App Router 下 RSC 服务端组件与客户端状态通信、Fetch Data Cache 命中陷阱以及如何避免全量路由退化为动态渲染。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-18",
    "title": "整理了一套自己用了 5 年的 Linux 终端开箱即用配置（Zsh + Starship + Zellij + Fzf）",
    "category": {
      "id": "cat-resources",
      "slug": "resources",
      "name": "星图资源",
      "description": "开源神器、实用工具脚本、Docker 镜像与效率利器",
      "color": "#06b6d4",
      "bgColor": "rgba(6, 182, 212, 0.12)",
      "topicsCount": 3
    },
    "tags": [
      "终端神器",
      "Zsh",
      "Starship",
      "Linux生产力"
    ],
    "author": {
      "id": "user-terminal",
      "username": "terminal_poet",
      "name": "终端极客_Echo",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
      "joinedAt": "2024-07-02",
      "likesReceived": 940,
      "topicsCount": 11,
      "badges": [
        "🚀 深空探索先锋",
        "⌨️ 终端诗人"
      ],
      "location": "南京",
      "website": ""
    },
    "content": "每次装新机器，第一件事就是拉这套 dotfiles：\n\n- **Starship**：纯 Rust 开发，几毫秒渲染 Git 状态与执行耗时，彻底告别臃肿的 oh-my-zsh 启动延迟。\n- **Zellij**：比 Tmux 更好看、开箱即用的分屏神器，支持浮动终端和可视化标签栏。\n- **Fzf + Zoxide**：智能模糊跳转，输入 `z proj` 瞬间跨目录穿梭。\n\n一键安装脚本已发布至 GitHub，欢迎 Star！",
    "createdAt": "2026-09-01T18:21:50.375Z",
    "lastActivityAt": "2026-09-05T09:01:50.375Z",
    "views": 9200,
    "likes": 740,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
        "joinedAt": "2024-07-02",
        "likesReceived": 940,
        "topicsCount": 11,
        "badges": [
          "🚀 深空探索先锋",
          "⌨️ 终端诗人"
        ],
        "location": "南京",
        "website": ""
      },
      {
        "id": "user-matrix",
        "username": "matrix_walker",
        "name": "矩阵漫步者",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "开源自用的跨平台终端配置，包含基于 Rust 的 Starship 极速提示符、Zellij 现代分屏终端复用器以及 Fzf 历史命令模糊检索。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-20",
    "title": "独立开发出海第 120 天：从零到第一笔 $99 美元 Stripe 入账的真实感悟",
    "category": {
      "id": "cat-lounge",
      "slug": "lounge",
      "name": "星际酒馆",
      "description": "生活杂谈、独立开发者日常、摸鱼吹水、思想碰撞",
      "color": "#f59e0b",
      "bgColor": "rgba(245, 158, 11, 0.12)",
      "topicsCount": 3
    },
    "tags": [
      "出海创业",
      "Stripe",
      "独立开发",
      "商业化"
    ],
    "author": {
      "id": "user-indie",
      "username": "indie_nomad",
      "name": "星轨独立创作者",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "全栈出海独立开发第 2 年，分享 MRR 增长实战与踩坑记录。",
      "joinedAt": "2024-05-18",
      "likesReceived": 1640,
      "topicsCount": 15,
      "badges": [
        "🚀 深空探索先锋",
        "💰 独立黑客"
      ],
      "location": "清迈 / 大理",
      "website": ""
    },
    "content": "今天凌晨 3 点半，手机震动收到了来自 Stripe 的推送：`You received a new payment of $99.00`。\n\n虽然金额不大，但这是我人生中第一次通过互联网向一个从未谋面的海外陌生人提供价值并获得报酬。\n\n### 三点血泪经验：\n1. **不要闭门造车**：在写第一行代码前，去 Reddit 搜索相关的痛点帖子，如果没人吐槽，说明没人愿意为之付费。\n2. **定价要自信**：很多人做独立开发习惯收 $5 甚至免费，欧美用户更看重工具能否帮他们节省时间，敢于定高客单价。\n3. **分发大于产品**：把 50% 的精力花在内容营销与渠道触达上。",
    "createdAt": "2026-09-01T03:21:50.375Z",
    "lastActivityAt": "2026-09-05T07:21:50.375Z",
    "views": 13200,
    "likes": 1080,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-indie",
        "username": "indie_nomad",
        "name": "星轨独立创作者",
        "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "全栈出海独立开发第 2 年，分享 MRR 增长实战与踩坑记录。",
        "joinedAt": "2024-05-18",
        "likesReceived": 1640,
        "topicsCount": 15,
        "badges": [
          "🚀 深空探索先锋",
          "💰 独立黑客"
        ],
        "location": "清迈 / 大理",
        "website": ""
      },
      {
        "id": "user-neo",
        "username": "neo",
        "name": "Neo (星舰引航者)",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 4,
        "trustTitle": "猎户座主权官 / 创世领航员"
      }
    ],
    "replies": [],
    "aiSummary": "作者记录了打造一款垂直类 AI 工具的出海全过程：从 Product Hunt 冷启动、Reddit 真实用户回访，到凌晨收到第一笔付费邮件的兴奋与思考。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-21",
    "title": "2026 年自建智能家居 Home Assistant 与 Zigbee2MQTT 网关避坑实录",
    "category": {
      "id": "cat-tech",
      "slug": "tech",
      "name": "深空科技",
      "description": "前沿硬件、网络拓扑、数码好物、极客折腾记录",
      "color": "#0284c7",
      "bgColor": "rgba(2, 132, 199, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "HomeAssistant",
      "智能家居",
      "Zigbee",
      "物联网"
    ],
    "author": {
      "id": "user-linusfan",
      "username": "linusfan",
      "name": "纯血运维漫游者",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
      "joinedAt": "2024-05-01",
      "likesReceived": 820,
      "topicsCount": 16,
      "badges": [
        "🚀 深空探索先锋",
        "🐧 Linux 极客"
      ],
      "location": "深圳",
      "website": ""
    },
    "content": "不想被米家、涂鸦或者 HomeKit 绑架，自建 Home Assistant 是唯一终极解法。\n\n用一个德胜或者 Sonoff 的 CC2652P Zigbee USB 协调器，刷好开源固件，配合 Zigbee2MQTT，几百种不同品牌的传感器几秒内接入，断网也能本地执行联动自动化！",
    "createdAt": "2026-08-31T17:21:50.375Z",
    "lastActivityAt": "2026-09-05T06:31:50.375Z",
    "views": 7400,
    "likes": 510,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "Debian 精品主义者，VPS 晚高峰线路测速狂魔，BBR 调优师傅。",
        "joinedAt": "2024-05-01",
        "likesReceived": 820,
        "topicsCount": 16,
        "badges": [
          "🚀 深空探索先锋",
          "🐧 Linux 极客"
        ],
        "location": "深圳",
        "website": ""
      },
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "分享如何摆脱各大家电厂商的封闭生态，通过 Docker 部署 Home Assistant 与开放 Zigbee 协议，实现全屋温湿度、灯光与门锁的无公网纯内网联动。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-22",
    "title": "用 Rust 写了一个极简高性能的反向代理与静态资源服务器，内存占用仅 8MB",
    "category": {
      "id": "cat-dev",
      "slug": "dev",
      "name": "开发调优",
      "description": "全栈架构、代码重构、Serverless、Linux 性能调优",
      "color": "#10b981",
      "bgColor": "rgba(16, 185, 129, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "Rust",
      "反向代理",
      "高性能",
      "网络编程"
    ],
    "author": {
      "id": "user-rust",
      "username": "rust_stellar",
      "name": "锈迹星辰",
      "avatar": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "Rustaceans. 追求极致性能与内存安全，开源反代与并发工具维护者。",
      "joinedAt": "2024-06-01",
      "likesReceived": 1290,
      "topicsCount": 14,
      "badges": [
        "🚀 深空探索先锋",
        "🦀 Rust 先锋"
      ],
      "location": "武汉",
      "website": ""
    },
    "content": "在 512MB 内存的小机上跑 Nginx 或 Caddy，光是基础进程就吃掉三四十兆。\n\n基于 Rust 写了一个专为极低资源服务器设计的反代工具：\n- 零额外依赖，静态编译单个可执行文件\n- 支持零拷贝代理上游 HTTP/1.1 与 HTTP/2\n- 内存占用恒定在 8MB 左右\n\n源码已开源，适合把玩！",
    "createdAt": "2026-08-31T14:01:50.375Z",
    "lastActivityAt": "2026-09-05T05:41:50.375Z",
    "views": 8600,
    "likes": 670,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-rust",
        "username": "rust_stellar",
        "name": "锈迹星辰",
        "avatar": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "Rustaceans. 追求极致性能与内存安全，开源反代与并发工具维护者。",
        "joinedAt": "2024-06-01",
        "likesReceived": 1290,
        "topicsCount": 14,
        "badges": [
          "🚀 深空探索先锋",
          "🦀 Rust 先锋"
        ],
        "location": "武汉",
        "website": ""
      },
      {
        "id": "user-vortix",
        "username": "vortix",
        "name": "VortiX_后端",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "基于 Tokio 与 Hyper 打造的轻量级反代服务，内存占用低至 8MB，自带 ACME 自动申请证书与 Brotli 压缩，非常适合百兆小内存 VPS。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-23",
    "title": "收集汇总几个依然稳定可用的免费 SSL 证书申请方案（ACME / Let's Encrypt 自动化）",
    "category": {
      "id": "cat-perks",
      "slug": "perks",
      "name": "星际补给",
      "description": "免费 API 额度、开源公益服务、云厂商优惠券与邀请码",
      "color": "#ec4899",
      "bgColor": "rgba(236, 72, 153, 0.12)",
      "topicsCount": 4
    },
    "tags": [
      "免费SSL",
      "ACME",
      "HTTPS",
      "网络安全"
    ],
    "author": {
      "id": "user-cfninja",
      "username": "cloudflare_ninja",
      "name": "边缘黑客_Ray",
      "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
      "joinedAt": "2024-03-22",
      "likesReceived": 3120,
      "topicsCount": 31,
      "badges": [
        "🌟 恒星守望者",
        "⚡ 边缘计算宗师"
      ],
      "location": "广州",
      "website": ""
    },
    "content": "推荐使用 `acme.sh` 脚本自动化签发，支持 DNS API 验证泛域名：\n\n```bash\n# 切换默认 CA 为 Google 或 Let's Encrypt\nacme.sh --set-default-ca --server letsencrypt\n# 申请泛域名证书并自动部署\nacme.sh --issue --dns dns_cf -d example.com -d '*.example.com'\n```\n\n配置好 Crontab，证书到期前 30 天自动静默续签，永不过期！",
    "createdAt": "2026-08-31T09:01:50.375Z",
    "lastActivityAt": "2026-09-05T04:51:50.375Z",
    "views": 9900,
    "likes": 720,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-cfninja",
        "username": "cloudflare_ninja",
        "name": "边缘黑客_Ray",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "把 Cloudflare Workers, Pages, D1, Zero Trust 玩出花来的边缘计算狂热粉。",
        "joinedAt": "2024-03-22",
        "likesReceived": 3120,
        "topicsCount": 31,
        "badges": [
          "🌟 恒星守望者",
          "⚡ 边缘计算宗师"
        ],
        "location": "广州",
        "website": ""
      }
    ],
    "replies": [],
    "aiSummary": "梳理了主流免费 SSL 证书提供商（Let's Encrypt、ZeroSSL、Google Trust Services）的自动化申请与续期方式，告别手动上传证书烦恼。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-24",
    "title": "程序员办公桌面好物推荐：客制化静电容键盘与人体工学椅避坑总结",
    "category": {
      "id": "cat-lounge",
      "slug": "lounge",
      "name": "星际酒馆",
      "description": "生活杂谈、独立开发者日常、摸鱼吹水、思想碰撞",
      "color": "#f59e0b",
      "bgColor": "rgba(245, 158, 11, 0.12)",
      "topicsCount": 3
    },
    "tags": [
      "数码好物",
      "键盘",
      "人体工学",
      "极客生活"
    ],
    "author": {
      "id": "user-terminal",
      "username": "terminal_poet",
      "name": "终端极客_Echo",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 2,
      "trustTitle": "深空探索先锋",
      "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
      "joinedAt": "2024-07-02",
      "likesReceived": 940,
      "topicsCount": 11,
      "badges": [
        "🚀 深空探索先锋",
        "⌨️ 终端诗人"
      ],
      "location": "南京",
      "website": ""
    },
    "content": "年轻时觉得一把 50 块钱的双飞燕就能写代码，到了 30 岁颈椎和手腕开始算总账。\n\n### 真正带来改变的三件装备：\n1. **HHKB / Niz 静电容键盘**：如棉花糖般的触发回弹，一天敲几万行代码手指完全不酸。\n2. **罗技垂直鼠标 / 轨迹球**：彻底治好了我的鼠标手（腕管综合征）。\n3. **升降桌**：坐 45 分钟站 15 分钟，腰椎压力直接降半。\n\n健康永远是极客探索宇宙的第一本钱！",
    "createdAt": "2026-08-31T00:41:50.375Z",
    "lastActivityAt": "2026-09-05T04:01:50.375Z",
    "views": 11400,
    "likes": 890,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-terminal",
        "username": "terminal_poet",
        "name": "终端极客_Echo",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋",
        "bio": "离不开命令行，Vim/Neovim、Zsh、Tmux 极简主义爱好者。",
        "joinedAt": "2024-07-02",
        "likesReceived": 940,
        "topicsCount": 11,
        "badges": [
          "🚀 深空探索先锋",
          "⌨️ 终端诗人"
        ],
        "location": "南京",
        "website": ""
      },
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长"
      }
    ],
    "replies": [],
    "aiSummary": "作者分享了历时多年亲测的拯救颈椎与手腕桌面外设清单，涵盖静电容键盘、分体式立式鼠标与气压升降桌的实际选购建议。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  },
  {
    "id": "topic-25",
    "title": "极简自托管书签导航与 RSS 阅读器方案推荐（Docker 一键部署）",
    "category": {
      "id": "cat-resources",
      "slug": "resources",
      "name": "星图资源",
      "description": "开源神器、实用工具脚本、Docker 镜像与效率利器",
      "color": "#06b6d4",
      "bgColor": "rgba(6, 182, 212, 0.12)",
      "topicsCount": 3
    },
    "tags": [
      "开源工具",
      "RSS阅读",
      "书签导航",
      "自托管"
    ],
    "author": {
      "id": "user-cygnus",
      "username": "cygnus",
      "name": "Cygnus_极客",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "trustLevel": 3,
      "trustTitle": "星域巡航舰长",
      "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
      "joinedAt": "2024-02-15",
      "likesReceived": 3420,
      "topicsCount": 38,
      "badges": [
        "🌟 恒星守望者",
        "🤖 AI 先锋",
        "🔥 精华星录"
      ],
      "location": "上海",
      "website": ""
    },
    "content": "面对铺天盖地的信息茧房与算法推荐，重回 RSS 是找回高信噪比阅读的最佳方式。\n\n- **Miniflux**：极简 Go 语言编写，内存占用仅 15MB，配合 iOS/Android 客户端 NetNewsWire体验拉满。\n- **Homepage**：极度美观的自托管导航页，自动集成 Docker 状态监控与天气小组件。\n\n一行 Docker Compose 即可拥有属于自己的星际控制台！",
    "createdAt": "2026-08-30T16:21:50.375Z",
    "lastActivityAt": "2026-09-05T03:11:50.375Z",
    "views": 8300,
    "likes": 610,
    "isLiked": false,
    "isBookmarked": false,
    "isPinned": false,
    "isFeatured": false,
    "isClosed": false,
    "repliesCount": 1,
    "participants": [
      {
        "id": "user-cygnus",
        "username": "cygnus",
        "name": "Cygnus_极客",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 3,
        "trustTitle": "星域巡航舰长",
        "bio": "折腾一切好玩的技术，大模型应用落地与高并发网关实战中。",
        "joinedAt": "2024-02-15",
        "likesReceived": 3420,
        "topicsCount": 38,
        "badges": [
          "🌟 恒星守望者",
          "🤖 AI 先锋",
          "🔥 精华星录"
        ],
        "location": "上海",
        "website": ""
      },
      {
        "id": "user-linusfan",
        "username": "linusfan",
        "name": "纯血运维漫游者",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "trustLevel": 2,
        "trustTitle": "深空探索先锋"
      }
    ],
    "replies": [],
    "aiSummary": "推荐基于 Docker 部署的轻量开源个人仪表盘 Homepage 与现代 RSS 阅读器 Miniflux，打造属于自己的无干扰信息获取阵地。",
    "reactions": [
      {
        "emoji": "❤️",
        "count": 1,
        "users": [
          "user-cygnus"
        ]
      },
      {
        "emoji": "🚀",
        "count": 1,
        "users": [
          "user-neo"
        ]
      },
      {
        "emoji": "👍",
        "count": 1,
        "users": [
          "user-vortix"
        ]
      }
    ]
  }
];
