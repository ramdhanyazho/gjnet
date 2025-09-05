import { connectToCluster } from "../../lib/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  try {
    const cluster = await connectToCluster();
    const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    const scope = bucket.scope(process.env.COUCHBASE_SCOPE || "_default");
    const collection = scope.collection(process.env.COUCHBASE_COLLECTION || "users");

    console.log(`🔹 Querying user: ${username} with role: ${role}`);

    const query = `
      SELECT META(u).id, u.username, u.password, u.role
      FROM \`${process.env.COUCHBASE_BUCKET}\`._default.\`${process.env.COUCHBASE_COLLECTION}\` u
      WHERE u.username = $username AND u.role = $role
      LIMIT 1
    `;

    const result = await cluster.query(query, {
      parameters: { username, role },
    });

    if (result.rows.length === 0) {
      console.warn("⚠️ User not found");
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0].u;

    // Verifikasi password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn("⚠️ Invalid password for user:", username);
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✅ Login successful for user:", username);

    return res.status(200).json({
      message: "Login successful",
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
