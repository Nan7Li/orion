interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { emoji, userId = 'user-current' } = body;

    if (!emoji) {
      return new Response(JSON.stringify({ success: false, error: 'Emoji required' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const existing = await env.DB.prepare(
      `SELECT id FROM reactions WHERE target_type = 'topic' AND target_id = ? AND user_id = ? AND emoji = ?`
    ).bind(topicId, userId, emoji).first();

    if (existing) {
      await env.DB.prepare(
        `DELETE FROM reactions WHERE id = ?`
      ).bind(existing.id).run();
    } else {
      const rxId = `rx-${Date.now()}`;
      await env.DB.prepare(
        `INSERT INTO reactions (id, target_type, target_id, user_id, emoji, created_at) VALUES (?, 'topic', ?, ?, ?, ?)`
      ).bind(rxId, topicId, userId, emoji, new Date().toISOString()).run();
    }

    // Return updated reactions
    const allReactions = await env.DB.prepare(
      `SELECT emoji, user_id FROM reactions WHERE target_type = 'topic' AND target_id = ?`
    ).bind(topicId).all();

    const rxMap: Record<string, string[]> = {};
    for (const rx of allReactions.results || []) {
      if (!rxMap[rx.emoji]) rxMap[rx.emoji] = [];
      rxMap[rx.emoji].push(rx.user_id);
    }
    const reactions = Object.keys(rxMap).map((em) => ({
      emoji: em,
      count: rxMap[em].length,
      users: rxMap[em],
    }));

    return new Response(JSON.stringify({ success: true, reactions }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
