import couchbase from 'couchbase';

let cluster = null;

export async function connectToCluster() {
  if (!cluster) {
    cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });
  }
  return cluster;
}