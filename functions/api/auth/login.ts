import { verifyTurnstileToken } from './_turnstile';
import { checkEdgeBlacklist } from '../risk/_edgeBlacklist';
import { checkLoginLockout, recordLoginFailure, clearLoginFailures } from '../risk/_edgeRateLimiter';
import { recordEdgeUserDevice } from '../risk/_edgeRiskEngine';

interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-device-hash',
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
    const body: any = await request.json().catch(() => ({}));
    const { username, password, turnstileToken, fingerprint } = body;

    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const headerDev = request.headers.get('x-device-hash');
    const deviceHash = fingerprint?.deviceHash || headerDev || body.device_hash || 'unknown-device';

    // 1. Blacklist Check
    const ipBl = await checkEdgeBlacklist(env.DB, 'ip', ip);
    if (ipBl.blacklisted) {
      return new Response(
        JSON.stringify({ success: false, code: 'BLACKLIST_IP_BLOCKED', error: `当前网络已被封禁: ${ipBl.reason}` }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    if (deviceHash !== 'unknown-device') {
      const devBl = await checkEdgeBlacklist(env.DB, 'device', deviceHash);
      if (devBl.blacklisted) {
        return new Response(
          JSON.stringify({ success: false, code: 'BLACKLIST_DEVICE_BLOCKED', error: `当前设备已被系统加入黑名单: ${devBl.reason}` }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }

    // 2. Cloudflare Turnstile bot verification
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileCheck.success) {
      return new Response(
        JSON.stringify({ success: false, code: 'TURNSTILE_REQUIRED', error: turnstileCheck.error }),
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

    // 3. Check Account Lockout Status (5 mins 10 fails -> 30 mins lockout)
    const lockCheck = await checkLoginLockout(env.DB, inputName);
    if (lockCheck.isLocked) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'ACCOUNT_LOGIN_LOCKED',
          error: `由于连续多次密码错误，账号已被锁定保护，请 ${lockCheck.waitMinutes} 分钟后再试`
        }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    // 4. Query user by username or email
    const userRow = await env.DB.prepare(
      `SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?`
    ).bind(inputName, inputName).first();

    if (!userRow) {
      const failInfo = await recordLoginFailure(env.DB, inputName);
      if (failInfo.locked) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'ACCOUNT_LOGIN_LOCKED',
            error: '密码连续错误达到上限，账号已被保护性锁定 30 分钟'
          }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: '用户不存在，请核对用户名或注册新账号' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Check account status
    if (userRow.status === 'SUSPENDED') {
      return new Response(
        JSON.stringify({ success: false, code: 'ACCOUNT_SUSPENDED', error: '该账号已被风控系统封禁，请联系客服处理' }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const expectedHash = await hashPassword(password);
    if (userRow.password_hash !== expectedHash) {
      const failInfo = await recordLoginFailure(env.DB, inputName);
      if (failInfo.locked) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'ACCOUNT_LOGIN_LOCKED',
            error: '密码连续错误达到上限，账号已被保护性锁定 30 分钟'
          }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: `密码错误，剩余尝试次数: ${Math.max(0, 10 - failInfo.failCount)}` }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // 5. Login successful: clear failure counts & record device binding
    await clearLoginFailures(env.DB, inputName);
    if (deviceHash !== 'unknown-device') {
      await recordEdgeUserDevice(
        env.DB,
        userRow.id,
        deviceHash,
        ip,
        request.headers.get('User-Agent') || '',
        fingerprint
      );
    }

    const badges = typeof userRow.badges === 'string' ? JSON.parse(userRow.badges || '[]') : userRow.badges || [];

    const user = {
      id: userRow.id,
      username: userRow.username,
      name: userRow.name || userRow.username,
      avatar: userRow.avatar,
      email: userRow.email || undefined,
      trustLevel: userRow.trust_level || 1,
      trustTitle: userRow.trust_title || '星际漫游者',
      bio: userRow.bio || '',
      joinedAt: userRow.joined_at,
      likesReceived: userRow.likes_received || 0,
      topicsCount: userRow.topics_count || 0,
      badges,
      riskScore: userRow.risk_score || 0,
      status: userRow.status || 'ACTIVE'
    };

    const token = btoa(JSON.stringify({ id: userRow.id, username: userRow.username, exp: Date.now() + 7 * 24 * 3600 * 1000 }));

    return new Response(
      JSON.stringify({ success: true, message: '航行认证成功，欢迎登舰！', user, token }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '登录失败' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
