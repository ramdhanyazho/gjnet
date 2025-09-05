import couchbase from 'couchbase';
let cluster, bucket, collection;

export async function getDB(){
  if(!cluster){
    cluster = await couchbase.connect(process.env.CAPELLA_CONNSTR, {
      username: process.env.CAPELLA_USER,
      password: process.env.CAPELLA_PASS
    });
    bucket = cluster.bucket(process.env.CAPELLA_BUCKET);
    collection = bucket.defaultCollection();
    console.log('✅ Connected to Couchbase Capella');
  }
  return { cluster, bucket, collection };
}
