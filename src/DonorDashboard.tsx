import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

interface Donation {
  id: string;
  user_id: string;
  campaign_id: string;
  amount: string;
  status: string;
  donor_name: string;
  payment_type: string;
  payment_token: string;
  redirect_url: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  campaign: {
    id: string;
    title: string;
  };
}

interface CampaignDetail {
  id: string;
  title: string;
  target_amount: string;
  current_amount: string;
  status: string;
}

const DonorDashboard: React.FC = () => {
  const { isAuthenticated, user, token, logout } = useAuth ? useAuth() : { isAuthenticated: false, user: null, token: null, logout: () => {} };
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignDetail[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && token && user?.id) {
      fetchDonations();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, token, user]);

  useEffect(() => {
    // Fetch campaign details for unique campaign_ids
    const fetchCampaigns = async () => {
      setCampaignsLoading(true);
      try {
        const uniqueCampaignIds = Array.from(new Set(donations.map(d => d.campaign_id)));
        const results: CampaignDetail[] = [];
        for (const id of uniqueCampaignIds) {
          const res = await fetch(`https://sedekahku.99delivery.id/campaigns/${id}`);
          const data = await res.json();
          if (data.campaign) {
            results.push({
              id: data.campaign.id,
              title: data.campaign.title,
              target_amount: data.campaign.target_amount,
              current_amount: data.campaign.current_amount,
              status: data.campaign.status,
            });
          }
        }
        setCampaigns(results);
      } catch (e) {
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };
    if (donations.length > 0) fetchCampaigns();
  }, [donations]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sedekahku.99delivery.id/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!user?.id) throw new Error('User ID tidak ditemukan di token');
      if (!Array.isArray(data.donations)) throw new Error('Data donasi tidak valid');
      const userDonations = data.donations.filter((d: Donation) => d.user_id === user.id);
      setDonations(userDonations);
    } catch (error) {
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Fallback if user info is missing
  const name = user?.name || user?.nama || '-';
  const email = user?.email || '-';

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>Dasbor Donatur</span>
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
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Profil */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profil Saya</h2>
          <div>
            <div className="mb-2"><span className="font-medium">Nama:</span> {name}</div>
            <div className="mb-2"><span className="font-medium">Email:</span> {email}</div>
          </div>
        </div>
        {/* Status Kampanye */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Kampanye yang Diikuti</h2>
          {campaignsLoading ? (
            <div className="text-gray-500">Memuat kampanye...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-gray-400">Belum ada kampanye diikuti.</div>
          ) : (
            <ul className="space-y-4">
              {campaigns.map(camp => {
                const progress = (parseInt(camp.current_amount) / parseInt(camp.target_amount)) * 100;
                return (
                  <li key={camp.id} className="border-b pb-2">
                    <div className="font-medium">{camp.title}</div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>Status: <span className="text-emerald-600 font-semibold">{camp.status}</span></span>
                      <span>Progress: {Math.round(progress)}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {/* Riwayat Donasi */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Riwayat Sedekah</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Belum ada riwayat sedekah.</div>
        ) : (
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
              {donations.map(donasi => (
                <tr key={donasi.id} className="border-b">
                  <td className="py-2">{new Date(donasi.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="py-2">{donasi.campaign?.title || '-'}</td>
                  <td className="py-2 text-right">Rp{parseInt(donasi.amount).toLocaleString('id-ID')}</td>
                  <td className="py-2 text-center">{donasi.status}</td>
                  <td className="py-2 text-center">
                    <button onClick={() => alert('Download bukti donasi belum tersedia')} className="text-emerald-600 hover:underline">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard; 