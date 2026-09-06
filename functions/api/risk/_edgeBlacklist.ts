export type BlacklistType = 'ip' | 'device' | 'email' | 'payment';

export interface BlacklistCheckResult {
  blacklisted: boolean;
  reason?: string;
}

export async function checkEdgeBlacklist(
  db: any,
  type: BlacklistType,
  rawValue: string
): Promise<BlacklistCheckResult> {
  if (!rawValue) return { blacklisted: false };
  const value = rawValue.trim().toLowerCase();

  try {
    const row = await db.prepare(
      `SELECT reason FROM blacklists 
       WHERE type = ? AND value = ? 
       AND (expires_at IS NULL OR expires_at > datetime('now')) 
       LIMIT 1`
    ).bind(type, value).first();

    if (row) {
      return {
        blacklisted: true,
        reason: String(row.reason || '已命中系统安全黑名单')
      };
    }
  } catch (err) {
    console.warn('[checkEdgeBlacklist Error]', err);
  }

  return { blacklisted: false };
}

export async function addEdgeBlacklist(
  db: any,
  type: BlacklistType,
  value: string,
  reason: string,
  operator = 'SYSTEM',
  expiresAt: string | null = null
): Promise<number> {
  const cleanVal = value.trim().toLowerCase();
  const res = await db.prepare(
    `INSERT INTO blacklists (type, value, reason, operator, expires_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(type, value) DO UPDATE SET
       reason = excluded.reason,
       operator = excluded.operator,
       expires_at = excluded.expires_at`
  ).bind(type, cleanVal, reason, operator, expiresAt).run();

  return res.meta?.last_row_id || 1;
}

export async function removeEdgeBlacklist(db: any, id: number): Promise<boolean> {
  const res = await db.prepare('DELETE FROM blacklists WHERE id = ?').bind(id).run();
  return (res.meta?.changes || 0) > 0;
}
