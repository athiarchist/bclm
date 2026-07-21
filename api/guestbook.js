import { createClient } from '@libsql/client';

function getDbClient() {
  const url = process.env.TURSO_DATABASE_URL || 'file:local_guestbook.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  return createClient({ url, authToken });
}

async function initDb(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      message TEXT NOT NULL,
      photo TEXT,
      likes INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `);
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getDbClient();
    await initDb(db);

    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 100');
      const rows = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        location: row.location || 'Supporter',
        message: row.message,
        photo: row.photo || null,
        likes: Number(row.likes) || 1,
        time: formatRelativeTime(row.created_at)
      }));

      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, location, message, photo } = req.body || {};

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required.' });
      }

      const id = 'gb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const createdAt = new Date().toISOString();

      await db.execute({
        sql: `INSERT INTO guestbook (id, name, location, message, photo, likes, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)`,
        args: [id, name, location || 'Pasture Supporter', message, photo || null, createdAt]
      });

      const newEntry = {
        id,
        name,
        location: location || 'Pasture Supporter',
        message,
        photo: photo || null,
        likes: 1,
        time: 'Just now',
        liked: true
      };

      return res.status(201).json({ success: true, entry: newEntry });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Guestbook API Error:', error);
    return res.status(500).json({ error: 'Database operations failed', details: error.message });
  }
}

function formatRelativeTime(isoString) {
  if (!isoString) return 'Recently';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
