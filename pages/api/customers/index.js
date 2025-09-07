import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // --- MENGAMBIL DAFTAR CUSTOMER ---
  if (req.method === "GET") {
    try {
      // Menghapus kolom password dari hasil query demi keamanan
      const results = await execute(`
        SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC LIMIT 50
      `);
      return res.status(200).json(results);
    } catch (err) {
      console.error("GET customers error:", err);
      return res.status(500).json({ message: "Gagal mengambil data customer" });
    }
  }

  // --- MEMBUAT CUSTOMER BARU ---
  if (req.method === "POST") {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // DIUBAH: Menggunakan placeholder $1, $2, dst. dan menambahkan created_at
      const result = await execute(
        `INSERT INTO customers (name, email, phone, password, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
        [name, email, phone, hashedPassword]
      );
      
      return res.status(201).json({ message: "Customer berhasil ditambahkan", id: result[0].id });
    } catch (err) {
      // Handle kemungkinan email duplikat
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: "Email sudah terdaftar." });
      }
      console.error("POST customer error:", err);
      return res.status(500).json({ message: "Gagal menambahkan customer" });
    }
  }

  // --- JIKA METHOD TIDAK DIDUKUNG ---
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

