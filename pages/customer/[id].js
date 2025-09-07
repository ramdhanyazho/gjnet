import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <p className="text-xl">Loading customer data...</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const base = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
  const colors = status === 'aktif' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  return <span className={`${base} ${colors}`}>{status || 'N/A'}</span>;
};

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [admin, setAdmin] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formOpen, setFormOpen] = useState(false);
  const [newSubForm, setNewSubForm] = useState({
    package: "",
    first_payment: "",
    fee: "",
    status: "aktif",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored || JSON.parse(stored).role !== 'admin') {
      router.push("/login");
      return;
    }
    setAdmin(JSON.parse(stored));

    if (id) {
      const fetchData = async () => {
        try {
          // Ambil detail customer dan langganannya secara bersamaan
          const [customerRes, subsRes] = await Promise.all([
            fetch(`/api/customers/${id}`),
            fetch(`/api/customers/subscriptions?customerId=${id}`)
          ]);

          if (customerRes.ok) setCustomer(await customerRes.json());
          if (subsRes.ok) setSubscriptions(await subsRes.json());

        } catch (error) {
          console.error("Failed to fetch customer data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, router]);

  const handleFormChange = (e) => {
    setNewSubForm({ ...newSubForm, [e.target.name]: e.target.value });
  };
  
  const handleFormSubmit = async () => {
    try {
      const res = await fetch(`/api/customers/${id}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubForm),
      });

      if (res.ok) {
        setFormOpen(false);
        // Refresh data langganan
        const subsRes = await fetch(`/api/customers/subscriptions?customerId=${id}`);
        if (subsRes.ok) setSubscriptions(await subsRes.json());
      } else {
        const errorData = await res.json();
        alert(`Gagal menyimpan: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Gagal mengirim form:", error);
      alert("Terjadi kesalahan pada server.");
    }
  };


  if (isLoading || !customer) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
            <Link href="/customers" className="text-blue-600 hover:underline">
                &larr; Kembali ke Daftar Customer
            </Link>
        </div>

        {/* Customer Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
            <p className="text-gray-500">{customer.email}</p>
            <p className="text-gray-500">{customer.phone}</p>
        </div>

        {/* Subscriptions Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Riwayat Langganan</h2>
                <button 
                  onClick={() => setFormOpen(true)}
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  + Tambah Langganan Baru
                </button>
            </div>
            
            {/* Tabel Langganan */}
            <div className="overflow-auto rounded-lg border">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left font-semibold">
                        <tr>
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Paket</th>
                            <th className="p-3 border">Biaya Awal</th>
                            <th className="p-3 border">Biaya Bulanan</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Tgl Daftar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.length > 0 ? subscriptions.map(sub => (
                            <tr key={sub.id} className="hover:bg-gray-50">
                                <td className="p-3 border font-mono">#{sub.id}</td>
                                <td className="p-3 border">{sub.package}</td>
                                <td className="p-3 border">Rp {new Intl.NumberFormat('id-ID').format(sub.first_payment || 0)}</td>
                                <td className="p-3 border">Rp {new Intl.NumberFormat('id-ID').format(sub.fee || 0)}</td>
                                <td className="p-3 border"><StatusBadge status={sub.status} /></td>
                                <td className="p-3 border">{new Date(sub.created_at).toLocaleDateString('id-ID')}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">Belum ada data langganan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal Form Tambah Langganan */}
        {formOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">Tambah Langganan Baru</h2>
                    <div className="space-y-4">
                        <input name="package" onChange={handleFormChange} placeholder="Nama Paket (e.g., 50 Mbps)" className="w-full border p-2 rounded"/>
                        <input name="first_payment" type="number" onChange={handleFormChange} placeholder="Biaya Pemasangan Awal" className="w-full border p-2 rounded"/>
                        <input name="fee" type="number" onChange={handleFormChange} placeholder="Biaya Bulanan" className="w-full border p-2 rounded"/>
                        <select name="status" onChange={handleFormChange} value={newSubForm.status} className="w-full border p-2 rounded bg-white">
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button onClick={() => setFormOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Batal</button>
                        <button onClick={handleFormSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
