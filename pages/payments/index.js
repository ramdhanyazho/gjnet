import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
    fee: "",
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
        fee: "",
      });
      setEditId(null);
    }
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    const url = editId ? `/api/payments/${editId}` : "/api/payments";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
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

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payments", 14, 10);
    const columns = [
      "ID",
      "Nama",
      "Alamat",
      "HP",
      "Tanggal",
      "Paket",
      "Status",
      "Bayar Pertama",
      "Biaya",
    ];
    const rows = filtered.map((p) => [
      p.id,
      p.name,
      p.address,
      p.phone,
      p.created_at,
      p.package,
      p.status,
      p.first_payment,
      p.fee,
    ]);
    doc.autoTable({ head: [columns], body: rows, startY: 20 });
    doc.save("payments.pdf");
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] text-[#1e293b] p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">💰 Payments - Welcome GJNET</h1>

      {user?.role && (
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded text-sm"
        >
          ← Kembali ke Dashboard
        </button>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Cari data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 px-4 py-2 rounded w-full sm:w-1/3"
        />
        <div className="flex items-center gap-2">
          <label>Rows:</label>
          <select
            value={rowLimit}
            onChange={(e) => setRowLimit(Number(e.target.value))}
            className="border border-blue-300 px-2 py-1 rounded"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            📥 Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            📄 PDF
          </button>
          {user?.role !== "readonly" && (
            <button
              onClick={() => openForm()}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm"
            >
              + Tambah
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto border rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-800 font-semibold">
            <tr>
              {[
                "ID",
                "Nama",
                "Alamat",
                "HP",
                "Tanggal",
                "Paket",
                "Status",
                "Bayar Pertama",
                "Biaya",
              ].map((h) => (
                <th key={h} className="px-3 py-2 border">
                  {h}
                </th>
              ))}
              {user?.role !== "readonly" && <th className="px-3 py-2 border">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, rowLimit).map((p) => (
              <tr key={p.id} className="hover:bg-blue-50">
                <td className="border px-3 py-1">{p.id}</td>
                <td className="border px-3 py-1">{p.name}</td>
                <td className="border px-3 py-1">{p.address}</td>
                <td className="border px-3 py-1">{p.phone}</td>
                <td className="border px-3 py-1">{p.created_at}</td>
                <td className="border px-3 py-1">{p.package}</td>
                <td className="border px-3 py-1">{p.status}</td>
                <td className="border px-3 py-1">{p.first_payment}</td>
                <td className="border px-3 py-1">{p.fee}</td>
                {user?.role !== "readonly" && (
                  <td className="border px-3 py-1 space-x-2">
                    <button
                      onClick={() => openForm(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Hapus
                      </button>
                    )}
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
            <h2 className="text-lg font-bold mb-4 text-blue-800">
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
            <div className="flex justify-end space-x-2 mt-2">
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
