import jwt from "jsonwebtoken";
import { getDB } from "../src/db.js";

export default async function handler(req, res) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { cluster, collection } = await getDB();

    if (req.method === "GET") {
      const q = `SELECT c.*, META(c).id as id FROM \\`${process.env.CAPELLA_BUCKET}\\`._default.customers c`;
      const result = await cluster.query(q);
      return res.json(result.rows);
    }

    if (req.method === "POST") {
      if (user.role !== "admin") return res.status(403).json({ error: "Hanya admin" });
      const id = "cust::" + Date.now();
      const doc = { ...req.body, balance: 0, registrationDate: new Date().toISOString().slice(0, 10) };
      await collection.insert(id, doc);
      return res.json({ id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Invalid token" });
  }
}
