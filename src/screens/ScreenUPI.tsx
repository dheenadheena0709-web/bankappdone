import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import { AccountFrozenModal } from '../components/AccountFrozenModal';
import {
  ArrowLeft,
  Send,
  QrCode,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  Receipt,
  Lock,
  Delete,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  HelpCircle,
  X,
  RefreshCw
} from 'lucide-react';

export const ScreenUPI: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, showBalance, setShowBalance } = useBank();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showMyQrModal, setShowMyQrModal] = useState(false);

  // Send Money Sheet / Modal Flow
  const [showSendModal, setShowSendModal] = useState(false);
  const [upiStep, setUpiStep] = useState<'input' | 'pin' | 'processing'>('input');
  const [payeeUpi, setPayeeUpi] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [upiRemarks, setUpiRemarks] = useState('');
  const [formError, setFormError] = useState('');

  // PIN pad state
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Global Freeze Popup
  const [showFreezePopup, setShowFreezePopup] = useState(false);

  // Check balance flow
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [balanceResult, setBalanceResult] = useState<string | null>(null);

  const handleCopyUpiId = () => {
    navigator.clipboard?.writeText(userAccount.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const openSendModal = () => {
    setPayeeUpi('');
    setUpiAmount('');
    setUpiRemarks('');
    setFormError('');
    setPin('');
    setPinError('');
    setUpiStep('input');
    setShowSendModal(true);
  };

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeUpi.trim()) {
      setFormError('Please enter UPI ID or Mobile Number');
      return;
    }
    const amt = parseFloat(upiAmount);
    if (!amt || amt <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    setFormError('');
    setPin('');
    setPinError('');
    setUpiStep('pin');
  };

  const handlePinKey = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError('');
      if (nextPin.length === 6) {
        // Proceed to 2-second processing
        setTimeout(() => {
          setUpiStep('processing');
          setTimeout(() => {
            // ALWAYS SHOW ACCOUNT FROZEN POPUP, BLOCK SUCCESS
            setShowSendModal(false);
            setShowFreezePopup(true);
          }, 2000);
        }, 200);
      }
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError('');
  };

  const handlePinClear = () => {
    setPin('');
    setPinError('');
  };

  const handleCheckBalance = () => {
    setCheckingBalance(true);
    setTimeout(() => {
      setCheckingBalance(false);
      // Freeze popup or alert
      setShowFreezePopup(true);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] text-black">
      {/* Top Red Header Background #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/home')}
              className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">UPI Payments</h1>
              <p className="text-xs text-white/80">Unified Payments Interface · NPCI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMyQrModal(true)}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title="My UPI QR"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/scan-qr')}
              className="px-2.5 py-1 bg-white text-[#DB0011] text-xs font-bold rounded-lg shadow-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Scan QR
            </button>
          </div>
        </div>

        {/* User UPI Identity Card */}
        <div className="bg-[#FFFFFF] text-black rounded-xl p-3.5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center font-bold text-sm shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-black truncate">
                    {userAccount.holderName}
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                    Linked
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] font-mono text-slate-600 font-semibold truncate">
                    {userAccount.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpiId}
                    className="p-0.5 text-slate-400 hover:text-black cursor-pointer shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMyQrModal(true)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex flex-col items-center gap-0.5 shrink-0 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#DB0011]" />
              <span className="text-[9px]">My QR</span>
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px]">Primary: HSBC Premier Savings ••••2010</span>
            <button
              onClick={handleCheckBalance}
              disabled={checkingBalance}
              className="text-[#DB0011] font-bold text-[11px] hover:underline cursor-pointer flex items-center gap-1"
            >
              {checkingBalance && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>Check Balance</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-4">
        {/* ESSENTIAL UPI ACTIONS GRID (Zero past contacts or history) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              UPI Services
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">NPCI 24x7</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Send Money */}
            <button
              onClick={openSendModal}
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-[#DB0011] transition flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-black group-hover:text-[#DB0011]">
                Send Money
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">To UPI ID / No</span>
            </button>

            {/* 2. Scan QR */}
            <button
              onClick={() => navigate('/scan-qr')}
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-[#DB0011] transition flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-black group-hover:text-[#DB0011]">
                Scan & Pay
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Any Merchant QR</span>
            </button>

            {/* 3. Check Balance */}
            <button
              onClick={handleCheckBalance}
              disabled={checkingBalance}
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-[#DB0011] transition flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-black group-hover:text-[#DB0011]">
                Check Balance
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Savings Account</span>
            </button>
          </div>
        </div>

        {/* Bank Transfer Shortcut */}
        <div
          onClick={() => navigate('/transfer')}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-[#DB0011] transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-black">Need Account Transfer?</h3>
              <p className="text-[11px] text-slate-500">
                Send via IMPS / NEFT using Account No & IFSC
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#DB0011]">&rarr;</span>
        </div>

        {/* UPI TRANSACTION HISTORY SECTION: CLEAN EMPTY STATE (NEW APP LOOK) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#DB0011]" />
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Recent UPI Transactions
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Fresh Account
            </span>
          </div>

          {/* Empty Illustration & Notice */}
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
              <Receipt className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-black">No recent UPI transactions</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              No transactions yet. Any UPI transfers or payments you make will appear here.
            </p>
            <button
              onClick={openSendModal}
              className="mt-4 px-4 py-2 bg-[#DB0011] hover:bg-[#b5000e] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Money</span>
            </button>
          </div>
        </div>

        {/* NPCI Security Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured by NPCI 256-bit UPI Encrypted Rail</span>
        </div>
      </main>

      {/* MODAL: MY UPI QR CODE */}
      {showMyQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl text-center space-y-3 relative">
            <button
              onClick={() => setShowMyQrModal(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-[#DB0011] tracking-wider">
                BHIM HSBC UPI QR
              </span>
              <h3 className="text-sm font-bold text-black mt-0.5">
                {userAccount.holderName}
              </h3>
            </div>

            {/* Generated QR Placeholder Container */}
            <div className="p-4 bg-white border-2 border-slate-200 rounded-xl inline-block shadow-inner mx-auto">
              <div className="w-44 h-44 bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-dashed border-slate-300 relative">
                <QrCode className="w-32 h-32 text-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-md bg-[#DB0011] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    HSBC
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">UPI ID</span>
              <strong className="text-xs font-mono font-bold text-black">
                {userAccount.upiId}
              </strong>
            </div>

            <button
              onClick={() => {
                handleCopyUpiId();
                setShowMyQrModal(false);
              }}
              className="w-full h-10 bg-[#DB0011] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#b5000e] transition cursor-pointer"
            >
              Copy UPI ID & Share
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET / MODAL: SEND MONEY VIA UPI */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto p-5 shadow-2xl text-left space-y-4">
            {/* STEP 1: INPUT FORM (100% BLANK WITH CLEAN PLACEHOLDERS) */}
            {upiStep === 'input' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">Send via UPI</h3>
                      <p className="text-[10px] text-slate-500">Instant transfer to any UPI ID</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleProceedToPin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Payee UPI ID or Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={payeeUpi}
                      onChange={(e) => setPayeeUpi(e.target.value)}
                      placeholder="Enter UPI ID e.g. name@okhdfcbank or Mobile"
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Amount (INR) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-lg font-bold text-black">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(e.target.value)}
                        placeholder="Enter Amount"
                        className="w-full h-11 pl-8 pr-12 rounded-xl border border-slate-300 font-mono text-lg font-bold focus:ring-2 focus:ring-[#DB0011] outline-none"
                      />
                      <span className="absolute right-3 text-xs font-bold text-slate-400">
                        INR
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={upiRemarks}
                      onChange={(e) => setUpiRemarks(e.target.value)}
                      placeholder="Remarks (Optional)"
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs text-[#DB0011] font-semibold">{formError}</p>
                  )}

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Debiting Account
                    </span>
                    <strong className="text-black">
                      HSBC Premier Savings - ••••2010
                    </strong>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-11 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Proceed to Enter PIN</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 2: PIN ENTRY (LOOKS FULLY WORKING) */}
            {upiStep === 'pin' && (
              <div className="text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-black">Enter 6-Digit UPI PIN</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorizing payment of ₹{(parseFloat(upiAmount) || 0).toLocaleString('en-IN')} to {payeeUpi}
                  </p>
                </div>

                {/* 6 Digit Display */}
                <div className="flex gap-2 justify-center py-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const hasDigit = pin.length > index;
                    const isCurrent = pin.length === index;
                    return (
                      <div
                        key={index}
                        className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                          hasDigit
                            ? 'border-[#DB0011] bg-white text-[#DB0011]'
                            : isCurrent
                            ? 'border-[#DB0011] ring-2 ring-[#DB0011]/20 bg-white'
                            : 'border-slate-300 bg-slate-50'
                        }`}
                      >
                        {hasDigit ? '•' : ''}
                      </div>
                    );
                  })}
                </div>

                {pinError && (
                  <p className="text-xs text-[#DB0011] font-semibold">{pinError}</p>
                )}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 pt-1 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePinKey(String(num))}
                      className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-lg font-bold text-black transition cursor-pointer select-none"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handlePinClear}
                    className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 transition cursor-pointer select-none"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePinKey('0')}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-lg font-bold text-black transition cursor-pointer select-none"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handlePinBackspace}
                    className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer select-none"
                    aria-label="Backspace"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setUpiStep('input')}
                  className="text-xs text-slate-500 hover:text-black font-semibold mt-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* STEP 3: 2-SECOND PROCESSING ANIMATION */}
            {upiStep === 'processing' && (
              <div className="py-8 text-center space-y-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-[#DB0011] animate-spin mx-auto" />
                </div>
                <h4 className="text-base font-black text-black">
                  Processing your transaction... Please wait
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Connecting to NPCI UPI network. Please do not close or press back.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GLOBAL FREEZE POPUP (Universal standard) */}
      <AccountFrozenModal
        isOpen={showFreezePopup}
        onClose={() => setShowFreezePopup(false)}
        onSupportClick={() => navigate('/profile')}
      />
    </div>
  );
};

export default ScreenUPI;
