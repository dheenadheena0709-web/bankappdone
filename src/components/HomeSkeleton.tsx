import React from 'react';
import { AccountCardSkeletonOverlay } from './AccountCardSkeletonOverlay';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F8F9FA] min-h-screen min-h-[100dvh] text-slate-900 pb-28 animate-pulse w-full max-w-full overflow-x-hidden">
      {/* Top Header & Account Card Skeleton */}
      <header className="bg-gradient-to-b from-[#E30613] via-[#D80512] to-[#C90410] text-white pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-6 shadow-[0_8px_30px_rgba(227,6,19,0.22)] relative overflow-hidden w-full">
        {/* Subtle decorative glows */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-48 h-48 bg-black/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 animate-shimmer" />
            <div className="space-y-1.5">
              <div className="w-24 h-3 rounded-md bg-white/30 animate-shimmer" />
              <div className="w-36 h-4.5 rounded-md bg-white/40 animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 animate-shimmer" />
            <div className="w-8 h-8 rounded-full bg-white/20 animate-shimmer" />
          </div>
        </div>

        {/* Account Overview Card Skeleton (Luxury Maroon) */}
        <div className="relative overflow-hidden rounded-[24px] p-4.5 xs:p-5 bg-gradient-to-br from-[#2D0206] via-[#1B0104] to-[#0A0002] border border-[#D4AF37]/50 shadow-[0_18px_45px_-12px_rgba(227,6,19,0.4),0_8px_24px_rgba(0,0,0,0.65)] text-white animate-shimmer-dark mx-3 xs:mx-4">
          {/* Skeleton loading overlay with animate-shimmer-dark */}
          <AccountCardSkeletonOverlay isLoading={true} />
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-28 h-3.5 rounded-md bg-white/20 animate-shimmer-dark" />
                <div className="w-14 h-4 rounded-full bg-emerald-500/20" />
              </div>
              <div className="w-40 h-3 rounded-md bg-white/15 animate-shimmer-dark" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 rounded-md bg-amber-500/30" />
              <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Balance Block */}
          <div className="mt-5 space-y-1.5">
            <div className="w-32 h-2.5 rounded bg-white/20 animate-shimmer-dark" />
            <div className="w-56 h-8 rounded-lg bg-white/25 animate-shimmer-dark" />
          </div>

          {/* Card Bottom Row */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="w-32 h-3 rounded bg-white/20 animate-shimmer-dark" />
            <div className="w-16 h-3 rounded bg-amber-400/20 animate-shimmer-dark" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 px-4 py-4 space-y-4 w-full">
        {/* 5 Quick Action Buttons Skeleton */}
        <section aria-label="Quick Actions Loading" className="w-full">
          <div className="grid grid-cols-5 gap-1 xs:gap-2 text-center w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 w-full min-w-0">
                <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-[14px] xs:rounded-[16px] bg-[#FFF5F6] border border-[#FAD2D5]/70 flex items-center justify-center animate-shimmer">
                  <div className="w-5 h-5 rounded-lg bg-red-200/50" />
                </div>
                <div className="w-8 xs:w-10 h-2.5 rounded bg-slate-200 animate-shimmer" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent Transactions Card Skeleton */}
        <section className="bg-white rounded-[20px] p-4.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100/90 overflow-hidden space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50" />
              <div className="w-32 h-3.5 rounded bg-slate-200 animate-shimmer" />
            </div>
            <div className="w-20 h-4 rounded-full bg-slate-100 animate-shimmer" />
          </div>

          <div className="divide-y divide-slate-100/90">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-3.5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/60 shrink-0 animate-shimmer" />
                  <div className="space-y-2">
                    <div className="w-36 h-4 rounded bg-slate-200 animate-shimmer" />
                    <div className="w-24 h-3 rounded bg-slate-100 animate-shimmer" />
                    <div className="w-28 h-2.5 rounded bg-slate-100 animate-shimmer" />
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <div className="w-20 h-4 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-12 h-3 rounded bg-emerald-100 animate-shimmer" />
                  <div className="w-16 h-2.5 rounded bg-slate-100 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banking Services Menu Skeleton */}
        <section className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100/90 overflow-hidden divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 animate-shimmer" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3.5 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-32 h-2.5 rounded bg-slate-100 animate-shimmer" />
                </div>
              </div>
              <div className="w-16 h-4 rounded bg-slate-100 animate-shimmer" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
