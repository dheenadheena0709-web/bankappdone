import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  variant?: 'red' | 'white';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  textColor = 'text-white',
  variant = 'red',
  className = ''
}) => {
  const sizeMap = {
    sm: { symbol: 'w-7 h-5', text: 'text-sm font-extrabold', subText: 'text-[9px]' },
    md: { symbol: 'w-9 h-6', text: 'text-base font-black', subText: 'text-[10px]' },
    lg: { symbol: 'w-16 h-11', text: 'text-xl font-black', subText: 'text-xs' },
    xl: { symbol: 'w-24 h-16', text: 'text-3xl font-black', subText: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const redColor = '#DB0011';
  const whiteColor = '#FFFFFF';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Iconic HSBC Geometric Hexagon Emblem SVG */}
      <div className={`relative ${currentSize.symbol} shrink-0 drop-shadow-xs`}>
        <svg
          viewBox="0 0 100 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background white field if rendered in red theme */}
          {variant === 'white' && (
            <rect width="100" height="60" rx="4" fill="white" />
          )}

          {/* Left Red Triangle */}
          <polygon
            points="0,30 35,6 35,54"
            fill={redColor}
          />

          {/* Right Red Triangle */}
          <polygon
            points="100,30 65,6 65,54"
            fill={redColor}
          />

          {/* Top Red Triangle */}
          <polygon
            points="50,30 35,6 65,6"
            fill={redColor}
          />

          {/* Bottom Red Triangle */}
          <polygon
            points="50,30 35,54 65,54"
            fill={redColor}
          />

          {/* Left White Triangle (between top/bottom/left) */}
          <polygon
            points="50,30 35,6 35,54"
            fill={whiteColor}
          />

          {/* Right White Triangle (between top/bottom/right) */}
          <polygon
            points="50,30 65,6 65,54"
            fill={whiteColor}
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`tracking-wider uppercase font-black ${currentSize.text} ${textColor}`}>
            HSBC
          </span>
          <span className={`text-slate-400 font-semibold tracking-widest uppercase mt-0.5 ${currentSize.subText}`}>
            PERSONAL BANKING
          </span>
        </div>
      )}
    </div>
  );
};
