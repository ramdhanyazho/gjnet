import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Helper component untuk memberikan warna pada status
const StatusBadge = ({ status }) => {
    const base = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
    const colors = status === 'aktif' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
    return <span className={`${base} ${colors}`}>{status || 'N/A'}</span>;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [rowLimit, setRowLimit] = useState(10);
  const [user, setUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  // State form disesuaikan dengan struktur baru
  const [form, setForm] = useState({
    customer_id: "",
    name: "", // Digunakan untuk duplikasi data & tampilan di form edit
    address: "",
    phone: "",
    created_at: new Date(),
    package: "",
    status: "aktif",
    first_payment: "",
    fee: "",
  });

  const router = useRouter();

  // Mengambil data payments dan customers sekaligus
  const fetchData = async () => {
    try {
      const [paymentsRes, customersRes] = await Promise.all([
        fetch("/api/payments"),
        fetch("/api/customers"),
      ]);
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data);
      }
      if (customersRes.ok) {
        setCustomers(await customersRes.json());
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };
  
  // Efek untuk memfilter data saat 'payments' atau 'search' berubah
  useEffect(() => {
    setFiltered(
      payments.filter((p) =>
        Object.values(p).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, payments]);

  // Efek untuk autentikasi dan pengambilan data awal
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u || !['admin', 'operator'].includes(u.role)) {
      router.push("/login");
      return;
    }
    setUser(u);
    fetchData();
  }, [router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleDateChange = (date) => setForm({ ...form, created_at: date });

  const openForm = (data = null) => {
    if (data) { // Mode Edit
      setForm({ ...data, name: data.customer_name, phone: data.customer_phone, created_at: new Date(data.created_at) });
      setEditId(data.id);
    } else { // Mode Tambah Baru
      setForm({
        customer_id: "", name: "", address: "", phone: "", created_at: new Date(),
        package: "", status: "aktif", first_payment: "", fee: "",
      });
      setEditId(null);
    }
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    const formattedDate = form.created_at ? form.created_at.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    
    let payload = { ...form, created_at: formattedDate };

    if (!editId) { // Logika saat Tambah Baru
      if (!form.customer_id) return alert("Silakan pilih customer.");
      const selectedCustomer = customers.find(c => c.id == form.customer_id);
      if (selectedCustomer) {
        // Menambahkan nama dan phone ke payload untuk disimpan di tabel payments
        payload.name = selectedCustomer.name;
        payload.phone = selectedCustomer.phone;
      }
    }
    
    // Hapus properti yang tidak ada di tabel 'payments' (yang hanya hasil JOIN)
    delete payload.customer_name; 
    delete payload.customer_phone;

    const url = editId ? `/api/payments/${editId}` : "/api/payments";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return alert(`Gagal menyimpan: ${(await res.json()).message}`);

    setFormOpen(false);
    setEditId(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    fetchData();
  };

  const exportExcel = () => {
    const dataToExport = filtered.slice(0, rowLimit).map(p => ({
        ID: p.id,
        Nama: p.customer_name,
        Alamat: p.address,
        HP: p.customer_phone,
        Tanggal: new Date(p.created_at).toLocaleDateString('id-ID'),
        Paket: p.package,
        Status: p.status,
        "Bayar Pertama": p.first_payment,
        Biaya: p.fee,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payments", 14, 10);
    const columns = ["ID", "Nama", "Alamat", "HP", "Tanggal", "Paket", "Status", "Bayar Pertama", "Biaya"];
    const rows = filtered.slice(0, rowLimit).map((p) => [
      p.id, p.customer_name, p.address, p.customer_phone, new Date(p.created_at).toLocaleDateString('id-ID'),
      p.package, p.status, p.first_payment, p.fee,
    ]);
    doc.autoTable({ head: [columns], body: rows, startY: 20 });
    doc.save("payments.pdf");
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] text-[#1e293b] p-6 font-sans flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">💰 Payments - Welcome GJNET</h1>
      <button onClick={() => router.push("/dashboard")} className="mb-4 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded text-sm w-fit">
        ← Kembali ke Dashboard
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <input type="text" placeholder="🔍 Cari data..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-blue-300 px-4 py-2 rounded w-full sm:w-1/3"/>
          <div className="flex items-center gap-2">
            <label>Rows:</label>
            <select value={rowLimit} onChange={(e) => setRowLimit(Number(e.target.value))} className="border border-blue-300 px-2 py-1 rounded bg-white">
              <option value={10}>10</option><option value={50}>50</option><option value={100}>100</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={exportExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">📥 Excel</button>
            <button onClick={exportPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">📄 PDF</button>
            {user?.role !== "readonly" && <button onClick={() => openForm()} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm">+ Tambah</button>}
          </div>
        </div>
        <div className="overflow-auto border rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-100 text-blue-800 font-semibold">
              <tr>
                {["ID", "Nama", "Alamat", "HP", "Tanggal", "Paket", "Status", "Bayar Pertama", "Biaya"].map((h) => (<th key={h} className="px-3 py-2 border">{h}</th>))}
                {user?.role !== "readonly" && <th className="px-3 py-2 border">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, rowLimit).map((p) => (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="border px-3 py-1">{p.id}</td>
                  <td className="border px-3 py-1 font-semibold text-blue-700">{p.customer_name}</td>
                  <td className="border px-3 py-1">{p.address}</td>
                  <td className="border px-3 py-1">{p.customer_phone}</td>
                  <td className="border px-3 py-1">{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="border px-3 py-1">{p.package}</td>
                  <td className="border px-3 py-1"><StatusBadge status={p.status}/></td>
                  <td className="border px-3 py-1">{p.first_payment}</td>
                  <td className="border px-3 py-1">{p.fee}</td>
                  {user?.role !== "readonly" && (
                    <td className="border px-3 py-1 space-x-2">
                      <button onClick={() => openForm(p)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">Edit</button>
                      {user?.role === "admin" && (<button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Hapus</button>)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-blue-800">{editId ? "Edit Payment" : "Tambah Payment"}</h2>
            
            {!editId ? (
              <>
                <label className="block text-sm font-semibold mb-1 text-blue-700">Pilih Customer</label>
                <select name="customer_id" value={form.customer_id} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2 bg-white">
                  <option value="">-- Pilih Customer --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </>
            ) : (<p className="mb-2">Customer: <span className="font-semibold">{form.customer_name}</span></p>)}
            
            <input name="address" placeholder="Alamat" value={form.address || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2"/>
            <input name="package" placeholder="Paket" value={form.package || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2"/>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2 bg-white">
              <option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option>
            </select>
            <input name="first_payment" type="number" placeholder="Bayar Pertama" value={form.first_payment || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2"/>
            <input name="fee" type="number" placeholder="Biaya" value={form.fee || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2"/>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Tanggal</label>
            <DatePicker selected={form.created_at} onChange={handleDateChange} dateFormat="dd-MM-yyyy" className="w-full border px-3 py-2 rounded mb-2"/>
            
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => setFormOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 text-center text-sm text-blue-800">© {new Date().getFullYear()} Welcome Ramdhanyazho. All rights reserved.</footer>
    </div>
  );
}

