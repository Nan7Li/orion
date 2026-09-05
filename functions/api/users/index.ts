interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { env } = context;
    const res = await env.DB.prepare(`SELECT * FROM users ORDER BY trust_level DESC, likes_received DESC`).all();
    const rows = res.results || [];

    const users = rows.map((u: any) => {
      let badges: string[] = [];
      try { badges = JSON.parse(u.badges); } catch { badges = []; }
      return {
        id: u.id,
        username: u.username,
        name: u.name,
        avatar: u.avatar,
        trustLevel: u.trust_level,
        trustTitle: u.trust_title,
        bio: u.bio || '',
        joinedAt: u.joined_at,
        likesReceived: u.likes_received || 0,
        topicsCount: u.topics_count || 0,
        badges,
        location: u.location || '',
        website: u.website || '',
      };
    });

    return new Response(JSON.stringify({ success: true, users }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const onRequestPatch = async (context: { env: Env; request: Request }) => {
  try {
    const { env, request } = context;
    const body: any = await request.json();
    const { id, name, avatar, bio, location, website } = body;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'User ID required' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (avatar) { updates.push('avatar = ?'); values.push(avatar); }
    if (bio !== undefined) { updates.push('bio = ?'); values.push(bio); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (website !== undefined) { updates.push('website = ?'); values.push(website); }

    if (updates.length > 0) {
      values.push(id);
      await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
    }

    const userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
    let badges: string[] = [];
    if (userRow && userRow.badges) {
      try { badges = JSON.parse(userRow.badges); } catch { badges = []; }
    }

    const updatedUser = userRow ? {
      id: userRow.id,
      username: userRow.username,
      name: userRow.name,
      avatar: userRow.avatar,
      trustLevel: userRow.trust_level,
      trustTitle: userRow.trust_title,
      bio: userRow.bio || '',
      joinedAt: userRow.joined_at,
      likesReceived: userRow.likes_received || 0,
      topicsCount: userRow.topics_count || 0,
      badges,
      location: userRow.location || '',
      website: userRow.website || '',
    } : null;

    return new Response(JSON.stringify({ success: true, user: updatedUser }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
