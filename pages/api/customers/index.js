import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // --- MENGAMBIL DAFTAR SEMUA CUSTOMER ---
  if (req.method === "GET") {
    try {
      // Mengambil data customer tanpa password demi keamanan
      const customers = await execute("SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC", []);
      res.status(200).json(customers);
    } catch (error) {
      console.error("API GET CUSTOMERS ERROR:", error);
      res.status(500).json({ message: "Gagal mengambil data customer", error });
    }
  } 
  
  // --- MEMBUAT CUSTOMER BARU ---
  else if (req.method === "POST") {
    const { name, email, phone, password } = req.body;

    // Validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password diperlukan" });
    }

    try {
      // Enkripsi password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      // PERBAIKAN: Menggunakan placeholder $1, $2, dst.
      const result = await execute(
        `
        INSERT INTO customers (name, email, phone, password, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `,
        [name, email, phone, hashedPassword]
      );
      
      res.status(201).json({ message: "Customer berhasil dibuat", customerId: result[0].id });
    } catch (error) {
      // Handle kemungkinan email duplikat
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: "Email sudah terdaftar." });
      }
      console.error("API CREATE CUSTOMER ERROR:", error);
      res.status(500).json({ message: "Error saat membuat customer", error });
    }
  } 
  
  // --- JIKA METHOD TIDAK DIDUKUNG ---
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

