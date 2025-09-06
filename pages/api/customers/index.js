import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const results = await execute(`
        SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC LIMIT 50
      `);
      res.status(200).json(results);
    } catch (err) {
      console.error("GET error:", err);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  }

  if (req.method === "POST") {
    const { name, email, phone, password } = req.body;

    // Validasi minimal
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password dengan salt 10
      const result = await execute(
        `INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)`,
        [name, email, phone, hashedPassword]
      );
      res.status(200).json({ message: "Customer added", id: result.lastInsertRowid });
    } catch (err) {
      console.error("POST error:", err);
      res.status(500).json({ message: "Failed to add customer" });
    }
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
