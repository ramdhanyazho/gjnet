// pages/customer/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // Redirect jika sudah login sebagai customer
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.role === "customer") router.replace("/customer/dashboard");
      }
    } catch {}
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message || "Login gagal");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      router.replace("/customer/dashboard");
    } catch {
      setErr("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Login Customer</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="w-full bg-blue-600 text-white py-2 rounded">Masuk</button>
        </form>
      </div>
    </div>
  );
}
