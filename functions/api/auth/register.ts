import { checkEdgeSlidingWindow } from '../risk/_edgeRateLimiter';
import { checkEdgeBlacklist } from '../risk/_edgeBlacklist';
import { evaluateEdgeRisk, recordEdgeUserDevice } from '../risk/_edgeRiskEngine';

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
    let { username, name, password, email, turnstileToken, form_fill_duration_ms, fingerprint } = body;

    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const headerDev = request.headers.get('x-device-hash');
    const deviceHash = fingerprint?.deviceHash || headerDev || body.device_hash || 'unknown-device';

    // -------------------------------------------------------------
    // 1. Blacklist Check (IP, Device, Email)
    // -------------------------------------------------------------
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
          JSON.stringify({ success: false, code: 'BLACKLIST_DEVICE_BLOCKED', error: `当前设备已被风控拉黑: ${devBl.reason}` }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }

    if (email) {
      const emailBl = await checkEdgeBlacklist(env.DB, 'email', email);
      if (emailBl.blacklisted) {
        return new Response(
          JSON.stringify({ success: false, code: 'BLACKLIST_EMAIL_BLOCKED', error: `该邮箱已被禁止注册: ${emailBl.reason}` }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }

    // -------------------------------------------------------------
    // 2. Sliding Window Rate Limiting (IP: 10m/3, Device: 10m/5)
    // -------------------------------------------------------------
    const ipLimit = await checkEdgeSlidingWindow(env.DB, `rl:reg:ip:${ip}`, 600, 3);
    if (!ipLimit.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'RATE_LIMIT_IP_EXCEEDED',
          error: `当前 IP 注册过于频繁，请 ${ipLimit.retryAfter} 秒后再试`,
          retryAfter: ipLimit.retryAfter
        }),
        { status: 429, headers: CORS_HEADERS }
      );
    }

    if (deviceHash !== 'unknown-device') {
      const devLimit = await checkEdgeSlidingWindow(env.DB, `rl:reg:dev:${deviceHash}`, 600, 5);
      if (!devLimit.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'RATE_LIMIT_DEVICE_EXCEEDED',
            error: `当前设备注册过于频繁，请 ${devLimit.retryAfter} 秒后再试`,
            retryAfter: devLimit.retryAfter
          }),
          { status: 429, headers: CORS_HEADERS }
        );
      }
    }

    // -------------------------------------------------------------
    // 3. Basic Input Validation
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 4. Edge Risk Scoring Engine Assessment
    // -------------------------------------------------------------
    const riskEval = await evaluateEdgeRisk(env.DB, {
      scene: 'REGISTER',
      username,
      email,
      ip,
      deviceHash,
      formFillDurationMs: form_fill_duration_ms ? Number(form_fill_duration_ms) : undefined,
      turnstileToken,
      cf: (request as any).cf
    });

    if (riskEval.action === 'REJECT') {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'RISK_REJECTED',
          error: '系统检测到注册环境存在极高安全风险，已被阻断',
          riskScore: riskEval.totalScore,
          triggeredRules: riskEval.triggeredRules
        }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    if (riskEval.action === 'CHALLENGE_TURNSTILE') {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'CHALLENGE_REQUIRED',
          needTurnstile: true,
          siteKey: '0x4AAAAAAEpRBYS-ySS6TpRE',
          error: '触发智能风控保护，请先完成 Cloudflare 人机安全验证',
          riskScore: riskEval.totalScore,
          triggeredRules: riskEval.triggeredRules
        }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    // -------------------------------------------------------------
    // 5. Create User in Cloudflare D1
    // -------------------------------------------------------------
    const userId = `user-${Date.now()}`;
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString().split('T')[0];
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}&backgroundColor=0f172a,1e1b4b`;
    const initialBadges = JSON.stringify(['🚀 新晋漫游者', '✨ 跃迁启航']);
    const userStatus = riskEval.action === 'MANUAL_REVIEW' ? 'PENDING_REVIEW' : 'ACTIVE';

    await env.DB.prepare(
      `INSERT INTO users (id, username, password_hash, name, avatar, email, trust_level, trust_title, bio, joined_at, likes_received, topics_count, badges, risk_score, status, risk_remark)
       VALUES (?, ?, ?, ?, ?, ?, 1, '星际漫游者', '刚刚抵达猎户座星系的新晋探索者。', ?, 0, 0, ?, ?, ?, ?)`
    ).bind(
      userId,
      username,
      passwordHash,
      name,
      avatar,
      email || null,
      now,
      initialBadges,
      riskEval.totalScore,
      userStatus,
      riskEval.triggeredRules.map(r => r.name).join('; ') || '正常注册'
    ).run();

    // 6. Record Device Fingerprint
    if (deviceHash !== 'unknown-device') {
      await recordEdgeUserDevice(
        env.DB,
        userId,
        deviceHash,
        ip,
        request.headers.get('User-Agent') || '',
        fingerprint
      );
    }

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
      riskScore: riskEval.totalScore,
      status: userStatus
    };

    const token = btoa(JSON.stringify({ id: userId, username, exp: Date.now() + 7 * 24 * 3600 * 1000 }));

    return new Response(
      JSON.stringify({
        success: true,
        message: userStatus === 'PENDING_REVIEW'
          ? '注册已提交，触发风控安全审核，审核通过后即可登录'
          : '跃迁注册成功！欢迎登入 Orion 猎户座社区',
        user,
        token,
        riskScore: riskEval.totalScore
      }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '注册失败' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
