import { query } from "@/lib/db"; // sesuaikan dengan koneksi DB kamu
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  const result = await query(`
    SELECT * FROM customers WHERE email = $1
  `, [email]);

  const user = result[0];

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: "customer", // tambahkan role agar bisa dibedakan dari admin
  });
}
