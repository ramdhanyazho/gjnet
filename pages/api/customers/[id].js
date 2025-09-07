import { execute } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  // --- LOGIKA UNTUK MENGEDIT CUSTOMER ---
  if (req.method === "PUT") {
    const { name, email, phone } = req.body;

    // Validasi input
    if (!name || !email) {
      return res.status(400).json({ message: "Nama dan email diperlukan" });
    }

    try {
      await execute(
        `
        UPDATE customers 
        SET name = $1, email = $2, phone = $3 
        WHERE id = $4
      `,
        [name, email, phone, id]
      );
      res.status(200).json({ message: "Customer berhasil diperbarui" });
    } catch (err) {
      console.error("PUT error:", err); // Log error dari kode Anda
      res.status(500).json({ message: "Gagal memperbarui customer" });
    }
  } 
  // --- LOGIKA UNTUK MENGHAPUS CUSTOMER ---
  else if (req.method === "DELETE") {
    try {
      await execute("DELETE FROM customers WHERE id = $1", [id]);
      res.status(200).json({ message: "Customer berhasil dihapus" });
    } catch (err) {
      console.error("DELETE error:", err); // Log error dari kode Anda
      res.status(500).json({ message: "Gagal menghapus customer" });
    }
  } 
  // --- JIKA METHOD TIDAK DIDUKUNG ---
  else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

