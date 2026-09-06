import { addEdgeBlacklist, removeEdgeBlacklist } from './_edgeBlacklist';

interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'users';

    // 1. List users with risk scores
    if (action === 'users') {
      const minRisk = parseInt(url.searchParams.get('minRisk') || '0', 10);
      const rows = await env.DB.prepare(
        `SELECT id, username, email, risk_score, status, risk_remark, joined_at 
         FROM users WHERE risk_score >= ? ORDER BY risk_score DESC LIMIT 50`
      ).bind(minRisk).all();
      return new Response(JSON.stringify({ success: true, data: rows.results }), { headers: CORS_HEADERS });
    }

    // 2. View user full profile
    if (action === 'user_profile') {
      const userId = url.searchParams.get('userId');
      if (!userId) {
        return new Response(JSON.stringify({ success: false, error: '缺少 userId 参数' }), { status: 400, headers: CORS_HEADERS });
      }

      const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      const devices = await env.DB.prepare('SELECT * FROM user_devices WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').bind(userId).all();
      const orders = await env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').bind(userId).all();
      const logs = await env.DB.prepare('SELECT * FROM security_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').bind(userId).all();

      return new Response(JSON.stringify({
        success: true,
        data: {
          user,
          devices: devices.results,
          orders: orders.results,
          securityLogs: logs.results
        }
      }), { headers: CORS_HEADERS });
    }

    // 3. List dynamic rules
    if (action === 'rules') {
      const rows = await env.DB.prepare('SELECT * FROM risk_rules ORDER BY scene, id').all();
      return new Response(JSON.stringify({ success: true, data: rows.results }), { headers: CORS_HEADERS });
    }

    // 4. List security logs
    if (action === 'logs') {
      const rows = await env.DB.prepare('SELECT * FROM security_logs ORDER BY id DESC LIMIT 50').all();
      return new Response(JSON.stringify({ success: true, data: rows.results }), { headers: CORS_HEADERS });
    }

    // 5. List blacklists
    if (action === 'blacklists') {
      const rows = await env.DB.prepare('SELECT * FROM blacklists ORDER BY id DESC LIMIT 50').all();
      return new Response(JSON.stringify({ success: true, data: rows.results }), { headers: CORS_HEADERS });
    }

    return new Response(JSON.stringify({ success: false, error: '未知 action' }), { status: 400, headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: CORS_HEADERS });
  }
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const body: any = await request.json().catch(() => ({}));
    const { action } = body;

    // 1. Adjust risk score
    if (action === 'adjust_score') {
      const { userId, newScore, reason } = body;
      await env.DB.prepare('UPDATE users SET risk_score = ?, risk_remark = ? WHERE id = ?')
        .bind(Number(newScore), reason || '管理员手动调整', userId).run();
      return new Response(JSON.stringify({ success: true, message: '风险分已更新' }), { headers: CORS_HEADERS });
    }

    // 2. Freeze account
    if (action === 'freeze') {
      const { userId, reason } = body;
      await env.DB.prepare("UPDATE users SET status = 'SUSPENDED', risk_remark = ? WHERE id = ?")
        .bind(reason || '因风控违规手动冻结', userId).run();
      return new Response(JSON.stringify({ success: true, message: '账号已被冻结' }), { headers: CORS_HEADERS });
    }

    // 3. Unfreeze account
    if (action === 'unfreeze') {
      const { userId } = body;
      await env.DB.prepare("UPDATE users SET status = 'ACTIVE', risk_score = 0, risk_remark = '管理员解封' WHERE id = ?")
        .bind(userId).run();
      return new Response(JSON.stringify({ success: true, message: '账号限制已解除' }), { headers: CORS_HEADERS });
    }

    // 4. Add to blacklist
    if (action === 'add_blacklist') {
      const { type, value, reason, expiresAt } = body;
      await addEdgeBlacklist(env.DB, type, value, reason, 'ADMIN', expiresAt || null);
      return new Response(JSON.stringify({ success: true, message: '成功加入黑名单' }), { headers: CORS_HEADERS });
    }

    // 5. Remove from blacklist
    if (action === 'remove_blacklist') {
      const { id } = body;
      await removeEdgeBlacklist(env.DB, Number(id));
      return new Response(JSON.stringify({ success: true, message: '已移出黑名单' }), { headers: CORS_HEADERS });
    }

    // 6. Update dynamic rule
    if (action === 'update_rule') {
      const { ruleCode, weight, isEnabled } = body;
      await env.DB.prepare(
        'UPDATE risk_rules SET weight = COALESCE(?, weight), is_enabled = COALESCE(?, is_enabled) WHERE rule_code = ?'
      ).bind(weight !== undefined ? Number(weight) : null, isEnabled !== undefined ? (isEnabled ? 1 : 0) : null, ruleCode).run();
      return new Response(JSON.stringify({ success: true, message: `规则 ${ruleCode} 已热生效更新` }), { headers: CORS_HEADERS });
    }

    return new Response(JSON.stringify({ success: false, error: '未知 action' }), { status: 400, headers: CORS_HEADERS });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: CORS_HEADERS });
  }
};
