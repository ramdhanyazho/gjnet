import { useEffect, useState } from 'react';
export default function PaymentsPage() {
  const [payments,setPayments]=useState([]);
  const [customerId,setCustomerId]=useState(''); const [amount,setAmount]=useState(''); const [status,setStatus]=useState('paid');
  const fetchPayments = async ()=>{ const res=await fetch('/api/payments'); const d=await res.json(); if(res.ok) setPayments(d.payments||[]); };
  useEffect(()=>{ fetchPayments(); },[]);
  const add = async (e)=>{ e.preventDefault(); await fetch('/api/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer_id:customerId,amount, status})}); setCustomerId(''); setAmount(''); fetchPayments(); };
  const del = async (id)=>{ await fetch('/api/payments/'+id,{method:'DELETE'}); fetchPayments(); };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <form onSubmit={add} className="mb-4 space-y-2">
        <input value={customerId} onChange={e=>setCustomerId(e.target.value)} placeholder="customer_id" className="border p-2 rounded w-full"/>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="amount" className="border p-2 rounded w-full"/>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full p-2 border rounded"><option>paid</option><option>pending</option></select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Payment</button>
      </form>
      <ul>
        {payments.map(p=> <li key={p.id} className="mb-2 border p-2 rounded"><div className="font-semibold">{p.customer_name} — {p.amount}</div><div className="text-sm">{p.status} • {p.date}</div><div><button onClick={()=>del(p.id)} className="text-red-600">Delete</button></div></li>)}
      </ul>
    </div>
  );
}
