import { execute } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const results = await execute(`
        SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC LIMIT 50
      `);
      res.status(200).json(results);
    } catch (err) {
      console.error("GET error:", err);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  }

  if (req.method === "POST") {
    const { name, email, phone } = req.body;
    try {
      const result = await execute(
        `INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`,
        [name, email, phone]
      );
      res.status(200).json({ message: "Customer added", id: result.lastInsertRowid });
    } catch (err) {
      console.error("POST error:", err);
      res.status(500).json({ message: "Failed to add customer" });
    }
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
