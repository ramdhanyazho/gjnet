// lib/db.js
import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL || process.env.STORAGE_URL;
const token =
  process.env.TURSO_AUTH_TOKEN || process.env.STORAGE_AUTH_TOKEN;

if (!url || !token) {
  console.error("❌ Missing Turso URL (TURSO_DATABASE_URL or STORAGE_URL)");
  console.error("❌ Missing Turso Token (TURSO_AUTH_TOKEN or STORAGE_AUTH_TOKEN)");
}

export const client = createClient({
  url,
  auth: { token },
});

export async function execute(sql, args = []) {
  const res = await client.execute(sql, args);
  if (res?.rows && res.rows.length > 0) {
    const cols = res.columns || [];
    if (Array.isArray(res.rows[0]) && cols.length) {
      return res.rows.map((r) => {
        const obj = {};
        for (let i = 0; i < cols.length; i++) obj[cols[i].name] = r[i];
        return obj;
      });
    } else {
      return res.rows;
    }
  }
  return [];
}
