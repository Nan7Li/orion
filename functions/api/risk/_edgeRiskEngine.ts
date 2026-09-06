import { isDisposableEmail } from './_disposableEmails';
import { verifyTurnstileToken } from '../auth/_turnstile';

export type RiskScene = 'REGISTER' | 'LOGIN' | 'ORDER';

export interface EdgeRiskContext {
  scene: RiskScene;
  userId?: string;
  username?: string;
  email?: string;
  ip: string;
  deviceHash: string;
  formFillDurationMs?: number;
  paymentAccountHash?: string;
  turnstileToken?: string;
  cf?: any;
}

export interface RuleDetail {
  code: string;
  name: string;
  score: number;
  detail: string;
}

export interface EdgeRiskResult {
  totalScore: number;
  level: 'NORMAL' | 'CHALLENGE' | 'REVIEW' | 'RESTRICTED';
  action: 'PASS' | 'CHALLENGE_TURNSTILE' | 'MANUAL_REVIEW' | 'REJECT';
  triggeredRules: RuleDetail[];
  turnstileVerified?: boolean;
}

/**
 * Cloudflare Edge Risk Evaluation Pipeline
 */
export async function evaluateEdgeRisk(
  db: any,
  ctx: EdgeRiskContext
): Promise<EdgeRiskResult> {
  // 1. Fetch dynamic rule configs from D1
  let activeRules: Record<string, { weight: number; is_enabled: boolean }> = {};
  try {
    const rulesRows = await db.prepare('SELECT rule_code, weight, is_enabled FROM risk_rules').all();
    if (rulesRows?.results) {
      for (const r of rulesRows.results) {
        activeRules[r.rule_code] = {
          weight: Number(r.weight),
          is_enabled: Number(r.is_enabled) === 1
        };
      }
    }
  } catch (err) {
    console.warn('[evaluateEdgeRisk rule fetch warning]', err);
  }

  const getWeight = (code: string, def: number) => {
    if (activeRules[code]) {
      return activeRules[code].is_enabled ? activeRules[code].weight : 0;
    }
    return def;
  };

  const triggeredRules: RuleDetail[] = [];
  let totalScore = 0;

  // -------------------------------------------------------------
  // Scene: REGISTER
  // -------------------------------------------------------------
  if (ctx.scene === 'REGISTER') {
    // Rule 1: Same IP Existing Accounts (past 7 days)
    const ipWeight = getWeight('SAME_IP_ACCOUNT', 20);
    if (ipWeight > 0 && ctx.ip) {
      try {
        const row = await db.prepare(
          `SELECT COUNT(DISTINCT user_id) as count FROM user_devices 
           WHERE ip = ? AND created_at >= datetime('now', '-7 days')`
        ).bind(ctx.ip).first();
        const count = Number(row?.count || 0);
        if (count >= 1) {
          triggeredRules.push({
            code: 'SAME_IP_ACCOUNT',
            name: '同IP已有账号',
            score: ipWeight,
            detail: `同一 IP 在过去 7 天内已关联 ${count} 个账号`
          });
          totalScore += ipWeight;
        }
      } catch (e) {}
    }

    // Rule 2: Same Device Existing Accounts
    const devWeight = getWeight('SAME_DEVICE_ACCOUNT', 30);
    if (devWeight > 0 && ctx.deviceHash && ctx.deviceHash !== 'unknown-device') {
      try {
        const row = await db.prepare(
          `SELECT COUNT(DISTINCT user_id) as count FROM user_devices 
           WHERE device_hash = ?`
        ).bind(ctx.deviceHash).first();
        const count = Number(row?.count || 0);
        if (count >= 1) {
          triggeredRules.push({
            code: 'SAME_DEVICE_ACCOUNT',
            name: '同设备已有账号',
            score: devWeight,
            detail: `同一物理设备已被 ${count} 个其他账号绑定使用`
          });
          totalScore += devWeight;
        }
      } catch (e) {}
    }

    // Rule 3: Cloudflare Native Edge Proxy / Tor / Datacenter ASN check
    const proxyWeight = getWeight('PROXY_VPN_IP', 20);
    if (proxyWeight > 0 && ctx.cf) {
      const country = String(ctx.cf.country || '').toUpperCase();
      const asn = Number(ctx.cf.asn || 0);
      const threatScore = Number(ctx.cf.threatScore || 0);

      // Major datacenter/hosting ASNs frequently abused by bot crawlers
      const datacenterAsns = [
        37963, 45102, 45090, 25820, 14061, 16509, 14618, 15169, 8075, 20473
      ];

      let isProxy = false;
      let reason = '';

      if (country === 'T1') {
        isProxy = true;
        reason = 'Cloudflare 识别到 Tor 匿名网络出口节点';
      } else if (country === 'XX' || country === 'A1') {
        isProxy = true;
        reason = 'Cloudflare 识别到匿名代理卫星网络';
      } else if (threatScore > 30) {
        isProxy = true;
        reason = `Cloudflare 威胁度超标 (Threat Score: ${threatScore})`;
      } else if (datacenterAsns.includes(asn)) {
        isProxy = true;
        reason = `公网机房/云服务器 IDC ASN 访问 (${asn})`;
      }

      if (isProxy) {
        triggeredRules.push({
          code: 'PROXY_VPN_IP',
          name: '代理/VPN/IDC机房IP',
          score: proxyWeight,
          detail: reason
        });
        totalScore += proxyWeight;
      }
    }

    // Rule 4: Disposable / Temporary Email Check
    const emailWeight = getWeight('DISPOSABLE_EMAIL', 20);
    if (emailWeight > 0 && ctx.email && isDisposableEmail(ctx.email)) {
      triggeredRules.push({
        code: 'DISPOSABLE_EMAIL',
        name: '临时/一次性邮箱',
        score: emailWeight,
        detail: `邮箱域名属于公共临时邮箱池: ${ctx.email.split('@')[1]}`
      });
      totalScore += emailWeight;
    }

    // Rule 5: Registration Velocity Check (< 1500ms)
    const velWeight = getWeight('REGISTRATION_VELOCITY', 20);
    if (velWeight > 0 && ctx.formFillDurationMs !== undefined && ctx.formFillDurationMs < 1500) {
      triggeredRules.push({
        code: 'REGISTRATION_VELOCITY',
        name: '异常注册速度',
        score: velWeight,
        detail: `表单提交耗时仅 ${ctx.formFillDurationMs}ms (< 1500ms)，属于脚本自动化快速填充`
      });
      totalScore += velWeight;
    }
  }

  // -------------------------------------------------------------
  // Scene: ORDER
  // -------------------------------------------------------------
  if (ctx.scene === 'ORDER') {
    // Rule 6: Same Device Multiple Accounts Ordering
    const devOrderWeight = getWeight('SAME_DEVICE_MULTI_ACCOUNT_ORDER', 30);
    if (devOrderWeight > 0 && ctx.deviceHash && ctx.deviceHash !== 'unknown-device') {
      try {
        const row = await db.prepare(
          `SELECT COUNT(DISTINCT user_id) as count FROM orders 
           WHERE device_hash = ? AND user_id != ?`
        ).bind(ctx.deviceHash, ctx.userId || '').first();
        const count = Number(row?.count || 0);
        if (count >= 1) {
          triggeredRules.push({
            code: 'SAME_DEVICE_MULTI_ACCOUNT_ORDER',
            name: '同设备多账号购买',
            score: devOrderWeight,
            detail: `该物理设备此前已被其他 ${count} 个账号下单购买`
          });
          totalScore += devOrderWeight;
        }
      } catch (e) {}
    }

    // Rule 7: Same Payment Method Across Accounts
    const payWeight = getWeight('SAME_PAYMENT_METHOD', 30);
    if (payWeight > 0 && ctx.paymentAccountHash && ctx.paymentAccountHash !== 'no-account-hash') {
      try {
        const row = await db.prepare(
          `SELECT COUNT(DISTINCT user_id) as count FROM orders 
           WHERE payment_account_hash = ? AND user_id != ?`
        ).bind(ctx.paymentAccountHash, ctx.userId || '').first();
        const count = Number(row?.count || 0);
        if (count >= 1) {
          triggeredRules.push({
            code: 'SAME_PAYMENT_METHOD',
            name: '同支付方式跨账号关联',
            score: payWeight,
            detail: `买家支付账号已被其他 ${count} 个用户账号绑定过`
          });
          totalScore += payWeight;
        }
      } catch (e) {}
    }

    // Rule 8: Order Spike Velocity (3 orders in 30s)
    const spikeWeight = getWeight('ORDER_SPIKE_VELOCITY', 20);
    if (spikeWeight > 0 && ctx.userId) {
      try {
        const countRow = await db.prepare(
          `SELECT COUNT(*) as count FROM orders 
           WHERE user_id = ? AND created_at >= datetime('now', '-30 seconds')`
        ).bind(ctx.userId).first();
        const count = Number(countRow?.count || 0);
        if (count >= 3) {
          triggeredRules.push({
            code: 'ORDER_SPIKE_VELOCITY',
            name: '短时间突发大量订单',
            score: spikeWeight,
            detail: `过去 30 秒内已连续发起 ${count} 笔订单`
          });
          totalScore += spikeWeight;
        }
      } catch (e) {}
    }
  }

  // -------------------------------------------------------------
  // Decision Tree
  // -------------------------------------------------------------
  let level: 'NORMAL' | 'CHALLENGE' | 'REVIEW' | 'RESTRICTED' = 'NORMAL';
  let action: 'PASS' | 'CHALLENGE_TURNSTILE' | 'MANUAL_REVIEW' | 'REJECT' = 'PASS';
  let turnstileVerified = false;

  if (totalScore < 40) {
    level = 'NORMAL';
    action = 'PASS';
  } else if (totalScore < 70) {
    level = 'CHALLENGE';
    // If Turnstile token passed, verify it!
    if (ctx.turnstileToken) {
      const check = await verifyTurnstileToken(ctx.turnstileToken, ctx.ip);
      if (check.success) {
        turnstileVerified = true;
        action = 'PASS'; // Verified, downgraded to pass
      } else {
        action = 'CHALLENGE_TURNSTILE';
      }
    } else {
      action = 'CHALLENGE_TURNSTILE';
    }
  } else if (totalScore < 100) {
    level = 'REVIEW';
    action = 'MANUAL_REVIEW';
  } else {
    level = 'RESTRICTED';
    action = 'REJECT';
  }

  // -------------------------------------------------------------
  // Async Record Security Audit Log
  // -------------------------------------------------------------
  try {
    await db.prepare(
      `INSERT INTO security_logs (user_id, event_type, ip, device_hash, risk_score, risk_change, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      ctx.userId || null,
      `RISK_${ctx.scene}`,
      ctx.ip,
      ctx.deviceHash || '',
      totalScore,
      totalScore,
      JSON.stringify({ scene: ctx.scene, totalScore, level, action, triggeredRules, turnstileVerified })
    ).run();
  } catch (err) {
    console.warn('[Security Log Write Warning]', err);
  }

  return {
    totalScore,
    level,
    action,
    triggeredRules,
    turnstileVerified
  };
}

/**
 * Record or update user device fingerprint binding
 */
export async function recordEdgeUserDevice(
  db: any,
  userId: string,
  deviceHash: string,
  ip: string,
  userAgent: string,
  extra: any = {}
): Promise<void> {
  if (!deviceHash || deviceHash === 'unknown-device') return;
  try {
    await db.prepare(
      `INSERT INTO user_devices (user_id, device_hash, ip, user_agent, screen_resolution, timezone, canvas_hash, webgl_vendor)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      userId,
      deviceHash,
      ip,
      userAgent || '',
      extra.screenResolution || '',
      extra.timezone || '',
      extra.canvasHash || '',
      extra.webglVendor || ''
    ).run();
  } catch (err) {
    console.warn('[recordEdgeUserDevice error]', err);
  }
}
