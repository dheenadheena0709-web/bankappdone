import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import {
  X,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  Home,
  Phone,
  Mail,
  Headphones
} from 'lucide-react';

export const Screen7PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { lastPayment } = useBank();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Generate random 10-digit transaction ID as requested: TXN{random 10 digits}
  const [txnId, setTxnId] = useState(() => {
    return `TXN${Math.floor(1000000000 + Math.random() * 9000000000).toString()}`;
  });

  const [txDate, setTxDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const displayAmount = lastPayment?.amount || 15000;

  // Sound and vibration on load
  useEffect(() => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setTxnId(`TXN${Math.floor(1000000000 + Math.random() * 9000000000).toString()}`);
      const now = new Date();
      setTxDate(now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }
    }, 2000);
  };

  if (isRetrying) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 w-full max-w-full overflow-x-hidden">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#DB0011] animate-spin" />
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Processing your transaction... Please wait
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
          Please wait while HSBC verifies your transaction with payment gateway. Do not press back or refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] px-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Transaction Status
        </span>
        <button
          onClick={() => navigate('/home')}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Failed Card */}
      <div className="my-auto py-2">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-red-200 dark:border-red-900/60 shadow-md text-center relative overflow-hidden">
          {/* Top red decorative accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#DB0011]" />

          {/* Big Red Cross Animation with "Transaction Failed" */}
          <div className="relative inline-flex mb-3 mt-1">
            <div className="w-16 h-16 rounded-full bg-[#DB0011] text-white flex items-center justify-center shadow-lg ring-8 ring-red-100 dark:ring-red-950 animate-pulse">
              <X className="w-10 h-10 stroke-[3]" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transaction Failed
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your request could not be processed
          </p>

          <div className="mt-4 p-4 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-red-950/40 dark:via-orange-950/30 dark:to-red-950/40 border-2 border-red-500 rounded-xl text-center shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-[#DB0011] dark:text-red-400 font-black text-sm tracking-wide">
              <span>⚠️</span>
              <span>Account Status: FREEZED</span>
              <span>🥶</span>
            </div>
            <p className="text-xs text-red-950 dark:text-red-300 font-semibold mt-1.5 leading-snug">
              Your account is temporarily freezed due to security reasons
            </p>
          </div>

          {/* Transaction Details */}
          <div className="mt-4 space-y-2 text-left text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction ID</span>
              <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold text-right">{txnId}</strong>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Amount</span>
              <strong className="text-base font-black text-[#DB0011] dark:text-red-400 font-mono text-right">
                ₹ {displayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Date & Time</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{txDate}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Reason</span>
              <span className="text-[#DB0011] dark:text-red-400 font-bold text-right text-xs">
                Account Freezed - Security Hold
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Code</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-bold text-right text-xs">
                ACCT_FRZ_001
              </span>
            </div>

            <div className="mt-2.5 p-3 bg-red-50/70 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#DB0011] dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-950 dark:text-red-300 font-semibold leading-relaxed">
                  Your account is freezed. Cannot debit. Please contact home branch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: [Try Again] [Home] */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleRetry}
          className="w-full h-11 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        {/* Home */}
        <button
          onClick={() => navigate('/home')}
          className="w-full h-11 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* Contact Support */}
        <button
          onClick={() => setShowSupportModal(true)}
          className="w-full h-10 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.99] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#DB0011] dark:text-red-400" />
          <span>Contact Support</span>
        </button>
      </div>

      {/* Support Popup Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">HSBC Customer Care</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your account is currently under security freeze (Code: ACCT_FRZ_001). Please reach out to our Premier Support team:
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:18002663456"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#DB0011] dark:text-red-400" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Customer Care</span>
                    <strong className="text-xs text-slate-900 dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">1800 266 3456</strong>
                  </div>
                </div>
                <span className="text-[10px] text-[#DB0011] dark:text-red-400 font-bold">Call Now &rarr;</span>
              </a>

              <a
                href="mailto:supportindia@hsbc.com"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#DB0011] dark:text-red-400" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Support Email</span>
                    <strong className="text-xs text-slate-900 dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">supportindia@hsbc.com</strong>
                  </div>
                </div>
                <span className="text-[10px] text-[#DB0011] dark:text-red-400 font-bold">Email &rarr;</span>
              </a>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                <strong>Home Branch Visit:</strong> Please visit HSBC Fort Main Branch, Mumbai with original KYC documents (PAN & Aadhaar) for biometric reverification.
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full h-10 rounded-xl bg-[#DB0011] text-white font-bold text-xs hover:bg-[#b5000e] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Screen7PaymentSuccess;
