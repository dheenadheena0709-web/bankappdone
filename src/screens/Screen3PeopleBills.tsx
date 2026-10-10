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
  UserCheck,
  Droplets,
  Tv,
  Wifi,
  Shield,
  CreditCard,
  Building2,
  GraduationCap,
  HeartPulse,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Check,
  Share2,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { AccountFrozenModal } from '../components/AccountFrozenModal';

export const Screen3PeopleBills: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFreezePopup, setShowFreezePopup] = useState(false);

  // FLOW A: PEOPLE & ACCOUNTS (Independent flow)
  const [payees, setPayees] = useState<PayeeContact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [payeeName, setPayeeName] = useState('');
  const [payeeIdentifier, setPayeeIdentifier] = useState('');
  const [payeeBank, setPayeeBank] = useState('');

  // FLOW B: BILL PAYMENTS (Independent in-modal flow: input -> confirm -> processing -> success)
  const [selectedBillType, setSelectedBillType] = useState<string | null>(null);
  const [billStep, setBillStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');
  const [viewAllSearch, setViewAllSearch] = useState('');

  // Active Bill Form fields (Empty Inputs)
  const [formData, setFormData] = useState({
    mobile: '',
    operator: '',
    circle: '',
    amount: '',
    consumerNumber: '',
    stateBoard: '',
    provider: '',
    customerId: '',
    vehicleNumber: '',
    fastagBank: '',
    lender: '',
    loanNumber: '',
    propertyDetails: '',
    landlordName: '',
    landlordAccount: '',
  });

  const [fetchBillStatus, setFetchBillStatus] = useState<string | null>(null);

  // Order Summary Details for Confirmation
  const [billSummary, setBillSummary] = useState({
    type: '',
    title: '',
    biller: '',
    identifier: '',
    amount: '',
  });

  // Pay From Account Selection
  const [payFromAccount, setPayFromAccount] = useState('HSBC Premier Savings - ••••2010');

  // Success Receipt State
  const [successDetails, setSuccessDetails] = useState({
    referenceNumber: '',
    date: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset Form Data
  const resetForm = () => {
    setFormData({
      mobile: '',
      operator: '',
      circle: '',
      amount: '',
      consumerNumber: '',
      stateBoard: '',
      provider: '',
      customerId: '',
      vehicleNumber: '',
      fastagBank: '',
      lender: '',
      loanNumber: '',
      propertyDetails: '',
      landlordName: '',
      landlordAccount: '',
    });
    setFetchBillStatus(null);
    setBillStep('input');
  };

  const openBillModal = (type: string) => {
    resetForm();
    setSelectedBillType(type);
    setBillStep('input');
  };

  const closeBillModal = () => {
    setSelectedBillType(null);
    resetForm();
  };

  // FLOW A: Add Payee Submission
  const handleAddPayeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeName.trim() || !payeeIdentifier.trim()) {
      showToast('Please enter payee name and account/mobile/UPI');
      return;
    }

    const words = payeeName.trim().split(' ');
    const initials =
      words.length > 1
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : words[0].slice(0, 2).toUpperCase();

    const newPayee: PayeeContact = {
      id: `p-${Date.now()}`,
      initials,
      name: payeeName.trim(),
      bank: payeeBank.trim() || 'Bank Account',
      accNumber: payeeIdentifier.trim(),
      color: '#DB0011',
      avatarBg: 'bg-slate-100 text-black',
    };

    setPayees((prev) => [...prev, newPayee]);
    setPayeeName('');
    setPayeeIdentifier('');
    setPayeeBank('');
    setShowAddModal(false);
    showToast(`Payee ${newPayee.name} added successfully`);
  };

  const handleFetchBill = () => {
    setFetchBillStatus('No outstanding bills found - fresh account');
  };

  // FLOW B: Step 1 -> Step 2: Show Order Summary page inside same modal
  const handleBillPaymentConfirm = (type: string, data: typeof formData) => {
    const serviceTitle = getModalTitle(type);
    const biller =
      data.operator ||
      data.provider ||
      data.lender ||
      data.landlordName ||
      data.stateBoard ||
      serviceTitle;

    const identifier =
      data.mobile ||
      data.consumerNumber ||
      data.customerId ||
      data.vehicleNumber ||
      data.loanNumber ||
      data.landlordAccount ||
      'N/A';

    const amt = data.amount && parseFloat(data.amount) > 0 ? data.amount : '0.00';

    setBillSummary({
      type,
      title: serviceTitle,
      biller,
      identifier,
      amount: amt,
    });
    setBillStep('confirm');
  };

  // FLOW B: Step 2 -> Step 3: Pay Bill -> 2-second processing -> ACCOUNT FROZEN POPUP (NEVER SUCCESS)
  const handleExecuteBillPay = () => {
    setBillStep('processing');
    setTimeout(() => {
      setBillStep('input');
      setSelectedBillType(null);
      setShowFreezePopup(true);
    }, 2000);
  };

  const handleShareReceipt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `HSBC Bharat BillPay Receipt\nBiller: ${billSummary.biller}\nAmount: ₹${billSummary.amount}\nRef: ${successDetails.referenceNumber}\nDate: ${successDetails.date}`
      );
      showToast('Receipt details copied to clipboard');
    }
  };

  // Main 8 tiles on the screen
  const mainBillServices = [
    { id: 'mobile', name: 'Mobile Recharge', icon: Smartphone, color: 'bg-red-50 text-[#DB0011]' },
    { id: 'postpaid', name: 'Postpaid', icon: PhoneCall, color: 'bg-slate-100 text-slate-800' },
    { id: 'electricity', name: 'Electricity Bill', icon: Zap, color: 'bg-red-50 text-[#DB0011]' },
    { id: 'gas', name: 'Piped Gas', icon: Flame, color: 'bg-slate-100 text-slate-800' },
    { id: 'fastag', name: 'FASTag', icon: Car, color: 'bg-slate-100 text-slate-800' },
    { id: 'emi', name: 'Loan EMI', icon: BadgeIndianRupee, color: 'bg-slate-100 text-slate-800' },
    { id: 'rent', name: 'Rent', icon: Home, color: 'bg-slate-100 text-slate-800' },
    { id: 'all', name: 'View All', icon: LayoutGrid, color: 'bg-slate-100 text-slate-800' },
  ];

  // Full catalog of 17 billers for "View All"
  const allBillerCatalog = [
    { id: 'mobile', name: 'Mobile Recharge', icon: Smartphone, color: 'bg-red-50 text-[#DB0011]' },
    { id: 'postpaid', name: 'Postpaid Mobile', icon: PhoneCall, color: 'bg-blue-50 text-blue-600' },
    { id: 'electricity', name: 'Electricity Bill', icon: Zap, color: 'bg-amber-50 text-amber-600' },
    { id: 'gas', name: 'Piped Gas', icon: Flame, color: 'bg-orange-50 text-orange-600' },
    { id: 'fastag', name: 'FASTag Recharge', icon: Car, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'emi', name: 'Loan EMI', icon: BadgeIndianRupee, color: 'bg-violet-50 text-violet-600' },
    { id: 'rent', name: 'Rent Payment', icon: Home, color: 'bg-rose-50 text-rose-600' },
    { id: 'water', name: 'Water Bill', icon: Droplets, color: 'bg-cyan-50 text-cyan-600' },
    { id: 'dth', name: 'DTH / Cable TV', icon: Tv, color: 'bg-indigo-50 text-indigo-600' },
    { id: 'broadband', name: 'Broadband / Landline', icon: Wifi, color: 'bg-teal-50 text-teal-600' },
    { id: 'insurance', name: 'Insurance Premium', icon: Shield, color: 'bg-purple-50 text-purple-600' },
    { id: 'cylinder', name: 'LPG Cylinder', icon: Flame, color: 'bg-red-50 text-red-600' },
    { id: 'creditcard', name: 'Credit Card Bill', icon: CreditCard, color: 'bg-slate-100 text-slate-700' },
    { id: 'tax', name: 'Municipal Tax', icon: Building2, color: 'bg-amber-50 text-amber-700' },
    { id: 'education', name: 'Education Fees', icon: GraduationCap, color: 'bg-blue-50 text-blue-700' },
    { id: 'hospital', name: 'Hospital / Medical', icon: HeartPulse, color: 'bg-rose-50 text-rose-700' },
    { id: 'society', name: 'Housing Society', icon: Users, color: 'bg-emerald-50 text-emerald-700' },
  ];

  const filteredAllBillers = allBillerCatalog.filter((item) =>
    item.name.toLowerCase().includes(viewAllSearch.toLowerCase())
  );

  const getModalTitle = (type: string) => {
    const item = allBillerCatalog.find((b) => b.id === type);
    return item ? item.name : 'Bill Payment';
  };

  const getModalIcon = (type: string) => {
    const item = allBillerCatalog.find((b) => b.id === type);
    return item ? item.icon : Zap;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] text-black">
      {/* Top Red Header #DB0011 "Move Money" */}
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
        <p className="text-xs text-white/80">Send money and manage utility bills</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-4">
        {/* FLOW A: SECTION 1: PEOPLE & ACCOUNTS */}
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
                    onClick={() =>
                      navigate('/transfer', {
                        state: { payeeName: contact.name, accNo: contact.accNumber },
                      })
                    }
                    className="flex flex-col items-center group cursor-pointer"
                    title={`Transfer to ${contact.name}`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105 group-active:scale-95 bg-slate-100 text-black border border-slate-300">
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

        {/* FLOW B: SECTION 2: BILL PAYMENTS (ALL 8 TILES INDEPENDENT) */}
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
            {mainBillServices.map((service) => {
              const IconComp = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => openBillModal(service.id)}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition cursor-pointer group text-center"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${service.color}`}
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

        {/* FLOW A QUICK LINK TO TRANSFER */}
        <div
          onClick={() => navigate('/transfer')}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#DB0011] transition group"
        >
          <div>
            <h4 className="text-xs font-bold text-black">New Account Transfer</h4>
            <p className="text-[11px] text-slate-500">
              Send money directly to any IFSC / Bank account
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#DB0011] group-hover:translate-x-0.5 transition" />
        </div>
      </main>

      {/* BOTTOM SHEET MODAL: VIEW ALL BILLERS */}
      {selectedBillType === 'all' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 max-h-[88vh] flex flex-col animate-slide-up">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">All Billers (Bharat BillPay)</h3>
                  <p className="text-[10px] text-slate-500">Select any category to pay utility bill</p>
                </div>
              </div>
              <button
                onClick={closeBillModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={viewAllSearch}
                onChange={(e) => setViewAllSearch(e.target.value)}
                placeholder="Search utility billers..."
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-black placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
              />
            </div>

            {/* Fresh Account Badge */}
            <div className="mb-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center justify-between shrink-0">
              <span>Account Status:</span>
              <span className="font-semibold text-slate-700">No recent / No outstanding - fresh account</span>
            </div>

            {/* Grid of 17 Categories */}
            <div className="grid grid-cols-4 gap-2.5 overflow-y-auto pb-4 flex-1">
              {filteredAllBillers.map((biller) => {
                const BillerIcon = biller.icon;
                return (
                  <button
                    key={biller.id}
                    onClick={() => openBillModal(biller.id)}
                    className="flex flex-col items-center p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition cursor-pointer group text-center active:scale-95"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${biller.color}`}
                    >
                      <BillerIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-black leading-tight">
                      {biller.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET MODAL: FLOW B - INDEPENDENT MULTI-STEP BILL PAYMENT FLOW */}
      {selectedBillType && selectedBillType !== 'all' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 max-h-[90vh] overflow-y-auto flex flex-col animate-slide-up">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

            {/* ================= STEP 1: INPUT BILLER DETAILS (EMPTY FORM ONLY) ================= */}
            {billStep === 'input' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => openBillModal('all')}
                      className="p-1 -ml-1 text-slate-400 hover:text-black rounded-lg cursor-pointer"
                      title="All billers"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                      {React.createElement(getModalIcon(selectedBillType), { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">{getModalTitle(selectedBillType)}</h3>
                      <p className="text-[10px] text-slate-500">Bharat BillPay (BBPS) Enabled</p>
                    </div>
                  </div>
                  <button
                    onClick={closeBillModal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Fresh Account Notice */}
                <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Account History:</span>
                  <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    No recent / No outstanding - fresh account
                  </span>
                </div>

                {/* FORM BODY - EMPTY INPUTS ONLY */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBillPaymentConfirm(selectedBillType, formData);
                  }}
                  className="space-y-3.5 flex-1"
                >
                  {/* 1. MOBILE RECHARGE */}
                  {selectedBillType === 'mobile' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="Enter 10-digit mobile number"
                          value={formData.mobile}
                          onChange={(e) => handleFieldChange('mobile', e.target.value.replace(/\D/g, ''))}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Operator & Circle *
                        </label>
                        <select
                          value={formData.operator}
                          required
                          onChange={(e) => handleFieldChange('operator', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                        >
                          <option value="">Select Operator (Jio, Airtel, Vi, BSNL)</option>
                          <option value="Jio Prepaid">Jio Prepaid</option>
                          <option value="Airtel Prepaid">Airtel Prepaid</option>
                          <option value="Vi Prepaid">Vodafone Idea (Vi)</option>
                          <option value="BSNL Prepaid">BSNL Prepaid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Recharge Amount (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="₹ Enter recharge amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 2. POSTPAID */}
                  {selectedBillType === 'postpaid' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Postpaid Mobile Number *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="Enter 10-digit postpaid mobile number"
                          value={formData.mobile}
                          onChange={(e) => handleFieldChange('mobile', e.target.value.replace(/\D/g, ''))}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Operator *
                        </label>
                        <select
                          value={formData.operator}
                          required
                          onChange={(e) => handleFieldChange('operator', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                        >
                          <option value="">Select Operator</option>
                          <option value="Jio Postpaid Plus">Jio Postpaid Plus</option>
                          <option value="Airtel Postpaid">Airtel Postpaid</option>
                          <option value="Vi Postpaid">Vodafone Idea Postpaid</option>
                          <option value="BSNL Postpaid">BSNL Postpaid</option>
                        </select>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleFetchBill}
                          className="w-full h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Fetch Bill</span>
                        </button>
                        {fetchBillStatus && (
                          <p className="text-[11px] text-amber-700 font-semibold mt-1.5 text-center">
                            {fetchBillStatus}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bill Amount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="₹ Bill amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 3. ELECTRICITY BILL */}
                  {selectedBillType === 'electricity' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          State / Electricity Board *
                        </label>
                        <select
                          value={formData.stateBoard}
                          required
                          onChange={(e) => handleFieldChange('stateBoard', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                        >
                          <option value="">Select Electricity Board / State</option>
                          <option value="Adani Electricity Mumbai">Adani Electricity Mumbai</option>
                          <option value="Tata Power Mumbai">Tata Power Mumbai</option>
                          <option value="MSEDCL Maharashtra">Maharashtra State Electricity (MSEDCL)</option>
                          <option value="BSES Rajdhani Delhi">BSES Rajdhani Power Limited (Delhi)</option>
                          <option value="TANGEDCO Tamil Nadu">TANGEDCO (Tamil Nadu)</option>
                          <option value="BESCOM Bengaluru">BESCOM (Bengaluru)</option>
                          <option value="UPPCL Urban Uttar Pradesh">UPPCL Urban (Uttar Pradesh)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Consumer Number / Account ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter Consumer / Account ID"
                          value={formData.consumerNumber}
                          onChange={(e) => handleFieldChange('consumerNumber', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleFetchBill}
                          className="w-full h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Fetch Outstanding Bill</span>
                        </button>
                        {fetchBillStatus && (
                          <p className="text-[11px] text-amber-700 font-semibold mt-1.5 text-center">
                            {fetchBillStatus}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bill Amount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="₹ Bill amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 4. PIPED GAS */}
                  {selectedBillType === 'gas' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gas Provider *
                        </label>
                        <select
                          value={formData.provider}
                          required
                          onChange={(e) => handleFieldChange('provider', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                        >
                          <option value="">Select Gas Provider</option>
                          <option value="Indraprastha Gas Limited (IGL)">Indraprastha Gas Limited (IGL)</option>
                          <option value="Mahanagar Gas Limited (MGL)">Mahanagar Gas Limited (MGL)</option>
                          <option value="Adani Total Gas">Adani Total Gas</option>
                          <option value="Gujarat Gas Company Ltd">Gujarat Gas Company Ltd</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Customer ID / BP Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter Customer ID / BP Number"
                          value={formData.customerId}
                          onChange={(e) => handleFieldChange('customerId', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bill Amount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="₹ Enter bill amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 5. FASTAG */}
                  {selectedBillType === 'fastag' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Vehicle Registration Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MH02AB1234"
                          value={formData.vehicleNumber}
                          onChange={(e) => handleFieldChange('vehicleNumber', e.target.value.toUpperCase())}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black uppercase focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Issuer Bank / Provider *
                        </label>
                        <select
                          value={formData.fastagBank}
                          required
                          onChange={(e) => handleFieldChange('fastagBank', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                        >
                          <option value="">Select FASTag Provider</option>
                          <option value="HSBC FASTag">HSBC FASTag</option>
                          <option value="ICICI Bank FASTag">ICICI Bank FASTag</option>
                          <option value="State Bank of India FASTag">State Bank of India FASTag</option>
                          <option value="HDFC Bank FASTag">HDFC Bank FASTag</option>
                          <option value="IDFC FIRST Bank FASTag">IDFC FIRST Bank FASTag</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Recharge Amount (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="₹ Enter recharge amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 6. LOAN EMI */}
                  {selectedBillType === 'emi' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Lender / Bank *
                        </label>
                        <select
                          value={formData.lender}
                          required
                          onChange={(e) => handleFieldChange('lender', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white"
                        >
                          <option value="">Select Bank / NBFC</option>
                          <option value="HSBC Bank India Loans">HSBC Bank India</option>
                          <option value="HDFC Bank Retail Assets">HDFC Bank Loans</option>
                          <option value="Bajaj Finance Limited">Bajaj Finance</option>
                          <option value="Tata Capital Financial">Tata Capital</option>
                          <option value="State Bank of India Loans">SBI Loans</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Loan Account Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter Loan Account Number"
                          value={formData.loanNumber}
                          onChange={(e) => handleFieldChange('loanNumber', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          EMI Amount (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="₹ Enter EMI amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 7. RENT */}
                  {selectedBillType === 'rent' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Property Details / Agreement Address *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Flat 402, Sanskar Heights"
                          value={formData.propertyDetails}
                          onChange={(e) => handleFieldChange('propertyDetails', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Landlord Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter landlord full name"
                          value={formData.landlordName}
                          onChange={(e) => handleFieldChange('landlordName', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Landlord Account Number / UPI ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5010049281729 or landlord@upi"
                          value={formData.landlordAccount}
                          onChange={(e) => handleFieldChange('landlordAccount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Rent Amount (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="₹ Enter rent amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* 8. OTHER SERVICES (Water, DTH, Broadband, Insurance, etc.) */}
                  {![
                    'mobile',
                    'postpaid',
                    'electricity',
                    'gas',
                    'fastag',
                    'emi',
                    'rent',
                  ].includes(selectedBillType) && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Select Provider / Operator *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`Enter ${getModalTitle(selectedBillType)} Provider`}
                          value={formData.provider}
                          onChange={(e) => handleFieldChange('provider', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Consumer / Policy / Account ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter Consumer or Account ID"
                          value={formData.customerId}
                          onChange={(e) => handleFieldChange('customerId', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Payment Amount (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="₹ Enter amount"
                          value={formData.amount}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                        />
                      </div>
                    </>
                  )}

                  {/* PROCEED BUTTON -> Goes to Order Summary inside modal */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <span>Proceed to Pay</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ================= STEP 2: CONFIRM PAYMENT / ORDER SUMMARY ================= */}
            {billStep === 'confirm' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBillStep('input')}
                      className="p-1 -ml-1 text-slate-500 hover:text-black rounded-lg cursor-pointer"
                      title="Back to edit details"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h3 className="text-sm font-bold text-black">Confirm Payment</h3>
                      <p className="text-[10px] text-slate-500">Review bill details & select account</p>
                    </div>
                  </div>
                  <button
                    onClick={closeBillModal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Amount Highlight Card */}
                <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-[#DB0011]" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Total Payable Amount
                  </span>
                  <div className="text-2xl font-black text-black font-mono mt-0.5">
                    ₹{parseFloat(billSummary.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Service Category</span>
                    <strong className="text-black font-semibold text-right">{billSummary.title}</strong>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Biller Name</span>
                    <strong className="text-[#DB0011] font-bold text-right">{billSummary.biller}</strong>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Consumer / ID Number</span>
                    <span className="font-mono font-bold text-black text-right">{billSummary.identifier}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Convenience Fee</span>
                    <span className="text-emerald-700 font-bold text-right">₹0.00 (Free)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Bill Network</span>
                    <span className="text-slate-700 font-semibold text-right">Bharat BillPay (BBPS)</span>
                  </div>
                </div>

                {/* Pay From: Select Account Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pay from: Select Account *
                  </label>
                  <select
                    value={payFromAccount}
                    onChange={(e) => setPayFromAccount(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011] bg-white shadow-2xs"
                  >
                    <option value="HSBC Premier Savings - ••••2010">
                      HSBC Premier Savings - ••••2010 (Bal: ₹12,00,00,00,000.00)
                    </option>
                    <option value="HSBC Current Business Account - ••••8812">
                      HSBC Current Business - ••••8812 (Bal: ₹50,00,000.00)
                    </option>
                  </select>
                </div>

                {/* BBPS Assurance Notice */}
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant bill clearance backed by NPCI Bharat Bill Payment System.</span>
                </div>

                {/* Action Button: Pay */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleExecuteBillPay}
                    className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Pay ₹{parseFloat(billSummary.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </button>

                  <button
                    onClick={() => setBillStep('input')}
                    className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Back to Edit Details
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PROCESSING ANIMATION ================= */}
            {billStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-[#DB0011] animate-spin" />
                </div>
                <h4 className="text-base font-bold text-black">Processing Bill Payment...</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Connecting to {billSummary.biller} via Bharat BillPay gateway. Please do not close or refresh.
                </p>
              </div>
            )}

            {/* ================= STEP 4: FINAL SUCCESS SCREEN WITH REFERENCE NUMBER ================= */}
            {billStep === 'success' && (
              <div className="space-y-4 text-center">
                {/* Header close */}
                <div className="flex justify-end">
                  <button
                    onClick={closeBillModal}
                    className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Green Check Animation */}
                <div className="relative inline-flex mb-1">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-8 ring-emerald-100 animate-bounce">
                    <Check className="w-9 h-9 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-black">Bill Payment Successful</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your utility payment has been accepted and processed
                  </p>
                </div>

                {/* Amount Paid Card */}
                <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Amount Paid
                  </span>
                  <div className="text-3xl font-black text-black font-mono mt-0.5">
                    ₹{parseFloat(billSummary.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Receipt Details */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">BBPS Reference Number</span>
                    <strong className="text-black font-mono font-bold text-right text-[11px]">
                      {successDetails.referenceNumber}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Biller Name</span>
                    <strong className="text-slate-800 font-bold text-right">{billSummary.biller}</strong>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Consumer / Mobile ID</span>
                    <span className="font-mono font-bold text-black text-right">{billSummary.identifier}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Payment Source</span>
                    <span className="text-slate-700 font-medium text-right text-[11px]">{payFromAccount}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Date & Time</span>
                    <span className="text-slate-700 font-medium text-right text-[11px]">{successDetails.date}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Payment Status</span>
                    <span className="text-emerald-700 font-bold text-right">Cleared (Success)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={closeBillModal}
                    className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>Done</span>
                  </button>

                  <button
                    onClick={handleShareReceipt}
                    className="w-full h-10 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Share / Copy Receipt</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOW A: ADD PAYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-xl text-left border border-slate-200 animate-slide-up">
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
                  placeholder="Enter payee name"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account / Mobile / UPI *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Account number, Mobile, or UPI ID"
                  value={payeeIdentifier}
                  onChange={(e) => setPayeeIdentifier(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank / Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India, HDFC, HSBC"
                  value={payeeBank}
                  onChange={(e) => setPayeeBank(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
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

      {/* GLOBAL FREEZE POPUP (Universal standard: Account Frozen, Your account has been frozen...) */}
      <AccountFrozenModal
        isOpen={showFreezePopup}
        onClose={() => setShowFreezePopup(false)}
        onSupportClick={() => navigate('/profile')}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTabOverride="move-money" />
    </div>
  );
};

export default Screen3PeopleBills;
