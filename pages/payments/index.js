import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ customer_id: "", amount: "", status: "paid" });
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const router = useRouter();

  const fetchPayments = async () => {
    const res = await fetch("/api/payments");
    const d = await res.json();
    if (res.ok) setPayments(d.payments || []);
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return router.replace("/login");

    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetchPayments();
  }, [router]);

  const filteredPayments = payments
    .filter((p) =>
      p.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      statusFilter === "all" ? true : p.status === statusFilter
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1;
      return 0;
    });

  const handleSave = async () => {
    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `/api/payments/${form.id}` : "/api/payments";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    fetchPayments();
    setShowForm(false);
    setForm({ customer_id: "", amount: "", status: "paid" });
    setEditMode(false);
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus data ini?")) return;
    await fetch("/api/payments/" + id, { method: "DELETE" });
    fetchPayments();
  };

  const handleExport = () => {
    const csv = [
      ["No", "Customer", "Amount", "Status", "Date"],
      ...filteredPayments.map((p, i) => [
        i + 1,
        p.customer_name,
        p.amount,
        p.status,
        p.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  function toggleSort(field) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">💰 Payments</h1>
        {user && (user.role === "admin" || user.role === "operator") && (
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 underline"
          >
            ⬅ Back to Dashboard
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Find by customer name"
          className="p-2 border rounded w-full sm:w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value={10}>Show 10</option>
          <option value={50}>Show 50</option>
          <option value={100}>Show 100</option>
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Payment
        </button>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ⬇ Export CSV
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Id</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Package</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">First Payment</th>
            <th className="border p-2">Fee</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.slice(0, rowLimit).map((p, idx) => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.address}</td>
              <td className="border p-2">{p.phone}</td>
              <td className="border p-2">{p.created_at}</td>
              <td className="border p-2">{p.package}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{p.first_payment}</td>
              <td className="border p-2">{p.fee}</td>
              <td className="border p-2 space-x-2">
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md space-y-2">
            <h2 className="text-lg font-semibold">
              {editMode ? "Edit" : "Add"} Payment
            </h2>
            <input
              placeholder="Customer ID"
              className="p-2 border rounded w-full"
              value={form.customer_id}
              onChange={(e) =>
                setForm({ ...form, customer_id: e.target.value })
              }
            />
            <input
              placeholder="Amount"
              className="p-2 border rounded w-full"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <select
              className="p-2 border rounded w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm({});
                  setEditMode(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}