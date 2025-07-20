import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, Heart, Receipt, Download, Share2 } from 'lucide-react';

interface PaymentResult {
  status: 'success' | 'pending' | 'failed' | 'error';
  message: string;
  donationId?: string;
  amount?: number;
  campaignTitle?: string;
  paymentMethod?: string;
  transactionTime?: string;
}

const PaymentFinish: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    handlePaymentFinish();
  }, []);

  const handlePaymentFinish = async () => {
    try {
      // Get parameters from Midtrans finish redirect URL
      const orderId = searchParams.get('order_id');
      const transactionStatus = searchParams.get('transaction_status');
      const fraudStatus = searchParams.get('fraud_status');
      const paymentType = searchParams.get('payment_type');
      const grossAmount = searchParams.get('gross_amount');
      const transactionTime = searchParams.get('transaction_time');

      console.log('Payment finish params:', {
        orderId,
        transactionStatus,
        fraudStatus,
        paymentType,
        grossAmount,
        transactionTime
      });

      if (!orderId) {
        setPaymentResult({
          status: 'error',
          message: 'ID donasi tidak ditemukan pada URL.'
        });
        setIsLoading(false);
        return;
      }

      // Fetch donation status from backend
      const response = await fetch(`https://sedekahku.99delivery.id/donations/${orderId}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data donasi');
      }
      const data = await response.json();
      const donation = data.donation;

      // Determine status
      let status: PaymentResult['status'];
      let message: string;
      if (donation.status === 'success' || donation.status === 'settlement') {
        status = 'success';
        message = 'Alhamdulillah! Donasi Anda berhasil diproses. Semoga menjadi amal jariyah yang berkah.';
        setShowConfetti(true);
      } else if (donation.status === 'pending') {
        status = 'pending';
        message = 'Pembayaran Anda sedang diproses. Kami akan mengirimkan notifikasi setelah pembayaran dikonfirmasi.';
      } else if (donation.status === 'failed' || donation.status === 'deny' || donation.status === 'expire' || donation.status === 'cancel') {
        status = 'failed';
        message = 'Pembayaran gagal atau dibatalkan. Silakan coba lagi dengan metode pembayaran yang berbeda.';
      } else {
        status = 'error';
        message = 'Terjadi kesalahan dalam pemrosesan pembayaran. Silakan hubungi tim support kami.';
      }

      setPaymentResult({
        status,
        message,
        donationId: donation.id,
        amount: donation.amount ? parseInt(donation.amount) : undefined,
        paymentMethod: donation.payment_type,
        transactionTime: donation.updated_at,
        campaignTitle: donation.campaign?.title
      });
    } catch (error) {
      console.error('Error handling payment finish:', error);
      setPaymentResult({
        status: 'error',
        message: 'Terjadi kesalahan dalam memproses hasil pembayaran.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPaymentWithBackend = async (donationId: string) => {
    try {
      // Optional: Verify payment status with your backend
      const response = await fetch(`https://sedekahku.99delivery.id/donations/${donationId}/verify`);
      if (response.ok) {
        const data = await response.json();
        console.log('Payment verification result:', data);
      }
    } catch (error) {
      console.error('Error verifying payment with backend:', error);
    }
  };

  const getStatusIcon = (status: PaymentResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-20 h-20 text-green-500" />;
      case 'pending':
        return <Clock className="w-20 h-20 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-20 h-20 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-20 h-20 text-red-500" />;
      default:
        return <AlertCircle className="w-20 h-20 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PaymentResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTitle = (status: PaymentResult['status']) => {
    switch (status) {
      case 'success':
        return 'Pembayaran Berhasil!';
      case 'pending':
        return 'Pembayaran Diproses';
      case 'failed':
        return 'Pembayaran Gagal';
      case 'error':
        return 'Terjadi Kesalahan';
      default:
        return 'Status Pembayaran';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    if (paymentResult?.donationId) {
      // Implement receipt download
      alert(`Download bukti donasi untuk ID: ${paymentResult.donationId}`);
    }
  };

  const handleShareDonation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Saya baru saja berdonasi di SedekahKita',
        text: `Alhamdulillah, saya baru saja berdonasi sebesar ${paymentResult?.amount ? formatCurrency(paymentResult.amount) : 'Rp 0'} untuk kampanye amal. Mari bergabung dalam kebaikan!`,
        url: window.location.origin
      });
    } else {
      // Fallback: copy to clipboard
      const text = `Alhamdulillah, saya baru saja berdonasi sebesar ${paymentResult?.amount ? formatCurrency(paymentResult.amount) : 'Rp 0'} untuk kampanye amal di SedekahKita. Mari bergabung dalam kebaikan!`;
      navigator.clipboard.writeText(text);
      alert('Teks berhasil disalin ke clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Memproses Pembayaran</h2>
          <p className="text-gray-500">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-8 rounded-xl text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Parameter Tidak Valid</h2>
            <p className="text-sm mb-6">Tidak dapat memproses hasil pembayaran. Silakan coba lagi.</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Kembali ke Kampanye
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Confetti effect for success */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <Heart className="w-4 h-4 text-emerald-400" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className={`border-2 rounded-2xl p-8 text-center ${getStatusColor(paymentResult.status)}`}>
          {getStatusIcon(paymentResult.status)}
          
          <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-800">
            {getStatusTitle(paymentResult.status)}
          </h1>
          
          <p className="text-lg mb-8 text-gray-600 leading-relaxed">
            {paymentResult.message}
          </p>
          
          {/* Payment Details */}
          {paymentResult.donationId && (
            <div className="bg-white/70 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Detail Pembayaran</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Donasi:</span>
                  <span className="font-mono font-medium">{paymentResult.donationId}</span>
                </div>
                {paymentResult.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah Donasi:</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(paymentResult.amount)}</span>
                  </div>
                )}
                {paymentResult.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    <span className="font-medium">{paymentResult.paymentMethod}</span>
                  </div>
                )}
                {paymentResult.transactionTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu Transaksi:</span>
                    <span className="font-medium">{formatDate(paymentResult.transactionTime)}</span>
                  </div>
                )}
                {paymentResult.campaignTitle && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kampanye:</span>
                    <span className="font-medium">{paymentResult.campaignTitle}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {paymentResult.status === 'success' && (
              <>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    Download Bukti
                  </button>
                  <button
                    onClick={handleShareDonation}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                    Bagikan
                  </button>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate('/dashboard/donor')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Lihat Riwayat Donasi
                  </button>
                  <button
                    onClick={() => navigate('/campaigns')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Lihat Kampanye Lain
                  </button>
                </div>
              </>
            )}
            
            {paymentResult.status === 'pending' && (
              <>
                <button
                  onClick={() => navigate('/dashboard/donor')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cek Status Donasi
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Kembali ke Kampanye
                </button>
              </>
            )}
            
            {paymentResult.status === 'failed' && (
              <>
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Kembali ke Kampanye
                </button>
              </>
            )}
            
            {paymentResult.status === 'error' && (
              <button
                onClick={() => navigate('/campaigns')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Kembali ke Kampanye
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFinish;