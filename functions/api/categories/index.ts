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
    const res = await env.DB.prepare(`SELECT * FROM categories`).all();
    const rows = res.results || [];

    const categories = rows.map((c: any) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      color: c.color,
      bgColor: c.bg_color,
      topicsCount: c.topics_count || 0,
    }));

    return new Response(JSON.stringify({ success: true, categories }), {
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
