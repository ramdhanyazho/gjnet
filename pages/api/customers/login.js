import { execute } from "@/lib/db"; // DIUBAH: Mengimpor 'execute'
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  try {
    // DIUBAH: Menggunakan 'execute' dan placeholder $1
    const result = await execute(
      `
      SELECT * FROM customers WHERE email = $1
    `,
      [email]
    );

    const user = result[0];

    if (!user) {
      // Pesan error yang lebih aman
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Pesan error yang lebih aman
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
    console.error("Login API error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

