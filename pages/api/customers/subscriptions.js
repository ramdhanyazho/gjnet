import { execute } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    // NOTE: Query ini mengasumsikan ada kolom 'customer_id' di tabel 'payments'
    // untuk menghubungkan pembayaran ke customer.
    const subscriptions = await execute(
      `
      SELECT id, package, status, first_payment, fee, created_at 
      FROM payments 
      WHERE customer_id = $1 
      ORDER BY created_at DESC
    `,
      [customerId]
    );

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("API GET SUBSCRIPTIONS ERROR:", error);
    res.status(500).json({ message: "Gagal mengambil data langganan", error: error.message });
  }
}
