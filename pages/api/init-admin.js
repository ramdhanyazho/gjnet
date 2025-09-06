import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Buat tabel users kalau belum ada (pakai schema yang konsisten)
    await execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cek apakah admin sudah ada
    const rows = await execute("SELECT id FROM users WHERE username = ?", [
      "admin",
    ]);

    if (rows.length === 0) {
      const hashed = await bcrypt.hash("admin123", 10);

      await execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", hashed, "admin"]
      );

      return res.status(201).json({
        message: "✅ Admin user created (username: admin, password: admin123)",
      });
    } else {
      return res.status(200).json({ message: "ℹ️ Admin already exists" });
    }
  } catch (error) {
    console.error("Init admin error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
