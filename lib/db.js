
import couchbase from 'couchbase';

let cluster = null;
let bucket = null;
let scope = null;

export async function getCluster() {
  if (!cluster) {
    cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USER,
      password: process.env.COUCHBASE_PASS,
    });
    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    scope = bucket.scope(process.env.COUCHBASE_SCOPE);
  }
  return { cluster, bucket, scope };
}

export async function getCollection(name) {
  const { scope } = await getCluster();
  return scope.collection(name);
}
