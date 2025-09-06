import couchbase from "couchbase";

let cluster;

export async function connectToCluster() {
  if (!cluster) {
    cluster = new couchbase.Cluster(process.env.COUCHBASE_CLUSTER_URL, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });
  }
  return cluster;
}
