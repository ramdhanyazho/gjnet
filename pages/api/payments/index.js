import { execute } from "@/lib/db";

export default async function handler(req, res) {
  try {
    // --- MENGAMBIL SEMUA DATA PEMBAYARAN DENGAN NAMA CUSTOMER ---
    if (req.method === "GET") {
      const payments = await execute(`
        SELECT 
          p.id, p.package, p.status, p.first_payment, p.fee, p.created_at, p.address,
          c.id as customer_id, -- Sertakan customer_id untuk form edit
          c.name as customer_name,
          c.phone as customer_phone
        FROM payments p
        LEFT JOIN customers c ON p.customer_id = c.id
        ORDER BY p.id DESC
      `);
      return res.status(200).json(payments);
    }

    // --- MEMBUAT PEMBAYARAN BARU UNTUK CUSTOMER YANG SUDAH ADA ---
    if (req.method === "POST") {
      // PERBAIKAN: Kita sekarang menerima customer_id, dan tidak lagi menyimpan name/phone
      const { customer_id, address, created_at, package: pkg, status, first_payment, fee } = req.body;

      if (!customer_id || !pkg || !fee) {
        return res.status(400).json({ message: "Customer, Paket, dan Biaya wajib diisi" });
      }

      // PERBAIKAN: Query INSERT tidak lagi menyertakan name dan phone
      await execute(
        `INSERT INTO payments 
         (customer_id, address, created_at, package, status, first_payment, fee) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [customer_id, address, created_at, pkg, status, first_payment, fee]
      );
      return res.status(201).json({ message: "Payment record created" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("Payments API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

