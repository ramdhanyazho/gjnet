// lib/db.js
import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL || process.env.STORAGE_URL || "";
const token =
  process.env.TURSO_AUTH_TOKEN || process.env.STORAGE_AUTH_TOKEN || "";

if (!url || !token) {
  console.warn("Turso env missing: TURSO_DATABASE_URL / STORAGE_URL or TURSO_AUTH_TOKEN / STORAGE_AUTH_TOKEN");
}

export const client = createClient({
  url,
  authToken: token, // harus pakai authToken di libsql
});

export async function execute(sql, args = []) {
  return client.execute({ sql, args });
}
