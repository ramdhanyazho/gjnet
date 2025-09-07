// pages/api/customers/login.js
import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email dan password wajib" });
  }

  try {
    // Gunakan placeholder ? (SQLite/Turso)
    const rows = await execute(
      "SELECT id, name, email, password FROM customers WHERE email = ?",
      [email]
    );

    // Ambil baris pertama dengan optional chaining array
    const user = rows?.;
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Bandingkan plain password vs hash tersimpan
    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Kembalikan data minimal tanpa password
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "customer",
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}
