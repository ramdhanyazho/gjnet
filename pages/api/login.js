// pages/api/login.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  try {
    const sql = "SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1";
    const result = await client.execute(sql, [username]);

    // libsql client returns rows in result.rows (array of arrays) or result.rows?.map ? handle common shapes
    let row = null;
    if (Array.isArray(result?.rows) && result.rows.length > 0) {
      // result.rows may be array of arrays or array of objects depending on client version.
      // Try to unwrap first row as object if possible.
      row = result.rows[0];
      // If row is array, try to map via columns if available
      if (Array.isArray(row) && Array.isArray(result?.columns)) {
        const obj = {};
        for (let i = 0; i < result.columns.length; i++) {
          obj[result.columns[i].name] = row[i];
        }
        row = obj;
      }
    }

    if (!row) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, row.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: row.id, username: row.username, role: row.role }, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });

    return res.status(200).json({ message: "Login successful", token, user: { id: row.id, username: row.username, role: row.role } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed", error: String(err) });
  }
}
