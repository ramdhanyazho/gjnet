import { connectToCluster } from '../../lib/couchbase.js';

export default async function handler(req, res) {
  const cluster = await connectToCluster();
  const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
  const scope = bucket.scope('_default');
  const collection = scope.collection('payments');

  if (req.method === 'GET') {
    const query = `SELECT META().id, customerId, amount, date FROM \`${process.env.COUCHBASE_BUCKET}\`._default.payments`;
    try {
      const result = await cluster.query(query);
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}