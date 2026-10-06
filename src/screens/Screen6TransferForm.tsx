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
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

  // Step state: 'form' | 'confirm' | 'pin' | 'processing' | 'success'
  const [step, setStep] = useState<'form' | 'confirm' | 'pin' | 'processing' | 'success'>('form');

  // Form Fields - completely blank on load
  const [beneficiaryName, setBeneficiaryName] = useState(stateData?.payeeName || '');
  const [accountNumber, setAccountNumber] = useState(stateData?.accNo?.replace(/\D/g, '') || '');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(stateData?.accNo?.replace(/\D/g, '') || '');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<'Savings' | 'Current'>('Savings');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT'>('IMPS');
  const [amount, setAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Validation & Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // PIN Entry state (6 digits, only 696196 valid)
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
        if (nextPin === '696196') {
          setTimeout(() => {
            setStep('processing');
          }, 300);
        } else {
          setTimeout(() => {
            setPinError('Invalid PIN');
            setPin('');
          }, 250);
        }
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

  // 2-second processing effect when reaching 'processing'
  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        const numAmt = parseFloat(amount) || 0;
        // Generate random 12-digit transaction ID
        const generatedId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setTxnId(generatedId);
        setTxDate(dateStr);

        // Execute transfer in BankContext
        executeTransfer({
          recipient: beneficiaryName,
          amount: numAmt,
          reference: remarks || 'Bank Transfer',
          transferType: transferMode,
        });

        // Update balance and sync to localStorage
        const transferAmount = numAmt;
        const newBalance = balance - transferAmount;
        setBalance(newBalance);
        localStorage.setItem('hsbc_balance', String(newBalance));
        localStorage.setItem('bank_balance', String(newBalance));

        setStep('success');

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.35 },
            colors: ['#DB0011', '#10B981', '#000000', '#F59E0B'],
          });
        } catch {
          // ignore
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step, amount, beneficiaryName, remarks, transferMode, executeTransfer]);

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
                else navigate(-1);
              }}
              className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold tracking-tight">
              {step === 'success' ? 'Transfer Status' : 'Bank Account Transfer'}
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
          <form onSubmit={handleFormSubmit} className="space-y-3">
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

              {/* Auto Bank Name display - hidden until IFSC is typed */}
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

            {/* Amount INR */}
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

      {/* STEP 4: PROCESSING SPINNER (2 SECONDS WITH HSBC RED #DB0011 SPINNER) */}
      {step === 'processing' && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#DB0011] animate-spin" />
          </div>
          <h2 className="text-lg font-black text-black tracking-tight">
            Processing Transfer...
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Please wait while HSBC verifies your transaction with RBI payment gateway. Do not press back or refresh.
          </p>
          <div className="mt-4 px-3 py-1 bg-red-50 text-[#DB0011] text-xs font-bold rounded-full">
            Routing via {transferMode} Network
          </div>
        </main>
      )}

      {/* STEP 5: TRANSFER COMPLETED SUCCESS SCREEN */}
      {step === 'success' && (
        <main className="flex-1 px-4 py-4 space-y-4">
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-slate-200 shadow-md text-center relative overflow-hidden">
            {/* Top red decorative accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#DB0011]" />

            {/* Green Tick Badge */}
            <div className="relative inline-flex mb-3 mt-1">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-6 ring-emerald-100">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-black tracking-tight">
              Transfer Completed
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Funds debited and transferred successfully
            </p>

            {/* Amount */}
            <div className="mt-3.5 py-2.5 bg-[#F5F5F5] rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Amount Transferred
              </span>
              <div className="text-3xl font-black text-black font-mono mt-0.5">
                ₹{(parseFloat(amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="mt-4 space-y-2 text-left text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Transaction ID</span>
                <strong className="text-black font-mono font-bold text-right">{txnId}</strong>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">To Beneficiary</span>
                <span className="font-bold text-black text-right">{beneficiaryName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">To Account</span>
                <span className="font-mono font-bold text-slate-800 text-right">{maskedAcc}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Bank & IFSC</span>
                <span className="text-slate-800 font-semibold text-right">{bankName} ({ifscCode})</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Transfer Mode</span>
                <span className="text-[#DB0011] font-bold text-right">{transferMode} Instant</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="text-slate-800 font-semibold text-right">{txDate}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">From Account</span>
                <span className="text-slate-800 font-semibold text-right">{userAccount.accountNumber}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* On Done go back to Home */}
            <button
              onClick={() => navigate('/home')}
              className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Done</span>
            </button>

            <button
              onClick={() => {
                setStep('form');
                setAmount('');
              }}
              className="w-full h-11 bg-white hover:bg-slate-100 border border-slate-300 text-black font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Make Another Transfer
            </button>
          </div>
        </main>
      )}

      {/* Persistent Bottom Security Banner */}
      <footer className="p-3 bg-[#FFFFFF] border-t border-slate-200 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>RBI BBPS & NPCI IMPS Clearing Guaranteed</span>
      </footer>
    </div>
  );
};

export default Screen6TransferForm;
