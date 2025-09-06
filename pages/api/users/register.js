import bcrypt from "bcrypt";
import { execute } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  const { username, password, role } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashed, role || "user"]);
    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(400).json({ message: "Register failed", error: String(err) });
  }
}
