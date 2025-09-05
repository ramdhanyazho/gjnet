import couchbase from "couchbase";

let cluster = null;

export async function connectToCluster() {
  if (cluster) return cluster; // reuse cluster connection

  try {
    cluster = await couchbase.connect(process.env.COUCHBASE_CLUSTER_URL, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });
    console.log("✅ Couchbase cluster connected!");
    return cluster;
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
    throw err;
  }
}
