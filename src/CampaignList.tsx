import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const categories = [
  { label: 'Semua', value: '' },
  { label: 'Masjid', value: 'Masjid' },
  { label: 'Pesantren', value: 'Pesantren' },
  { label: 'Bantuan', value: 'Bantuan' },
];

function formatCurrency(amount: string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(parseInt(amount));
}

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('https://sedekahku.99delivery.id/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchCategory = category ? c.category === category : true;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getImageUrl = (index: number) => {
    const images = [
      "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg",
      "https://images.pexels.com/photos/8819952/pexels-photo-8819952.jpeg",
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
    ];
    return images[index % images.length];
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Daftar Kampanye</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <input
          type="text"
          placeholder="Cari kampanye..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCampaigns.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Tidak ada kampanye ditemukan.</div>
        )}
        {filteredCampaigns.map((campaign, index) => {
          const progress = (parseInt(campaign.current_amount) / parseInt(campaign.target_amount)) * 100;
          return (
            <div key={campaign.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <img src={getImageUrl(index)} alt={campaign.title} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                <p className="text-gray-600">{campaign.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Terkumpul</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-semibold">{formatCurrency(campaign.current_amount)}</span>
                    <span className="text-gray-500">{formatCurrency(campaign.target_amount)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-500">{campaign.category}</span>
                  <Link to={`/campaigns/${campaign.id}`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg text-center block">
                    Donasi Sekarang
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignList; 