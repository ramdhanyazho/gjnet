import { execute } from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  try {
    const rows = await execute("SELECT id, username, role, created_at FROM users ORDER BY id DESC", []);
    return res.status(200).json({ users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to list users" });
  }
}
