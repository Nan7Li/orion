-- Orion community: X-style posts, communities, social graph

create table if not exists profiles (
  user_id text primary key,
  handle text not null unique,
  display_name text not null,
  bio text not null default '',
  avatar_hue integer not null default 200,
  location text not null default '',
  website text not null default '',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists communities (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  rules text not null default '',
  accent text not null default 'sky',
  member_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists community_members (
  community_id text not null references communities(id) on delete cascade,
  user_id text not null,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table if not exists posts (
  id text primary key,
  user_id text not null,
  community_id text references communities(id) on delete set null,
  body text not null,
  parent_id text references posts(id) on delete cascade,
  quote_id text references posts(id) on delete set null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_idx on posts (created_at desc);
create index if not exists posts_parent_idx on posts (parent_id);
create index if not exists posts_user_idx on posts (user_id, created_at desc);
create index if not exists posts_community_idx on posts (community_id, created_at desc);

create table if not exists likes (
  user_id text not null,
  post_id text not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists reposts (
  user_id text not null,
  post_id text not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists bookmarks (
  user_id text not null,
  post_id text not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists follows (
  follower_id text not null,
  followee_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id)
);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  actor_id text not null,
  kind text not null,
  post_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

insert into profiles (user_id, handle, display_name, bio, avatar_hue, location, website, verified, created_at) values
  ('orion', 'nan7li', 'Nan7Li', 'Orion 领航员。全栈，终身学习者。连接思想，星辰大海。', 210, 'Taipei', 'https://nan77a.com', true, now() - interval '400 days'),
  ('cygnus', 'cygnus', '天鹅座', '模型炼丹、本地部署、Agent 编排。把 GPU 榨干是一种修养。', 265, 'Shanghai', '', true, now() - interval '220 days'),
  ('neo', 'neo', 'Neo', '独立开发者。白天写 TypeScript，晚上修 Homelab。', 160, 'Shenzhen', '', false, now() - interval '180 days'),
  ('vortix', 'vortix', 'Vortix', '边缘计算与网络。Cloudflare、WireGuard、VPS 线路强迫症。', 32, 'Tokyo', '', false, now() - interval '150 days'),
  ('mira', 'mira', 'Mira', '产品与设计。把复杂的系统做成一张干净的卡片。', 330, 'Hangzhou', '', false, now() - interval '90 days'),
  ('kai', 'kai', '开', 'Linux 调优、容器、从零搭一套能睡觉的监控。', 48, 'Chengdu', '', false, now() - interval '60 days')
on conflict (user_id) do nothing;

insert into communities (id, slug, name, description, rules, accent, member_count) values
  ('c-ai', 'ai', '人工智能', 'LLM、本地模型、Agent 与评测。少口号，多实测。', '讨论请附模型名、量化方式和硬件配置。禁止搬运无出处的基准数字。', 'violet', 12840),
  ('c-dev', 'dev', '开发调优', '全栈架构、性能、Serverless、代码卫生。', '贴代码用围栏。描述复现步骤。对事不对人。', 'emerald', 9620),
  ('c-tech', 'tech', '深空科技', '硬件、网络、数码与极客折腾记录。', '晒机可以，广告不行。附型号和价格更有用。', 'sky', 7410),
  ('c-perks', 'perks', '星际补给', 'API 额度、公益服务、云厂商券与邀请。', '先说明来源与限制。禁止盗号、滥用与倒卖。', 'rose', 5830),
  ('c-lab', 'lab', '星图资源', '开源工具、脚本、镜像与效率利器。', '分享请带仓库链接与许可。注明自己是否维护。', 'cyan', 4200),
  ('c-lounge', 'lounge', '星际酒馆', '生活、独立开发日常、摸鱼与思想碰撞。', '友善。可以吐槽，不要人身攻击。', 'amber', 15120),
  ('c-notice', 'notice', '星舰通标', 'Orion 公约、版本说明与官方公告。', '本社区由领航员维护，讨论保持克制。', 'red', 2200)
on conflict (id) do nothing;

insert into community_members (community_id, user_id, role) values
  ('c-notice', 'orion', 'mod'),
  ('c-ai', 'orion', 'member'),
  ('c-ai', 'cygnus', 'mod'),
  ('c-dev', 'neo', 'mod'),
  ('c-tech', 'vortix', 'mod'),
  ('c-lounge', 'mira', 'member'),
  ('c-lab', 'kai', 'mod'),
  ('c-perks', 'orion', 'mod'),
  ('c-dev', 'orion', 'member'),
  ('c-tech', 'kai', 'member')
on conflict do nothing;

insert into follows (follower_id, followee_id) values
  ('cygnus', 'orion'),
  ('neo', 'orion'),
  ('vortix', 'orion'),
  ('mira', 'orion'),
  ('kai', 'orion'),
  ('neo', 'cygnus'),
  ('mira', 'neo'),
  ('kai', 'vortix'),
  ('orion', 'cygnus')
on conflict do nothing;

insert into posts (id, user_id, community_id, body, parent_id, quote_id, is_pinned, created_at) values
  ('p-welcome', 'orion', 'c-notice',
   E'欢迎降落 Orion。\n\n这里不是灌水区，是给开发者、独立创作者和 AI 探索者的社区。求真、开源、对事不对人。\n\n公约三条：友善、给上下文、注明出处。加入一个社区，从一条认真的帖子开始。\n\n#Orion',
   null, null, true, now() - interval '6 days'),
  ('p-edge', 'orion', 'c-notice',
   E'基础设施说明：时间线、注册和发帖都走边缘数据库，全球就近读写。\n\n账号用邮箱或 X / Google 都可以。密码加盐存储，会话在你的设备上。如果时间线卡住，下拉刷新即可。\n\n#Cloudflare',
   null, null, true, now() - interval '5 days'),
  ('p-r1', 'cygnus', 'c-ai',
   E'DeepSeek-R1 32B 蒸馏版，双 4090 + vLLM AWQ：\n\n• 单卡显存约 18.5GB\n• 单请求 42 tok/s\n• thinking 阶段很稳，几乎不抖\n\n671B Q4 在 512GB 内存上混卸大概 3.5 tok/s，能跑但没必要。个人工位选 32B。\n\n启动命令丢在回复里。 #DeepSeek #vLLM',
   null, null, false, now() - interval '2 days 4 hours'),
  ('p-r1-cmd', 'cygnus', 'c-ai',
   E'```\nvllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B \\\n  --tensor-parallel-size 2 \\\n  --gpu-memory-utilization 0.92 \\\n  --max-model-len 16384 \\\n  --quantization awq\n```\n\n`--enforce-eager` 在长思维链上更稳，吞吐会掉一点。',
   'p-r1', null, false, now() - interval '2 days 3 hours'),
  ('p-r1-reply', 'neo', 'c-ai',
   '32B 对我这种写业务的已经够用。671B 更像实验室玩具。你这套 AWQ 配置我今晚就搬去工位。',
   'p-r1', null, false, now() - interval '2 days 2 hours'),
  ('p-cursor', 'mira', 'c-ai',
   E'Cursor 最有用的不是模型，是约束。团队 `.cursorrules` 四条：\n\n1. 最小侵入，不重写无关函数\n2. 原注释必须留着\n3. 新代码禁止 any\n4. 异步必须有错误路径\n\n模型一自作聪明，这四条就能把它拉回来。你们还加了什么？\n\n#Cursor #ClaudeCode',
   null, null, false, now() - interval '1 day 14 hours'),
  ('p-cursor-r', 'kai', 'c-ai',
   '再加一条：不要擅自升级依赖。Agent 特别爱把 lockfile 改成「看起来更新」的版本。',
   'p-cursor', null, false, now() - interval '1 day 12 hours'),
  ('p-cf', 'vortix', 'c-dev',
   E'把论坛当静态站部署在 Pages 上，动态全丢给 Edge Functions，是目前最省事的个人社区架构。\n\n坑：D1 的延迟在跨区写入时会抖。读多写少的时间线没问题，点赞计数要接受短暂不一致。\n\n#Cloudflare #Serverless',
   null, null, false, now() - interval '22 hours'),
  ('p-lab', 'kai', 'c-lab',
   E'Homelab 最小监控三件套：Prometheus + Grafana + 一个会叫的 Alertmanager。\n\n别一上来上全套可观测。先盯磁盘、温度和证书过期，能让你少起夜三次。\n\n仓库过两天开源。 #Homelab #Linux',
   null, null, false, now() - interval '18 hours'),
  ('p-perk', 'orion', 'c-perks',
   E'开发者体验计划开了一小批额度，给认真在社区里说话的人。\n\n规则：在本帖认真介绍你正在做的项目，或你对 Orion 的一条具体建议。脚本号直接跳过。\n\n#星际补给',
   null, null, false, now() - interval '16 hours'),
  ('p-perk-r', 'neo', 'c-perks',
   '我在做一套给独立开发者用的账单看板，对接 Stripe 和加密货币。社区如果能把「正在做什么」做成时间线置顶就好了。',
   'p-perk', null, false, now() - interval '15 hours'),
  ('p-wire', 'vortix', 'c-tech',
   E'WireGuard 在随身 WiFi 上跑了两个月。中兴 UFI + sing-box TProxy，延迟比 ClashTun 稳一截。\n\n如果你也在折腾便携路由，把固件版本写下，别只说「能用」。\n\n#WireGuard #Homelab',
   null, null, false, now() - interval '11 hours'),
  ('p-lounge', 'mira', 'c-lounge',
   '独立开发最难的不是代码，是连续三周没有人说话还继续做。所以才需要一个会回帖的社区。今晚谁在线，报一下你卡在哪。',
   null, null, false, now() - interval '7 hours'),
  ('p-lounge-r', 'kai', 'c-lounge',
   '卡在命名。功能写完了，产品名还是临时的。有人说先上线再改，我改了四次域名了。',
   'p-lounge', null, false, now() - interval '6 hours'),
  ('p-ts', 'neo', 'c-dev',
   E'TanStack Start 现在写全栈比 Next 轻。文件路由、server function、类型从服务端一路走到按钮。\n\n换过来的代价：生态文档还在长。社区帖比官方示例更有用。\n\n#TypeScript #TanStack',
   null, null, false, now() - interval '4 hours'),
  ('p-glass', 'orion', 'c-lounge',
   E'Orion 这版界面按 iOS 27 的 Liquid Glass 重做：玻璃分层、边缘描边、可读性优先，不再靠糊掉背景装高级。\n\n时间线学习 X：为你推荐 / 正在关注、社区、回复链、转发与书签。发帖，看帖，回帖，都应该像说话一样顺。',
   null, null, false, now() - interval '2 hours'),
  ('p-quote', 'cygnus', 'c-ai',
   '同意。模型社区如果还是论坛盖楼，信息密度会塌。短帖 + 深回复，才是现在这代人的阅读方式。',
   null, 'p-glass', false, now() - interval '90 minutes')
on conflict (id) do nothing;

insert into likes (user_id, post_id) values
  ('cygnus', 'p-welcome'), ('neo', 'p-welcome'), ('mira', 'p-welcome'), ('kai', 'p-welcome'), ('vortix', 'p-welcome'),
  ('orion', 'p-r1'), ('neo', 'p-r1'), ('kai', 'p-r1'), ('mira', 'p-r1'),
  ('orion', 'p-cursor'), ('cygnus', 'p-cursor'), ('neo', 'p-cursor'),
  ('orion', 'p-lounge'), ('neo', 'p-lounge'), ('kai', 'p-lounge'),
  ('mira', 'p-glass'), ('cygnus', 'p-glass'), ('vortix', 'p-glass'),
  ('orion', 'p-ts'), ('kai', 'p-lab'), ('neo', 'p-cf')
on conflict do nothing;

insert into reposts (user_id, post_id) values
  ('neo', 'p-r1'),
  ('kai', 'p-lab'),
  ('mira', 'p-welcome'),
  ('vortix', 'p-glass')
on conflict do nothing;

insert into bookmarks (user_id, post_id) values
  ('neo', 'p-r1'),
  ('kai', 'p-cursor'),
  ('mira', 'p-lab')
on conflict do nothing;
