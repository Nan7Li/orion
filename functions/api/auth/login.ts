import { verifyTurnstileToken } from './_turnstile';

interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + ':orion_cosmic_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const body: any = await request.json();
    const { username, password, turnstileToken } = body;

    // 1. Cloudflare Turnstile bot verification
    const remoteIp = request.headers.get('CF-Connecting-IP') || undefined;
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, remoteIp);
    if (!turnstileCheck.success) {
      return new Response(
        JSON.stringify({ success: false, error: turnstileCheck.error }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: '请输入用户名与密码' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const inputName = username.trim().toLowerCase();

    // Query user by username or email
    const userRow = await env.DB.prepare(
      `SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?`
    ).bind(inputName, inputName).first();

    if (!userRow) {
      return new Response(
        JSON.stringify({ success: false, error: '用户不存在，请核对用户名或注册新账号' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const expectedHash = await hashPassword(password);
    if (userRow.password_hash && userRow.password_hash !== expectedHash) {
      return new Response(
        JSON.stringify({ success: false, error: '通行密钥（密码）错误，请重新输入' }),
        { status: 401, headers: CORS_HEADERS }
      );
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

    const token = btoa(JSON.stringify({ id: user.id, username: user.username, exp: Date.now() + 7 * 24 * 3600 * 1000 }));

    return new Response(
      JSON.stringify({ success: true, message: `欢迎登入 Orion 社区，${user.name}！`, user, token }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '登入验证失败' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
