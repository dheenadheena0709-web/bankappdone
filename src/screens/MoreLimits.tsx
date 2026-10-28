import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sliders, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBank } from '../context/BankContext';

export const MoreLimits: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount } = useBank();
  const [upiLimit, setUpiLimit] = useState(100000);
  const [impsLimit, setImpsLimit] = useState(500000);
  const [neftLimit, setNeftLimit] = useState(2500000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 shadow-sm border-b dark:border-slate-800 transition-colors duration-200 w-full">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/more')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back to More"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Payment & Transfer Limits</h1>
            <p className="text-xs text-white/80">Account: •••• {userAccount.accountNumber?.slice(-4) || '2010'}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl p-3.5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-amber-900 dark:text-amber-300">Custom Limit Adjustments Notice</h2>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 mt-0.5 leading-relaxed">
              This feature is coming soon. Enhanced single-day limit elevations over ₹50 Lakh require authorization by your Premier Relationship Manager.
            </p>
          </div>
        </div>

        {/* Limit Sliders */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Configured Daily Allowances
          </h2>

          {/* UPI Limit Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">UPI Daily Transfer Limit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">NPCI ceiling capped at ₹1 Lakh</p>
              </div>
              <span className="text-sm font-bold text-[#DB0011] dark:text-red-400 font-mono">
                ₹{upiLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="10000"
              value={upiLimit}
              onChange={(e) => setUpiLimit(Number(e.target.value))}
              className="w-full accent-[#DB0011] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              <span>₹10,000</span>
              <span>₹50,000</span>
              <span>Max ₹1,00,000</span>
            </div>
          </div>

          {/* IMPS Instant Transfer */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">IMPS Immediate Payment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">24x7 instant interbank settlement</p>
              </div>
              <span className="text-sm font-bold text-[#DB0011] dark:text-red-400 font-mono">
                ₹{impsLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="50000"
              value={impsLimit}
              onChange={(e) => setImpsLimit(Number(e.target.value))}
              className="w-full accent-[#DB0011] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              <span>₹50,000</span>
              <span>₹2,50,000</span>
              <span>Max ₹5,00,000</span>
            </div>
          </div>

          {/* NEFT / RTGS Transfer */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">NEFT / RTGS High Value</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Large transfers with 2-factor OTP</p>
              </div>
              <span className="text-sm font-bold text-[#DB0011] dark:text-red-400 font-mono">
                ₹{neftLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="5000000"
              step="500000"
              value={neftLimit}
              onChange={(e) => setNeftLimit(Number(e.target.value))}
              className="w-full accent-[#DB0011] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              <span>₹5,00,000</span>
              <span>₹25,00,000</span>
              <span>Max ₹50,00,000</span>
            </div>
          </div>
        </div>

        {/* Save Limits Action Button */}
        <button
          onClick={() => showToast('Daily limits updated successfully')}
          className="w-full py-3.5 bg-[#DB0011] hover:bg-[#B5000E] text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Save Limit Preferences</span>
        </button>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/more')}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#DB0011] dark:hover:text-red-400 cursor-pointer"
          >
            ← Back to More Services
          </button>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default MoreLimits;
