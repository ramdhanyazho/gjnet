import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getDB } from "../src/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password, role } = req.body;
  try {
    const { cluster } = await getDB();
    const q = `SELECT u.*, META(u).id as id FROM \\`${process.env.CAPELLA_BUCKET}\\`._default.users u WHERE u.username=$username AND u.role=$role LIMIT 1`;
    const result = await cluster.query(q, { parameters: { username, role } });
    if (result.rows.length === 0) return res.status(401).json({ error: "User tidak ditemukan" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" });
    res.json({ token, username: user.username, role: user.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}
