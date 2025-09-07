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
    // PERBAIKAN 1: Menggunakan placeholder '$1' yang benar
    const result = await execute(
      "SELECT id, name, email, phone, password, created_at FROM customers WHERE email = $1",
      [email]
    );

    // PERBAIKAN 2: Mengambil baris pertama dari hasil query dengan cara yang benar
    const user = result[0];
    
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password || "");
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

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

