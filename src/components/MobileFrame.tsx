import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full max-w-[480px] mx-auto relative min-h-screen min-h-[100dvh] bg-[#F5F5F5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 overflow-x-hidden sm:shadow-[0_0_40px_rgba(0,0,0,0.08)] sm:border-x sm:border-slate-200/70 dark:sm:border-slate-800/70">
      {children}
    </div>
  );
};
