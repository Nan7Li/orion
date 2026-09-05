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
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, error: '请完整填写邮箱、6位验证码与新密码' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: '新通行密钥长度不得少于 6 位' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const inputEmail = email.trim().toLowerCase();
    const inputCode = code.trim();
    const nowMs = Date.now();

    // Verify code in D1
    const resetRecord = await env.DB.prepare(
      `SELECT * FROM password_resets 
       WHERE LOWER(email) = ? AND code = ? AND used = 0 AND expires_at > ?
       ORDER BY expires_at DESC LIMIT 1`
    ).bind(inputEmail, inputCode, nowMs).first();

    if (!resetRecord) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '验证码不正确或已失效，请重新核对或重新获取验证码',
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Hash new password
    const newHash = await hashPassword(newPassword);

    // Update user password in D1
    await env.DB.prepare(
      `UPDATE users SET password_hash = ? WHERE id = ?`
    ).bind(newHash, resetRecord.user_id).run();

    // Mark reset code as used
    await env.DB.prepare(
      `UPDATE password_resets SET used = 1 WHERE id = ?`
    ).bind(resetRecord.id).run();

    // Fetch refreshed user info
    const userRow = await env.DB.prepare(
      `SELECT * FROM users WHERE id = ?`
    ).bind(resetRecord.user_id).first();

    if (!userRow) {
      return new Response(
        JSON.stringify({ success: false, error: '账号状态异常' }),
        { status: 404, headers: CORS_HEADERS }
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
      JSON.stringify({
        success: true,
        message: '通行密钥重置成功！已为您自动登入星舰网络。',
        user,
        token,
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '重置密码失败' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
