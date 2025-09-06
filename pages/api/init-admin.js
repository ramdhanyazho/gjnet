import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Buat tabel users kalau belum ada
    await execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `);

    // Cek apakah admin sudah ada
    const rows = await execute("SELECT * FROM users WHERE username = ?", [
      "admin",
    ]);

    if (rows.length === 0) {
      const hashed = await bcrypt.hash("admin123", 10);
      await execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", hashed, "admin"]
      );
      return res
        .status(200)
        .json({ message: "✅ Admin user created (admin/admin123)" });
    } else {
      return res.status(200).json({ message: "ℹ️ Admin already exists" });
    }
  } catch (error) {
    console.error("Init admin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
