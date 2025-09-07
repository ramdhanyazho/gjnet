import { execute } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // --- MENGEDIT DATA PEMBAYARAN ---
    if (req.method === "PUT") {
      const { name, address, phone, created_at, package: pkg, status, first_payment, fee } = req.body;

      // DISESUAIKAN: Menggunakan placeholder $1, $2, dst.
      await execute(
        `UPDATE payments 
         SET name=$1, address=$2, phone=$3, created_at=$4, package=$5, status=$6, first_payment=$7, fee=$8 
         WHERE id=$9`,
        [name, address, phone, created_at, pkg, status, first_payment, fee, id]
      );

      return res.status(200).json({ message: "✅ Payment updated" });
    }

    // --- MENGHAPUS DATA PEMBAYARAN ---
    if (req.method === "DELETE") {
      // DISESUAIKAN: Menggunakan placeholder $1
      await execute("DELETE FROM payments WHERE id = $1", [id]);
      return res.status(200).json({ message: "🗑️ Payment deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Payments API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

