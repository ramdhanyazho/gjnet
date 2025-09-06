import { useState } from 'react';
import { useRouter } from 'next/router';
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const router = useRouter();
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username, password, role }) });
      const data = await res.json();
      if (res.ok) { alert('Registered'); router.push('/login'); }
      else setError(data.message || data.error || 'Register failed');
    } catch (err) { setError('Server error'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <form onSubmit={submit} className="space-y-4">
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="w-full p-2 border rounded" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="w-full p-2 border rounded" />
          <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-2 border rounded">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {error && <div className="text-red-500">{error}</div>}
          <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
        </form>
        <div className="mt-4 text-sm">Have account? <a href="/login" className="text-blue-600">Login</a></div>
      </div>
    </div>
  );
}
