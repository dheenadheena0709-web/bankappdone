import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Lock,
  Delete,
  Sparkles,
  ArrowRight,
  Share2,
  Download,
  X,
  Phone,
  PhoneCall,
  Headphones,
  Mail,
  Home,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { AccountFrozenModal } from '../components/AccountFrozenModal';

const playErrorBuzzer = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(160, ctx.currentTime + 0.22);
    gain2.gain.setValueAtTime(0.28, ctx.currentTime + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.22);
    osc2.stop(ctx.currentTime + 0.45);
  } catch {
    // Ignore audio error
  }
};

// Known IFSC prefix to Bank Name mapping for India
const IFSC_BANK_MAP: Record<string, string> = {
  SBIN: 'State Bank of India',
  HDFC: 'HDFC Bank',
  ICIC: 'ICICI Bank',
  HSBC: 'HSBC Bank India',
  UTIB: 'Axis Bank',
  KKBK: 'Kotak Mahindra Bank',
  PUNB: 'Punjab National Bank',
  BARB: 'Bank of Baroda',
  CNRB: 'Canara Bank',
  UBIN: 'Union Bank of India',
  IDIB: 'Indian Bank',
  YESB: 'Yes Bank',
  INDB: 'IndusInd Bank',
  BKID: 'Bank of India',
  MAHB: 'Bank of Maharashtra',
  IOBA: 'Indian Overseas Bank',
  CUBK: 'City Union Bank',
  FEDB: 'Federal Bank',
};

export const Screen6TransferForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userAccount, executeTransfer, showBalance, setShowBalance } = useBank();

  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem('hsbc_balance') || localStorage.getItem('bank_balance');
    if (!stored || Number(stored) < 1000000000 || stored === '12000010000') {
      localStorage.setItem('hsbc_balance', '12000000000');
      localStorage.setItem('bank_balance', '12000000000');
      return 12000000000;
    }
    return Number(stored);
  });

  useEffect(() => {
    const updateBalance = () => {
      const stored = localStorage.getItem('hsbc_balance') || localStorage.getItem('bank_balance');
      if (!stored || Number(stored) < 1000000000 || stored === '12000010000') {
        setBalance(12000000000);
      } else {
        setBalance(Number(stored));
      }
    };
    updateBalance();
    window.addEventListener('storage', updateBalance);
    window.addEventListener('focus', updateBalance);
    return () => {
      window.removeEventListener('storage', updateBalance);
      window.removeEventListener('focus', updateBalance);
    };
  }, []);

  // Route state if navigated from Contacts
  const stateData = location.state as { payeeName?: string; accNo?: string } | null;

  // Step state: 'form' | 'confirm' | 'pin' | 'processing' | 'failed'
  const [step, setStep] = useState<'form' | 'confirm' | 'pin' | 'processing' | 'failed'>('form');
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showFreezePopup, setShowFreezePopup] = useState<boolean>(false);

  // Tab state: 'account' (Account Transfer) vs 'upi' (Mobile Number / UPI Transfer)
  const isUpiInState = Boolean(
    stateData?.accNo?.includes('@') ||
    (stateData?.accNo && !/^\d{9,18}$/.test(stateData.accNo))
  );
  const [transferTab, setTransferTab] = useState<'account' | 'upi'>(isUpiInState ? 'upi' : 'account');

  // Account Transfer Fields - completely blank on load
  const [beneficiaryName, setBeneficiaryName] = useState(!isUpiInState ? (stateData?.payeeName || '') : '');
  const [accountNumber, setAccountNumber] = useState(!isUpiInState ? (stateData?.accNo?.replace(/\D/g, '') || '') : '');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(!isUpiInState ? (stateData?.accNo?.replace(/\D/g, '') || '') : '');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<'Savings' | 'Current'>('Savings');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT'>('IMPS');

  // UPI / Mobile Transfer Fields - completely blank on load
  const [upiIdentifier, setUpiIdentifier] = useState(isUpiInState ? (stateData?.accNo || '') : '');
  const [upiPayeeName, setUpiPayeeName] = useState(isUpiInState ? (stateData?.payeeName || '') : '');

  // Common Fields
  const [amount, setAmount] = useState<string>((location.state as any)?.amount || '');
  const [remarks, setRemarks] = useState<string>('');

  // Validation & Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // PIN Entry state (6 digits)
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Result metadata
  const [txnId, setTxnId] = useState<string>('');
  const [txDate, setTxDate] = useState<string>('');

  // Auto-detect Bank Name when IFSC is typed
  useEffect(() => {
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (cleanIfsc.length >= 4) {
      const prefix = cleanIfsc.slice(0, 4);
      if (IFSC_BANK_MAP[prefix]) {
        setBankName(IFSC_BANK_MAP[prefix]);
      } else {
        setBankName(`${prefix} Bank Ltd`);
      }
    } else {
      setBankName('');
    }
  }, [ifscCode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (transferTab === 'account') {
      if (!beneficiaryName.trim()) {
        newErrors.beneficiaryName = 'Beneficiary name is required';
      }

      if (!accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      } else if (accountNumber.length < 9 || accountNumber.length > 18) {
        newErrors.accountNumber = 'Account number should be 9 to 18 digits';
      }

      if (accountNumber !== confirmAccountNumber) {
        newErrors.confirmAccountNumber = 'Account numbers do not match';
      }

      // Standard IFSC format: 4 letters, 0, 6 characters (alphanumeric)
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC code is required';
      } else if (!ifscRegex.test(ifscCode.toUpperCase().trim())) {
        newErrors.ifscCode = 'Invalid IFSC format (e.g. SBIN0001234)';
      }
    } else {
      // UPI / Mobile Transfer validation
      if (!upiIdentifier.trim()) {
        newErrors.upiIdentifier = 'Please enter Mobile Number or UPI ID';
      }
    }

    const numAmt = parseFloat(amount) || 0;
    if (numAmt <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (numAmt > balance) {
      newErrors.amount = `Insufficient balance. Available: ${balance.toLocaleString('en-IN')} inr`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('confirm');
    }
  };

  const handleOpenPin = () => {
    setPin('');
    setPinError('');
    setStep('pin');
  };

  const handlePinKey = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setPinError('');
      if (nextPin.length === 6) {
        setTimeout(() => {
          setStep('processing');
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

  // 2-second processing effect when reaching 'processing' - ALWAYS FAILS WITH ACCOUNT FREEZED
  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        // Generate random 10-digit transaction ID as requested: TXN{random 10 digits}
        const random10Digits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const generatedId = `TXN${random10Digits}`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setTxnId(generatedId);
        setTxDate(dateStr);

        // Realistic error sound
        playErrorBuzzer();

        // Realistic vibration
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 300]);
          }
        } catch {
          // ignore
        }

        // NO money is debited because the account is FREEZED!
        // Always show FAILED screen & Freeze popup
        setStep('failed');
        setShowFreezePopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  // Mask account number: e.g. 50100492817291 -> ••••••••••7291
  const maskedAcc = accountNumber.length > 4
    ? '••••••••' + accountNumber.slice(-4)
    : accountNumber;

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] text-black">
      {/* Top Header Background: #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (step === 'confirm') setStep('form');
                else if (step === 'pin') setStep('confirm');
                else if (step === 'failed') navigate('/home');
                else navigate(-1);
              }}
              className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold tracking-tight">
              {step === 'failed' ? 'Transfer Status' : 'Bank Account Transfer'}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold bg-black/20 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-bit Secure</span>
          </div>
        </div>

        {/* Available Balance on top */}
        <div className="bg-white/10 rounded-xl p-3 border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/80 font-medium block uppercase tracking-wider">
              Available Balance
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black font-mono tracking-tight text-white">
                {showBalance
                  ? balance.toLocaleString('en-IN')
                  : '••••••••••'}
              </span>
              <span className="text-xs font-bold text-white/80">inr</span>
            </div>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
            title="Toggle balance visibility"
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* STEP 1: FORM VIEW */}
      {step === 'form' && (
        <main className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
          {/* Two Top Tabs: Account Transfer vs Mobile Number / UPI Transfer */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTransferTab('account');
                setErrors({});
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                transferTab === 'account'
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'text-slate-700 hover:text-black hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Account Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTransferTab('upi');
                setErrors({});
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                transferTab === 'upi'
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'text-slate-700 hover:text-black hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile / UPI</span>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3">
            {/* TAB 1: ACCOUNT TRANSFER FIELDS */}
            {transferTab === 'account' && (
              <>
                {/* Beneficiary Name */}
                <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="Enter beneficiary name"
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#DB0011] outline-none"
                  />
                  {errors.beneficiaryName && (
                    <p className="text-[11px] text-[#DB0011] font-semibold mt-1">
                      {errors.beneficiaryName}
                    </p>
                  )}
                </div>

                {/* Account Number & Confirm Account Number */}
                <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter account number"
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                    {errors.accountNumber && (
                      <p className="text-[11px] text-[#DB0011] font-semibold mt-1">
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Account Number *
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={confirmAccountNumber}
                      onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Re-enter account number"
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                    {accountNumber.trim().length > 0 && confirmAccountNumber.trim().length > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-[11px]">
                        {accountNumber === confirmAccountNumber ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Account numbers match
                          </span>
                        ) : (
                          <span className="text-[#DB0011] font-semibold">
                            Account numbers do not match
                          </span>
                        )}
                      </div>
                    )}
                    {errors.confirmAccountNumber && (
                      <p className="text-[11px] text-[#DB0011] font-semibold mt-1">
                        {errors.confirmAccountNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* IFSC Code & Auto Bank Name */}
                <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        IFSC Code *
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Format: 4 letters, 0, 6 digits/letters
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={11}
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="Ex: SBIN0001234"
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                    {errors.ifscCode && (
                      <p className="text-[11px] text-[#DB0011] font-semibold mt-1">
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>

                  {/* Auto Bank Name display */}
                  {ifscCode.trim().length >= 4 && bankName && (
                    <div className="p-2.5 rounded-lg bg-[#F5F5F5] border border-slate-200 flex items-center gap-2 transition-all">
                      <Building2 className="w-4 h-4 text-[#DB0011] shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Bank Name (Auto-detected)
                        </span>
                        <span className="text-xs font-bold text-black truncate block">
                          {bankName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Type (Savings / Current) */}
                <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('Savings')}
                      className={`h-10 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        accountType === 'Savings'
                          ? 'bg-[#DB0011] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {accountType === 'Savings' && <Check className="w-3.5 h-3.5" />}
                      <span>Savings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('Current')}
                      className={`h-10 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        accountType === 'Current'
                          ? 'bg-[#DB0011] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {accountType === 'Current' && <Check className="w-3.5 h-3.5" />}
                      <span>Current</span>
                    </button>
                  </div>
                </div>

                {/* Transfer Mode (IMPS Instant / NEFT) */}
                <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Transfer Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferMode('IMPS')}
                      className={`p-2 rounded-lg text-left transition cursor-pointer border ${
                        transferMode === 'IMPS'
                          ? 'bg-red-50/80 border-[#DB0011] text-[#DB0011]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">IMPS Instant</span>
                        <span className="text-[9px] font-bold bg-[#DB0011] text-white px-1.5 py-0.2 rounded">
                          24x7
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Immediate clearance
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransferMode('NEFT')}
                      className={`p-2 rounded-lg text-left transition cursor-pointer border ${
                        transferMode === 'NEFT'
                          ? 'bg-red-50/80 border-[#DB0011] text-[#DB0011]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">NEFT</span>
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          Hourly
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Batch settlement
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: MOBILE NUMBER / UPI TRANSFER FIELDS */}
            {transferTab === 'upi' && (
              <>
                <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number or UPI ID *
                    </label>
                    <input
                      type="text"
                      value={upiIdentifier}
                      onChange={(e) => setUpiIdentifier(e.target.value)}
                      placeholder="Enter 10-digit mobile or UPI ID e.g. name@upi"
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                    {errors.upiIdentifier && (
                      <p className="text-[11px] text-[#DB0011] font-semibold mt-1">
                        {errors.upiIdentifier}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Payee Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiPayeeName}
                      onChange={(e) => setUpiPayeeName(e.target.value)}
                      placeholder="Enter payee name"
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Payment Rail</span>
                    <strong className="text-black">NPCI Unified Payments Interface (UPI 24x7)</strong>
                  </div>
                </div>
              </>
            )}

            {/* Amount INR (Common to both) */}
            <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Amount (INR) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-lg font-bold text-black">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 pl-8 pr-14 rounded-lg border border-slate-300 font-mono text-xl font-black text-black focus:ring-2 focus:ring-[#DB0011] outline-none"
                />
                <span className="absolute right-3 text-xs font-bold text-slate-500">
                  INR
                </span>
              </div>
              {errors.amount && (
                <p className="text-[11px] text-[#DB0011] font-semibold">
                  {errors.amount}
                </p>
              )}

              {/* Quick Preset Chips */}
              <div className="flex gap-1.5 pt-1">
                {['500', '2000', '5000', '10000', '25000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(`${preset}.00`)}
                    className="px-2 py-1 text-xs font-bold rounded-md bg-[#F5F5F5] hover:bg-slate-200 text-black transition cursor-pointer"
                  >
                    +₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks (optional) */}
            <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Remarks (Optional)
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {remarks.length}/30
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Rent, College Fees, Loan Repayment"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#DB0011] outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-1 pb-4">
              <button
                type="submit"
                className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{amount && parseFloat(amount) > 0 ? `Transfer ₹${(parseFloat(amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Transfer Funds'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </main>
      )}

      {/* STEP 2: CONFIRMATION PAGE */}
      {step === 'confirm' && (
        <main className="flex-1 px-4 py-4 space-y-4">
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 shadow-md">
            <h2 className="text-sm font-bold text-black border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Review Transfer Details</span>
              <span className="text-[10px] font-bold bg-red-50 text-[#DB0011] px-2 py-0.5 rounded">
                Step 2 of 3
              </span>
            </h2>

            <div className="py-3 text-center bg-slate-50 rounded-xl my-3 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Transfer Amount
              </span>
              <div className="text-2xl font-black font-mono text-black mt-0.5">
                ₹{(parseFloat(amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                Transfer Fee: ₹0.00 (Free)
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {transferTab === 'account' ? (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Beneficiary Name</span>
                    <strong className="text-black font-bold text-right">{beneficiaryName}</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">To Account</span>
                    <strong className="text-black font-mono font-bold text-right">{maskedAcc}</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Bank Name</span>
                    <span className="text-black font-semibold text-right">{bankName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">IFSC Code</span>
                    <span className="text-black font-mono font-bold text-right">{ifscCode}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Account Type</span>
                    <span className="text-black font-semibold text-right">{accountType} Account</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Transfer Mode</span>
                    <span className="text-[#DB0011] font-bold text-right">{transferMode} (Instant)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Transfer Mode</span>
                    <span className="text-[#DB0011] font-bold text-right">Mobile / UPI Instant</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Recipient UPI / Mobile</span>
                    <strong className="text-black font-mono font-bold text-right">{upiIdentifier}</strong>
                  </div>

                  {upiPayeeName && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Payee Name</span>
                      <strong className="text-black font-bold text-right">{upiPayeeName}</strong>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Clearing Network</span>
                    <span className="text-slate-800 font-semibold text-right">NPCI UPI Instant</span>
                  </div>
                </>
              )}

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Remarks</span>
                <span className="text-slate-800 text-right">{remarks || 'N/A'}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">From Account</span>
                <span className="text-black font-semibold text-right">
                  {userAccount.accountName} ({userAccount.accountNumber})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleOpenPin}
              className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Confirm & Enter PIN</span>
            </button>

            <button
              onClick={() => setStep('form')}
              className="w-full h-11 bg-white hover:bg-slate-100 border border-slate-300 text-black font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Modify Details
            </button>
          </div>
        </main>
      )}

      {/* STEP 3: TRANSACTION PIN ENTRY POPUP (6 DIGITS + NUMERIC KEYPAD) */}
      {step === 'pin' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-5 shadow-2xl text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-black">Enter Transaction PIN</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorizing transfer of ₹{(parseFloat(amount) || 0).toLocaleString('en-IN')} to {beneficiaryName}
              </p>
            </div>

            {/* 6 Digit Boxes */}
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

            {/* Numeric Keypad */}
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
              onClick={() => setStep('confirm')}
              className="text-xs text-slate-500 hover:text-black font-semibold mt-2 cursor-pointer"
            >
              Cancel Transfer
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PROCESSING SPINNER (2 SECONDS WITH "Processing your transaction... Please wait") */}
      {step === 'processing' && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#DB0011] animate-spin" />
          </div>
          <h2 className="text-lg font-black text-black tracking-tight">
            Processing your transaction... Please wait
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Please wait while HSBC verifies your transaction with payment gateway. Do not press back or refresh.
          </p>
          <div className="mt-4 px-3 py-1 bg-red-50 text-[#DB0011] text-xs font-bold rounded-full">
            Routing via {transferMode} Network
          </div>
        </main>
      )}

      {/* STEP 5: TRANSACTION FAILED SCREEN - ACCOUNT FREEZED (HSBC WORLD STYLE) */}
      {step === 'failed' && (
        <main className="flex-1 px-4 py-4 space-y-4">
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-red-200 shadow-md text-center relative overflow-hidden">
            {/* Top red decorative accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#DB0011]" />

            {/* Big Red Cross Animation with "Transaction Failed" */}
            <div className="relative inline-flex mb-3 mt-1">
              <div className="w-16 h-16 rounded-full bg-[#DB0011] text-white flex items-center justify-center shadow-lg ring-8 ring-red-100 animate-pulse">
                <X className="w-10 h-10 stroke-[3]" />
              </div>
            </div>

            <h1 className="text-2xl font-black text-black tracking-tight">
              Transaction Failed
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Your request could not be processed
            </p>

            {/* Middle Alert Banner:
               ┌─────────────────────────────┐
               │  ⚠️ Account Status: FREEZED 🥶  │
               │  Your account is temporarily  │
               │  freezed due to security      │
               │  reasons                      │
               └─────────────────────────────┘ */}
            <div className="mt-4 p-4 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-500 rounded-xl text-center shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-[#DB0011] font-black text-sm tracking-wide">
                <span>⚠️</span>
                <span>Account Status: FREEZED</span>
                <span>🥶</span>
              </div>
              <p className="text-xs text-red-950 font-semibold mt-1.5 leading-snug">
                Your account is temporarily freezed due to security reasons
              </p>
            </div>

            {/* Transaction Details */}
            <div className="mt-4 space-y-2 text-left text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Transaction ID</span>
                <strong className="text-black font-mono font-bold text-right">{txnId}</strong>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Amount</span>
                <strong className="text-base font-black text-[#DB0011] font-mono text-right">
                  ₹ {(parseFloat(amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="text-slate-800 font-semibold text-right">{txDate}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Reason</span>
                <span className="text-[#DB0011] font-bold text-right text-xs">
                  Account Freezed - Security Hold
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Code</span>
                <span className="font-mono text-slate-800 font-bold text-right text-xs">
                  ACCT_FRZ_001
                </span>
              </div>

              <div className="mt-2.5 p-3 bg-red-50/70 rounded-xl border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#DB0011] shrink-0 mt-0.5" />
                  <p className="text-xs text-red-950 font-semibold leading-relaxed">
                    Your account is freezed. Cannot debit. Please contact home branch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: [Try Again] [Home] */}
          <div className="space-y-2 pt-1">
            {/* Try Again -> infinite loop, re-triggers 2-second processing and fails */}
            <button
              onClick={() => {
                setStep('processing');
              }}
              className="w-full h-11 bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
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
              className="w-full h-10 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-600 border border-slate-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#DB0011]" />
              <span>Contact Support</span>
            </button>
          </div>
        </main>
      )}

      {/* Customer Support Popup Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#DB0011] flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-black">HSBC Customer Care</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your account is currently under security freeze (Code: ACCT_FRZ_001). Please reach out to our Premier Support team:
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:18002663456"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-red-50 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#DB0011]" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Customer Care</span>
                    <strong className="text-xs text-black group-hover:text-[#DB0011]">1800 266 3456</strong>
                  </div>
                </div>
                <span className="text-[10px] text-[#DB0011] font-bold">Call Now &rarr;</span>
              </a>

              <a
                href="mailto:supportindia@hsbc.com"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-red-50 hover:border-red-200 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#DB0011]" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Support Email</span>
                    <strong className="text-xs text-black group-hover:text-[#DB0011]">supportindia@hsbc.com</strong>
                  </div>
                </div>
                <span className="text-[10px] text-[#DB0011] font-bold">Email &rarr;</span>
              </a>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
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

      {/* GLOBAL FREEZE POPUP (Universal standard: Account Frozen, Your account has been frozen...) */}
      <AccountFrozenModal
        isOpen={showFreezePopup}
        onClose={() => setShowFreezePopup(false)}
        onSupportClick={() => {
          setShowFreezePopup(false);
          setShowSupportModal(true);
        }}
      />

      {/* Persistent Bottom Security Banner */}
      <footer className="p-3 bg-[#FFFFFF] border-t border-slate-200 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>RBI BBPS & NPCI IMPS Clearing Guaranteed</span>
      </footer>
    </div>
  );
};

export default Screen6TransferForm;
