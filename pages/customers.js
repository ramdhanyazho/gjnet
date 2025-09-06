import { useEffect, useState } from 'react';
export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [phone,setPhone]=useState('');
  const fetchCustomers = async ()=>{
    const res = await fetch('/api/customers'); const data = await res.json();
    if(res.ok) setCustomers(data.customers || []);
  };
  useEffect(()=>{ fetchCustomers(); },[]);
  const add = async (e)=>{ e.preventDefault(); await fetch('/api/customers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,phone})}); setName(''); setEmail(''); setPhone(''); fetchCustomers(); };
  const del = async (id)=>{ await fetch('/api/customers/'+id,{method:'DELETE'}); fetchCustomers(); };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <form onSubmit={add} className="mb-4 space-y-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border p-2 rounded w-full"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded w-full"/>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="border p-2 rounded w-full"/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul>
        {customers.map(c=> <li key={c.id} className="mb-2 border p-2 rounded flex justify-between items-center"><div><div className="font-semibold">{c.name}</div><div className="text-sm">{c.email} – {c.phone}</div></div><div><button onClick={()=>del(c.id)} className="text-red-600">Delete</button></div></li>)}
      </ul>
    </div>
  );
}
