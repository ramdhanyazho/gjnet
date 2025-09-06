import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const u = JSON.parse(stored);
    if (!["admin", "operator"].includes(u.role)) {
      router.push("/login");
      return;
    }

    setUser(u);
    fetchCustomers();
  }, [router]);

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
    setFiltered(data);
  };

  useEffect(() => {
    const q = search.toLowerCase();
    const f = customers.filter((c) =>
      Object.values(c).some((v) => String(v).toLowerCase().includes(q))
    );
    setFiltered(f);
  }, [search, customers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openForm = (data = null) => {
    if (data) {
      setForm(data);
      setEditId(data.id);
    } else {
      setForm({ name: "", email: "", phone: "" });
      setEditId(null);
    }
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (editId) {
      await fetch(`/api/customers/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setFormOpen(false);
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus customer ini?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">👥 Manage Customers</h1>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Cari customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:brightness-110"
            >
              ← Kembali ke Dashboard
            </button>
            {user?.role === "admin" && (
              <button
                onClick={() => openForm()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:brightness-110"
              >
                + Tambah Customer
              </button>
            )}
          </div>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left font-semibold">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Nama</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">No HP</th>
                <th className="p-3 border">Dibuat</th>
                {user?.role === "admin" && <th className="p-3 border">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{c.id}</td>
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.email}</td>
                  <td className="p-3 border">{c.phone}</td>
                  <td className="p-3 border">{c.created_at}</td>
                  {user?.role === "admin" && (
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => openForm(c)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:brightness-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:brightness-110"
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {formOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">
                {editId ? "Edit Customer" : "Tambah Customer"}
              </h2>
              {["name", "email", "phone"].map((key) => (
                <input
                  key={key}
                  name={key}
                  placeholder={key.toUpperCase()}
                  value={form[key] || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mb-2"
                />
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          © Ramdhanyazho 2025
        </div>
      </div>
    </div>
  );
}
