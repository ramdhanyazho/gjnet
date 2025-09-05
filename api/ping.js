import couchbase from 'couchbase';

let cluster = null;

async function getCluster() {
  if (!cluster) {
    cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USER,
      password: process.env.COUCHBASE_PASS,
    });
  }
  return cluster;
}

export default async function handler(req, res) {
  try {
    const cluster = await getCluster();
    const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    const collection = bucket.defaultCollection();

    // Tes query
    const result = await cluster.query('SELECT "Hello from Couchbase Capella!" as msg;');

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
