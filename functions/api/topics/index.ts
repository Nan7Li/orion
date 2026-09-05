interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const url = new URL(request.url);
    const categorySlug = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const currentUserId = url.searchParams.get('userId') || 'user-current';

    let query = `
      SELECT 
        t.id, t.title, t.tags, t.content, t.created_at, t.last_activity_at,
        t.views, t.likes, t.replies_count, t.is_pinned, t.is_featured, t.is_closed, t.ai_summary,
        c.id as cat_id, c.slug as cat_slug, c.name as cat_name, c.description as cat_desc, c.color as cat_color, c.bg_color as cat_bg_color, c.topics_count as cat_topics_count,
        u.id as author_id, u.username as author_username, u.name as author_name, u.avatar as author_avatar,
        u.trust_level as author_trust_level, u.trust_title as author_trust_title, u.bio as author_bio,
        u.joined_at as author_joined_at, u.likes_received as author_likes_received, u.topics_count as author_topics_count,
        u.badges as author_badges, u.location as author_location, u.website as author_website
      FROM topics t
      JOIN categories c ON t.category_id = c.id
      JOIN users u ON t.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (categorySlug && categorySlug !== 'all') {
      query += ` AND c.slug = ?`;
      params.push(categorySlug);
    }

    if (search && search.trim()) {
      query += ` AND (t.title LIKE ? OR t.content LIKE ? OR u.name LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY t.is_pinned DESC, t.last_activity_at DESC`;

    const topicStmt = env.DB.prepare(query);
    const topicsResult = params.length > 0 ? await topicStmt.bind(...params).all() : await topicStmt.all();
    const rows = topicsResult.results || [];

    // Fetch reactions for topics
    const reactionsRes = await env.DB.prepare(
      `SELECT target_id, emoji, user_id FROM reactions WHERE target_type = 'topic'`
    ).all();
    const reactionRows = reactionsRes.results || [];

    // Group reactions by topic
    const topicReactionsMap: Record<string, Record<string, string[]>> = {};
    for (const rx of reactionRows) {
      if (!topicReactionsMap[rx.target_id]) topicReactionsMap[rx.target_id] = {};
      if (!topicReactionsMap[rx.target_id][rx.emoji]) topicReactionsMap[rx.target_id][rx.emoji] = [];
      topicReactionsMap[rx.target_id][rx.emoji].push(rx.user_id);
    }

    // Fetch user bookmarks & likes for the current user
    const likesRes = await env.DB.prepare(
      `SELECT target_id FROM likes WHERE target_type = 'topic' AND user_id = ?`
    ).bind(currentUserId).all();
    const likedSet = new Set((likesRes.results || []).map((r: any) => r.target_id));

    const bookmarksRes = await env.DB.prepare(
      `SELECT topic_id FROM bookmarks WHERE user_id = ?`
    ).bind(currentUserId).all();
    const bookmarkedSet = new Set((bookmarksRes.results || []).map((r: any) => r.topic_id));

    // Fetch participants per topic
    const repliesParticipantsRes = await env.DB.prepare(
      `SELECT DISTINCT r.topic_id, u.id, u.username, u.name, u.avatar, u.trust_level, u.trust_title
       FROM replies r JOIN users u ON r.author_id = u.id`
    ).all();
    const participantsMap: Record<string, any[]> = {};
    for (const p of repliesParticipantsRes.results || []) {
      if (!participantsMap[p.topic_id]) participantsMap[p.topic_id] = [];
      participantsMap[p.topic_id].push({
        id: p.id,
        username: p.username,
        name: p.name,
        avatar: p.avatar,
        trustLevel: p.trust_level,
        trustTitle: p.trust_title,
      });
    }

    const topics = rows.map((row: any) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [];
      } catch {
        parsedTags = [];
      }

      let parsedBadges: string[] = [];
      try {
        parsedBadges = typeof row.author_badges === 'string' ? JSON.parse(row.author_badges) : row.author_badges || [];
      } catch {
        parsedBadges = [];
      }

      const author = {
        id: row.author_id,
        username: row.author_username,
        name: row.author_name,
        avatar: row.author_avatar,
        trustLevel: row.author_trust_level,
        trustTitle: row.author_trust_title,
        bio: row.author_bio || '',
        joinedAt: row.author_joined_at,
        likesReceived: row.author_likes_received || 0,
        topicsCount: row.author_topics_count || 0,
        badges: parsedBadges,
        location: row.author_location || '',
        website: row.author_website || '',
      };

      const category = {
        id: row.cat_id,
        slug: row.cat_slug,
        name: row.cat_name,
        description: row.cat_desc,
        color: row.cat_color,
        bgColor: row.cat_bg_color,
        topicsCount: row.cat_topics_count || 0,
      };

      const rxMap = topicReactionsMap[row.id] || {};
      const reactions = Object.keys(rxMap).map((emoji) => ({
        emoji,
        count: rxMap[emoji].length,
        users: rxMap[emoji],
      }));

      const otherParticipants = participantsMap[row.id] || [];
      const participants = [author, ...otherParticipants.filter((p) => p.id !== author.id)];

      return {
        id: row.id,
        title: row.title,
        category,
        tags: parsedTags,
        author,
        content: row.content,
        createdAt: row.created_at,
        lastActivityAt: row.last_activity_at,
        views: row.views,
        likes: row.likes,
        isLiked: likedSet.has(row.id),
        isBookmarked: bookmarkedSet.has(row.id),
        isPinned: !!row.is_pinned,
        isFeatured: !!row.is_featured,
        isClosed: !!row.is_closed,
        repliesCount: row.replies_count,
        participants,
        replies: [],
        aiSummary: row.ai_summary || undefined,
        reactions,
      };
    });

    return new Response(JSON.stringify({ success: true, topics }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const body: any = await request.json();
    const { title, categorySlug, tags, content, authorId = 'user-current' } = body;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ success: false, error: '标题与内容不能为空' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Find category
    let cat = await env.DB.prepare(`SELECT * FROM categories WHERE slug = ?`).bind(categorySlug || 'tech').first();
    if (!cat) {
      cat = await env.DB.prepare(`SELECT * FROM categories WHERE slug = 'dev'`).first();
    }
    if (!cat) {
      cat = { id: 'cat-tech', slug: 'tech', name: '深空科技', color: '#0284c7', bg_color: 'rgba(2, 132, 199, 0.12)', topics_count: 0 };
    }

    // Verify or default user
    let user = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(authorId).first();
    if (!user) {
      user = await env.DB.prepare(`SELECT * FROM users WHERE id = 'user-current'`).first();
    }

    const topicId = `topic-${Date.now()}`;
    const now = new Date().toISOString();
    const tagList = Array.isArray(tags) && tags.length > 0 ? tags : ['讨论'];

    await env.DB.prepare(
      `INSERT INTO topics (id, title, category_id, author_id, tags, content, created_at, last_activity_at, views, likes, replies_count, is_pinned, is_featured, is_closed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 0, 0)`
    ).bind(topicId, title, cat.id, user ? user.id : authorId, JSON.stringify(tagList), content, now, now).run();

    // Increment user & category counters
    if (user) {
      await env.DB.prepare(`UPDATE users SET topics_count = topics_count + 1 WHERE id = ?`).bind(user.id).run();
    }
    await env.DB.prepare(`UPDATE categories SET topics_count = topics_count + 1 WHERE id = ?`).bind(cat.id).run();

    let parsedBadges: string[] = [];
    if (user && user.badges) {
      try { parsedBadges = JSON.parse(user.badges); } catch { parsedBadges = []; }
    }

    const createdTopic = {
      id: topicId,
      title,
      category: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description || '',
        color: cat.color || '#6366f1',
        bgColor: cat.bg_color || 'rgba(99,102,241,0.1)',
        topicsCount: (cat.topics_count || 0) + 1,
      },
      tags: tagList,
      author: {
        id: user ? user.id : authorId,
        username: user ? user.username : 'explorer',
        name: user ? user.name : '探索者',
        avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
        trustLevel: user ? user.trust_level : 1,
        trustTitle: user ? user.trust_title : '星际漫游者',
        bio: user ? user.bio : '',
        joinedAt: user ? user.joined_at : now,
        likesReceived: user ? user.likes_received : 0,
        topicsCount: user ? (user.topics_count || 0) + 1 : 1,
        badges: parsedBadges,
      },
      content,
      createdAt: now,
      lastActivityAt: now,
      views: 1,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      isFeatured: false,
      isClosed: false,
      repliesCount: 0,
      participants: [user ? {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        trustLevel: user.trust_level,
        trustTitle: user.trust_title,
      } : {
        id: authorId,
        username: 'explorer',
        name: '探索者',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
        trustLevel: 1,
        trustTitle: '星际漫游者',
      }],
      replies: [],
      reactions: [],
    };

    return new Response(JSON.stringify({ success: true, topic: createdTopic }), {
      status: 201,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Failed to create topic' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
