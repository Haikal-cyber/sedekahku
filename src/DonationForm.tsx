import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Home } from 'lucide-react';

const paymentMethods = [
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'E-Wallet', value: 'ewallet' },
  { label: 'QRIS', value: 'qris' },
];

interface DonationResponse {
  message: string;
  donation: {
    id: string;
    amount: number;
    status: string;
    payment_token: string;
    redirect_url: string;
  };
}

const DonationForm: React.FC = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [payment, setPayment] = useState(paymentMethods[0].value);
  const [name, setName] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Login Diperlukan</p>
          <p className="text-sm">Anda harus login terlebih dahulu untuk melakukan donasi.</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const requestBody = {
        campaign_id: id,
        amount: parseInt(amount),
        donor_name: isAnon ? 'Anonim' : (name || 'Anonim'),
        payment_type: payment
      };

      const response = await fetch('https://sedekahku.99delivery.id/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token tidak valid, silakan login ulang');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DonationResponse = await response.json();
      
      // Redirect to Midtrans Snap
      if (data.donation.redirect_url) {
        window.location.href = data.donation.redirect_url;
      } else {
        throw new Error('Redirect URL tidak ditemukan');
      }

    } catch (err) {
      console.error('Error creating donation:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses donasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Header with Home button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Formulir Donasi</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium border border-emerald-200 transition-colors"
        >
          <Home className="w-5 h-5" />
          Beranda
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block mb-1 font-medium">Jumlah Donasi (Rp)</label>
          <input
            type="number"
            min="1000"
            required
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Masukkan nominal donasi"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nama Donatur</label>
          <input
            type="text"
            value={isAnon ? '' : name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Nama Anda (opsional)"
            disabled={isAnon || isLoading}
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="anonim"
              checked={isAnon}
              onChange={e => setIsAnon(e.target.checked)}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="anonim" className="text-sm text-gray-600">Sembunyikan nama (Donasi Anonim)</label>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Catatan (opsional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Tulis pesan atau doa..."
            rows={3}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Memproses...
            </div>
          ) : (
            'Lanjut Bayar'
          )}
        </button>
      </form>
    </div>
  );
};

export default DonationForm; 