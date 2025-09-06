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
    if (parsedUser.role !== "admin") {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.username} 👋</p>

      <div className="mt-6 space-y-2">
        <button
          onClick={() => router.push("/users")}
          className="block w-full bg-blue-500 text-white p-2 rounded"
        >
          Manage Users
        </button>
        <button
          onClick={() => router.push("/customers")}
          className="block w-full bg-green-500 text-white p-2 rounded"
        >
          Manage Customers
        </button>
        <button
          onClick={() => router.push("/change-password")}
          className="block w-full bg-yellow-500 text-white p-2 rounded"
        >
          Change Password
        </button>
        <button
          onClick={logout}
          className="block w-full bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
