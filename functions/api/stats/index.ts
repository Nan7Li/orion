interface Env {
  DB: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { env } = context;
    const [topicsCnt, repliesCnt, usersCnt] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM topics`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM replies`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM users`).first(),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalTopics: (topicsCnt?.count || 0) + 136, // Add realistic base or show exact
          exactTopics: topicsCnt?.count || 0,
          totalReplies: (repliesCnt?.count || 0) + 892,
          exactReplies: repliesCnt?.count || 0,
          totalUsers: (usersCnt?.count || 0) + 2420,
          onlineVoyagers: 18 + Math.floor(Math.random() * 7),
          pulsarFrequency: '1420.405 MHz',
        },
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
