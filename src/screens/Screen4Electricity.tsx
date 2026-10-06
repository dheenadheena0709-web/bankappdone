import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ELECTRICITY_BILLERS, LINKED_ELECTRICITY_ACCOUNT } from '../constants/mockData';
import { useBank } from '../context/BankContext';
import { ArrowLeft, Search, Zap, Building, ShieldCheck, ChevronRight } from 'lucide-react';

export const Screen4Electricity: React.FC = () => {
  const navigate = useNavigate();
  const { executeBillPayment } = useBank();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBillers = ELECTRICITY_BILLERS.filter((biller) =>
    biller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    biller.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    biller.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayLinkedBill = () => {
    executeBillPayment({
      billerName: LINKED_ELECTRICITY_ACCOUNT.billerName,
      consumerNo: LINKED_ELECTRICITY_ACCOUNT.consumerNo,
      amount: LINKED_ELECTRICITY_ACCOUNT.amount,
    });
    navigate('/payment-success');
  };

  const handleSelectBiller = (biller: typeof ELECTRICITY_BILLERS[0]) => {
    executeBillPayment({
      billerName: biller.name,
      consumerNo: '902194821',
      amount: 3250.00,
    });
    navigate('/payment-success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px]">
      {/* Top Header Background: #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('/people-and-bills')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Electricity Bill Payment</h1>
            <p className="text-xs text-white/80">Select electricity biller</p>
          </div>
        </div>

        {/* Search Bar: "Search by bill operator" */}
        <div className="relative mt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bill operator"
            className="w-full h-11 pl-9 pr-3 rounded-lg bg-white text-black placeholder-slate-400 text-xs font-medium border border-slate-200 focus:ring-2 focus:ring-white outline-none shadow-xs"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-4">
        {/* SECTION 1: LINKED ACCOUNT (Sanskar Tower 1405) WITH PAY ₹15,000 BUTTON */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider">
              Linked Account
            </h2>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Bill Due
            </span>
          </div>

          <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">
                    {LINKED_ELECTRICITY_ACCOUNT.accountName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {LINKED_ELECTRICITY_ACCOUNT.billerName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Due Date</span>
                <span className="text-xs font-bold text-[#DB0011]">
                  {LINKED_ELECTRICITY_ACCOUNT.dueDate}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Consumer Number</span>
                <span className="font-mono font-bold text-black">
                  {LINKED_ELECTRICITY_ACCOUNT.consumerNo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Bill Amount</span>
                <span className="text-base font-black text-black font-mono">
                  ₹{LINKED_ELECTRICITY_ACCOUNT.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Pay ₹15,000 button in #DB0011 */}
            <div className="mt-3.5">
              <button
                onClick={handlePayLinkedBill}
                className="w-full h-11 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Pay ₹15,000</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: ALL ELECTRICITY BILLERS LIST */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider">
              All Electricity Billers ({filteredBillers.length})
            </h2>
            <span className="text-[10px] text-slate-500">BBPS Enabled</span>
          </div>

          <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden max-h-[320px] overflow-y-auto">
            {filteredBillers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No electricity operator found matching "{searchQuery}"
              </div>
            ) : (
              filteredBillers.map((biller) => (
                <button
                  key={biller.id}
                  onClick={() => handleSelectBiller(biller)}
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
                      Pay
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 bg-[#FFFFFF] border-t border-slate-200 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>BBPS Bharat BillPay Instant Clearance</span>
      </footer>
    </div>
  );
};
