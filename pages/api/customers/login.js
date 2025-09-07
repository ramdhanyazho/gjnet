import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  try {
    // Menggunakan 'execute' dan placeholder $1 yang benar untuk Turso/libsql
    const result = await execute(
      `
      SELECT * FROM customers WHERE email = $1
    `,
      [email]
    );

    const user = result[0];

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Membandingkan password yang diinput dengan hash di database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Jika berhasil, kirim data user (tanpa password)
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "customer",
    });
  } catch (error) {
    console.error("Login API Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

