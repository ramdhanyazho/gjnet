import { execute } from "@/lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const rows = await execute("SELECT * FROM payments ORDER BY id DESC");
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { name, address, phone, created_at, package: pkg, status, first_payment, fee } = req.body;

      await execute(
        `INSERT INTO payments 
        (name, address, phone, created_at, package, status, first_payment, fee) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, address, phone, created_at, pkg, status, first_payment, fee]
      );

      return res.status(201).json({ message: "✅ Payment record created" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Payments API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
