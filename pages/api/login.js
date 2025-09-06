import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // cari user berdasarkan username
    const users = await execute("SELECT id, username, password, role FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
