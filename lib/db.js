// lib/db.js
import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.STORAGE_URL ||
  process.env.TURSO_DATABASE_TURSO_DATABASE_URL; // fallback untuk integrasi Vercel-Tusbo

const token =
  process.env.TURSO_AUTH_TOKEN ||
  process.env.STORAGE_AUTH_TOKEN ||
  process.env.TURSO_DATABASE_TURSO_AUTH_TOKEN; // fallback untuk integrasi Vercel-Tusbo

if (!url) {
  console.error("❌ Missing Turso URL (check TURSO_DATABASE_URL or integration variable)");
}
if (!token) {
  console.error("❌ Missing Turso Token (check TURSO_AUTH_TOKEN or integration variable)");
}

// Debug log
console.log("✅ Turso DB URL:", url || "MISSING");
console.log("✅ Turso DB Token:", token ? "OK" : "MISSING");

export const client = createClient({
  url,
  authToken: token, // pakai 'authToken' sesuai @libsql/client terbaru
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
