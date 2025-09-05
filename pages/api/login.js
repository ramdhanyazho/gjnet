
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getCollection } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  try {
    const users = await getCollection(process.env.COUCHBASE_USERS_COL);
    const result = await users.get(username).catch(() => null);

    if (!result) return res.status(401).json({ error: 'User not found' });
    const user = result.value;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
