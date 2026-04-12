import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
};

const EMPTY_FORM = { title: '', description: '', status: 'pending' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const [itemsRes, statsRes] = await Promise.all([
      api.get('/items'),
      api.get('/items/stats'),
    ]);
    setItems(itemsRes.data);
    setStats(statsRes.data);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (item) => { setForm({ title: item.title, description: item.description || '', status: item.status }); setEditId(item.id); setShowForm(true); setError(''); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (editId) {
        await api.put(`/items/${editId}`, form);
      } else {
        await api.post('/items', form);
      }
      await fetchData();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/items/${id}`);
    await fetchData();
  };

  const statCards = [
    { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
    { label: 'Active', value: stats.active, color: 'bg-green-100 text-green-700' },
    { label: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Completed', value: stats.completed, color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello, {user?.name}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 text-center ${color}`}>
              <p className="text-3xl font-bold">{value ?? 0}</p>
              <p className="text-sm font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Items Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">My Items</h2>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + New Item
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit Item' : 'New Item'}</h3>
              {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-3">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text" placeholder="Title" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  placeholder="Description (optional)" rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeForm} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No items yet. Create your first one!</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
