import { execute } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      const { name, address, phone, created_at, package: pkg, status, first_payment, fee } = req.body;

      await execute(
        `UPDATE payments 
         SET name=?, address=?, phone=?, created_at=?, package=?, status=?, first_payment=?, fee=? 
         WHERE id=?`,
        [name, address, phone, created_at, pkg, status, first_payment, fee, id]
      );

      return res.status(200).json({ message: "✅ Payment updated" });
    }

    if (req.method === "DELETE") {
      await execute("DELETE FROM payments WHERE id = ?", [id]);
      return res.status(200).json({ message: "🗑️ Payment deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Payments API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
