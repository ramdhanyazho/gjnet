import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToCluster } from '../../lib/couchbase.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const cluster = await connectToCluster();
    const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    const collection = bucket.defaultCollection();

    try {
      const result = await collection.get(`user::${username}`);
      const user = result.value;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ error: 'User not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}