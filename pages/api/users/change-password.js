import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { oldPassword, newPassword } = req.body;
  const userData = JSON.parse(req.cookies.user || "{}"); // bisa juga ambil dari localStorage di client

  if (!userData.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const rows = await execute("SELECT * FROM users WHERE id = ?", [userData.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await execute("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
