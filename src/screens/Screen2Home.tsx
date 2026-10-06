import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { BottomNav } from '../components/BottomNav';
import { useBank } from '../context/BankContext';
import {
  Bell,
  Eye,
  EyeOff,
  ChevronRight,
  Send,
  Receipt,
  BookOpen,
  QrCode,
  Copy,
  Check,
  Building2,
  CreditCard,
  SlidersHorizontal,
  ArrowDownLeft,
  CheckCircle2,
  X,
  Printer,
  Download
} from 'lucide-react';

export const Screen2Home: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, transactions, showBalance, setShowBalance } = useBank();
  const [balance, setBalance] = useState(() => {
    return Number(localStorage.getItem('hsbc_balance') || localStorage.getItem('bank_balance') || '50000');
  });
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Keep balance in sync when navigating to dashboard, after login, or when localStorage updates
  useEffect(() => {
    const updateBalance = () => {
      const stored = Number(localStorage.getItem('hsbc_balance') || localStorage.getItem('bank_balance') || '50000');
      setBalance(stored);
    };
    updateBalance();
    window.addEventListener('storage', updateBalance);
    window.addEventListener('focus', updateBalance);
    return () => {
      window.removeEventListener('storage', updateBalance);
      window.removeEventListener('focus', updateBalance);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyAcc = () => {
    navigator.clipboard?.writeText(userAccount.accountNumber);
    setCopied(true);
    showToast('Account number copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px]">
      {/* Top Header Background: #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-lg shadow-xs">
              <BrandLogo size="sm" variant="red" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/80 font-medium block leading-none">
                  Welcome back
                </span>
                <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded">
                  Premier
                </span>
              </div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight mt-0.5">
                {userAccount.holderName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold text-white cursor-pointer border border-white/20"
              title="Profile & Support"
            >
              SMS
            </button>
            <button
              onClick={() => showToast('No new notifications')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full ring-1 ring-[#DB0011]" />
            </button>
          </div>
        </div>

        {/* ACCOUNT BALANCE CARD */}
        <div className="bg-[#FFFFFF] text-black rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase block">
                  {userAccount.accountName}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-slate-600 font-bold">
                  {userAccount.accountNumber}
                </span>
                <button
                  onClick={handleCopyAcc}
                  className="text-slate-400 hover:text-black p-0.5 cursor-pointer"
                  title="Copy account number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Account Balance */}
          <div className="mt-3">
            <span className="text-[10px] text-slate-500 tracking-wider uppercase font-bold block">
              Available Account Balance
            </span>

            <div className="mt-1 flex items-baseline gap-1.5">
              {showBalance ? (
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
                  {balance}
                </div>
              ) : (
                <div className="text-2xl font-black tracking-tight font-mono text-black">
                  ••••••••••••••••
                </div>
              )}
              <span className="text-xs font-bold text-slate-600">
                INR
              </span>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
            <button
              onClick={() => navigate('/transfer')}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#DB0011] group-hover:text-white flex items-center justify-center text-slate-700 transition">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Transfer</span>
            </button>

            <button
              onClick={() => navigate('/people-and-bills')}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#DB0011] group-hover:text-white flex items-center justify-center text-slate-700 transition">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Pay Bills</span>
            </button>

            <button
              onClick={() => navigate('/mpassbook')}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#DB0011] text-white flex items-center justify-center shadow-xs transition">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#DB0011]">mPassbook</span>
            </button>

            <button
              onClick={() => showToast('QR scanner active')}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#DB0011] group-hover:text-white flex items-center justify-center text-slate-700 transition">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Scan QR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-3.5">
        {/* RECENT TRANSACTIONS (Newest Acc Opening Deposit at top, GREEN LEAF second) */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Transactions
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
              {transactions.length} Transactions
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-3.5 hover:bg-slate-50 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-slate-900">
                          {tx.senderName}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                          {tx.transferMode}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {tx.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                        <span>{tx.date}</span>
                        <span>·</span>
                        <span>{tx.time}</span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        Ref: {tx.refNo}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-black font-mono text-emerald-700">
                      +{tx.deposit ? Math.round(tx.deposit) : 0}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                      Credit
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      Bal: {Math.round(tx.balance)}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#DB0011] font-bold group-hover:underline">
                  <span className="text-[11px]">View Receipt / Details</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BANK SERVICES & MENU */}
        <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          {/* 1. Borrowing */}
          <button
            onClick={() => showToast('Borrowing: 1000000 offer available')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  Borrowing
                </h3>
                <p className="text-xs text-slate-500">Loans & Mortgages</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                1000000 Pre-approved
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* 2. Cards */}
          <button
            onClick={() => showToast('Cards: 1 Debit Card Active')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  Cards
                </h3>
                <p className="text-xs text-slate-500">Debit and Credit cards</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">1 Card</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* 3. Services / Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  Services & Personal Details
                </h3>
                <p className="text-xs text-slate-500">View KYC profile, statements & settings</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Physical mPassbook Quick Link */}
        <div
          onClick={() => navigate('/mpassbook')}
          className="bg-[#FFFFFF] border-l-4 border-[#DB0011] rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-black">mPassbook Digital Ledger</h3>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#DB0011] text-white rounded">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                View physical passbook ledger with printed deposit entries
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#DB0011] group-hover:translate-x-0.5 transition" />
        </div>
      </main>

      {/* TRANSACTION DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl text-left border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#DB0011] rounded">
                  <BrandLogo size="sm" variant="red" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    Transaction Advice
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Credit Receipt
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Status: {selectedTx.status}
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-2">
                +{Math.round(selectedTx.deposit || 0)} INR
              </div>
            </div>

            <div className="py-3 space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-1 flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <strong className="text-slate-900 font-mono">{selectedTx.date} · {selectedTx.time}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Particulars / Sender</span>
                <strong className="text-slate-900 font-black">{selectedTx.senderName}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Transfer Mode</span>
                <strong className="text-blue-700 font-bold">{selectedTx.transferMode}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Beneficiary Account</span>
                <strong className="text-slate-900 font-mono">{userAccount.accountNumber}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Reference / Ref No</span>
                <strong className="text-slate-900 font-mono text-[11px]">{selectedTx.refNo}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Balance</span>
                <strong className="text-[#DB0011] font-mono font-bold">{Math.round(selectedTx.balance)} INR</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => {
                  showToast('Receipt downloaded');
                  setSelectedTx(null);
                }}
                className="flex-1 h-10 rounded-lg bg-[#DB0011] hover:bg-[#b5000e] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTabOverride="home" />
    </div>
  );
};
