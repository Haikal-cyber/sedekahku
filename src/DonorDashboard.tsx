import React, { useState } from 'react';

// Data dummy
const dummyDonations = [
  {
    id: 1,
    campaign: 'Pembangunan Masjid Al-Hidayah',
    amount: 100000,
    date: '2024-05-01',
    status: 'Terkonfirmasi',
    receipt: 'bukti1.pdf',
  },
  {
    id: 2,
    campaign: 'Bantuan Kemanusiaan Gaza',
    amount: 50000,
    date: '2024-05-10',
    status: 'Menunggu Konfirmasi',
    receipt: 'bukti2.pdf',
  },
];

const dummyFollowed = [
  {
    id: 1,
    title: 'Pembangunan Masjid Al-Hidayah',
    progress: 50,
    status: 'Berjalan',
  },
  {
    id: 3,
    title: 'Bantuan Kemanusiaan Gaza',
    progress: 75,
    status: 'Berjalan',
  },
];

const DonorDashboard: React.FC = () => {
  const [name, setName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi@email.com');
  const [editing, setEditing] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleDownload = (receipt: string) => {
    alert(`Download bukti donasi: ${receipt} (simulasi)`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Dasbor Donatur</h1>
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Profil */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profil Saya</h2>
          {editing ? (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nama</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium">Simpan</button>
            </form>
          ) : (
            <div>
              <div className="mb-2"><span className="font-medium">Nama:</span> {name}</div>
              <div className="mb-2"><span className="font-medium">Email:</span> {email}</div>
              <button onClick={() => setEditing(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium mt-2">Edit Profil</button>
            </div>
          )}
        </div>
        {/* Status Kampanye */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Kampanye yang Diikuti</h2>
          <ul className="space-y-4">
            {dummyFollowed.map(kampanye => (
              <li key={kampanye.id} className="border-b pb-2">
                <div className="font-medium">{kampanye.title}</div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Status: <span className="text-emerald-600 font-semibold">{kampanye.status}</span></span>
                  <span>Progress: {kampanye.progress}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Riwayat Donasi */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Riwayat Sedekah</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Tanggal</th>
              <th className="py-2 text-left">Kampanye</th>
              <th className="py-2 text-right">Nominal</th>
              <th className="py-2 text-center">Status</th>
              <th className="py-2 text-center">Bukti</th>
            </tr>
          </thead>
          <tbody>
            {dummyDonations.map(donasi => (
              <tr key={donasi.id} className="border-b">
                <td className="py-2">{donasi.date}</td>
                <td className="py-2">{donasi.campaign}</td>
                <td className="py-2 text-right">Rp{donasi.amount.toLocaleString('id-ID')}</td>
                <td className="py-2 text-center">{donasi.status}</td>
                <td className="py-2 text-center">
                  <button onClick={() => handleDownload(donasi.receipt)} className="text-emerald-600 hover:underline">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorDashboard; 