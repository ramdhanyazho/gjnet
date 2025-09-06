// lib/db.js - Turso libsql client helper
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.warn("Turso env missing: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
}

export const client = createClient({
  url,
  auth: { token },
});

// helper to run a query and return rows as objects when columns present
export async function execute(sql, args=[]) {
  const res = await client.execute(sql, args);
  // try to normalize rows to array of objects
  if (res?.rows && res.rows.length > 0) {
    const cols = res.columns || [];
    if (Array.isArray(res.rows[0]) && cols.length) {
      return res.rows.map(r => {
        const obj = {};
        for (let i=0;i<cols.length;i++) obj[cols[i].name] = r[i];
        return obj;
      });
    } else {
      return res.rows;
    }
  }
  return [];
}
