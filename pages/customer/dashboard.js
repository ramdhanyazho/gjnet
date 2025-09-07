import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Helper component untuk loading screen yang lebih baik
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-800">
    <div className="text-white text-xl font-semibold">Memuat data Anda...</div>
  </div>
);

// Helper component untuk memberikan warna pada status
const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
  if (status === 'aktif') {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
  }
  // Tambahkan kondisi lain jika ada status lain (misal: 'nonaktif')
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status || 'N/A'}</span>;
};


export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  // PENYESUAIAN: State baru untuk menyimpan data langganan
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/customer/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== 'customer') {
      localStorage.removeItem("user");
      router.replace("/customer/login");
      return;
    }

    setUser(parsedUser);

    // PENYESUAIAN: Fungsi untuk mengambil data langganan dari API
    const fetchSubscriptions = async (customerId) => {
      try {
        const res = await fetch(`/api/customers/subscriptions?customerId=${customerId}`);
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data langganan:", error);
      } finally {
        setIsLoading(false); // Selesai loading
      }
    };
    
    // Panggil fungsi di atas dengan ID user yang sedang login
    fetchSubscriptions(parsedUser.id);

  }, [router]);

  // Tampilkan loading screen jika data belum siap
  if (!user || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Selamat Datang, {user.name}!</h1>
            <p className="text-gray-500 mt-1">Ini adalah halaman dashboard personal Anda.</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/customer/login");
            }}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Informasi Akun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-500">Nama Lengkap</p>
              <p className="text-gray-800 text-lg">{user.name}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Alamat Email</p>
              <p className="text-gray-800 text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* --- PENYESUAIAN: Bagian ini sekarang menampilkan data langganan secara dinamis --- */}
        <div className="border-t pt-6">
           <h2 className="text-xl font-semibold text-gray-700 mb-4">Layanan Anda</h2>
           {subscriptions.length > 0 ? (
             <div className="overflow-auto rounded-lg border border-gray-200">
               <table className="min-w-full text-sm">
                 <thead className="bg-gray-100 text-left font-semibold">
                   <tr>
                     <th className="p-3 border">ID Pesanan</th>
                     <th className="p-3 border">Paket</th>
                     <th className="p-3 border">Biaya Bulanan</th>
                     <th className="p-3 border">Status</th>
                     <th className="p-3 border">Tanggal Daftar</th>
                   </tr>
                 </thead>
                 <tbody>
                   {subscriptions.map((sub) => (
                     <tr key={sub.id} className="hover:bg-gray-50">
                       <td className="p-3 border font-mono">#{sub.id}</td>
                       <td className="p-3 border">{sub.package}</td>
                       <td className="p-3 border">Rp {new Intl.NumberFormat('id-ID').format(sub.fee || 0)}</td>
                       <td className="p-3 border"><StatusBadge status={sub.status} /></td>
                       <td className="p-3 border">{new Date(sub.created_at).toLocaleDateString('id-ID')}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <div className="text-center p-10 bg-gray-50 rounded-lg border-2 border-dashed">
                <p className="text-gray-500">Anda belum memiliki riwayat langganan.</p>
             </div>
           )}
        </div>
         <div className="mt-6 text-center text-sm text-gray-400">
          © Ramdhanyazho 2025
        </div>
      </div>
    </div>
  );
}

