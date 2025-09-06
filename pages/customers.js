import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CustomersPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Customers Page</h1>
      <p>Welcome, {user.username} ({user.role})</p>
    </div>
  );
}
