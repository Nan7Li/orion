import { checkEdgeSlidingWindow } from '../risk/_edgeRateLimiter';
import { checkEdgeBlacklist } from '../risk/_edgeBlacklist';
import { evaluateEdgeRisk } from '../risk/_edgeRiskEngine';

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

async function hashSha256(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const body: any = await request.json().catch(() => ({}));
    const { userId, productId, amount, paymentMethod, paymentAccount, turnstileToken, fingerprint } = body;

    if (!userId || !productId || !amount || !paymentMethod) {
      return new Response(
        JSON.stringify({ success: false, error: 'userId, productId, amount, paymentMethod 均为必填项' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const headerDev = request.headers.get('x-device-hash');
    const deviceHash = fingerprint?.deviceHash || headerDev || body.device_hash || 'unknown-device';

    // Hash buyer payment account
    const paymentAccountHash = paymentAccount ? await hashSha256(String(paymentAccount).trim()) : 'no-account-hash';

    // 1. Blacklist Check
    const ipBl = await checkEdgeBlacklist(env.DB, 'ip', ip);
    if (ipBl.blacklisted) {
      return new Response(
        JSON.stringify({ success: false, code: 'BLACKLIST_IP_BLOCKED', error: `网络异常: ${ipBl.reason}` }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    if (deviceHash !== 'unknown-device') {
      const devBl = await checkEdgeBlacklist(env.DB, 'device', deviceHash);
      if (devBl.blacklisted) {
        return new Response(
          JSON.stringify({ success: false, code: 'BLACKLIST_DEVICE_BLOCKED', error: `设备已被加入风控黑名单: ${devBl.reason}` }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }

    if (paymentAccountHash !== 'no-account-hash') {
      const payBl = await checkEdgeBlacklist(env.DB, 'payment', paymentAccountHash);
      if (payBl.blacklisted) {
        return new Response(
          JSON.stringify({ success: false, code: 'BLACKLIST_PAYMENT_BLOCKED', error: `支付账号存在恶意风险，已冻结: ${payBl.reason}` }),
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }

    // 2. Order Rate Limiting (1 min max 5 orders)
    const orderLimit = await checkEdgeSlidingWindow(env.DB, `rl:ord:user:${userId}`, 60, 5);
    if (!orderLimit.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'RATE_LIMIT_ORDER_EXCEEDED',
          error: `下单请求过于频繁，请 ${orderLimit.retryAfter} 秒后再试`,
          retryAfter: orderLimit.retryAfter
        }),
        { status: 429, headers: CORS_HEADERS }
      );
    }

    // 3. Edge Risk Scoring Engine Assessment (Scene: ORDER)
    const riskEval = await evaluateEdgeRisk(env.DB, {
      scene: 'ORDER',
      userId: String(userId),
      ip,
      deviceHash,
      paymentAccountHash,
      turnstileToken,
      cf: (request as any).cf
    });

    if (riskEval.action === 'REJECT') {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'ORDER_RISK_REJECTED',
          error: '系统检测到订单存在刷单或套利风险，已被阻断',
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
          error: '订单触发智能人机安全验证，请验证后继续',
          riskScore: riskEval.totalScore,
          triggeredRules: riskEval.triggeredRules
        }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    // 4. Create Order in Cloudflare D1
    const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const orderStatus = riskEval.action === 'MANUAL_REVIEW' ? 'PENDING_REVIEW' : 'PENDING_PAY';

    const insertResult = await env.DB.prepare(
      `INSERT INTO orders (order_no, user_id, product_id, amount, device_hash, ip, payment_method, payment_account_hash, risk_score, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderNo,
      String(userId),
      String(productId),
      Number(amount),
      deviceHash,
      ip,
      paymentMethod,
      paymentAccountHash,
      riskEval.totalScore,
      orderStatus
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: orderStatus === 'PENDING_REVIEW'
          ? '订单已创建，因风控保护转入人工核实队列，审核通过后自动发卡'
          : '下单成功，请继续完成付款',
        data: {
          orderId: insertResult.meta?.last_row_id || 1,
          orderNo,
          status: orderStatus,
          riskScore: riskEval.totalScore,
          triggeredRules: riskEval.triggeredRules
        }
      }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || '下单处理异常' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
