import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [rowLimit, setRowLimit] = useState(10);
  const [user, setUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    created_at: "",
    package: "",
    status: "aktif",
    first_payment: "",
    fee: ""
  });

  const router = useRouter();

  const fetchPayments = async () => {
    const res = await fetch("/api/payments");
    const data = await res.json();
    setPayments(data);
    setFiltered(data);
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u.username) {
      router.push("/login");
      return;
    }
    setUser(u);
    fetchPayments();
  }, [router]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filteredData = payments.filter((p) =>
      Object.values(p).some((val) =>
        String(val).toLowerCase().includes(q)
      )
    );
    setFiltered(filteredData);
  }, [search, payments]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openForm = (data = null) => {
    if (data) {
      setForm(data);
      setEditId(data.id);
    } else {
      setForm({
        name: "",
        address: "",
        phone: "",
        created_at: "",
        package: "",
        status: "aktif",
        first_payment: "",
        fee: ""
      });
      setEditId(null);
    }
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (editId) {
      await fetch(`/api/payments/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setFormOpen(false);
    setEditId(null);
    setForm({});
    fetchPayments();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    fetchPayments();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💰 Payments</h1>

      {/* Tombol kembali ke dashboard */}
      {(user?.role === "admin" || user?.role === "operator") && (
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 bg-gray-300 text-sm px-4 py-1 rounded"
        >
          ← Kembali ke Dashboard
        </button>
      )}

      {/* Pencarian dan opsi row */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded w-full sm:w-1/3"
        />
        <div>
          <label className="mr-2">Rows:</label>
          <select
            value={rowLimit}
            onChange={(e) => setRowLimit(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {user?.role !== "readonly" && (
          <button
            onClick={() => openForm()}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            + Tambah Payment
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Alamat</th>
              <th className="border p-2">HP</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Paket</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Bayar Pertama</th>
              <th className="border p-2">Biaya</th>
              {user?.role !== "readonly" && <th className="border p-2">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, rowLimit).map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.address}</td>
                <td className="border p-2">{p.phone}</td>
                <td className="border p-2">{p.created_at}</td>
                <td className="border p-2">{p.package}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">{p.first_payment}</td>
                <td className="border p-2">{p.fee}</td>
                {user?.role !== "readonly" && (
                  <td className="border p-2 space-x-2">
                    {user?.role === "admin" && (
                      <>
                        <button
                          onClick={() => openForm(p)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                    {user?.role === "operator" && (
                      <button
                        onClick={() => openForm(p)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        disabled
                      >
                        (readonly)
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah/Edit */}
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit Payment" : "Tambah Payment"}
            </h2>
            {[
              ["name", "Nama"],
              ["address", "Alamat"],
              ["phone", "No HP"],
              ["created_at", "Tanggal"],
              ["package", "Paket"],
              ["status", "Status"],
              ["first_payment", "Bayar Pertama"],
              ["fee", "Biaya"],
            ].map(([key, label]) => (
              <input
                key={key}
                name={key}
                placeholder={label}
                value={form[key] || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mb-2"
              />
            ))}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditId(null);
                }}
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
    </div>
  );
}
