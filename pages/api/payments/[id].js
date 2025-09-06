import { execute } from "../../../../lib/db";
export default async function handler(req, res) {
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ message: "Missing id" });
  if (req.method === "PUT") {
    const { customer_id, amount, status, date } = req.body || {};
    try {
      await execute("UPDATE payments SET customer_id = ?, amount = ?, status = ?, date = ? WHERE id = ?", [customer_id, amount, status || null, date || null, id]);
      return res.status(200).json({ message: "Payment updated" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Update failed", error: String(err) });
    }
  }
  if (req.method === "DELETE") {
    try {
      await execute("DELETE FROM payments WHERE id = ?", [id]);
      return res.status(200).json({ message: "Payment deleted" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Delete failed", error: String(err) });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
