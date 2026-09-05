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
    let { username, name, password, email, turnstileToken } = body;

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
        JSON.stringify({ success: false, error: '用户名与密码为必填项' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    username = username.trim().toLowerCase();
    name = (name || username).trim();

    if (username.length < 3 || username.length > 20) {
      return new Response(
        JSON.stringify({ success: false, error: '用户名长度需在 3 到 20 个字符之间' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return new Response(
        JSON.stringify({ success: false, error: '用户名仅支持英文字母、数字、下划线及横线' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: '密码长度至少需 6 位' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Check existing username
    const existing = await env.DB.prepare(
      `SELECT id FROM users WHERE LOWER(username) = ?`
    ).bind(username).first();

    if (existing) {
      return new Response(
        JSON.stringify({ success: false, error: '该星舰呼号/用户名已被注册，请尝试其他名称' }),
        { status: 409, headers: CORS_HEADERS }
      );
    }

    const userId = `user-${Date.now()}`;
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString().split('T')[0];
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}&backgroundColor=0f172a,1e1b4b`;
    const initialBadges = JSON.stringify(['🚀 新晋漫游者', '✨ 跃迁启航']);

    await env.DB.prepare(
      `INSERT INTO users (id, username, password_hash, name, avatar, email, trust_level, trust_title, bio, joined_at, likes_received, topics_count, badges)
       VALUES (?, ?, ?, ?, ?, ?, 1, '星际漫游者', '刚刚抵达猎户座星系的新晋探索者。', ?, 0, 0, ?)`
    ).bind(userId, username, passwordHash, name, avatar, email || null, now, initialBadges).run();

    const user = {
      id: userId,
      username,
      name,
      avatar,
      email: email || undefined,
      trustLevel: 1,
      trustTitle: '星际漫游者',
      bio: '刚刚抵达猎户座星系的新晋探索者。',
      joinedAt: now,
      likesReceived: 0,
      topicsCount: 0,
      badges: ['🚀 新晋漫游者', '✨ 跃迁启航'],
    };

    const token = btoa(JSON.stringify({ id: userId, username, exp: Date.now() + 7 * 24 * 3600 * 1000 }));

    return new Response(
      JSON.stringify({ success: true, message: '跃迁注册成功！欢迎登入 Orion 猎户座社区', user, token }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '注册失败' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
