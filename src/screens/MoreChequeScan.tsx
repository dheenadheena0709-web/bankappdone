import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine, Camera, Upload, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBank } from '../context/BankContext';

export const MoreChequeScan: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount } = useBank();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [chequeAmount, setChequeAmount] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      showToast('Optical cheque OCR scan complete. CTS verification pending.');
    }, 1500);
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
            <h1 className="text-lg font-bold tracking-tight">Scan & Deposit Cheque</h1>
            <p className="text-xs text-white/80">Digital CTS-2010 Clearing System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Notice Card */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl p-3.5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-amber-900 dark:text-amber-300">Digital Cheque Clearing Preview</h2>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 mt-0.5 leading-relaxed">
              This feature is coming soon. The Reserve Bank CTS-2010 mobile clearing integration is currently undergoing security compliance.
            </p>
          </div>
        </div>

        {/* Side Selector */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSide('front')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeSide === 'front' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Front Side (MICR & Sign)
          </button>
          <button
            onClick={() => setActiveSide('back')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeSide === 'back' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Back Side (Endorsement)
          </button>
        </div>

        {/* Viewfinder Mockup */}
        <div className="relative bg-slate-900 dark:bg-slate-950 rounded-2xl h-52 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-white overflow-hidden p-4">
          <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-3">
            <div className="flex justify-between">
              <span className="w-3 h-3 border-t-2 border-l-2 border-[#DB0011]"></span>
              <span className="w-3 h-3 border-t-2 border-r-2 border-[#DB0011]"></span>
            </div>
            <div className="flex justify-between">
              <span className="w-3 h-3 border-b-2 border-l-2 border-[#DB0011]"></span>
              <span className="w-3 h-3 border-b-2 border-r-2 border-[#DB0011]"></span>
            </div>
          </div>

          <ScanLine className="w-10 h-10 text-slate-400 mb-2 animate-pulse" />
          <p className="text-xs font-bold text-slate-200">
            {activeSide === 'front' ? 'Align front MICR band within borders' : 'Align account endorsement on rear'}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Place cheque on a dark flat surface</p>
        </div>

        {/* Form Inputs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cheque Amount (₹)
            </label>
            <input
              type="number"
              value={chequeAmount}
              onChange={(e) => setChequeAmount(e.target.value)}
              placeholder="e.g. 50,000"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-semibold outline-none focus:border-[#DB0011]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Credit To Account
            </label>
            <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
              HSBC Premier Savings •••• {userAccount.accountNumber?.slice(-4) || '2010'}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="flex-1 py-3 bg-[#DB0011] hover:bg-[#B5000E] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Camera className="w-4 h-4" />
            <span>{isCapturing ? 'Scanning Cheque...' : 'Capture Cheque'}</span>
          </button>
          <button
            onClick={() => showToast('Gallery upload is coming soon.')}
            className="px-4 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>

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
export default MoreChequeScan;
