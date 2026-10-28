import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Screen0Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0A3D62] text-white select-none">
      {/* Background Image: Dal Lake Srinagar, Kashmir with Shikara boat and snow mountains */}
      <div className="absolute inset-0 z-0">
        <img
          src="/kashmir_dal_lake.jpg"
          alt="Dal Lake Kashmir with Shikara boat and snow-capped Himalayas"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_32%] scale-100"
        />
        {/* Subtle atmospheric tint matching authentic HSBC India splash gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b4877]/25 via-transparent to-[#022b4d]/55 pointer-events-none" />
      </div>

      {/* Top Left: Welcome to HSBC India */}
      <div className="relative z-10 pt-[max(2rem,env(safe-area-inset-top,0px))] px-5 xs:px-6 sm:px-7">
        <h1 className="text-[24px] xs:text-[26px] sm:text-[30px] font-normal text-white tracking-normal leading-[1.25] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          Welcome to
          <span className="block font-normal mt-0.5">HSBC India</span>
        </h1>
      </div>

      {/* Center: Iconic HSBC Red Hexagon Logo */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 my-auto">
        <div className="w-44 xs:w-52 sm:w-60 max-w-[75vw] aspect-[100/60] relative drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.02]">
          <svg
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label="HSBC Logo"
          >
            {/* Left Red Triangle (pointing left) */}
            <polygon points="0,30 35,6 35,54" fill="#E30613" />

            {/* Right Red Triangle (pointing right) */}
            <polygon points="100,30 65,6 65,54" fill="#E30613" />

            {/* Top Red Triangle (pointing down) */}
            <polygon points="50,30 35,6 65,6" fill="#E30613" />

            {/* Bottom Red Triangle (pointing up) */}
            <polygon points="50,30 35,54 65,54" fill="#E30613" />

            {/* Left White Triangle */}
            <polygon points="50,30 35,6 35,54" fill="#FFFFFF" />

            {/* Right White Triangle */}
            <polygon points="50,30 65,6 65,54" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Bottom Section: Prompt Text & 2 White Action Buttons */}
      <div className="relative z-10 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))] px-5 xs:px-6 sm:px-7">
        {/* Label: Already bank with us in India? */}
        <p className="text-[14.5px] xs:text-[15.5px] sm:text-base font-normal text-white mb-3.5 tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
          Already bank with us in India?
        </p>

        {/* Buttons Stack */}
        <div className="flex flex-col gap-2.5">
          {/* Button 1: Not yet, open a new account */}
          <button
            onClick={() => setShowOpenAccountModal(true)}
            className="w-full min-h-[46px] sm:h-12 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 text-[13px] xs:text-[13.5px] sm:text-sm font-semibold rounded-[3px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition cursor-pointer px-3"
          >
            <span>Not yet, open a new account</span>
          </button>

          {/* Button 2: Yes, log on or register */}
          <button
            onClick={() => navigate('/login')}
            className="w-full min-h-[46px] sm:h-12 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 text-[13px] xs:text-[13.5px] sm:text-sm font-semibold rounded-[3px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition cursor-pointer px-3"
          >
            <span>Yes, log on or register</span>
          </button>
        </div>
      </div>

      {/* Authentic "Open a New Account" Modal */}
      {showOpenAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-5 xs:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0">
                  <svg viewBox="0 0 100 60" fill="none" className="w-full h-full">
                    <polygon points="0,30 35,6 35,54" fill="#E30613" />
                    <polygon points="100,30 65,6 65,54" fill="#E30613" />
                    <polygon points="50,30 35,6 65,6" fill="#E30613" />
                    <polygon points="50,30 35,54 65,54" fill="#E30613" />
                    <polygon points="50,30 35,6 35,54" fill="#1B1B1B" />
                    <polygon points="50,30 65,6 65,54" fill="#1B1B1B" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Open an HSBC Account
                </h3>
              </div>
              <button
                onClick={() => setShowOpenAccountModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl">
                <div className="flex items-center gap-1.5 text-[#E30613] dark:text-red-400 font-bold text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HSBC Premier Banking</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enjoy dedicated relationship management, global recognition across 29 countries, and exclusive wealth solutions.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Digital onboarding with Video KYC using Aadhaar & PAN</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Complimentary Premier Platinum debit card with zero forex markup</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Instant access to Digital Secure Key & NetBanking</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => {
                  setShowOpenAccountModal(false);
                  navigate('/login');
                }}
                className="w-full h-11 bg-[#E30613] hover:bg-[#c70510] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Continue to Sign In / Demo Account</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowOpenAccountModal(false)}
                className="w-full h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screen0Welcome;

