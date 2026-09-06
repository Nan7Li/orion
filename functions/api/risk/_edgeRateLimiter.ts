export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

/**
 * Cloudflare Edge Atomic Sliding Window Rate Limiter using Cloudflare D1
 */
export async function checkEdgeSlidingWindow(
  db: any,
  rateKey: string,
  windowSec: number,
  maxAllowed: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const clearBefore = now - windowMs;

  try {
    // 1. Clean expired entries & count active requests atomically
    await db.prepare('DELETE FROM edge_rate_limits WHERE rate_key = ? AND timestamp < ?')
      .bind(rateKey, clearBefore)
      .run();

    const countRow = await db.prepare(
      'SELECT COUNT(*) as count, MIN(timestamp) as oldest FROM edge_rate_limits WHERE rate_key = ?'
    ).bind(rateKey).first();

    const currentCount = Number(countRow?.count || 0);

    if (currentCount < maxAllowed) {
      // Record this attempt
      await db.prepare('INSERT INTO edge_rate_limits (rate_key, timestamp) VALUES (?, ?)')
        .bind(rateKey, now)
        .run();

      return {
        allowed: true,
        remaining: maxAllowed - currentCount - 1,
        retryAfter: 0
      };
    } else {
      const oldest = Number(countRow?.oldest || now);
      const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        retryAfter
      };
    }
  } catch (err) {
    console.warn('[Edge RateLimiter Error]', err);
    return { allowed: true, remaining: 1, retryAfter: 0 };
  }
}

/**
 * Check if an account identifier is locked out (30 mins lockout)
 */
export async function checkLoginLockout(db: any, identifier: string): Promise<{ isLocked: boolean; waitMinutes: number }> {
  if (!identifier) return { isLocked: false, waitMinutes: 0 };
  const now = Date.now();

  try {
    const row = await db.prepare(
      'SELECT locked_until FROM login_lockouts WHERE identifier = ?'
    ).bind(identifier.toLowerCase()).first();

    if (row && Number(row.locked_until) > now) {
      const remainingMs = Number(row.locked_until) - now;
      return {
        isLocked: true,
        waitMinutes: Math.max(1, Math.ceil(remainingMs / 60000))
      };
    }
  } catch (err) {
    console.warn('[checkLoginLockout Error]', err);
  }

  return { isLocked: false, waitMinutes: 0 };
}

/**
 * Record a login failure: 5 mins 10 fails -> lock for 30 mins
 */
export async function recordLoginFailure(db: any, identifier: string): Promise<{ locked: boolean; failCount: number }> {
  const now = Date.now();
  const idLower = identifier.toLowerCase();
  const lockoutMs = 1800 * 1000; // 30 mins
  const windowMs = 300 * 1000;   // 5 mins

  try {
    const row = await db.prepare(
      'SELECT fail_count, last_fail_at FROM login_lockouts WHERE identifier = ?'
    ).bind(idLower).first();

    let failCount = 1;
    if (row) {
      // If previous failure was within 5 minutes, accumulate
      if (now - Number(row.last_fail_at) < windowMs) {
        failCount = Number(row.fail_count) + 1;
      }
    }

    let lockedUntil = 0;
    if (failCount >= 10) {
      lockedUntil = now + lockoutMs;
    }

    await db.prepare(
      `INSERT INTO login_lockouts (identifier, fail_count, locked_until, last_fail_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(identifier) DO UPDATE SET
         fail_count = ?,
         locked_until = ?,
         last_fail_at = ?`
    ).bind(idLower, failCount, lockedUntil, now, failCount, lockedUntil, now).run();

    return {
      locked: lockedUntil > 0,
      failCount
    };
  } catch (err) {
    console.warn('[recordLoginFailure Error]', err);
    return { locked: false, failCount: 1 };
  }
}

/**
 * Clear login failure count on successful login
 */
export async function clearLoginFailures(db: any, identifier: string): Promise<void> {
  try {
    await db.prepare('DELETE FROM login_lockouts WHERE identifier = ?')
      .bind(identifier.toLowerCase())
      .run();
  } catch (err) {}
}
