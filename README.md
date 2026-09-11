# Orion

连接思想 · 星辰大海。

X 风格的社区：时间线、关注流、帖子、回复、转发、引用、书签、圈子与通知。注册后即可发帖。

## 功能

- 首页「为你推荐 / 正在关注」双时间线
- 发帖、回复、喜欢、转发、引用、书签
- 圈子（社区）浏览与加入
- 用户主页、通知、探索页
- 邮箱注册登录，数据落在 Postgres

## 本地运行

```bash
npm install
npm run dev
```

需要可用的 `DATABASE_URL`（Postgres）。首次构建会跑 `migrations/` 里的表结构。

## 技术栈

- React 19 + TanStack Start / Router / Query
- Tailwind CSS v4
- Better Auth + Postgres (Kysely)

## 仓库

https://github.com/Nan7Li/orion
