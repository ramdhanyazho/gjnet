import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/customer-login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hi, {user.name}</h1>
      <p>📧 Email: {user.email}</p>
      <p>🧾 Status langganan: Aktif (contoh)</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/customer-login");
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
