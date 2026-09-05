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

export const onRequestPost = async (context: { env: Env; params: { id: string }; request: Request }) => {
  try {
    const { env, params, request } = context;
    const topicId = params.id;
    const body: any = await request.json();
    const { content, authorId = 'user-current', replyToUser, replyToContent } = body;

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: '回复内容不能为空' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Get current floor number
    const countRow = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM replies WHERE topic_id = ?`
    ).bind(topicId).first();
    const floorNumber = (countRow ? countRow.cnt : 0) + 2;

    const replyId = `reply-${Date.now()}`;
    const now = new Date().toISOString();

    // Verify user
    let user = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(authorId).first();
    if (!user) {
      user = await env.DB.prepare(`SELECT * FROM users WHERE id = 'user-current'`).first();
    }

    // Insert reply
    await env.DB.prepare(
      `INSERT INTO replies (id, topic_id, floor_number, author_id, content, likes, reply_to_user, reply_to_content, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`
    ).bind(
      replyId,
      topicId,
      floorNumber,
      user ? user.id : authorId,
      content,
      replyToUser || null,
      replyToContent || null,
      now
    ).run();

    // Update topic replies_count & last_activity_at
    await env.DB.prepare(
      `UPDATE topics SET replies_count = replies_count + 1, last_activity_at = ? WHERE id = ?`
    ).bind(now, topicId).run();

    let parsedBadges: string[] = [];
    if (user && user.badges) {
      try { parsedBadges = JSON.parse(user.badges); } catch { parsedBadges = []; }
    }

    const reply = {
      id: replyId,
      topicId,
      floorNumber,
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
        topicsCount: user ? user.topics_count : 0,
        badges: parsedBadges,
      },
      content,
      createdAt: now,
      likes: 0,
      isLiked: false,
      replyToUser: replyToUser || undefined,
      replyToContent: replyToContent || undefined,
      reactions: [],
    };

    return new Response(JSON.stringify({ success: true, reply }), {
      status: 201,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Failed to create reply' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
