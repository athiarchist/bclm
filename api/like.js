import { createClient } from '@libsql/client';

function getDbClient() {
  const url = process.env.TURSO_DATABASE_URL || 'file:local_guestbook.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  return createClient({ url, authToken });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id, increment } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'Entry ID is required.' });
    }

    const db = getDbClient();
    const delta = increment ? 1 : -1;

    await db.execute({
      sql: `UPDATE guestbook SET likes = MAX(0, likes + ?) WHERE id = ?`,
      args: [delta, id]
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Like API Error:', error);
    return res.status(500).json({ error: 'Database update failed', details: error.message });
  }
}
