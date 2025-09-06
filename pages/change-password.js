import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
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

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message || "Password updated");
    } catch (err) {
      setMessage("Error updating password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-700">Change Password</h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            Update Password
          </button>
        </form>

        {message && <p className="text-center text-sm text-gray-700">{message}</p>}

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg font-semibold hover:brightness-110 transition-all mt-4"
        >
          Return to Dashboard
        </button>

        <div className="text-center text-sm text-gray-400 mt-6">
          © Ramdhanyazho 2025
        </div>
      </div>
    </div>
  );
}
