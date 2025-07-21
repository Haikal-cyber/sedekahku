import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, Heart, Receipt, Download, Share2, Home, ArrowLeft } from 'lucide-react';

interface DonationData {
  id: string;
  amount: string;
  status: string;
  donor_name: string;
  payment_type: string;
  created_at: string;
  campaign: {
    id: string;
    title: string;
    description: string;
  };
  user: {
    name: string;
    email: string;
  };
}

const DonationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSuccessRedirect = async () => {
      try {
        const orderId = searchParams.get('order_id');
        const statusCode = searchParams.get('status_code');
        const transactionStatus = searchParams.get('transaction_status');

        if (!orderId) {
          setError('ID donasi tidak ditemukan');
          setIsLoading(false);
          return;
        }

        // Fetch donation data from backend
        const response = await fetch(`https://sedekahku.99delivery.id/donations/${orderId}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data donasi');
        }

        const data = await response.json();
        setDonationData(data.donation);
        setIsLoading(false);
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data donasi');
        setIsLoading(false);
      }
    };

    handleSuccessRedirect();
  }, [searchParams]);

  const getStatusInfo = (status: string, transactionStatus: string | null) => {
    if (transactionStatus === 'settlement' || status === 'paid') {
      return {
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        title: 'Pembayaran Berhasil!',
        message: 'Terima kasih atas donasi Anda. Semoga amal baik Anda diterima.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      };
    } else if (transactionStatus === 'pending' || status === 'pending') {
      return {
        icon: <Clock className="w-16 h-16 text-yellow-500" />,
        title: 'Pembayaran Sedang Diproses',
        message: 'Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      };
    } else {
      return {
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        title: 'Pembayaran Gagal',
        message: 'Maaf, pembayaran Anda gagal. Silakan coba lagi.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      };
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(parseInt(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data donasi...</p>
        </div>
      </div>
    );
  }

  if (error || !donationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error || 'Data donasi tidak ditemukan'}</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Kampanye
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(donationData.status, searchParams.get('transaction_status'));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/campaigns')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Kampanye
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Status Donasi</h1>
        </div>

        {/* Status Card */}
        <div className={`bg-white rounded-xl shadow-lg p-8 mb-6 ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
          <div className="text-center">
            {statusInfo.icon}
            <h2 className={`text-2xl font-bold mt-4 ${statusInfo.textColor}`}>
              {statusInfo.title}
            </h2>
            <p className={`mt-2 ${statusInfo.textColor}`}>
              {statusInfo.message}
            </p>
          </div>
        </div>

        {/* Donation Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Heart className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Detail Donasi</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">ID Donasi:</span>
              <span className="font-medium text-gray-900">{donationData.id}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Kampanye:</span>
              <span className="font-medium text-gray-900">{donationData.campaign.title}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Nominal:</span>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(donationData.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Metode Pembayaran:</span>
              <span className="font-medium text-gray-900 capitalize">
                {donationData.payment_type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                donationData.status === 'paid' ? 'bg-green-100 text-green-800' :
                donationData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {donationData.status === 'paid' ? 'Berhasil' :
                 donationData.status === 'pending' ? 'Menunggu' : 'Gagal'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Tanggal:</span>
              <span className="font-medium text-gray-900">
                {formatDate(donationData.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/campaigns')}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Beranda
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Cetak
            </button>

            <button
              onClick={() => {
                const text = `Saya baru saja berdonasi ${formatCurrency(donationData.amount)} untuk kampanye "${donationData.campaign.title}". Mari bergabung dalam kebaikan!`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Donasi Berhasil',
                    text: text,
                    url: window.location.origin
                  });
                } else {
                  navigator.clipboard.writeText(text);
                  alert('Teks berhasil disalin ke clipboard!');
                }
              }}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess; 