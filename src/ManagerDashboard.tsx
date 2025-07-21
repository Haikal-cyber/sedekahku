import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: string;
  current_amount: string;
  image_url: string;
  category: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const ManagerDashboard: React.FC = () => {
  // ALL HOOKS AT THE VERY TOP
  const { token, user, logout, isAuthenticated } = useAuth ? useAuth() : { token: null, user: null, logout: () => {}, isAuthenticated: false };
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();

  // Move fetchCampaigns above useEffect
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sedekahku.99delivery.id/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, []);

  // ACCESS CHECKS AFTER ALL HOOKS
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user) {
    return <div className="text-center py-16 text-gray-500">Memuat data pengguna...</div>;
  }
  if (user.role !== 'pengelola' && user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Tambah kampanye baru (real API)
  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const response = await fetch('https://sedekahku.99delivery.id/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          target_amount: parseInt(newTarget),
          category: newCategory,
          image_url: newImage,
        }),
      });
      if (!response.ok) throw new Error('Gagal menambah kampanye');
      await fetchCampaigns();
      setShowAdd(false);
      setNewTitle('');
      setNewDesc('');
      setNewTarget('');
      setNewCategory('');
      setNewImage('');
    } catch (error) {
      alert('Gagal menambah kampanye');
    } finally {
      setAddLoading(false);
    }
  };

  // Penarikan dana (simulasi)
  const handleWithdraw = (id: string) => {
    alert(`Penarikan dana kampanye ID ${id} (simulasi)`);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>Dasbor Pengelola Kampanye</span>
        </h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium border border-emerald-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            Beranda
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium border border-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Daftar Kampanye</h2>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">Tambah Kampanye Baru</button>
      </div>
      {/* Form tambah kampanye */}
      {showAdd && (
        <form onSubmit={handleAddCampaign} className="mb-8 bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 font-medium">Judul Kampanye</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 font-medium">Deskripsi</label>
            <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block mb-1 font-medium">Target (Rp)</label>
            <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block mb-1 font-medium">Kategori</label>
            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 font-medium">Image URL</label>
            <input type="text" value={newImage} onChange={e => setNewImage(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <button type="submit" disabled={addLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium min-w-[120px]">
            {addLoading ? 'Menambah...' : 'Tambah'}
          </button>
          <button type="button" onClick={() => setShowAdd(false)} className="ml-2 text-gray-500 min-w-[80px]">Batal</button>
        </form>
      )}
      {/* Statistik dan daftar kampanye */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat data kampanye...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-white rounded-xl shadow p-6 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-lg">{camp.title}</div>
              </div>
              <div className="mb-2">Total Donasi: <span className="font-semibold">{formatCurrency(camp.current_amount)}</span></div>
              <div className="mb-2">Target: <span className="font-semibold">{formatCurrency(camp.target_amount)}</span></div>
              <div className="mb-2">Status: <span className="font-semibold text-emerald-600">{camp.status}</span></div>
              <div className="mb-2">Kategori: <span className="font-semibold text-gray-700">{camp.category}</span></div>
              <div className="mb-2">Pengelola: <span className="font-semibold text-gray-700">{camp.user?.name}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard; 