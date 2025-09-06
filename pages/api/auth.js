import { execute } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  try {
    const rows = await execute("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // validasi password di sini
    return res.status(200).json({ message: "Login successful", user: rows[0] });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
