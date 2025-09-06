import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.username || !["admin", "operator"].includes(parsedUser.role)) {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);
    fetchPayments();
  }, [router]);

  const fetchPayments = async () => {
    const res = await fetch("/api/payments");
    const data = await res.json();
    setPayments(data);
    setLoading(false);
  };

  const savePayment = async () => {
    // Cegah operator mengedit
    if (form.id && user.role !== "admin") {
      alert("Operator tidak boleh mengedit data.");
      return;
    }

    const url = form.id ? `/api/payments/${form.id}` : "/api/payments";
    const method = form.id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({});
    fetchPayments();
  };

  const deletePayment = async (id) => {
    if (user.role !== "admin") {
      alert("Operator tidak boleh menghapus data.");
      return;
    }

    if (!confirm("Yakin hapus data ini?")) return;
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    fetchPayments();
  };

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💰 Payments</h1>

      {/* Form Tambah/Edit */}
      <div className="mb-6 space-y-2 p-4 border rounded bg-gray-50">
        <input
          placeholder="Nama"
          className="p-2 border rounded w-full"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Alamat"
          className="p-2 border rounded w-full"
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="No HP"
          className="p-2 border rounded w-full"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={form.created_at || ""}
          onChange={(e) => setForm({ ...form, created_at: e.target.value })}
        />
        <input
          placeholder="Paket"
          type="number"
          className="p-2 border rounded w-full"
          value={form.package || ""}
          onChange={(e) => setForm({ ...form, package: e.target.value })}
        />
        <input
          placeholder="Status"
          className="p-2 border rounded w-full"
          value={form.status || "aktif"}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />
        <input
          placeholder="Bayar pertama"
          type="number"
          className="p-2 border rounded w-full"
          value={form.first_payment || ""}
          onChange={(e) => setForm({ ...form, first_payment: e.target.value })}
        />
        <input
          placeholder="Biaya"
          type="number"
          className="p-2 border rounded w-full"
          value={form.fee || ""}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
        />

        <div className="space-x-2">
          <button
            onClick={savePayment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {form.id ? "Update" : "Tambah"}
          </button>
          {form.id && (
            <button
              onClick={() => setForm({})}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">No</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Alamat</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">HP</th>
            <th className="border p-2">Paket</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Bayar Pertama</th>
            <th className="border p-2">Biaya</th>
            {user.role === "admin" && <th className="border p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {payments.map((p, idx) => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.address}</td>
              <td className="border p-2">{p.created_at}</td>
              <td className="border p-2">{p.phone}</td>
              <td className="border p-2">{p.package}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{p.first_payment}</td>
              <td className="border p-2">{p.fee}</td>
              {user.role === "admin" && (
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => setForm(p)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePayment(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
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
  );
}
