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

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const body: any = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: '请输入您注册时绑定的电子邮箱' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const inputEmail = email.trim().toLowerCase();

    // Query user by email (or username fallback)
    const userRow = await env.DB.prepare(
      `SELECT id, username, name, email FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?`
    ).bind(inputEmail, inputEmail).first();

    if (!userRow) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '未找到绑定该邮箱的星舰探索者账号，请确认邮箱或前往跃迁注册',
        }),
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Generate 6-digit numeric cosmic code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const id = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    const nowIso = new Date().toISOString();

    // Invalidate previous unused codes for this email
    await env.DB.prepare(
      `UPDATE password_resets SET used = 1 WHERE LOWER(email) = ? AND used = 0`
    ).bind(inputEmail).run();

    // Insert new reset verification code
    await env.DB.prepare(
      `INSERT INTO password_resets (id, user_id, email, code, expires_at, used, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`
    ).bind(id, userRow.id, userRow.email || inputEmail, code, expiresAt, nowIso).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '星际通行密钥重置验证码已生成！',
        username: userRow.username,
        name: userRow.name,
        email: userRow.email || inputEmail,
        code, // Returned for instant testing and frictionless demo, also can be sent via SMTP in production
        expiresMinutes: 15,
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '请求找回账号失败' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
