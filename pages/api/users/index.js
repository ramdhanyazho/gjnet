import { execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // --- MENGAMBIL SEMUA USERS ---
  if (req.method === "GET") {
    try {
      // Menghapus kolom password dari hasil query demi keamanan
      const rows = await execute("SELECT id, username, role, created_at FROM users");
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to fetch users",
        error: err.message,
      });
    }
  }

  // --- MEMBUAT USER BARU ---
  if (req.method === "POST") {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const hashed = await bcrypt.hash(password, 10);
      
      // DIUBAH: Menggunakan placeholder $1, $2, $3
      await execute(
        "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
        [username, hashed, role || "operator"] // Mengganti default menjadi 'operator'
      );

      return res.status(201).json({ message: "User created" });
    } catch (err) {
      // Handle kemungkinan username duplikat
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: "Username sudah terdaftar." });
      }
      return res.status(500).json({
        message: "Failed to create user",
        error: err.message,
      });
    }
  }

  // --- MENGUPDATE ROLE USER ---
  if (req.method === "PUT") {
    try {
      const { id, role } = req.body;
      if (!id || !role) {
        return res.status(400).json({ message: "ID and role required" });
      }

      // DIUBAH: Menggunakan placeholder $1, $2
      await execute("UPDATE users SET role = $1 WHERE id = $2", [role, id]);
      return res.status(200).json({ message: "User role updated" });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to update user",
        error: err.message,
      });
    }
  }

  // --- MENGHAPUS USER ---
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: "ID required" });
      }

      // DIUBAH: Menggunakan placeholder $1
      await execute("DELETE FROM users WHERE id = $1", [id]);
      return res.status(200).json({ message: "User deleted" });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to delete user",
        error: err.message,
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

