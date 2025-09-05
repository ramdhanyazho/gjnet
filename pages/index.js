import React, { useState } from 'react';

export default function Home() {
  const [section, setSection] = useState('login');

  return (
    <div>
      <h1>🌐 GJnet WiFi Management System</h1>
      <nav>
        <button onClick={() => setSection('login')}>Login</button>
        <button onClick={() => setSection('customers')}>Customers</button>
        <button onClick={() => setSection('payments')}>Payments</button>
      </nav>

      {section === 'login' && <div><h2>Login Form</h2></div>}
      {section === 'customers' && <div><h2>Customers Data</h2></div>}
      {section === 'payments' && <div><h2>Payments Data</h2></div>}
    </div>
  );
}