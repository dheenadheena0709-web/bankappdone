import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  CreditCard,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import { useBank } from '../context/BankContext';

export const MoreGSTSummary: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount } = useBank();

  // Primary GSTIN & basic details stored with persistence
  const [gstNumber, setGstNumber] = useState<string>(() => {
    return localStorage.getItem('hsbc_gst_number') || '';
  });
  const [businessName, setBusinessName] = useState<string>(() => {
    return userAccount.holderName || userAccount.name || 'Sirajudeen Mohamed';
  });
  const [panNumber] = useState<string>(() => {
    return userAccount.panNumber || 'FUCPS1419A';
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempGst, setTempGst] = useState<string>(gstNumber);
  const [tempName, setTempName] = useState<string>(businessName);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(gstNumber);
    }
    setCopied(true);
    setToastMessage('GST Number copied to clipboard');
    setTimeout(() => {
      setCopied(false);
      setToastMessage(null);
    }, 2000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGst = tempGst.trim().toUpperCase();
    const cleanName = tempName.trim();
    if (!cleanGst) return;

    setGstNumber(cleanGst);
    setBusinessName(cleanName || userAccount.holderName);
    localStorage.setItem('hsbc_gst_number', cleanGst);
    localStorage.setItem('hsbc_business_name', cleanName || userAccount.holderName);
    setIsEditing(false);
    setToastMessage('GST details updated successfully');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 shadow-sm border-b dark:border-slate-800 transition-colors duration-200 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/more')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back to More"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">GST & Business Tax Summary</h1>
            <p className="text-xs text-white/80">Registered Business Tax Identification</p>
          </div>
        </div>
      </header>

      {/* Main Content - Minimal: Only GST number & essential identification */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {!gstNumber ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <ShieldCheck className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Personal Savings Account •••• 2010
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Account Holder: {userAccount.holderName || 'Sirajudeen Mohamed'}. A GSTIN is not mandatory for personal savings accounts. If you hold a registered trade GSTIN, you may link it below.
            </p>
            <button
              onClick={() => {
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-[#E30613] text-white text-xs font-bold rounded-xl hover:bg-[#C90410] active:scale-95 transition cursor-pointer shadow-xs"
            >
              Add / Link GSTIN
            </button>
          </div>
        ) : (
          <>
            {/* Active Verified Status Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">GST Registration Active</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Verified with GST Common Portal (GSTN)</p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>

        {/* GST Number Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Goods and Services Tax ID (GSTIN)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold font-mono tracking-wider text-white">
                  {gstNumber}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition text-slate-300 hover:text-white cursor-pointer"
                  title="Copy GST Number"
                  aria-label="Copy GST Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setTempGst(gstNumber);
                setTempName(businessName);
                setIsEditing(!isEditing);
              }}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveEdit} className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  GST Number (15 Digits)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={tempGst}
                  onChange={(e) => setTempGst(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg uppercase focus:outline-none focus:border-[#DB0011]"
                  placeholder="27AAACK1234M1Z5"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Business / Trade Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-[#DB0011]"
                  placeholder="Business Trade Name"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#DB0011] text-white rounded-lg hover:bg-[#B5000E] transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Essential Details list - ONLY GST and basic identifiers */}
          <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2.5 flex items-center justify-between first:pt-0">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Legal Business Name</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{businessName}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Linked PAN</span>
              </div>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">{panNumber}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Taxpayer Type</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Regular</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Registered State</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Maharashtra (State Code: 27)
              </span>
            </div>
          </div>
        </div>
      </>
    )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/more')}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#DB0011] dark:hover:text-red-400 transition cursor-pointer"
          >
            ← Back to More Services
          </button>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default MoreGSTSummary;
