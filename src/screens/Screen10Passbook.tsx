import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import { BrandLogo } from '../components/BrandLogo';
import { PassbookSkeleton } from '../components/PassbookSkeleton';
import {
  Printer,
  Download,
  ArrowLeft,
  Stamp,
  Search,
  CheckCheck
} from 'lucide-react';

export const Screen10Passbook: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, transactions } = useBank();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Elegant skeleton loading simulation for digital passbook ledger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.narration.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.date.includes(filterQuery) ||
      tx.refNo.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStatement = () => {
    const headers = ['Date', 'Particulars / Narration', 'Ref No', 'Withdrawal (DR)', 'Deposit (CR)', 'Balance'];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.narration}"`,
      t.refNo,
      t.withdrawal ? t.withdrawal.toFixed(2) : '',
      t.deposit ? t.deposit.toFixed(2) : '',
      t.balance.toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HSBC_Passbook_Statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  if (isLoading) {
    return <PassbookSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-black dark:text-white animate-fade-in pb-24 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Top Header Background: #DB0011 */}
      <div className="bg-[#DB0011] dark:bg-slate-900 text-white px-3 xs:px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-3 flex items-center justify-between shadow-sm border-b dark:border-slate-800 print:hidden transition-colors duration-200 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/home')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-0.5 bg-white rounded shadow-xs">
            <BrandLogo size="sm" variant="red" />
          </div>
          <span className="text-xs font-bold tracking-tight">mPassbook Digital Ledger</span>
        </div>

        {/* Print / Download Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-black hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer shadow-xs border dark:border-slate-700"
            title="Print Passbook"
          >
            <Printer className="w-3.5 h-3.5 text-[#DB0011] dark:text-red-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadStatement}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black text-white hover:bg-slate-800 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-1.5 print:hidden">
          <CheckCheck className="w-4 h-4" />
          <span>Statement CSV downloaded!</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="px-3 py-2 bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs print:hidden">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search particulars, date, ref..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 text-xs text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
          />
        </div>
        <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold ml-2">
          {filteredTransactions.length} Transactions
        </span>
      </div>

      {/* PHYSICAL PASSBOOK CONTAINER */}
      <div className="flex-1 p-2 sm:p-3 overflow-y-auto no-scrollbar">
        <div className="w-full bg-[#fbfcfe] dark:bg-slate-900 ledger-paper-lines shadow-md rounded-lg border border-slate-300 dark:border-slate-800 relative overflow-hidden font-ledger">
          {/* Authentic Bank Passbook Left Red Ruling Margin Line */}
          <div className="absolute left-1.5 top-0 bottom-0 ledger-margin-line pointer-events-none" />

          {/* PHYSICAL PASSBOOK HEADER */}
          <div className="p-3 sm:p-4 border-b-2 border-slate-400 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-0.5 bg-[#DB0011] rounded">
                  <BrandLogo size="sm" variant="red" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black tracking-tight text-black dark:text-white uppercase">
                    HSBC mPassbook | Acc: {userAccount.accountNumber || userAccount.accountNo || '002197782010'}
                  </h1>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">
                    Branch: {userAccount.branch || 'HSBC Fort Main Branch, Mumbai'} · IFSC: {userAccount.ifsc || 'HSBC0400002'}{(userAccount.micrCode || userAccount.micr) ? ` · MICR: ${userAccount.micrCode || userAccount.micr}` : ''}
                  </p>
                </div>
              </div>

              {/* Ink Stamp Badge in Blue/Red */}
              <div className="border border-[#DB0011] rounded px-2 py-0.5 text-[9px] text-[#DB0011] uppercase tracking-widest font-sans font-bold flex items-center gap-1 rotate-[-2deg]">
                <Stamp className="w-3 h-3 text-[#DB0011]" />
                <span>OFFICIAL DIGITAL LEDGER</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-sans text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[9px]">A/C HOLDER:</span>
                <strong className="text-black dark:text-white">{(userAccount.holderName || userAccount.name || 'Account Holder').toUpperCase()}</strong>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[9px]">A/C TYPE:</span>
                <span className="text-slate-800 dark:text-slate-200">{(userAccount.accountName || 'SAVINGS ACCOUNT - PREMIER').toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[9px]">LEDGER FOLIO:</span>
                <span className="font-mono">FOLIO #284-B</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 dark:text-slate-500 block text-[9px]">PRINT DATE:</span>
                <span className="font-mono font-bold">{transactions[0]?.date || '14/10/2026'}</span>
              </div>
            </div>
          </div>

          {/* AUTHENTIC PASSBOOK TABLE */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] leading-tight select-text">
              <thead>
                <tr className="bg-slate-200/90 dark:bg-slate-800 text-black dark:text-slate-200 border-b-2 border-slate-400 dark:border-slate-700 font-sans font-bold text-[10px] tracking-wider uppercase">
                  <th className="py-2 pl-4 pr-1 whitespace-nowrap w-24">Date & Time</th>
                  <th className="py-2 px-2 min-w-[160px]">Particulars / Narration</th>
                  <th className="py-2 px-2 text-right whitespace-nowrap text-[#DB0011] dark:text-red-400 w-28">
                    Withdrawal (Debit)
                  </th>
                  <th className="py-2 px-2 text-right whitespace-nowrap text-emerald-800 dark:text-emerald-400 w-32">
                    Deposit (Credit)
                  </th>
                  <th className="py-2 pl-2 pr-4 text-right whitespace-nowrap w-36 text-black dark:text-white">
                    Balance
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-dotted divide-blue-300 dark:divide-slate-700 font-mono">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors bg-emerald-50/30 dark:bg-emerald-950/20"
                  >
                    <td className="py-2 pl-4 pr-1 text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap text-[10px]">
                      <div>{tx.date}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">{tx.time || '10:30 AM'}</div>
                    </td>

                    <td className="py-2 px-2 text-black dark:text-white font-bold text-[10px] tracking-tight">
                      <div className="text-slate-900 dark:text-slate-100 font-extrabold" title={tx.narration}>
                        {tx.narration}
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                        <span>Ref: {tx.refNo}</span>
                        <span>·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{tx.transferMode || 'IMPS'} Success</span>
                      </div>
                    </td>

                    {/* Withdrawal (Debit in Red) */}
                    <td className="py-2 px-2 text-right font-extrabold text-[#DB0011] dark:text-red-400 whitespace-nowrap text-[11px]">
                      {tx.withdrawal !== null
                        ? `₹${tx.withdrawal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '-'}
                    </td>

                    {/* Deposit (Credit in Green) */}
                    <td className="py-2 px-2 text-right font-extrabold text-emerald-700 dark:text-emerald-400 whitespace-nowrap text-[11px]">
                      {tx.deposit !== null ? (
                        <span>+₹{tx.deposit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      ) : '-'}
                    </td>

                    {/* Balance */}
                    <td className="py-2 pl-2 pr-4 text-right font-extrabold text-black dark:text-white whitespace-nowrap text-[11px]">
                      <span>₹{tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Passbook Bottom Bookbinding & End of Entries */}
          <div className="p-4 bg-white/95 dark:bg-slate-900/95 border-t-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center">
            <div className="w-full flex justify-between items-end text-[9px] font-sans text-slate-500 dark:text-slate-400">
              <div>
                <span>Computer Generated Ledger · Official Bank Verification</span>
              </div>
              <div className="text-right">
                <span className="block font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                  Closing Balance: ₹{userAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                </span>
                <span>Page 01 of 01 · End of Entries ({filteredTransactions.length} Total)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3 bg-[#FFFFFF] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 print:hidden">
        <button
          onClick={() => navigate('/home')}
          className="flex-1 h-11 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-black dark:text-white font-bold text-xs rounded-lg transition cursor-pointer"
        >
          Return to Home
        </button>

        <button
          onClick={() => navigate('/transfer')}
          className="flex-1 h-11 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center"
        >
          <span>Transfer Money</span>
        </button>
      </div>
    </div>
  );
};
