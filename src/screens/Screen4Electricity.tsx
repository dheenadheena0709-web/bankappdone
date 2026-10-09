import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ELECTRICITY_BILLERS } from '../constants/mockData';
import {
  ArrowLeft,
  Search,
  Zap,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Check,
  Share2,
  X
} from 'lucide-react';

export const Screen4Electricity: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiller, setSelectedBiller] = useState<string>('');
  const [consumerNumber, setConsumerNumber] = useState<string>('');
  const [billAmount, setBillAmount] = useState<string>('3250.00');
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [payFromAccount, setPayFromAccount] = useState('HSBC Premier Savings - ••••2010');
  const [successRef, setSuccessRef] = useState('');
  const [successDate, setSuccessDate] = useState('');

  const filteredBillers = ELECTRICITY_BILLERS.filter((biller) =>
    biller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    biller.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    biller.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFetchBill = () => {
    if (!consumerNumber.trim()) {
      setFetchStatus('Please enter Consumer Number');
      return;
    }
    setFetchStatus('No outstanding bills found - fresh account');
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleExecutePayment = () => {
    setStep('processing');
    setTimeout(() => {
      const now = new Date();
      const dateStr =
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ', ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const ref = `BBPS${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      setSuccessRef(ref);
      setSuccessDate(dateStr);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] text-black">
      {/* Top Header Background: #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => {
              if (step === 'confirm') setStep('input');
              else navigate('/people-and-bills');
            }}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Electricity Bill Payment</h1>
            <p className="text-xs text-white/80">Bharat BillPay (BBPS) Independent Flow</p>
          </div>
        </div>

        {/* Search Bar */}
        {step === 'input' && (
          <div className="relative mt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by electricity board or operator"
              className="w-full h-11 pl-9 pr-3 rounded-lg bg-white text-black placeholder-slate-400 text-xs font-medium border border-slate-200 focus:ring-2 focus:ring-white outline-none shadow-xs"
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-4">
        {/* ================= STEP 1: INPUT BILLER DETAILS ================= */}
        {step === 'input' && (
          <>
            {/* FRESH ACCOUNT STATUS BANNER */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Account Status</span>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                No recent / No outstanding - fresh account
              </span>
            </div>

            {/* SECTION 1: EMPTY FORM FOR ELECTRICITY BILL */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider mb-3">
                Pay Electricity Bill
              </h2>

              <form onSubmit={handleProceedToConfirm} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State / Electricity Board *
                  </label>
                  <select
                    value={selectedBiller}
                    required
                    onChange={(e) => setSelectedBiller(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                  >
                    <option value="">Select Electricity Board / State</option>
                    {ELECTRICITY_BILLERS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Consumer Number / Account ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Consumer Number"
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleFetchBill}
                    className="w-full h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition cursor-pointer"
                  >
                    Fetch Bill
                  </button>
                  {fetchStatus && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1.5 text-center">
                      {fetchStatus}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bill Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="₹ Enter bill amount"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Proceed to Confirm</span>
                </button>
              </form>
            </div>

            {/* SECTION 2: ALL ELECTRICITY BILLERS LIST */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-xs font-bold text-black uppercase tracking-wider">
                  All Electricity Billers ({filteredBillers.length})
                </h2>
                <span className="text-[10px] text-slate-500">BBPS Enabled</span>
              </div>

              <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden max-h-[240px] overflow-y-auto">
                {filteredBillers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No electricity operator found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredBillers.map((biller) => (
                    <button
                      key={biller.id}
                      type="button"
                      onClick={() => setSelectedBiller(biller.name)}
                      className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${biller.iconBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          <Zap className="w-4 h-4 fill-white" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-black group-hover:text-[#DB0011]">
                            {biller.name}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {biller.state} · {biller.code}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#DB0011]">
                        <span className="text-[10px] font-bold text-[#DB0011] opacity-0 group-hover:opacity-100 transition">
                          Select
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* ================= STEP 2: CONFIRM PAYMENT / ORDER SUMMARY ================= */}
        {step === 'confirm' && (
          <div className="space-y-4">
            {/* Amount Banner */}
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-[#DB0011]" />
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Total Payable Amount
              </span>
              <div className="text-2xl font-black text-black font-mono mt-0.5">
                ₹{parseFloat(billAmount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Biller Name</span>
                <strong className="text-[#DB0011] font-bold text-right">{selectedBiller || 'Electricity Board'}</strong>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Consumer Number</span>
                <span className="font-mono font-bold text-black text-right">{consumerNumber || '9021948210'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Convenience Fee</span>
                <span className="text-emerald-700 font-bold text-right">₹0.00 (Free)</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Payment Gateway</span>
                <span className="text-slate-700 font-semibold text-right">NPCI Bharat BillPay</span>
              </div>
            </div>

            {/* Pay From Account */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Pay from: Select Account *
              </label>
              <select
                value={payFromAccount}
                onChange={(e) => setPayFromAccount(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
              >
                <option value="HSBC Premier Savings - ••••2010">
                  HSBC Premier Savings - ••••2010 (Bal: ₹12,00,00,00,000.00)
                </option>
                <option value="HSBC Current Business Account - ••••8812">
                  HSBC Current Business - ••••8812 (Bal: ₹50,00,000.00)
                </option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleExecutePayment}
                className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Pay ₹{parseFloat(billAmount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </button>

              <button
                onClick={() => setStep('input')}
                className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Back to Edit
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROCESSING SPINNER ================= */}
        {step === 'processing' && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-[#DB0011] animate-spin" />
            <h4 className="text-base font-bold text-black">Processing Electricity Bill...</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Verifying transaction with Bharat BillPay gateway. Please do not refresh.
            </p>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS RECEIPT ================= */}
        {step === 'success' && (
          <div className="space-y-4 text-center">
            {/* Green Tick */}
            <div className="relative inline-flex mb-1 mt-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-8 ring-emerald-100 animate-bounce">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-black">Electricity Bill Paid</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Receipt generated and cleared via BBPS
              </p>
            </div>

            {/* Amount Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Amount Paid
              </span>
              <div className="text-3xl font-black text-black font-mono mt-0.5">
                ₹{parseFloat(billAmount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Receipt Details */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">BBPS Ref Number</span>
                <strong className="text-black font-mono font-bold text-right text-[11px]">{successRef}</strong>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Electricity Board</span>
                <strong className="text-slate-800 font-bold text-right">{selectedBiller || 'Electricity Board'}</strong>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Consumer Number</span>
                <span className="font-mono font-bold text-black text-right">{consumerNumber || '9021948210'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Paid From</span>
                <span className="text-slate-700 font-medium text-right text-[11px]">{payFromAccount}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-700 font-medium text-right text-[11px]">{successDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => navigate('/people-and-bills')}
                className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-3 bg-[#FFFFFF] border-t border-slate-200 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>BBPS Bharat BillPay Instant Clearance</span>
      </footer>
    </div>
  );
};

export default Screen4Electricity;
