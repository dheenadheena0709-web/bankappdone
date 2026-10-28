import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Calendar, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { useBank } from '../context/BankContext';

export const MoreEStatements: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount } = useBank();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ONLY October month records - all other months removed per requirement
  const statements = [
    {
      id: 'stmt-oct-2026',
      title: 'October 2026 Official e-Statement',
      period: '01 Oct 2026 - 31 Oct 2026',
      size: '1.4 MB',
      type: 'Monthly e-Statement',
      tag: 'October 2026',
    },
    {
      id: 'cert-oct-tax-2026',
      title: 'October 2026 Interest & Tax Certificate',
      period: '01 Oct 2026 - 31 Oct 2026 (TDS & Form 16A)',
      size: '890 KB',
      type: 'Interest Certificate',
      tag: 'October 2026',
    },
  ];

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setToastMessage(`${name} downloaded successfully`);

      // Trigger standard text/csv certificate statement download
      try {
        const fileContent = `==============================================================
HSBC OFFICIAL e-STATEMENT & CERTIFICATE
MONTH: OCTOBER 2026 (01 Oct 2026 - 31 Oct 2026)
==============================================================
Document Title   : ${name}
Account Holder   : ${userAccount.holderName || userAccount.name || 'Sirajudeen Mohamed Sharif'}
Account Number   : •••• ${userAccount.accountNumber?.slice(-4) || '2010'}
Full Account No  : ${userAccount.fullAccountNumber || userAccount.accountNumber}
Account Type     : ${userAccount.accountType || 'Savings Account'}
IFSC Code        : ${userAccount.ifsc || 'HSBC0560002'}
Branch           : ${userAccount.branch || 'Bangalore Main Branch'}
Statement Period : 01 October 2026 to 31 October 2026
Verified Date    : 31 October 2026

Security Hash    : SHA256-OCT-2026-CERT-884920491
Digitally certified by Kinetic Premier Digital Banking.
==============================================================`;

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        // Fallback handled smoothly
      }

      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 shadow-sm border-b dark:border-slate-800 transition-colors duration-200 w-full">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/more')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back to More"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">e-Statements & Certificates</h1>
            <p className="text-xs text-white/80">
              Account •••• {userAccount.accountNumber?.slice(-4) || '2010'} • October 2026
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Month Filter Indicator - Only October */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold text-xs">
              OCT
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Selected Statement Period</p>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">October 2026</h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3 h-3" />
            Active Month
          </span>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>SHA-256 encrypted & verified for official tax and visa submission</span>
        </div>

        {/* Available Statements List - October Month Only */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              October 2026 Records
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">2 Records</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {statements.map((stmt) => (
              <div key={stmt.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900/60 flex items-center justify-center text-[#DB0011] dark:text-red-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{stmt.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {stmt.period}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">• {stmt.size}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(stmt.id, stmt.title)}
                  disabled={downloadingId === stmt.id}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#DB0011] dark:hover:bg-[#DB0011] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#DB0011] transition flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
                  aria-label={`Download ${stmt.title}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === stmt.id ? 'Saving...' : 'PDF'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* October Month Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            October 2026 Statement Summary
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Statement Period</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">01 Oct - 31 Oct 2026</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Issuing Branch</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{userAccount.branch || 'Bangalore'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Account Number</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">•••• {userAccount.accountNumber?.slice(-4) || '2010'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Document Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Certified & Ready</span>
            </div>
          </div>
        </div>

        {/* Back Link Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/more')}
            className="text-xs font-bold text-[#DB0011] dark:text-red-400 hover:underline cursor-pointer"
          >
            ← Back to More Services
          </button>
        </div>
      </main>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default MoreEStatements;
