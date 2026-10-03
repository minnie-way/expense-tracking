import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { filename, dataBase64, contentType } = req.body;
    if (!filename || !dataBase64) {
      return res.status(400).json({ error: 'Missing filename or image data' });
    }
    const buffer = Buffer.from(dataBase64, 'base64');
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType || 'image/jpeg',
      addRandomSuffix: true,
    });
    res.status(200).json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
