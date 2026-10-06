import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { PayeeContact } from '../constants/mockData';
import {
  Smartphone,
  PhoneCall,
  Zap,
  Flame,
  Car,
  BadgeIndianRupee,
  Home,
  LayoutGrid,
  ChevronRight,
  Plus,
  UserX,
  X,
  UserCheck
} from 'lucide-react';

export const Screen3PeopleBills: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [payees, setPayees] = useState<PayeeContact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [payeeName, setPayeeName] = useState('');
  const [payeeBank, setPayeeBank] = useState('');
  const [payeeAcc, setPayeeAcc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddPayeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeName.trim() || !payeeAcc.trim()) {
      showToast('Please enter payee name and account number');
      return;
    }

    const words = payeeName.trim().split(' ');
    const initials = words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();

    const newPayee: PayeeContact = {
      id: `p-${Date.now()}`,
      initials,
      name: payeeName.trim(),
      bank: payeeBank.trim() || 'Bank Account',
      accNumber: payeeAcc.trim(),
      color: '#DB0011',
      avatarBg: 'bg-slate-100 text-black'
    };

    setPayees(prev => [...prev, newPayee]);
    setPayeeName('');
    setPayeeBank('');
    setPayeeAcc('');
    setShowAddModal(false);
    showToast(`Payee ${newPayee.name} added successfully`);
  };

  // 8 Bill Payments icons
  const billPaymentServices = [
    { id: 'mobile', name: 'Mobile Recharge', icon: Smartphone, color: 'bg-red-50 text-[#DB0011]', path: null },
    { id: 'postpaid', name: 'Postpaid', icon: PhoneCall, color: 'bg-slate-100 text-slate-800', path: null },
    { id: 'electricity', name: 'Electricity Bill', icon: Zap, color: 'bg-red-50 text-[#DB0011]', path: '/electricity-bill', highlight: true },
    { id: 'gas', name: 'Piped Gas', icon: Flame, color: 'bg-slate-100 text-slate-800', path: null },
    { id: 'fastag', name: 'FASTag', icon: Car, color: 'bg-slate-100 text-slate-800', path: null },
    { id: 'emi', name: 'Loan EMI', icon: BadgeIndianRupee, color: 'bg-slate-100 text-slate-800', path: null },
    { id: 'rent', name: 'Rent', icon: Home, color: 'bg-slate-100 text-slate-800', path: null },
    { id: 'all', name: 'View All', icon: LayoutGrid, color: 'bg-slate-100 text-slate-800', path: null },
  ];

  const handleBillClick = (service: typeof billPaymentServices[0]) => {
    if (service.path) {
      navigate(service.path);
    } else {
      showToast(`${service.name} payment service selected`);
    }
  };

  const handleContactClick = (contact: PayeeContact) => {
    navigate('/transfer', { state: { payeeName: contact.name, accNo: contact.accNumber } });
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px]">
      {/* Top Red Header #DB0011 "People & Business" */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold tracking-tight">Move Money</h1>
          <button
            onClick={() => navigate('/pay-and-transfer')}
            className="text-xs font-bold text-white/90 hover:text-white flex items-center gap-0.5 cursor-pointer bg-white/10 px-2 py-0.5 rounded-md"
          >
            <span>International</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-white/80">
          Send money and manage utility bills
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-3 space-y-4">
        {/* SECTION 1: PEOPLE & ACCOUNTS */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider">
              People & Accounts
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-[#DB0011] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add payee</span>
            </button>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-slate-200/80 shadow-sm min-h-[140px] flex flex-col justify-center">
            {payees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <UserX className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">No payees added</h3>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                  You have not added any beneficiaries or payees yet.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 px-3 py-1.5 bg-[#DB0011] hover:bg-[#b5000e] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add payee</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-y-3 gap-x-2">
                {payees.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                    className="flex flex-col items-center group cursor-pointer"
                    title={`Transfer to ${contact.name}`}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105 group-active:scale-95 bg-slate-100 text-black border border-slate-300"
                    >
                      {contact.initials}
                    </div>
                    <span className="text-[11px] font-bold text-black mt-1.5 truncate max-w-[68px] text-center">
                      {contact.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">
                      {contact.bank.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: BILL PAYMENTS (8 ICONS) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider">
              Bill Payments
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold">
              BBPS Assured
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-[#FFFFFF] p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
            {billPaymentServices.map((service) => {
              const IconComp = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleBillClick(service)}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group text-center"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 group-active:scale-95 ${service.color}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-black leading-tight">
                    {service.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK LINK TO TRANSFER */}
        <div
          onClick={() => navigate('/transfer')}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#DB0011] transition group"
        >
          <div>
            <h4 className="text-xs font-bold text-black">New Account Transfer</h4>
            <p className="text-[11px] text-slate-500">Send money directly to any IFSC / Bank account</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#DB0011] group-hover:translate-x-0.5 transition" />
        </div>
      </main>

      {/* ADD PAYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-xl text-left border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-black">Add New Payee</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayeeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Bank / HDFC"
                  value={payeeBank}
                  onChange={(e) => setPayeeBank(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Number / IBAN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 501002391024"
                  value={payeeAcc}
                  onChange={(e) => setPayeeAcc(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-lg bg-[#DB0011] hover:bg-[#b5000e] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Save Payee
                </button>
              </div>
            </form>
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
      <BottomNav activeTabOverride="pay" />
    </div>
  );
};
