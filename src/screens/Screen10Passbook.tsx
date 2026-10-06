import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import { BrandLogo } from '../components/BrandLogo';
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

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] text-black">
      {/* Top Header Background: #DB0011 */}
      <div className="bg-[#DB0011] text-white px-4 py-3 flex items-center justify-between shadow-sm print:hidden">
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-black hover:bg-slate-100 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Print Passbook"
          >
            <Printer className="w-3.5 h-3.5 text-[#DB0011]" />
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
      <div className="px-3 py-2 bg-slate-200 border-b border-slate-300 flex items-center justify-between text-xs print:hidden">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search particulars, date, ref..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-2 bg-white rounded-md border border-slate-300 text-xs text-black placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#DB0011]"
          />
        </div>
        <span className="text-[11px] font-mono text-slate-700 font-bold ml-2">
          {filteredTransactions.length} Transactions
        </span>
      </div>

      {/* PHYSICAL PASSBOOK CONTAINER:
          - Looks like physical passbook, NOT card list
          - NO big Account Balance summary box at top
          - Background: White paper with light blue ruled lines
          - Header: Dheena Bank mPassbook | Acc: DB-XXXX-XXXX-1234
          - Table: Date | Particulars / Narration | Withdrawal (Debit in Red) | Deposit (Credit in Green) | Balance
          - 20 dummy transactions with dotted separator lines
          - Footer watermark: "This is a fictional UI for educational purpose only"
      */}
      <div className="flex-1 p-2 sm:p-3 overflow-y-auto no-scrollbar">
        <div className="w-full bg-[#fbfcfe] ledger-paper-lines shadow-md rounded-lg border border-slate-300 relative overflow-hidden font-ledger">
          {/* Authentic Bank Passbook Left Red Ruling Margin Line */}
          <div className="absolute left-1.5 top-0 bottom-0 ledger-margin-line pointer-events-none" />

          {/* PHYSICAL PASSBOOK HEADER */}
          <div className="p-3 sm:p-4 border-b-2 border-slate-400 bg-white/95">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-0.5 bg-[#DB0011] rounded">
                  <BrandLogo size="sm" variant="red" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black tracking-tight text-black uppercase">
                    HSBC mPassbook | Acc: {userAccount.accountNumber}
                  </h1>
                  <p className="text-[10px] text-slate-600 font-sans font-medium">
                    Branch: {userAccount.branch} · IFSC: {userAccount.ifsc}
                  </p>
                </div>
              </div>

              {/* Ink Stamp Badge in Blue/Red */}
              <div className="border border-[#DB0011] rounded px-2 py-0.5 text-[9px] text-[#DB0011] uppercase tracking-widest font-sans font-bold flex items-center gap-1 rotate-[-2deg]">
                <Stamp className="w-3 h-3 text-[#DB0011]" />
                <span>OFFICIAL DIGITAL LEDGER</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-sans text-slate-700">
              <div>
                <span className="text-slate-400 block text-[9px]">A/C HOLDER:</span>
                <strong className="text-black">{userAccount.holderName.toUpperCase()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">A/C TYPE:</span>
                <span>{userAccount.accountType.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">LEDGER FOLIO:</span>
                <span className="font-mono">FOLIO #284-B</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[9px]">PRINT DATE:</span>
                <span className="font-mono font-bold">23/10/2026</span>
              </div>
            </div>
          </div>

          {/* AUTHENTIC PASSBOOK TABLE (SINGLE TRANSACTION) */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] leading-tight select-text">
              <thead>
                <tr className="bg-slate-200/90 text-black border-b-2 border-slate-400 font-sans font-bold text-[10px] tracking-wider uppercase">
                  <th className="py-2 pl-4 pr-1 whitespace-nowrap w-24">Date & Time</th>
                  <th className="py-2 px-2 min-w-[160px]">Particulars / Narration</th>
                  <th className="py-2 px-2 text-right whitespace-nowrap text-[#DB0011] w-24">
                    Withdrawal (Debit)
                  </th>
                  <th className="py-2 px-2 text-right whitespace-nowrap text-emerald-800 w-32">
                    Deposit (Credit)
                  </th>
                  <th className="py-2 pl-2 pr-4 text-right whitespace-nowrap w-32 text-black">
                    Balance
                  </th>
                </tr>
              </thead>

              {/* Table Body with single transaction */}
              <tbody className="divide-y divide-dotted divide-blue-300 font-mono">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/50 transition-colors bg-emerald-50/30"
                  >
                    <td className="py-2 pl-4 pr-1 text-slate-700 font-bold whitespace-nowrap text-[10px]">
                      <div>{tx.date}</div>
                      <div className="text-[9px] text-slate-500 font-normal">{tx.time || '11:43 AM'}</div>
                    </td>

                    <td className="py-2 px-2 text-black font-bold text-[10px] tracking-tight">
                      <div className="text-slate-900 font-extrabold" title={tx.narration}>
                        {tx.narration}
                      </div>
                      <div className="text-[9px] text-slate-500 font-normal mt-0.5 flex items-center gap-1">
                        <span>Ref: {tx.refNo}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-bold">SWIFT Success</span>
                      </div>
                    </td>

                    {/* Withdrawal (Debit in Red) */}
                    <td className="py-2 px-2 text-right font-extrabold text-[#DB0011] whitespace-nowrap text-[11px]">
                      {tx.withdrawal !== null
                        ? `₹${tx.withdrawal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '-'}
                    </td>

                    {/* Deposit (Credit in Green) */}
                    <td className="py-2 px-2 text-right font-extrabold text-emerald-700 whitespace-nowrap text-[11px]">
                      {tx.deposit !== null ? (
                        <span>+{Math.round(tx.deposit)}</span>
                      ) : '-'}
                    </td>

                    {/* Balance */}
                    <td className="py-2 pl-2 pr-4 text-right font-extrabold text-black whitespace-nowrap text-[11px]">
                      <span>{Math.round(tx.balance)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Passbook Bottom Bookbinding & End of Entries */}
          <div className="p-4 bg-white/95 border-t-2 border-slate-300 flex flex-col items-center justify-center text-center">
            <div className="w-full flex justify-between items-end text-[9px] font-sans text-slate-500">
              <div>
                <span>Computer Generated Ledger · Official Bank Verification</span>
              </div>
              <div className="text-right">
                <span className="block font-mono font-bold text-slate-900 text-xs">Closing Balance: {Math.round(userAccount.balance)} INR</span>
                <span>Page 01 of 01 · End of Entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3 bg-[#FFFFFF] border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
        <button
          onClick={() => navigate('/home')}
          className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-black font-bold text-xs rounded-lg transition cursor-pointer"
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
