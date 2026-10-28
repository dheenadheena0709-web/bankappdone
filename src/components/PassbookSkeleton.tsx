import React from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';

export const PassbookSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] text-black animate-pulse">
      {/* Top Header Background: #DB0011 */}
      <div className="bg-[#DB0011] text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 -ml-1 text-white opacity-80">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div className="w-7 h-7 bg-white/20 rounded shadow-xs animate-shimmer" />
          <span className="text-xs font-bold tracking-tight">mPassbook Digital Ledger</span>
        </div>

        {/* Action button skeletons */}
        <div className="flex items-center gap-1.5 opacity-60">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 text-xs font-bold">
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/30 text-xs font-bold">
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="px-3 py-2 bg-slate-200 border-b border-slate-300 flex items-center justify-between text-xs">
        <div className="h-8 w-64 bg-white/70 rounded-md animate-shimmer" />
        <div className="w-24 h-4 bg-slate-300 rounded animate-shimmer" />
      </div>

      {/* Physical Passbook Container Skeleton */}
      <div className="flex-1 p-2 sm:p-3 overflow-y-auto no-scrollbar">
        <div className="w-full bg-[#fbfcfe] ledger-paper-lines shadow-md rounded-lg border border-slate-300 relative overflow-hidden font-ledger">
          {/* Authentic Bank Passbook Left Red Ruling Margin Line */}
          <div className="absolute left-1.5 top-0 bottom-0 ledger-margin-line pointer-events-none" />

          {/* PHYSICAL PASSBOOK HEADER SKELETON */}
          <div className="p-3 sm:p-4 border-b-2 border-slate-400 bg-white/95">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#DB0011]/30 rounded animate-shimmer" />
                <div className="space-y-1.5">
                  <div className="w-48 sm:w-64 h-4 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-32 h-2.5 rounded bg-slate-100 animate-shimmer" />
                </div>
              </div>

              {/* Stamp Badge skeleton */}
              <div className="w-36 h-5 rounded border border-[#DB0011]/40 bg-red-50/50 animate-shimmer rotate-[-2deg]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="w-16 h-2 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-24 h-3 rounded bg-slate-300 animate-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-slate-200/90 border-b-2 border-slate-400 px-4 py-2 flex items-center justify-between text-[10px] uppercase font-bold text-slate-600">
            <div className="w-24">Date & Time</div>
            <div className="flex-1 px-4">Particulars / Narration</div>
            <div className="w-24 text-right">Debit</div>
            <div className="w-28 text-right">Credit</div>
            <div className="w-28 text-right">Balance</div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="divide-y divide-dotted divide-blue-300 px-4 py-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                <div className="w-24 space-y-1 shrink-0">
                  <div className="w-16 h-2.5 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-12 h-2 rounded bg-slate-100 animate-shimmer" />
                </div>

                <div className="flex-1 px-2 space-y-1">
                  <div className="w-3/4 h-3 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-1/2 h-2 rounded bg-slate-100 animate-shimmer" />
                </div>

                <div className="w-20 text-right shrink-0">
                  <div className="w-12 h-2.5 ml-auto rounded bg-slate-100 animate-shimmer" />
                </div>

                <div className="w-24 text-right shrink-0">
                  <div className="w-16 h-3 ml-auto rounded bg-emerald-100 animate-shimmer" />
                </div>

                <div className="w-24 text-right shrink-0">
                  <div className="w-20 h-3 ml-auto rounded bg-slate-200 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>

          {/* Passbook Bottom Bookbinding */}
          <div className="p-4 bg-white/95 border-t-2 border-slate-300 flex items-center justify-between">
            <div className="w-48 h-2.5 rounded bg-slate-200 animate-shimmer" />
            <div className="w-36 h-3 rounded bg-slate-300 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
