import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "admin" && parsedUser.role !== "operator") {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const logout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white text-xl font-semibold">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">Welcome to GJNET Dashboard</h1>
        <p className="text-gray-700 font-medium">Hello, <span className="font-semibold">{user.username}</span> 👋</p>

        <div className="space-y-3 text-left">
          {user.role === "admin" && (
            <button
              onClick={() => router.push("/users")}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Manage Users
            </button>
          )}
          <button
            onClick={() => router.push("/customers")}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:brightness-110 transition-all"
          >
            Manage Customers
          </button>
          <button
            onClick={() => router.push("/payments")}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:brightness-110 transition-all"
          >
            Payment
          </button>
          <button
            onClick={() => router.push("/change-password")}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all"
          >
            Change Password
          </button>
          <button
            onClick={logout}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:brightness-110 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          © Ramdhanyazho 2025
        </div>
      </div>
    </div>
  );
}
