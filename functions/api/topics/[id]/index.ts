interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env; params: { id: string }; request: Request }) => {
  try {
    const { env, params, request } = context;
    const topicId = params.id;
    const url = new URL(request.url);
    const currentUserId = url.searchParams.get('userId') || 'user-current';

    // Atomic increment view count
    await env.DB.prepare(`UPDATE topics SET views = views + 1 WHERE id = ?`).bind(topicId).run();

    // Query topic
    const topicRow = await env.DB.prepare(`
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
      WHERE t.id = ?
    `).bind(topicId).first();

    if (!topicRow) {
      return new Response(JSON.stringify({ success: false, error: 'Topic not found' }), {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    // Query topic reactions
    const topicReactionsRes = await env.DB.prepare(`
      SELECT emoji, user_id FROM reactions WHERE target_type = 'topic' AND target_id = ?
    `).bind(topicId).all();

    const topicRxMap: Record<string, string[]> = {};
    for (const rx of topicReactionsRes.results || []) {
      if (!topicRxMap[rx.emoji]) topicRxMap[rx.emoji] = [];
      topicRxMap[rx.emoji].push(rx.user_id);
    }
    const reactions = Object.keys(topicRxMap).map((emoji) => ({
      emoji,
      count: topicRxMap[emoji].length,
      users: topicRxMap[emoji],
    }));

    // Query user like & bookmark
    const likeRow = await env.DB.prepare(
      `SELECT id FROM likes WHERE target_type = 'topic' AND target_id = ? AND user_id = ?`
    ).bind(topicId, currentUserId).first();

    const bookmarkRow = await env.DB.prepare(
      `SELECT id FROM bookmarks WHERE topic_id = ? AND user_id = ?`
    ).bind(topicId, currentUserId).first();

    // Query replies
    const repliesRes = await env.DB.prepare(`
      SELECT 
        r.id, r.topic_id, r.floor_number, r.content, r.likes, r.reply_to_user, r.reply_to_content, r.created_at,
        u.id as author_id, u.username as author_username, u.name as author_name, u.avatar as author_avatar,
        u.trust_level as author_trust_level, u.trust_title as author_trust_title, u.bio as author_bio,
        u.joined_at as author_joined_at, u.likes_received as author_likes_received, u.topics_count as author_topics_count,
        u.badges as author_badges
      FROM replies r
      JOIN users u ON r.author_id = u.id
      WHERE r.topic_id = ?
      ORDER BY r.floor_number ASC
    `).bind(topicId).all();

    const replyRows = repliesRes.results || [];
    const replyIds = replyRows.map((r: any) => r.id);

    // Query reply likes & reactions for current user and all users
    let replyReactionsMap: Record<string, Record<string, string[]>> = {};
    let userLikedReplies = new Set<string>();

    if (replyIds.length > 0) {
      const placeholders = replyIds.map(() => '?').join(',');
      const replyRxRes = await env.DB.prepare(
        `SELECT target_id, emoji, user_id FROM reactions WHERE target_type = 'reply' AND target_id IN (${placeholders})`
      ).bind(...replyIds).all();

      for (const rx of replyRxRes.results || []) {
        if (!replyReactionsMap[rx.target_id]) replyReactionsMap[rx.target_id] = {};
        if (!replyReactionsMap[rx.target_id][rx.emoji]) replyReactionsMap[rx.target_id][rx.emoji] = [];
        replyReactionsMap[rx.target_id][rx.emoji].push(rx.user_id);
      }

      const userLikesRes = await env.DB.prepare(
        `SELECT target_id FROM likes WHERE target_type = 'reply' AND user_id = ? AND target_id IN (${placeholders})`
      ).bind(currentUserId, ...replyIds).all();

      for (const lk of userLikesRes.results || []) {
        userLikedReplies.add(lk.target_id);
      }
    }

    const replies = replyRows.map((r: any) => {
      let rBadges: string[] = [];
      try { rBadges = JSON.parse(r.author_badges); } catch { rBadges = []; }

      const rxForThis = replyReactionsMap[r.id] || {};
      const rxList = Object.keys(rxForThis).map((emoji) => ({
        emoji,
        count: rxForThis[emoji].length,
        users: rxForThis[emoji],
      }));

      return {
        id: r.id,
        topicId: r.topic_id,
        floorNumber: r.floor_number,
        author: {
          id: r.author_id,
          username: r.author_username,
          name: r.author_name,
          avatar: r.author_avatar,
          trustLevel: r.author_trust_level,
          trustTitle: r.author_trust_title,
          bio: r.author_bio || '',
          joinedAt: r.author_joined_at,
          likesReceived: r.author_likes_received || 0,
          topicsCount: r.author_topics_count || 0,
          badges: rBadges,
        },
        content: r.content,
        createdAt: r.created_at,
        likes: r.likes,
        isLiked: userLikedReplies.has(r.id),
        replyToUser: r.reply_to_user || undefined,
        replyToContent: r.reply_to_content || undefined,
        reactions: rxList,
      };
    });

    let parsedTags: string[] = [];
    try { parsedTags = JSON.parse(topicRow.tags); } catch { parsedTags = []; }
    let parsedBadges: string[] = [];
    try { parsedBadges = JSON.parse(topicRow.author_badges); } catch { parsedBadges = []; }

    const author = {
      id: topicRow.author_id,
      username: topicRow.author_username,
      name: topicRow.author_name,
      avatar: topicRow.author_avatar,
      trustLevel: topicRow.author_trust_level,
      trustTitle: topicRow.author_trust_title,
      bio: topicRow.author_bio || '',
      joinedAt: topicRow.author_joined_at,
      likesReceived: topicRow.author_likes_received || 0,
      topicsCount: topicRow.author_topics_count || 0,
      badges: parsedBadges,
      location: topicRow.author_location || '',
      website: topicRow.author_website || '',
    };

    const category = {
      id: topicRow.cat_id,
      slug: topicRow.cat_slug,
      name: topicRow.cat_name,
      description: topicRow.cat_desc,
      color: topicRow.cat_color,
      bgColor: topicRow.cat_bg_color,
      topicsCount: topicRow.cat_topics_count || 0,
    };

    // Deduplicate participants
    const participantsMap: Record<string, any> = { [author.id]: author };
    for (const rep of replies) {
      if (!participantsMap[rep.author.id]) {
        participantsMap[rep.author.id] = rep.author;
      }
    }

    const topic = {
      id: topicRow.id,
      title: topicRow.title,
      category,
      tags: parsedTags,
      author,
      content: topicRow.content,
      createdAt: topicRow.created_at,
      lastActivityAt: topicRow.last_activity_at,
      views: topicRow.views,
      likes: topicRow.likes,
      isLiked: !!likeRow,
      isBookmarked: !!bookmarkRow,
      isPinned: !!topicRow.is_pinned,
      isFeatured: !!topicRow.is_featured,
      isClosed: !!topicRow.is_closed,
      repliesCount: topicRow.replies_count,
      participants: Object.values(participantsMap),
      replies,
      aiSummary: topicRow.ai_summary || undefined,
      reactions,
    };

    return new Response(JSON.stringify({ success: true, topic }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Failed to get topic' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};

export const onRequestPatch = async (context: { env: Env; params: { id: string }; request: Request }) => {
  try {
    const { env, params, request } = context;
    const topicId = params.id;
    const body: any = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (body.isPinned !== undefined) {
      updates.push('is_pinned = ?');
      values.push(body.isPinned ? 1 : 0);
    }
    if (body.isClosed !== undefined) {
      updates.push('is_closed = ?');
      values.push(body.isClosed ? 1 : 0);
    }
    if (body.isFeatured !== undefined) {
      updates.push('is_featured = ?');
      values.push(body.isFeatured ? 1 : 0);
    }
    if (body.aiSummary !== undefined) {
      updates.push('ai_summary = ?');
      values.push(body.aiSummary);
    }

    if (updates.length > 0) {
      values.push(topicId);
      await env.DB.prepare(`UPDATE topics SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
    }

    return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
