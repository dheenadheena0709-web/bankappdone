import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBank } from '../context/BankContext';

export const MoreCards: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount } = useBank();
  const [showCVV, setShowCVV] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [onlineEnabled, setOnlineEnabled] = useState(true);
  const [intlEnabled, setIntlEnabled] = useState(false);
  const [contactlessEnabled, setContactlessEnabled] = useState(true);
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
            <h1 className="text-lg font-bold tracking-tight">Debit & Virtual Cards</h1>
            <p className="text-xs text-white/80">HSBC Kinetic Premier Card Center</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Realistic Card Representation */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-5 shadow-xl border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">
              HSBC Kinetic Premier
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Active</span>
            </div>
          </div>

          {/* EMV Chip & Contactless */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-7 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center">
              <div className="w-5 h-4 border border-amber-600/40 rounded-xs"></div>
            </div>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </div>

          {/* Card Number with toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-base sm:text-lg tracking-widest text-slate-100 font-bold">
              {showCardNumber ? (userAccount.debitCard?.number || '4532 8921 5409 4022') : (userAccount.debitCard?.maskedNumber || '•••• •••• •••• ' + (userAccount.debitCard?.number?.slice(-4) || '4022'))}
            </div>
            <button
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="p-1 rounded-md text-slate-400 hover:text-white transition cursor-pointer"
              title={showCardNumber ? 'Hide full number' : 'Show full number'}
            >
              {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
              <p className="text-xs font-bold tracking-wide text-white uppercase">
                {userAccount.holderName || userAccount.name || 'SIRAJUDEEN MOHAMED SHARIF'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Expires</p>
              <p className="text-xs font-bold font-mono text-slate-200">
                {userAccount.debitCard?.expiry || '09/29'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-slate-400">CVV</p>
              <button
                onClick={() => setShowCVV(!showCVV)}
                className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300 hover:text-white transition cursor-pointer"
              >
                <span>{showCVV ? (userAccount.debitCard?.cvv || '842') : '•••'}</span>
                {showCVV ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DB0011] dark:text-red-400" />
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">Advanced Card Controls</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This feature is coming soon. Real-time physical card re-issuance, tokenized Apple/Google Pay sync, and PIN reset are currently in preview.
          </p>
        </div>

        {/* Card Security Controls (Interactive Preview) */}
        <div className="space-y-2">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Card Security & Usage
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Online Transactions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Allow e-commerce & in-app purchases</p>
              </div>
              <button
                onClick={() => {
                  setOnlineEnabled(!onlineEnabled);
                  showToast(onlineEnabled ? 'Online transactions disabled' : 'Online transactions enabled');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  onlineEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">International Usage</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Foreign currency & overseas POS</p>
              </div>
              <button
                onClick={() => {
                  setIntlEnabled(!intlEnabled);
                  showToast(intlEnabled ? 'International usage turned off' : 'International usage enabled');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  intlEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Contactless (NFC) Tap & Pay</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fast tap up to ₹5,000 without PIN</p>
              </div>
              <button
                onClick={() => {
                  setContactlessEnabled(!contactlessEnabled);
                  showToast(contactlessEnabled ? 'Contactless disabled' : 'Contactless enabled');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  contactlessEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Freeze Card Button */}
        <button
          onClick={() => showToast('Card lock toggled')}
          className="w-full py-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-[#DB0011] dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Temporarily Freeze Card</span>
        </button>
      </main>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default MoreCards;
