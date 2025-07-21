import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

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

function formatCurrency(amount: string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(parseInt(amount));
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch('https://sedekahku.99delivery.id/campaigns');
      const data = await response.json();
      const foundCampaign = data.campaigns.find((c: Campaign) => c.id === id);
      setCampaign(foundCampaign || null);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = () => {
    const images = [
      "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg",
      "https://images.pexels.com/photos/8819952/pexels-photo-8819952.jpeg",
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-16 text-center">Loading...</div>;
  }

  if (!campaign) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-gray-500">Kampanye tidak ditemukan.</div>;
  }

  const progress = (parseInt(campaign.current_amount) / parseInt(campaign.target_amount)) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header with Home button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Detail Kampanye</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium border border-emerald-200 transition-colors"
        >
          <Home className="w-5 h-5" />
          Beranda
        </button>
      </div>
      <img src={getImageUrl()} alt={campaign.title} className="w-full h-64 object-cover rounded-xl mb-8" />
      <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
      <p className="text-gray-600 mb-6">{campaign.description}</p>
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Terkumpul</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div className="bg-emerald-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-emerald-600 font-semibold">{formatCurrency(campaign.current_amount)}</span>
          <span className="text-gray-500">{formatCurrency(campaign.target_amount)}</span>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cerita Kampanye</h2>
        <p className="text-gray-700">{campaign.description}</p>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Informasi Pengelola</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-medium">{campaign.user.name}</div>
          <div className="text-sm text-gray-600">{campaign.user.email}</div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Daftar Donatur</h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="text-gray-400">Belum ada donasi.</div>
        </div>
      </div>
      <div className="text-center">
        <Link to={`/campaigns/${campaign.id}/donate`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg inline-block">
          Donasi Sekarang
        </Link>
      </div>
    </div>
  );
};

export default CampaignDetail; 