// lib/db.js - Turso (libsql) client helper
import { createClient } from "@libsql/client";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  // Throwing here would break build if env not set; export a getClient function that throws on use.
  console.warn("Warning: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set.");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  auth: { token: process.env.TURSO_AUTH_TOKEN },
});

export { client };
