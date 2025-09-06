import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "readonly" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || JSON.parse(storedUser).role !== "admin") {
      router.replace("/login");
      return;
    }

    fetchUsers();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ User created");
        setForm({ username: "", password: "", role: "readonly" });
        fetchUsers();
      } else {
        setMessage(data.message || "❌ Failed to create user");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      if (res.ok) {
        setMessage("✅ Role updated");
        fetchUsers();
      }
    } catch (err) {
      setMessage("❌ Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage("✅ User deleted");
        fetchUsers();
      }
    } catch (err) {
      setMessage("❌ Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white p-6">
      <div className="max-w-5xl mx-auto bg-white text-black rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Manage Users</h1>

        {/* Form Create User */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <h2 className="text-xl font-semibold">Add User</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-3 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="readonly">Read Only</option>
            </select>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:brightness-110"
            >
              Create
            </button>
          </form>
          {message && <p className="text-sm mt-2">{message}</p>}
        </div>

        {/* List Users */}
        <div>
          <h2 className="text-xl font-semibold mb-3">User List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white text-sm text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{u.id}</td>
                    <td className="border px-4 py-2">{u.username}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                        <option value="readonly">Read Only</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return to Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg font-semibold hover:brightness-110 transition-all"
        >
          Return to Dashboard
        </button>

        <div className="text-center text-sm text-gray-500 mt-6">
          © Ramdhanyazho 2025
        </div>
      </div>
    </div>
  );
}
