import React, { useState } from 'react';

// Data dummy kampanye
const dummyCampaigns = [
  {
    id: 1,
    title: 'Pembangunan Masjid Al-Hidayah',
    totalDonation: 250000000,
    daily: 2000000,
    monthly: 50000000,
    transactions: [
      { id: 1, date: '2024-06-01', donor: 'Budi', amount: 1000000 },
      { id: 2, date: '2024-06-02', donor: 'Anonim', amount: 2000000 },
    ],
    status: 'Berjalan',
  },
  {
    id: 2,
    title: 'Beasiswa Hafidz Al-Quran',
    totalDonation: 180000000,
    daily: 1000000,
    monthly: 30000000,
    transactions: [
      { id: 1, date: '2024-06-01', donor: 'Rina', amount: 750000 },
    ],
    status: 'Berjalan',
  },
];

const ManagerDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState(dummyCampaigns);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState<number|null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Tambah kampanye baru
  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaigns([
      ...campaigns,
      {
        id: campaigns.length + 1,
        title: newTitle,
        totalDonation: 0,
        daily: 0,
        monthly: 0,
        transactions: [],
        status: 'Berjalan',
      },
    ]);
    setNewTitle('');
    setShowAdd(false);
  };

  // Edit kampanye
  const handleEditCampaign = (id: number, title: string) => {
    setEditId(id);
    setEditTitle(title);
  };
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaigns(campaigns.map(c => c.id === editId ? { ...c, title: editTitle } : c));
    setEditId(null);
    setEditTitle('');
  };

  // Penarikan dana (simulasi)
  const handleWithdraw = (id: number) => {
    alert(`Penarikan dana kampanye ID ${id} (simulasi)`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Dasbor Pengelola Kampanye</h1>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Daftar Kampanye</h2>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">Tambah Kampanye Baru</button>
      </div>
      {/* Form tambah kampanye */}
      {showAdd && (
        <form onSubmit={handleAddCampaign} className="mb-8 bg-white p-4 rounded-xl shadow flex gap-4 items-end">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Judul Kampanye</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium">Tambah</button>
          <button type="button" onClick={() => setShowAdd(false)} className="ml-2 text-gray-500">Batal</button>
        </form>
      )}
      {/* Statistik dan daftar kampanye */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {campaigns.map(camp => (
          <div key={camp.id} className="bg-white rounded-xl shadow p-6 mb-4">
            {editId === camp.id ? (
              <form onSubmit={handleSaveEdit} className="mb-4 flex gap-2 items-end">
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 flex-1" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">Simpan</button>
                <button type="button" onClick={() => setEditId(null)} className="ml-2 text-gray-500">Batal</button>
              </form>
            ) : (
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-lg">{camp.title}</div>
                <button onClick={() => handleEditCampaign(camp.id, camp.title)} className="text-emerald-600 hover:underline text-sm">Edit</button>
              </div>
            )}
            <div className="mb-2">Total Donasi: <span className="font-semibold">Rp{camp.totalDonation.toLocaleString('id-ID')}</span></div>
            <div className="mb-2">Donasi Harian: <span className="font-semibold">Rp{camp.daily.toLocaleString('id-ID')}</span></div>
            <div className="mb-2">Donasi Bulanan: <span className="font-semibold">Rp{camp.monthly.toLocaleString('id-ID')}</span></div>
            <div className="mb-2">Status: <span className="font-semibold text-emerald-600">{camp.status}</span></div>
            <button onClick={() => handleWithdraw(camp.id)} className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium">Penarikan Dana</button>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Laporan Transaksi</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-1 text-left">Tanggal</th>
                    <th className="py-1 text-left">Donatur</th>
                    <th className="py-1 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {camp.transactions.length === 0 && (
                    <tr><td colSpan={3} className="text-gray-400 py-2 text-center">Belum ada transaksi</td></tr>
                  )}
                  {camp.transactions.map(tx => (
                    <tr key={tx.id}>
                      <td className="py-1">{tx.date}</td>
                      <td className="py-1">{tx.donor}</td>
                      <td className="py-1 text-right">Rp{tx.amount.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard; 