import React from 'react';

interface LuxuryBalanceShimmerProps {
  amount: number | string;
  currency?: string;
  size?: 'lg' | 'md' | 'sm';
  className?: string;
  isMasked?: boolean;
}

export const LuxuryBalanceShimmer: React.FC<LuxuryBalanceShimmerProps> = ({
  amount,
  currency = 'INR',
  size = 'lg',
  className,
  isMasked = false,
}) => {
  const formattedAmount =
    typeof amount === 'number'
      ? (amount % 1 !== 0
          ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : amount.toLocaleString('en-IN'))
      : amount;

  const textClasses = className
    ? className
    : size === 'lg'
    ? 'text-[19px] xs:text-[22px] sm:text-[26px] tracking-tight'
    : size === 'md'
    ? 'text-lg xs:text-xl sm:text-2xl tracking-tight'
    : 'text-base xs:text-lg sm:text-xl tracking-tight';

  return (
    <div className="relative inline-flex items-baseline gap-1.5 xs:gap-2 select-none group max-w-full flex-wrap xs:flex-nowrap">
      {/* Container with overflow hidden for the luxury diagonal light sweep */}
      <div className="relative inline-block overflow-hidden rounded-md py-0.5">
        {isMasked ? (
          <span className={`${textClasses} font-bold font-mono text-white/90 leading-none`}>
            ••••••••••••••••
          </span>
        ) : (
          <div className="relative">
            {/* Base crisp text */}
            <span
              className={`${textClasses} font-bold font-mono leading-none text-white drop-shadow-[0_2px_12px_rgba(255,223,115,0.18)] block`}
            >
              {formattedAmount}
            </span>

            {/* Diagonal White-Gold Light Sweep Layer (1.2s duration, repeating every 3s) */}
            <div
              className="absolute inset-0 pointer-events-none luxury-sweep-layer"
              aria-hidden="true"
            >
              {/* Sweeping diagonal light beam */}
              <div className="absolute inset-0 luxury-beam" />
            </div>

            {/* Trailing Sparkle Particles that pulse in sync with the sweep */}
            <div
              className="absolute inset-0 pointer-events-none luxury-sparkle-container"
              aria-hidden="true"
            >
              {/* Sparkle 1: Top-Left early glint */}
              <span className="absolute -top-1 left-[18%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#FFE58F] sparkle-particle sparkle-1" />
              {/* Sparkle 2: Center-Right gold glint */}
              <span className="absolute top-2 left-[58%] w-2 h-2 rounded-full bg-[#FFE58F] shadow-[0_0_10px_#FFDF73] sparkle-particle sparkle-2" />
              {/* Sparkle 3: Bottom trailing star */}
              <span className="absolute bottom-0 left-[82%] w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#FFF] sparkle-particle sparkle-3" />
            </div>
          </div>
        )}
      </div>

      {currency && (
        <span
          className={`font-bold uppercase tracking-wider text-[#FFE58F] drop-shadow-xs ${
            size === 'lg' ? 'text-xs' : 'text-[11px]'
          }`}
        >
          {currency}
        </span>
      )}
    </div>
  );
};
