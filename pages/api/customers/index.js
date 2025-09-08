import { execute } from "@/lib/db";

export default async function handler(req, res) {
  try {
    // --- MENGAMBIL SEMUA DATA PEMBAYARAN ---
    if (req.method === "GET") {
      // Query ini mengambil data dari tabel payments dan menggabungkannya dengan data customer
      const payments = await execute(`
        SELECT 
          p.id, p.package, p.status, p.first_payment, p.fee, p.created_at, p.address,
          c.id as customer_id,
          c.name as customer_name,
          c.phone as customer_phone
        FROM payments p
        LEFT JOIN customers c ON p.customer_id = c.id
        ORDER BY p.id DESC
      `);
      return res.status(200).json(payments);
    }

    // --- MEMBUAT DATA PEMBAYARAN BARU ---
    if (req.method === "POST") {
      // PERBAIKAN: Sekarang kita juga menerima 'name' dan 'phone' dari req.body
      const { customer_id, name, address, phone, created_at, package: pkg, status, first_payment, fee } = req.body;

      if (!customer_id || !name || !pkg || !fee) {
          return res.status(400).json({ message: "Customer, Nama, Paket, dan Biaya wajib diisi" });
      }

      // PERBAIKAN: Query INSERT sekarang menyertakan 'name' dan 'phone' agar sesuai dengan tabel Anda
      await execute(
        `INSERT INTO payments 
         (customer_id, name, address, phone, created_at, package, status, first_payment, fee) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [customer_id, name, address, phone, created_at, pkg, status, first_payment, fee]
      );

      return res.status(201).json({ message: "Payment record created" });
    }

    // Jika method tidak diizinkan
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("Payments API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

