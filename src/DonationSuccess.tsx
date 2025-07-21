import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, Heart, Receipt, Download, Share2, Home, ArrowLeft, RefreshCw, X } from 'lucide-react';
import TransactionReceipt from './TransactionReceipt';

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
  const [retryCount, setRetryCount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const handleSuccessRedirect = async () => {
      try {
        const orderId = searchParams.get('order_id');
        const statusCode = searchParams.get('status_code');
        const transactionStatus = searchParams.get('transaction_status');
        const fraudStatus = searchParams.get('fraud_status');

        console.log('Midtrans Redirect Parameters:', {
          orderId,
          statusCode,
          transactionStatus,
          fraudStatus
        });

        if (!orderId) {
          setError('ID donasi tidak ditemukan pada URL redirect');
          setIsLoading(false);
          return;
        }

        // Fetch donation data from backend
        const response = await fetch(`https://sedekahku.99delivery.id/donations/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Gagal mengambil data donasi`);
        }

        const data = await response.json();
        setDonationData(data.donation);
        setIsLoading(false);

        // Log successful transaction
        console.log('Donation Data Retrieved:', data.donation);
        
        // Track successful payment for analytics
        if (transactionStatus === 'settlement') {
          console.log('Payment Successfully Completed:', {
            donationId: orderId,
            amount: data.donation.amount,
            campaign: data.donation.campaign.title
          });
        }

      } catch (err) {
        console.error('Error fetching donation data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data donasi');
        setIsLoading(false);
      }
    };

    handleSuccessRedirect();
  }, [searchParams]);

  const retryFetch = async () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
    
    // Wait a bit before retrying
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getStatusInfo = (status: string, transactionStatus: string | null, statusCode: string | null) => {
    // Midtrans specific status handling
    if (transactionStatus === 'settlement' && statusCode === '200') {
      return {
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        title: 'Pembayaran Berhasil! 🎉',
        message: 'Terima kasih atas donasi Anda. Semoga amal baik Anda diterima dan menjadi berkah.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        isSuccess: true
      };
    } else if (transactionStatus === 'pending' || status === 'pending') {
      return {
        icon: <Clock className="w-16 h-16 text-yellow-500" />,
        title: 'Pembayaran Sedang Diproses ⏳',
        message: 'Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi dari bank atau e-wallet.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        isSuccess: false
      };
    } else if (transactionStatus === 'deny' || transactionStatus === 'expire') {
      return {
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        title: 'Pembayaran Ditolak/Dibatalkan ❌',
        message: 'Pembayaran Anda ditolak atau dibatalkan. Silakan coba lagi dengan metode pembayaran yang berbeda.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        isSuccess: false
      };
    } else if (transactionStatus === 'cancel') {
      return {
        icon: <XCircle className="w-16 h-16 text-orange-500" />,
        title: 'Pembayaran Dibatalkan ⚠️',
        message: 'Anda membatalkan pembayaran. Silakan coba lagi jika ingin melanjutkan donasi.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        isSuccess: false
      };
    } else {
      return {
        icon: <AlertCircle className="w-16 h-16 text-gray-500" />,
        title: 'Status Pembayaran Tidak Diketahui',
        message: 'Status pembayaran tidak dapat dipastikan. Silakan hubungi tim support.',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800',
        isSuccess: false
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

  const getPaymentMethodLabel = (paymentType: string) => {
    const labels: { [key: string]: string } = {
      'bank_transfer': 'Transfer Bank',
      'ewallet': 'E-Wallet',
      'qris': 'QRIS',
      'credit_card': 'Kartu Kredit',
      'debit_card': 'Kartu Debit'
    };
    return labels[paymentType] || paymentType.replace('_', ' ');
  };

  const handlePrint = () => {
    setShowReceipt(true);
    setTimeout(() => {
      window.print();
      setShowReceipt(false);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi status pembayaran...</p>
          <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error || !donationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error || 'Data donasi tidak ditemukan'}</p>
          
          <div className="space-y-3">
            <button
              onClick={retryFetch}
              disabled={retryCount >= 3}
              className="flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi {retryCount > 0 && `(${retryCount}/3)`}
            </button>
            
            <button
              onClick={() => navigate('/campaigns')}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Kembali ke Kampanye
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(
    donationData.status, 
    searchParams.get('transaction_status'),
    searchParams.get('status_code')
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/campaigns')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Kampanye
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Status Pembayaran</h1>
        </div>

        {/* Status Card */}
        <div className={`bg-white rounded-xl shadow-lg p-8 mb-6 ${statusInfo.bgColor} border ${statusInfo.borderColor} animate-pulse`}>
          <div className="text-center">
            {statusInfo.icon}
            <h2 className={`text-2xl font-bold mt-4 ${statusInfo.textColor}`}>
              {statusInfo.title}
            </h2>
            <p className={`mt-2 ${statusInfo.textColor}`}>
              {statusInfo.message}
            </p>
            
            {statusInfo.isSuccess && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm">
                  💝 Terima kasih telah berpartisipasi dalam kebaikan!
                </p>
              </div>
            )}
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
              <span className="text-gray-600">ID Transaksi:</span>
              <span className="font-mono text-sm font-medium text-gray-900">{donationData.id}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Kampanye:</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">{donationData.campaign.title}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Nominal Donasi:</span>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(donationData.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Metode Pembayaran:</span>
              <span className="font-medium text-gray-900">
                {getPaymentMethodLabel(donationData.payment_type)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Status Pembayaran:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusInfo.isSuccess ? 'bg-green-100 text-green-800' :
                donationData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {statusInfo.isSuccess ? 'Berhasil' :
                 donationData.status === 'pending' ? 'Menunggu' : 'Gagal'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Tanggal Transaksi:</span>
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
              onClick={handlePrint}
              className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Cetak Receipt
            </button>

            <button
              onClick={() => {
                const text = `Saya baru saja berdonasi ${formatCurrency(donationData.amount)} untuk kampanye "${donationData.campaign.title}". Mari bergabung dalam kebaikan! 💝`;
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

        {/* Additional Info for Pending Payments */}
        {!statusInfo.isSuccess && searchParams.get('transaction_status') === 'pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Informasi Penting</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Pembayaran akan diproses dalam 1-2 jam kerja</li>
              <li>• Anda akan menerima notifikasi email saat pembayaran berhasil</li>
              <li>• Jika pembayaran gagal, donasi akan otomatis dibatalkan</li>
              <li>• Hubungi support jika ada pertanyaan</li>
            </ul>
          </div>
        )}

        {/* Receipt Modal for Printing */}
        {showReceipt && donationData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
              <button
                onClick={() => setShowReceipt(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Preview Receipt</h3>
                <p className="text-sm text-gray-600">Klik tombol cetak untuk mencetak receipt</p>
              </div>
              <TransactionReceipt 
                donationData={donationData}
                transactionStatus={searchParams.get('transaction_status') || ''}
              />
              <div className="mt-4 flex justify-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Cetak Sekarang
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationSuccess; 