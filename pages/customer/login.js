// pages/api/customers/login.js
import { execute } from "@/lib/db"; // sebelumnya: import { query } from "@/lib/db"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email dan password wajib" });
    }

    // gunakan execute (wrapper ke client.execute)
    const rows = await execute(
      "SELECT id, email, password_hash FROM customers WHERE email = ?",
      [email]
    );

    const row = rows?.;
    if (!row) return res.status(401).json({ message: "Kredensial salah" });

    // TODO: ganti ke bcrypt.compare untuk hash
    const ok = password === row.password_hash; // placeholder
    if (!ok) return res.status(401).json({ message: "Kredensial salah" });

    return res.status(200).json({ id: row.id, email: row.email });
  } catch (e) {
    return res.status(500).json({ message: e?.message || "Server error" });
  }
}
