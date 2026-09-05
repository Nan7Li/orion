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
    const replyId = params.id;
    const body: any = await request.json();
    const userId = body.userId || 'user-current';

    const existing = await env.DB.prepare(
      `SELECT id FROM likes WHERE target_type = 'reply' AND target_id = ? AND user_id = ?`
    ).bind(replyId, userId).first();

    let isLiked = false;
    if (existing) {
      await env.DB.prepare(
        `DELETE FROM likes WHERE target_type = 'reply' AND target_id = ? AND user_id = ?`
      ).bind(replyId, userId).run();
      await env.DB.prepare(
        `UPDATE replies SET likes = MAX(0, likes - 1) WHERE id = ?`
      ).bind(replyId).run();
      isLiked = false;
    } else {
      const likeId = `like-${Date.now()}`;
      await env.DB.prepare(
        `INSERT INTO likes (id, target_type, target_id, user_id, created_at) VALUES (?, 'reply', ?, ?, ?)`
      ).bind(likeId, replyId, userId, new Date().toISOString()).run();
      await env.DB.prepare(
        `UPDATE replies SET likes = likes + 1 WHERE id = ?`
      ).bind(replyId).run();
      isLiked = true;
    }

    const replyRow = await env.DB.prepare(`SELECT likes FROM replies WHERE id = ?`).bind(replyId).first();

    return new Response(
      JSON.stringify({ success: true, isLiked, likes: replyRow ? replyRow.likes : 0 }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
