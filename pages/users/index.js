import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "readonly" });
  const [message, setMessage] = useState("");

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
    fetchUsers();
  }, []);

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {/* Form Create User */}
      <div className="p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="readonly">Read Only</option>
          </select>
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Create
          </button>
        </form>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>

      {/* List Users */}
      <div>
        <h2 className="text-lg font-semibold mb-2">User List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Username</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-3 py-2">{u.id}</td>
                <td className="border px-3 py-2">{u.username}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2 space-x-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="readonly">Read Only</option>
                  </select>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
}
