import { execute } from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const rows = await execute("SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC", []);
    return res.status(200).json({ customers: rows });
  }
  if (req.method === "POST") {
    const { name, email, phone } = req.body || {};
    if (!name) return res.status(400).json({ message: "Name required" });
    try {
      await execute("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)", [name, email || null, phone || null]);
      return res.status(201).json({ message: "Customer created" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Create failed", error: String(err) });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
