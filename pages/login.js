import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login success");

        // simpan user ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect sesuai role
        const role = data.user.role;
        if (role === "admin" || role === "operator") {
          router.push("/dashboard");
        } else {
          router.push("/customers");
        }
      } else {
        setError(data.message || data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full p-2 border rounded"
          />
          {error && <div className="text-red-500">{error}</div>}
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
        <div className="mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
