import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { optionalAuth } from "./optional-auth";
import { HANDLE_RE, normalizeHandle } from "./text";
import type {
  Author,
  Community,
  CommunityAccent,
  FeedTab,
  Notification,
  Post,
  Trend,
} from "./types";

const ACCENTS = new Set<CommunityAccent>([
  "sky",
  "emerald",
  "violet",
  "rose",
  "cyan",
  "amber",
  "red",
]);

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const s = String(value ?? "");
  if (/^\d{4}-\d{2}-\d{2} /.test(s)) return s.replace(" ", "T") + "Z";
  return s;
}

function accent(value: unknown): CommunityAccent {
  const s = String(value ?? "sky");
  return ACCENTS.has(s as CommunityAccent) ? (s as CommunityAccent) : "sky";
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function bool(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

type PostRow = Record<string, unknown>;

function mapPost(row: PostRow): Post {
  const quoteId = row.quote_id ? String(row.quote_id) : null;
  return {
    id: String(row.id),
    body: String(row.body ?? ""),
    createdAt: iso(row.created_at),
    parentId: row.parent_id ? String(row.parent_id) : null,
    quoteId,
    isPinned: bool(row.is_pinned),
    likeCount: num(row.like_count),
    repostCount: num(row.repost_count),
    replyCount: num(row.reply_count),
    bookmarkCount: num(row.bookmark_count),
    liked: bool(row.liked),
    reposted: bool(row.reposted),
    bookmarked: bool(row.bookmarked),
    author: {
      userId: String(row.user_id),
      handle: String(row.handle),
      displayName: String(row.display_name),
      avatarHue: num(row.avatar_hue),
      verified: bool(row.verified),
    },
    community: row.community_id
      ? {
          id: String(row.community_id),
          slug: String(row.community_slug),
          name: String(row.community_name),
          accent: accent(row.community_accent),
        }
      : null,
    quote:
      quoteId && row.quote_body
        ? {
            id: quoteId,
            body: String(row.quote_body),
            handle: String(row.quote_handle ?? ""),
            displayName: String(row.quote_name ?? ""),
            avatarHue: num(row.quote_hue),
          }
        : null,
  };
}

const POST_SELECT = `
  p.id, p.user_id, p.community_id, p.body, p.parent_id, p.quote_id, p.is_pinned,
  p.created_at::text as created_at,
  pr.handle, pr.display_name, pr.avatar_hue, pr.verified,
  c.slug as community_slug, c.name as community_name, c.accent as community_accent,
  (select count(*)::int from likes l where l.post_id = p.id) as like_count,
  (select count(*)::int from reposts r where r.post_id = p.id) as repost_count,
  (select count(*)::int from posts r where r.parent_id = p.id) as reply_count,
  (select count(*)::int from bookmarks b where b.post_id = p.id) as bookmark_count,
  exists(select 1 from likes l where l.post_id = p.id and l.user_id = $1) as liked,
  exists(select 1 from reposts r where r.post_id = p.id and r.user_id = $1) as reposted,
  exists(select 1 from bookmarks b where b.post_id = p.id and b.user_id = $1) as bookmarked,
  q.body as quote_body, qp.handle as quote_handle, qp.display_name as quote_name, qp.avatar_hue as quote_hue
`;

const POST_JOIN = `
  from posts p
  join profiles pr on pr.user_id = p.user_id
  left join communities c on c.id = p.community_id
  left join posts q on q.id = p.quote_id
  left join profiles qp on qp.user_id = q.user_id
`;

async function loadPosts(sql: Awaited<ReturnType<typeof getSql>>, viewer: string, extra: string, params: unknown[]) {
  const rows = await sql.query<PostRow>(
    `select ${POST_SELECT} ${POST_JOIN} ${extra}`,
    [viewer, ...params],
  );
  return rows.map(mapPost);
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .handler(async ({ context }) => {
    if (!context.userId) return null;
    const sql = await getSql();
    const rows = await sql.query<PostRow>(
      `select p.user_id, p.handle, p.display_name, p.bio, p.avatar_hue, p.location, p.website, p.verified,
              p.created_at::text as created_at,
              (select count(*)::int from follows f where f.followee_id = p.user_id) as followers,
              (select count(*)::int from follows f where f.follower_id = p.user_id) as following,
              (select count(*)::int from posts x where x.user_id = p.user_id and x.parent_id is null) as posts
       from profiles p where p.user_id = $1`,
      [context.userId],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      userId: String(row.user_id),
      handle: String(row.handle),
      displayName: String(row.display_name),
      bio: String(row.bio ?? ""),
      avatarHue: num(row.avatar_hue),
      location: String(row.location ?? ""),
      website: String(row.website ?? ""),
      verified: bool(row.verified),
      createdAt: iso(row.created_at),
      followers: num(row.followers),
      following: num(row.following),
      posts: num(row.posts),
      isFollowing: false,
    } satisfies Author;
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { handle: string; displayName: string; bio?: string }) => data)
  .handler(async ({ context, data }) => {
    const handle = normalizeHandle(data.handle);
    const displayName = data.displayName.trim().slice(0, 32);
    const bio = (data.bio ?? "").trim().slice(0, 160);
    if (!HANDLE_RE.test(handle)) throw new Error("呼号需为 3–20 位字母、数字或下划线");
    if (!displayName) throw new Error("请填写显示名称");
    const sql = await getSql();
    const existing = await sql.query<{ user_id: string }>(
      `select user_id from profiles where user_id = $1`,
      [context.userId],
    );
    if (existing[0]) {
      await sql.query(
        `update profiles set handle = $2, display_name = $3, bio = $4 where user_id = $1
         and not exists (select 1 from profiles p2 where p2.handle = $2 and p2.user_id <> $1)`,
        [context.userId, handle, displayName, bio],
      );
      const clash = await sql.query<{ handle: string }>(
        `select handle from profiles where user_id = $1`,
        [context.userId],
      );
      if (clash[0]?.handle !== handle) throw new Error("这个呼号已被占用");
      return { handle };
    }
    const taken = await sql.query<{ handle: string }>(
      `select handle from profiles where handle = $1`,
      [handle],
    );
    if (taken[0]) throw new Error("这个呼号已被占用");
    const hue = Math.floor(Math.random() * 360);
    await sql.query(
      `insert into profiles (user_id, handle, display_name, bio, avatar_hue)
       values ($1, $2, $3, $4, $5)`,
      [context.userId, handle, displayName, bio, hue],
    );
    return { handle };
  });

export const listFeed = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .validator((data: { tab?: FeedTab; community?: string; q?: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = context.userId ?? "";
    const tab = data.tab ?? "for-you";
    if (data.q && data.q.trim()) {
      const q = `%${data.q.trim().replace(/^#/, "")}%`;
      return loadPosts(
        sql,
        viewer,
        `where (p.body ilike $2 or pr.handle ilike $2 or pr.display_name ilike $2)
         order by p.is_pinned desc, p.created_at desc limit 80`,
        [q],
      );
    }
    if (data.community) {
      return loadPosts(
        sql,
        viewer,
        `where c.slug = $2 and p.parent_id is null
         order by p.is_pinned desc, p.created_at desc limit 80`,
        [data.community],
      );
    }
    if (tab === "following" && context.userId) {
      return loadPosts(
        sql,
        viewer,
        `where p.parent_id is null and (
            p.user_id in (select followee_id from follows where follower_id = $2)
            or p.community_id in (select community_id from community_members where user_id = $2)
            or p.user_id = $2
          )
         order by p.created_at desc limit 80`,
        [context.userId],
      );
    }
    return loadPosts(
      sql,
      viewer,
      `where p.parent_id is null
       order by p.is_pinned desc, p.created_at desc limit 80`,
      [],
    );
  });

export const getPost = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const viewer = context.userId ?? "";
    const posts = await loadPosts(sql, viewer, `where p.id = $2 limit 1`, [id]);
    const post = posts[0] ?? null;
    if (!post) return { post: null, ancestors: [] as Post[], replies: [] as Post[] };
    const replies = await loadPosts(
      sql,
      viewer,
      `where p.parent_id = $2 order by p.created_at asc limit 120`,
      [id],
    );
    const ancestors: Post[] = [];
    let cursor = post.parentId;
    while (cursor && ancestors.length < 8) {
      const chain = await loadPosts(sql, viewer, `where p.id = $2 limit 1`, [cursor]);
      const node = chain[0];
      if (!node) break;
      ancestors.unshift(node);
      cursor = node.parentId;
    }
    return { post, ancestors, replies };
  });

export const listRepliesForUser = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .validator((handle: string) => handle)
  .handler(async ({ context, data: handle }) => {
    const sql = await getSql();
    return loadPosts(
      sql,
      context.userId ?? "",
      `where pr.handle = $2 and p.parent_id is not null
       order by p.created_at desc limit 60`,
      [normalizeHandle(handle)],
    );
  });

export const listCommunities = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<PostRow>(
      `select c.*, exists(
         select 1 from community_members m where m.community_id = c.id and m.user_id = $1
       ) as joined
       from communities c
       order by c.member_count desc`,
      [context.userId ?? ""],
    );
    return rows.map(
      (row): Community => ({
        id: String(row.id),
        slug: String(row.slug),
        name: String(row.name),
        description: String(row.description),
        rules: String(row.rules ?? ""),
        accent: accent(row.accent),
        memberCount: num(row.member_count),
        joined: bool(row.joined),
      }),
    );
  });

export const getCommunity = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .validator((slug: string) => slug)
  .handler(async ({ context, data: slug }) => {
    const sql = await getSql();
    const rows = await sql.query<PostRow>(
      `select c.*, exists(
         select 1 from community_members m where m.community_id = c.id and m.user_id = $2
       ) as joined
       from communities c where c.slug = $1`,
      [slug, context.userId ?? ""],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      description: String(row.description),
      rules: String(row.rules ?? ""),
      accent: accent(row.accent),
      memberCount: num(row.member_count),
      joined: bool(row.joined),
    } satisfies Community;
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .validator((handle: string) => handle)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const handle = normalizeHandle(data);
    const rows = await sql.query<PostRow>(
      `select p.user_id, p.handle, p.display_name, p.bio, p.avatar_hue, p.location, p.website, p.verified,
              p.created_at::text as created_at,
              (select count(*)::int from follows f where f.followee_id = p.user_id) as followers,
              (select count(*)::int from follows f where f.follower_id = p.user_id) as following,
              (select count(*)::int from posts x where x.user_id = p.user_id and x.parent_id is null) as posts,
              exists(select 1 from follows f where f.follower_id = $2 and f.followee_id = p.user_id) as is_following
       from profiles p where p.handle = $1`,
      [handle, context.userId ?? ""],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      userId: String(row.user_id),
      handle: String(row.handle),
      displayName: String(row.display_name),
      bio: String(row.bio ?? ""),
      avatarHue: num(row.avatar_hue),
      location: String(row.location ?? ""),
      website: String(row.website ?? ""),
      verified: bool(row.verified),
      createdAt: iso(row.created_at),
      followers: num(row.followers),
      following: num(row.following),
      posts: num(row.posts),
      isFollowing: bool(row.is_following),
    } satisfies Author;
  });

export const listUserPosts = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .validator((data: { handle: string; kind?: "posts" | "likes" }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = context.userId ?? "";
    const handle = normalizeHandle(data.handle);
    if (data.kind === "likes") {
      return loadPosts(
        sql,
        viewer,
        `where p.id in (select l.post_id from likes l join profiles a on a.user_id = l.user_id where a.handle = $2)
         order by p.created_at desc limit 60`,
        [handle],
      );
    }
    return loadPosts(
      sql,
      viewer,
      `where pr.handle = $2 and p.parent_id is null
       order by p.created_at desc limit 60`,
      [handle],
    );
  });

export const listBookmarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return loadPosts(
      sql,
      context.userId,
      `where exists (select 1 from bookmarks b where b.post_id = p.id and b.user_id = $2)
       order by p.created_at desc limit 80`,
      [context.userId],
    );
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<PostRow>(
      `select n.id, n.kind, n.post_id, n.created_at::text as created_at, n.read_at,
              a.user_id as actor_id, a.handle, a.display_name, a.avatar_hue,
              p.body as preview
       from notifications n
       join profiles a on a.user_id = n.actor_id
       left join posts p on p.id = n.post_id
       where n.user_id = $1
       order by n.created_at desc
       limit 50`,
      [context.userId],
    );
    return rows.map(
      (row): Notification => ({
        id: String(row.id),
        kind: String(row.kind) as Notification["kind"],
        createdAt: iso(row.created_at),
        read: Boolean(row.read_at),
        actor: {
          userId: String(row.actor_id),
          handle: String(row.handle),
          displayName: String(row.display_name),
          avatarHue: num(row.avatar_hue),
        },
        postId: row.post_id ? String(row.post_id) : null,
        preview: row.preview ? String(row.preview).slice(0, 80) : null,
      }),
    );
  });

export const unreadCount = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .handler(async ({ context }) => {
    if (!context.userId) return 0;
    const sql = await getSql();
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from notifications where user_id = $1 and read_at is null`,
      [context.userId],
    );
    return num(rows[0]?.n);
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql.query(`update notifications set read_at = now() where user_id = $1 and read_at is null`, [
      context.userId,
    ]);
    return { ok: true };
  });

export const listTrends = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql.query<{ body: string }>(
    `select body from posts where created_at > now() - interval '14 days' limit 200`,
  );
  const counts = new Map<string, number>();
  const tagRe = /#([\p{L}\p{N}_]+)/gu;
  for (const row of rows) {
    const body = row.body ?? "";
    let m: RegExpExecArray | null;
    const re = new RegExp(tagRe);
    while ((m = re.exec(body))) {
      const tag = m[1];
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const trends: Trend[] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag, count]) => ({ tag, count }));
  return trends;
});

export const whoToFollow = createServerFn({ method: "GET" })
  .middleware([optionalAuth])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<PostRow>(
      `select p.user_id, p.handle, p.display_name, p.bio, p.avatar_hue, p.verified,
              (select count(*)::int from follows f where f.followee_id = p.user_id) as followers
       from profiles p
       where p.user_id <> $1
         and not exists (select 1 from follows f where f.follower_id = $1 and f.followee_id = p.user_id)
       order by followers desc
       limit 4`,
      [context.userId ?? ""],
    );
    return rows.map((row) => ({
      userId: String(row.user_id),
      handle: String(row.handle),
      displayName: String(row.display_name),
      bio: String(row.bio ?? ""),
      avatarHue: num(row.avatar_hue),
      verified: bool(row.verified),
      followers: num(row.followers),
    }));
  });

async function notify(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  actorId: string,
  kind: string,
  postId: string | null,
) {
  if (userId === actorId) return;
  await sql.query(
    `insert into notifications (id, user_id, actor_id, kind, post_id) values ($1, $2, $3, $4, $5)`,
    [crypto.randomUUID(), userId, actorId, kind, postId],
  );
}

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { body: string; communityId?: string | null; parentId?: string | null; quoteId?: string | null }) => data)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (body.length < 1) throw new Error("内容不能为空");
    if (body.length > 500) throw new Error("帖子最长 500 字");
    const sql = await getSql();
    const profile = await sql.query<{ handle: string }>(
      `select handle from profiles where user_id = $1`,
      [context.userId],
    );
    if (!profile[0]) throw new Error("请先完成注册资料");
    const id = crypto.randomUUID();
    await sql.query(
      `insert into posts (id, user_id, community_id, body, parent_id, quote_id)
       values ($1, $2, $3, $4, $5, $6)`,
      [id, context.userId, data.communityId ?? null, body, data.parentId ?? null, data.quoteId ?? null],
    );
    if (data.parentId) {
      const parent = await sql.query<{ user_id: string }>(`select user_id from posts where id = $1`, [
        data.parentId,
      ]);
      if (parent[0]) await notify(sql, parent[0].user_id, context.userId, "reply", id);
    }
    const posts = await loadPosts(sql, context.userId, `where p.id = $2 limit 1`, [id]);
    return posts[0];
  });

export const toggleLike = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((postId: string) => postId)
  .handler(async ({ context, data: postId }) => {
    const sql = await getSql();
    const existing = await sql.query<{ post_id: string }>(
      `select post_id from likes where user_id = $1 and post_id = $2`,
      [context.userId, postId],
    );
    if (existing[0]) {
      await sql.query(`delete from likes where user_id = $1 and post_id = $2`, [context.userId, postId]);
      return { liked: false };
    }
    await sql.query(`insert into likes (user_id, post_id) values ($1, $2)`, [context.userId, postId]);
    const owner = await sql.query<{ user_id: string }>(`select user_id from posts where id = $1`, [postId]);
    if (owner[0]) await notify(sql, owner[0].user_id, context.userId, "like", postId);
    return { liked: true };
  });

export const toggleRepost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((postId: string) => postId)
  .handler(async ({ context, data: postId }) => {
    const sql = await getSql();
    const existing = await sql.query<{ post_id: string }>(
      `select post_id from reposts where user_id = $1 and post_id = $2`,
      [context.userId, postId],
    );
    if (existing[0]) {
      await sql.query(`delete from reposts where user_id = $1 and post_id = $2`, [context.userId, postId]);
      return { reposted: false };
    }
    await sql.query(`insert into reposts (user_id, post_id) values ($1, $2)`, [context.userId, postId]);
    const owner = await sql.query<{ user_id: string }>(`select user_id from posts where id = $1`, [postId]);
    if (owner[0]) await notify(sql, owner[0].user_id, context.userId, "repost", postId);
    return { reposted: true };
  });

export const toggleBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((postId: string) => postId)
  .handler(async ({ context, data: postId }) => {
    const sql = await getSql();
    const existing = await sql.query<{ post_id: string }>(
      `select post_id from bookmarks where user_id = $1 and post_id = $2`,
      [context.userId, postId],
    );
    if (existing[0]) {
      await sql.query(`delete from bookmarks where user_id = $1 and post_id = $2`, [
        context.userId,
        postId,
      ]);
      return { bookmarked: false };
    }
    await sql.query(`insert into bookmarks (user_id, post_id) values ($1, $2)`, [context.userId, postId]);
    return { bookmarked: true };
  });

export const toggleFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    if (userId === context.userId) throw new Error("不能关注自己");
    const sql = await getSql();
    const existing = await sql.query<{ followee_id: string }>(
      `select followee_id from follows where follower_id = $1 and followee_id = $2`,
      [context.userId, userId],
    );
    if (existing[0]) {
      await sql.query(`delete from follows where follower_id = $1 and followee_id = $2`, [
        context.userId,
        userId,
      ]);
      return { following: false };
    }
    await sql.query(`insert into follows (follower_id, followee_id) values ($1, $2)`, [
      context.userId,
      userId,
    ]);
    await notify(sql, userId, context.userId, "follow", null);
    return { following: true };
  });

export const toggleJoinCommunity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const existing = await sql.query<{ community_id: string }>(
      `select community_id from community_members where community_id = $1 and user_id = $2`,
      [communityId, context.userId],
    );
    if (existing[0]) {
      await sql.query(`delete from community_members where community_id = $1 and user_id = $2`, [
        communityId,
        context.userId,
      ]);
      await sql.query(
        `update communities set member_count = greatest(member_count - 1, 0) where id = $1`,
        [communityId],
      );
      return { joined: false };
    }
    await sql.query(
      `insert into community_members (community_id, user_id) values ($1, $2)`,
      [communityId, context.userId],
    );
    await sql.query(`update communities set member_count = member_count + 1 where id = $1`, [
      communityId,
    ]);
    return { joined: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((postId: string) => postId)
  .handler(async ({ context, data: postId }) => {
    const sql = await getSql();
    await sql.query(`delete from posts where id = $1 and user_id = $2`, [postId, context.userId]);
    return { ok: true };
  });
