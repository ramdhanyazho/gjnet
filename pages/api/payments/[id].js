import { execute } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // --- MENGEDIT DATA PEMBAYARAN ---
    if (req.method === "PUT") {
      // Saat mengedit, kita tidak mengubah 'name' atau 'phone' di tabel payments.
      // Kita hanya mengubah data yang relevan dengan tabel 'payments'.
      const { address, created_at, package: pkg, status, first_payment, fee } = req.body;
      
      if (!pkg || !fee) {
        return res.status(400).json({ message: "Paket dan Biaya wajib diisi" });
      }

      await execute(
        `UPDATE payments SET 
         address = $1, created_at = $2, package = $3, status = $4, first_payment = $5, fee = $6 
         WHERE id = $7`,
        [address, created_at, pkg, status, first_payment, fee, id]
      );
      return res.status(200).json({ message: "✅ Payment record updated" });
    }

    // --- MENGHAPUS DATA PEMBAYARAN ---
    if (req.method === "DELETE") {
      await execute("DELETE FROM payments WHERE id = $1", [id]);
      return res.status(200).json({ message: "✅ Payment record deleted" });
    }

    // Jika method tidak diizinkan
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error(`Payments API error for ID ${id}:`, error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

