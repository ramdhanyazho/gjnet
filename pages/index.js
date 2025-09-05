import React, { useState, useEffect } from 'react';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loginResult, setLoginResult] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });

  // Fetch customers & payments
  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(setCustomers);

    fetch('/api/payments')
      .then(res => res.json())
      .then(setPayments);
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoginResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Selamat Datang di GJNet</h1>
      <p className="mb-8">Halaman ini berhasil ditampilkan di Vercel.</p>

      {/* Login Card */}
      <div className="bg-white shadow-md rounded-lg p-6 w-96 mb-8">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded px-3 py-2"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {loginResult && (
          <div className="mt-4 text-sm">
            <pre>{JSON.stringify(loginResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Customers */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Customers</h2>
        <pre>{JSON.stringify(customers, null, 2)}</pre>
      </div>

      {/* Payments */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Payments</h2>
        <pre>{JSON.stringify(payments, null, 2)}</pre>
      </div>
    </div>
  );
}
