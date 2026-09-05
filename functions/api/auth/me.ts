interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: '未登录' }), {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    let payload: any;
    try {
      payload = JSON.parse(atob(token));
    } catch {
      return new Response(JSON.stringify({ success: false, error: '无效令牌' }), {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    if (!payload.id) {
      return new Response(JSON.stringify({ success: false, error: '无效会话' }), {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(payload.id).first();
    if (!userRow) {
      return new Response(JSON.stringify({ success: false, error: '用户不存在' }), {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    let parsedBadges: string[] = [];
    try {
      parsedBadges = typeof userRow.badges === 'string' ? JSON.parse(userRow.badges) : userRow.badges || [];
    } catch {
      parsedBadges = [];
    }

    const user = {
      id: userRow.id,
      username: userRow.username,
      name: userRow.name,
      avatar: userRow.avatar,
      email: userRow.email || undefined,
      trustLevel: userRow.trust_level,
      trustTitle: userRow.trust_title,
      bio: userRow.bio || '',
      joinedAt: userRow.joined_at,
      likesReceived: userRow.likes_received || 0,
      topicsCount: userRow.topics_count || 0,
      badges: parsedBadges,
      location: userRow.location || '',
      website: userRow.website || '',
    };

    return new Response(JSON.stringify({ success: true, user }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
