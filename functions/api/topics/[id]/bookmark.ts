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
    const userId = body.userId || 'user-current';

    const existing = await env.DB.prepare(
      `SELECT id FROM bookmarks WHERE topic_id = ? AND user_id = ?`
    ).bind(topicId, userId).first();

    let isBookmarked = false;
    if (existing) {
      await env.DB.prepare(`DELETE FROM bookmarks WHERE id = ?`).bind(existing.id).run();
      isBookmarked = false;
    } else {
      const bmId = `bm-${Date.now()}`;
      await env.DB.prepare(
        `INSERT INTO bookmarks (id, topic_id, user_id, created_at) VALUES (?, ?, ?, ?)`
      ).bind(bmId, topicId, userId, new Date().toISOString()).run();
      isBookmarked = true;
    }

    return new Response(JSON.stringify({ success: true, isBookmarked }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
