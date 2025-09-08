import { execute } from "@/lib/db";

export default async function handler(req, res) {
  try {
    // --- MENGAMBIL SEMUA DATA PEMBAYARAN ---
    if (req.method === "GET") {
      // Query ini mengambil semua kolom dari tabel payments
      const rows = await execute("SELECT * FROM payments ORDER BY id DESC");
      return res.status(200).json(rows);
    }

    // --- MEMBUAT DATA PEMBAYARAN BARU ---
    if (req.method === "POST") {
      const { name, address, phone, created_at, package: pkg, status, first_payment, fee } = req.body;

      if (!name || !pkg || !fee) {
          return res.status(400).json({ message: "Nama, Paket, dan Biaya wajib diisi" });
      }

      // DISESUAIKAN: Menggunakan placeholder $1, $2, dst. yang benar
      await execute(
        `INSERT INTO payments 
         (name, address, phone, created_at, package, status, first_payment, fee) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [name, address, phone, created_at, pkg, status, first_payment, fee]
      );

      return res.status(201).json({ message: "✅ Payment record created" });
    }

    // Jika method tidak diizinkan
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("Payments API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

