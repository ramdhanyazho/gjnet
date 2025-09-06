import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.username} 👋</p>
    </div>
  );
}
