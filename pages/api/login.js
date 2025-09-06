// pages/api/login.js
import { connectToCluster } from "../../lib/db"; // pastikan connectToCluster sesuai setup kamu
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Connect ke Couchbase
    const cluster = await connectToCluster();
    const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    const scope = bucket.scope(process.env.COUCHBASE_SCOPE); // scope dari env, misal "app"
    const collection = scope.collection(process.env.COUCHBASE_COLLECTION); // collection dari env, misal "users"

    console.log(`🔹 Querying user: ${username}`);

    // Query N1QL untuk ambil user
    const query = `
      SELECT META(u).id, u.username, u.password, u.role
      FROM \`${process.env.COUCHBASE_BUCKET}\`.\`${process.env.COUCHBASE_SCOPE}\`.\`${process.env.COUCHBASE_COLLECTION}\` u
      WHERE u.username = $username
      LIMIT 1
    `;

    const result = await cluster.query(query, { parameters: { username } });

    if (result.rows.length === 0) {
      console.warn("⚠️ User not found");
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0].u;

    // Verifikasi password dengan bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn("⚠️ Invalid password for user:", username);
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✅ Login successful for user:", username);

    // Bisa tambahkan JWT atau session di sini jika mau
    return res.status(200).json({
      message: "Login successful",
      user: { id: result.rows[0].id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
