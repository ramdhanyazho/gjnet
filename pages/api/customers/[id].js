import { execute } from "@/lib/db";
export default async function handler(req, res) {
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ message: "Missing id" });
  if (req.method === "PUT") {
    const { name, email, phone } = req.body || {};
    try {
      await execute("UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email || null, phone || null, id]);
      return res.status(200).json({ message: "Customer updated" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Update failed", error: String(err) });
    }
  }
  if (req.method === "DELETE") {
    try {
      await execute("DELETE FROM customers WHERE id = ?", [id]);
      return res.status(200).json({ message: "Customer deleted" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Delete failed", error: String(err) });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
