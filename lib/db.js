import couchbase from "couchbase";

let cluster = null;

export async function connectToCluster() {
  if (cluster) return cluster;

  const clusterConnStr = process.env.COUCHBASE_CLUSTER_URL;
  const username = process.env.COUCHBASE_USERNAME;
  const password = process.env.COUCHBASE_PASSWORD;

  try {
    cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
    });
    console.log("✅ Connected to Couchbase Capella");
    return cluster;
  } catch (error) {
    console.error("❌ Failed to connect Couchbase:", error);
    throw error;
  }
}
