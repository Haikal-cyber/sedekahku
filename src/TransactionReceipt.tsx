import React from 'react';
import { Heart, CheckCircle } from 'lucide-react';

interface ReceiptProps {
  donationData: {
    id: string;
    amount: string;
    status: string;
    donor_name: string;
    payment_type: string;
    created_at: string;
    campaign: {
      title: string;
      description: string;
    };
  };
  transactionStatus: string;
}

const TransactionReceipt: React.FC<ReceiptProps> = ({ donationData, transactionStatus }) => {
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

  const isSuccess = transactionStatus === 'settlement';

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg print:shadow-none print-receipt">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-center mb-2">
          <Heart className="w-8 h-8 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">SedekahKu</h1>
        </div>
        <p className="text-gray-600 text-sm">Platform Donasi Digital</p>
      </div>

      {/* Status */}
      <div className={`text-center mb-6 p-4 rounded-lg ${
        isSuccess ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-center mb-2">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          ) : (
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          )}
          <span className={`font-semibold ${
            isSuccess ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {isSuccess ? 'PEMBAYARAN BERHASIL' : 'PEMBAYARAN DIPROSES'}
          </span>
        </div>
        <p className={`text-sm ${
          isSuccess ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {isSuccess ? 'Terima kasih atas donasi Anda' : 'Menunggu konfirmasi pembayaran'}
        </p>
      </div>

      {/* Receipt Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">No. Transaksi:</span>
          <span className="font-mono text-sm font-medium">{donationData.id}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Tanggal:</span>
          <span className="text-sm font-medium">{formatDate(donationData.created_at)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Donatur:</span>
          <span className="text-sm font-medium">{donationData.donor_name}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Kampanye:</span>
          <span className="text-sm font-medium text-right max-w-xs">{donationData.campaign.title}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Metode:</span>
          <span className="text-sm font-medium">{getPaymentMethodLabel(donationData.payment_type)}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b-2 border-gray-200">
          <span className="text-gray-800 font-semibold">Total Donasi:</span>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(donationData.amount)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs space-y-2">
        <p>Bukti ini dapat digunakan sebagai tanda terima donasi</p>
        <p>Terima kasih telah berpartisipasi dalam kebaikan</p>
        <p className="mt-4 pt-4 border-t border-gray-200">
          SedekahKu - Platform Donasi Digital<br />
          www.sedekahku.com
        </p>
      </div>

      {/* Print Instructions */}
      <div className="hidden print:block mt-8 text-center text-xs text-gray-400">
        <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
      </div>
    </div>
  );
};

export default TransactionReceipt; 