import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || process.env.STORAGE_URL || "";
const token = process.env.TURSO_AUTH_TOKEN || process.env.STORAGE_AUTH_TOKEN || "";

if (!url) {
  console.error("❌ Missing Turso URL (TURSO_DATABASE_URL or STORAGE_URL)");
}
if (!token) {
  console.error("❌ Missing Turso Token (TURSO_AUTH_TOKEN or STORAGE_AUTH_TOKEN)");
}

export const client = createClient({
  url,
  authToken: token,
});

export async function execute(sql, args = []) {
  return client.execute({ sql, args });
}
