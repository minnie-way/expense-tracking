import { createClient } from 'redis';

let client;
async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
  }
  return client;
}

const KEY = 'ledger-data';

export default async function handler(req, res) {
  const redis = await getClient();

  if (req.method === 'GET') {
    const value = await redis.get(KEY);
    res.status(200).json(value ? JSON.parse(value) : null);
  } else if (req.method === 'POST') {
    await redis.set(KEY, JSON.stringify(req.body));
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
}
