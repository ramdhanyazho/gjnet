// pages/api/register.js
import bcrypt from "bcrypt";
import { client } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { username, password, role } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    const args = [username, hashed, role || "user"];
    await client.execute(insertSql, args);

    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
    // try detect unique constraint
    return res.status(400).json({ message: "Register failed", error: String(err) });
  }
}
