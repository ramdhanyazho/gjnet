// pages/index.js
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loginResult, setLoginResult] = useState(null);

  // Ambil data customers
  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err));

    fetch('/api/payments')
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(err => console.error(err));
  }, []);

  // Fungsi login
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password' })
      });
      const data = await res.json();
      setLoginResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Selamat Datang di GJNet</h1>
      <p>Halaman ini berhasil ditampilkan di Vercel.</p>

      {/* Login Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Login</h2>
        <button onClick={handleLogin}>Login</button>
        {loginResult && (
          <pre>{JSON.stringify(loginResult, null, 2)}</pre>
        )}
      </div>

      {/* Customers Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Customers</h2>
        <pre>{JSON.stringify(customers, null, 2)}</pre>
      </div>

      {/* Payments Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Payments</h2>
        <pre>{JSON.stringify(payments, null, 2)}</pre>
      </div>
    </div>
  );
}
