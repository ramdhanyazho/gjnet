import { execute } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const rows = await execute("SELECT id, username, role FROM users");
      return res.status(200).json(rows);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
  }

  if (req.method === "POST") {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
      }

      // Hash password
      const bcrypt = require("bcryptjs");
      const hashed = await bcrypt.hash(password, 10);

      await execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashed, role]
      );

      return res.status(201).json({ message: "✅ User created" });
    } catch (err) {
      console.error("❌ Create user error:", err);
      return res.status(500).json({ message: "Failed to create user" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
