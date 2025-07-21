import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, Heart, Download, Share2, Home, ArrowLeft, X } from 'lucide-react';
import TransactionReceipt from './TransactionReceipt';

const DonationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showReceipt, setShowReceipt] = useState(false);

  // Get all data from query params
  const orderId = searchParams.get('order_id');
  const statusCode = searchParams.get('status_code');
  const transactionStatus = searchParams.get('transaction_status');
  const amount = searchParams.get('amount');
  const donorName = searchParams.get('donor_name');
  const campaignTitle = searchParams.get('campaign_title');
  const paymentType = searchParams.get('payment_type');
  const createdAt = searchParams.get('created_at');

  // Helper for status info
  const getStatusInfo = (transactionStatus: string | null, statusCode: string | null) => {
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
    } else if (transactionStatus === 'pending') {
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

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(parseInt(amount));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (paymentType: string | null) => {
    if (!paymentType) return '-';
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

  // If no orderId, show error
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">ID donasi tidak ditemukan pada URL.</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Kampanye
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transactionStatus, statusCode);

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
            <h2 className={`text-2xl font-bold mt-4 ${statusInfo.textColor}`}>{statusInfo.title}</h2>
            <p className={`mt-2 ${statusInfo.textColor}`}>{statusInfo.message}</p>
            {statusInfo.isSuccess && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm">💝 Terima kasih telah berpartisipasi dalam kebaikan!</p>
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
              <span className="font-mono text-sm font-medium text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Kampanye:</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">{campaignTitle || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Nominal Donasi:</span>
              <span className="font-bold text-lg text-green-600">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Nama Donatur:</span>
              <span className="font-medium text-gray-900">{donorName || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Metode Pembayaran:</span>
              <span className="font-medium text-gray-900">{getPaymentMethodLabel(paymentType)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Status Pembayaran:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusInfo.isSuccess ? 'bg-green-100 text-green-800' :
                transactionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {statusInfo.isSuccess ? 'Berhasil' :
                 transactionStatus === 'pending' ? 'Menunggu' : 'Gagal'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Tanggal Transaksi:</span>
              <span className="font-medium text-gray-900">{formatDate(createdAt)}</span>
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
                const text = `Saya baru saja berdonasi ${formatCurrency(amount)} untuk kampanye "${campaignTitle}". Mari bergabung dalam kebaikan! 💝`;
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
        {!statusInfo.isSuccess && transactionStatus === 'pending' && (
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
        {showReceipt && (
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
                donationData={{
                  id: orderId,
                  amount: amount || '-',
                  status: transactionStatus || '-',
                  donor_name: donorName || '-',
                  payment_type: paymentType || '-',
                  created_at: createdAt || new Date().toISOString(),
                  campaign: {
                    title: campaignTitle || '-',
                    description: '-',
                  },
                }}
                transactionStatus={transactionStatus || ''}
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