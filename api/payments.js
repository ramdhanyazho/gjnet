import jwt from "jsonwebtoken";
import { getDB } from "../src/db.js";

export default async function handler(req, res) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const { collection } = await getDB();

    if (req.method === "POST") {
      const { customerId, amount, note } = req.body;
      if (!customerId || !amount) return res.status(400).json({ error: "Data kurang" });
      const payId = "pay::" + Date.now();
      const payment = { customerId, amount, note: note || "", date: new Date().toISOString().slice(0, 10) };
      await collection.insert(payId, payment);
      const custDoc = await collection.get(customerId);
      const cust = custDoc.value;
      cust.balance = (cust.balance || 0) + Number(amount);
      await collection.replace(customerId, cust);
      return res.json({ success: true, payment: { id: payId, ...payment } });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Invalid token" });
  }
}
