import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTERNATIONAL_PAYEES, EXCHANGE_RATES } from '../constants/mockData';
import {
  ArrowLeft,
  Send,
  Globe2,
  Users2,
  UserPlus,
  ChevronRight,
  X,
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react';

export const Screen5PayTransfer: React.FC = () => {
  const navigate = useNavigate();
  const [internationalPayees, setInternationalPayees] = useState<typeof INTERNATIONAL_PAYEES>([]);
  const [showPayeesPopup, setShowPayeesPopup] = useState(false);
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newIban, setNewIban] = useState('');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [addSuccess, setAddSuccess] = useState(false);

  const handleSelectInternationalPayee = (payee: typeof INTERNATIONAL_PAYEES[0]) => {
    setShowPayeesPopup(false);
    navigate('/transfer', {
      state: {
        payeeName: payee.name,
        accNo: payee.iban,
        currency: payee.currency,
        isInternational: true
      }
    });
  };

  const handleAddPayeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPayeeName.trim() && newIban.trim()) {
      setInternationalPayees((prev) => [
        ...prev,
        {
          id: `intl-${Date.now()}`,
          name: newPayeeName.trim(),
          bank: 'International Partner Bank',
          country: 'Overseas',
          iban: newIban.trim(),
          currency: newCurrency
        }
      ]);
    }
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddPayeeModal(false);
      setShowPayeesPopup(true);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Header Background: #DB0011 */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 shadow-sm border-b dark:border-slate-800 transition-colors duration-200 w-full">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate('/home')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pay and transfer</h1>
            <p className="text-xs text-white/80">Domestic and Global transfers</p>
          </div>
        </div>
      </header>

      {/* Main Menu List */}
      <main className="flex-1 px-4 py-3 space-y-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* 1. Pay and transfer > */}
          <button
            onClick={() => navigate('/transfer')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Pay and transfer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send to bank accounts, mobile number, or IFSC
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 2. UPI Payments (New App Look) > */}
          <button
            onClick={() => navigate('/upi')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  UPI Payments
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant transfer via UPI ID or Mobile Number
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 2. Send money internationally > */}
          <button
            onClick={() => setShowPayeesPopup(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Send money internationally
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  International wire remittance
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 3. International payees > */}
          <button
            onClick={() => setShowPayeesPopup(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  International payees
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage saved foreign payees
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {internationalPayees.length} Saved
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* 4. Add international payee > */}
          <button
            onClick={() => setShowAddPayeeModal(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Add international payee
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add beneficiary with IBAN & SWIFT
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Live FX Rates */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#DB0011] dark:text-red-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Live Indicative Forex
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">RBI Ref</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {EXCHANGE_RATES.map((fx) => (
              <div
                key={fx.pair}
                className="p-2 rounded-lg bg-[#F5F5F5] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">{fx.pair}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">₹{fx.rate}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  {fx.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* POPUP SECTION FOR INTERNATIONAL PAYEES */}
      {showPayeesPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border dark:border-slate-800">
            <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#F5F5F5] dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#DB0011] text-white flex items-center justify-center">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">International Payees</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Select payee to initiate transfer</p>
                </div>
              </div>
              <button
                onClick={() => setShowPayeesPopup(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto max-h-[60vh] divide-y divide-slate-100 dark:divide-slate-800">
              {internationalPayees.length === 0 ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No saved international payees found
                </div>
              ) : (
                internationalPayees.map((payee) => (
                  <div
                    key={payee.id}
                    onClick={() => handleSelectInternationalPayee(payee)}
                    className="pt-2 first:pt-0 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2 rounded-lg transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {payee.currency}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                          {payee.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{payee.bank} · {payee.country}</p>
                        <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500">{payee.iban}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#F5F5F5] dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button
                onClick={() => {
                  setShowPayeesPopup(false);
                  setShowAddPayeeModal(true);
                }}
                className="flex-1 h-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 rounded-lg transition cursor-pointer"
              >
                + Add New Payee
              </button>
              <button
                onClick={() => setShowPayeesPopup(false)}
                className="px-4 h-10 bg-[#DB0011] text-white text-xs font-bold rounded-lg hover:bg-[#b5000e] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD INTERNATIONAL PAYEE MODAL */}
      {showAddPayeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm p-4 shadow-2xl relative text-left border dark:border-slate-800">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#DB0011] dark:text-red-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add International Payee</h3>
              </div>
              <button
                onClick={() => setShowAddPayeeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Payee Added Successfully!</h4>
              </div>
            ) : (
              <form onSubmit={handleAddPayeeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPayeeName}
                    onChange={(e) => setNewPayeeName(e.target.value)}
                    placeholder="Full legal name"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#DB0011] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    required
                    value={newIban}
                    onChange={(e) => setNewIban(e.target.value)}
                    placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#DB0011] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Currency
                    </label>
                    <select
                      value={newCurrency}
                      onChange={(e) => setNewCurrency(e.target.value)}
                      className="w-full h-10 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#DB0011] outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AED">AED (د.إ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      SWIFT / BIC
                    </label>
                    <input
                      type="text"
                      defaultValue="BARCGB22"
                      className="w-full h-10 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#DB0011] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 h-11 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
                >
                  Save Beneficiary
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
