// lib/db.js
import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.STORAGE_URL ||
  process.env.TURSO_DATABASE_TURSO_DATABASE_URL; // fallback untuk integrasi Vercel-Turso

const token =
  process.env.TURSO_AUTH_TOKEN ||
  process.env.STORAGE_AUTH_TOKEN ||
  process.env.TURSO_DATABASE_TURSO_AUTH_TOKEN; // fallback untuk integrasi Vercel-Turso

if (!url) {
  console.error("❌ Missing Turso URL (check TURSO_DATABASE_URL or integration variable)");
}
if (!token) {
  console.error("❌ Missing Turso Token (check TURSO_AUTH_TOKEN or integration variable)");
}

// Debug log koneksi
console.log("✅ Turso DB URL:", url || "MISSING");
console.log("✅ Turso DB Token:", token ? "OK" : "MISSING");

export const client = createClient({
  url,
  authToken: token, // pakai 'authToken' sesuai @libsql/client terbaru
});

export async function execute(sql, args = []) {
  try {
    // 🔍 Debug log query & parameter
    console.log("DEBUG SQL:", sql);
    console.log("DEBUG ARGS:", args);

    const res = await client.execute({ sql, args });
    return res.rows || [];
  } catch (err) {
    console.error("❌ DB execute error:", err, "SQL:", sql, "ARGS:", args);
    throw err;
  }
}
