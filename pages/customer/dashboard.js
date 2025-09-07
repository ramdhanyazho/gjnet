import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Helper component untuk loading screen yang lebih baik
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-800">
    <div className="text-white text-xl font-semibold">Memuat data pengguna...</div>
  </div>
);

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/customer/login"); // Gunakan /customer/login
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);

    // PENYESUAIAN PENTING: Periksa role pengguna
    // Hanya customer yang boleh mengakses halaman ini
    if (parsedUser.role !== 'customer') {
      localStorage.removeItem("user"); // Hapus data login yang salah
      router.replace("/customer/login");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  // Tampilkan loading screen jika data user belum siap
  if (!user) {
    return <LoadingScreen />;
  }

  // TAMPILAN BARU: Disesuaikan agar lebih profesional
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

        {/* --- Bagian Informasi Akun --- */}
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

        {/* --- Placeholder untuk Konten Lain --- */}
        <div className="border-t pt-6">
           <h2 className="text-xl font-semibold text-gray-700 mb-4">Layanan Anda</h2>
           <div className="text-center p-10 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-500">Anda belum memiliki riwayat pesanan.</p>
              <button className="mt-4 bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Lihat Layanan
              </button>
           </div>
        </div>
         <div className="mt-6 text-center text-sm text-gray-400">
          © Ramdhanyazho 2025
        </div>
      </div>
    </div>
  );
}
