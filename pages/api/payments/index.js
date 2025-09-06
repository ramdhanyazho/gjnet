import { execute } from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const rows = await execute("SELECT p.id, p.customer_id, c.name as customer_name, p.amount, p.status, p.date, p.created_at FROM payments p LEFT JOIN customers c ON p.customer_id = c.id ORDER BY p.id DESC", []);
    return res.status(200).json({ payments: rows });
  }
  if (req.method === "POST") {
    const { customer_id, amount, status, date } = req.body || {};
    if (!customer_id || !amount) return res.status(400).json({ message: "customer_id and amount required" });
    try {
      await execute("INSERT INTO payments (customer_id, amount, status, date) VALUES (?, ?, ?, ?)", [customer_id, amount, status || null, date || null]);
      return res.status(201).json({ message: "Payment created" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Create failed", error: String(err) });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
