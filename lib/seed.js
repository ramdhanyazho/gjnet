import { connectToCluster } from "./db";
import bcrypt from "bcrypt";

async function seed() {
  const cluster = await connectToCluster();
  const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
  const scope = bucket.scope(process.env.COUCHBASE_SCOPE);

  const users = scope.collection("users");
  const customers = scope.collection("customers");
  const payments = scope.collection("payments");

  // Insert Users
  await users.upsert("user1", {
    username: "admin",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  });
  await users.upsert("user2", {
    username: "demo",
    password: await bcrypt.hash("user123", 10),
    role: "user",
  });

  // Insert Customers
  await customers.upsert("cust1", { name: "John Doe", email: "john@example.com", phone: "08123456789" });
  await customers.upsert("cust2", { name: "Jane Smith", email: "jane@example.com", phone: "08987654321" });

  // Insert Payments
  await payments.upsert("pay1", { customerId: "cust1", amount: 500000, status: "paid", date: "2025-09-01" });
  await payments.upsert("pay2", { customerId: "cust2", amount: 750000, status: "pending", date: "2025-09-03" });

  console.log("✅ Seed data berhasil!");
}

seed().catch(console.error);
