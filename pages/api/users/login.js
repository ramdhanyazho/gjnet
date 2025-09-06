import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { execute } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
  try {
    const rows = await execute("SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1", [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });
    return res.status(200).json({ message: "Login successful", token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed", error: String(err) });
  }
}
