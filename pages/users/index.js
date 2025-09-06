import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const rows = await execute("SELECT id, username, role FROM users");
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const hashed = await bcrypt.hash(password, 10);
      await execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashed, role || "readonly"]
      );

      return res.status(201).json({ message: "User created" });
    } catch (err) {
      return res.status(500).json({ message: "Failed to create user", error: err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
