import React from 'react';

interface AccountCardSkeletonOverlayProps {
  isLoading: boolean;
  className?: string;
}

/**
 * Skeleton loading overlay with 'animate-shimmer-dark' effect
 * Designed for luxury dark maroon HSBC Premier / Kinetic account overview cards.
 * Provides a high-fidelity visual preview during initial data loading.
 */
export const AccountCardSkeletonOverlay: React.FC<AccountCardSkeletonOverlayProps> = ({
  isLoading,
  className = '',
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`absolute inset-0 z-30 rounded-[24px] bg-gradient-to-br from-[#2D0206] via-[#1B0104] to-[#0A0002] border border-[#D4AF37]/50 shadow-[0_18px_45px_-12px_rgba(227,6,19,0.4),0_8px_24px_rgba(0,0,0,0.65)] p-5 flex flex-col justify-between animate-shimmer-dark pointer-events-none select-none transition-opacity duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Full-card dark shimmer overlay sweep */}
      <div className="absolute inset-0 animate-shimmer-dark pointer-events-none z-10" />

      {/* Glossy specular atmospheric overlay matching live card */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#E30613]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row Skeleton */}
      <div className="relative z-20 flex items-start justify-between">
        <div className="space-y-2">
          {/* Account Name Badge Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-36 h-3.5 rounded-md bg-white/20 animate-shimmer-dark" />
            <div className="w-14 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 animate-pulse" />
          </div>
          {/* Account Number Skeleton */}
          <div className="w-40 h-3 rounded-md bg-white/15 animate-shimmer-dark" />
        </div>

        {/* EMV Chip & Action Button Skeleton */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-6 rounded-md bg-gradient-to-br from-[#E6C665]/40 via-[#C9A237]/40 to-[#8C6D1F]/40 border border-[#FFE58F]/30 animate-shimmer-dark" />
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 animate-shimmer-dark" />
        </div>
      </div>

      {/* Available Balance Section Skeleton */}
      <div className="relative z-20 mt-4 space-y-2">
        <div className="w-36 h-2.5 rounded bg-white/20 animate-shimmer-dark" />
        <div className="w-64 h-8 rounded-lg bg-white/25 animate-shimmer-dark" />
      </div>

      {/* Bottom Row Skeleton */}
      <div className="relative z-20 mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="w-40 h-3 rounded bg-white/20 animate-shimmer-dark" />
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#FFE58F]/20 animate-shimmer-dark" />
          <div className="w-14 h-3 rounded bg-[#FFE58F]/30 animate-shimmer-dark" />
        </div>
      </div>
    </div>
  );
};
