import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { ShieldCheck, Check, ChevronRight, Lock } from 'lucide-react';

export const Screen1SecureKey: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-950 min-h-screen min-h-[100dvh] px-4 xs:px-5 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Top Brand Marker */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <BrandLogo size="sm" showText={true} textColor="text-black dark:text-white" variant="red" />
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step 1 of 1</span>
      </div>

      {/* Main Content */}
      <div className="my-auto flex flex-col items-center text-center">
        {/* Illustration: Phone with PIN dots & lock icon */}
        <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-50 dark:bg-red-950/40 -z-10 scale-110" />

          {/* Stylized Phone Illustration */}
          <div className="w-28 h-38 bg-white dark:bg-slate-900 rounded-2xl border-4 border-black dark:border-slate-700 shadow-xl flex flex-col items-center justify-between p-2 relative">
            <div className="w-8 h-1 bg-slate-400 rounded-full mb-1" />

            {/* Inner Phone Screen */}
            <div className="w-full flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-2 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#DB0011] text-white flex items-center justify-center mb-2 shadow-xs">
                <Lock className="w-4 h-4" />
              </div>

              {/* 6 PIN Dots */}
              <div className="flex gap-1.5 justify-center mb-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-black dark:bg-white"
                  />
                ))}
              </div>

              <span className="text-[7px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                SECURE KEY
              </span>
            </div>

            <div className="w-6 h-0.5 bg-slate-400 rounded-full mt-1" />
          </div>

          {/* Floating shield badge */}
          <div className="absolute -bottom-1 -right-1 bg-[#DB0011] text-white p-2 rounded-full shadow-md border-2 border-white dark:border-slate-900">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Title: Introducing the Digital Secure Key on your phone. */}
        <h1 className="text-xl font-bold text-black dark:text-white tracking-tight text-center leading-snug">
          Introducing the Digital Secure Key on your phone.
        </h1>

        {/* Description about 6-digit PIN security */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 text-center leading-relaxed max-w-xs">
          Your phone is now your security device. Generate single-use authorization codes instantly to log on and transfer funds.
        </p>

        {/* Key Features List */}
        <div className="mt-5 w-full space-y-2 text-left bg-[#F5F5F5] dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
            <span className="p-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-[#DB0011] dark:text-red-400 mt-0.5 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span>Protected by your private 6-digit PIN or Touch ID / Face ID</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
            <span className="p-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-[#DB0011] dark:text-red-400 mt-0.5 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span>Generates codes offline even without cellular reception</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
            <span className="p-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-[#DB0011] dark:text-red-400 mt-0.5 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span>Authorizes instant transfers and bill payments safely</span>
          </div>
        </div>
      </div>

      {/* Button: "Continue" -> Go to Home in #DB0011 */}
      <div className="pt-3">
        <button
          onClick={() => navigate('/home')}
          className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
