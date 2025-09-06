import { execute } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { name, email, phone } = req.body;
    try {
      await query(
        `UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?`,
        [name, email, phone, id]
      );
      res.status(200).json({ message: "Customer updated" });
    } catch (err) {
      console.error("PUT error:", err);
      res.status(500).json({ message: "Failed to update customer" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await query(`DELETE FROM customers WHERE id = ?`, [id]);
      res.status(200).json({ message: "Customer deleted" });
    } catch (err) {
      console.error("DELETE error:", err);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  }

  if (!["PUT", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
