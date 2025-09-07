import { execute } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Ambil customer ID dari query parameter di URL
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    // Jalankan query untuk mengambil data pembayaran HANYA untuk customerId yang spesifik
    const payments = await execute(
      `
      SELECT id, amount, status, created_at 
      FROM payments 
      WHERE customer_id = $1 
      ORDER BY created_at DESC
    `,
      [customerId]
    );

    res.status(200).json(payments);
  } catch (error) {
    console.error("API GET PAYMENTS ERROR:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat pembayaran", error: error.message });
  }
}
