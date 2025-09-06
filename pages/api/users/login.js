import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const rows = await execute(
      "SELECT id, username, password, role FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,                         // <-- SET di .env / Vercel
      { expiresIn: "7d" }
    );

    // Set cookie httpOnly agar bisa dibaca API routes
    const cookie = [
      `token=${token}`,
      "HttpOnly",
      "Path=/",
      "SameSite=Lax",
      isProd ? "Secure" : "",                        // Secure hanya di HTTPS
      `Max-Age=${60 * 60 * 24 * 7}`,                 // 7 hari
    ].filter(Boolean).join("; ");

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}
