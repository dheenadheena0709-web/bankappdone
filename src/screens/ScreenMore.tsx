import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useBank } from '../context/BankContext';
import {
  BookOpen,
  FileText,
  CreditCard,
  ShieldCheck,
  Globe2,
  HelpCircle,
  ChevronRight,
  Receipt,
  ScanLine,
  Sliders,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';

export const ScreenMore: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, darkMode, toggleDarkMode } = useBank();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const moreSections = [
    {
      category: 'Passbook & Records',
      items: [
        {
          id: 'passbook',
          title: 'Digital mPassbook Ledger',
          desc: 'Instant physical ledger, stamps & statements',
          icon: BookOpen,
          action: () => navigate('/mpassbook'),
          badge: 'Live',
        },
        {
          id: 'statements',
          title: 'Official e-Statements & Certificates',
          desc: 'Download October monthly statement & certificate',
          icon: FileText,
          action: () => navigate('/more/e-statements'),
          badge: 'Oct 2026',
        },
      ],
    },
    {
      category: 'Cards & Limits',
      items: [
        {
          id: 'cards',
          title: 'Kinetic Premier Debit & Virtual Cards',
          desc: 'Manage PIN, overseas usage, and contactless',
          icon: CreditCard,
          action: () => navigate('/more/cards'),
        },
        {
          id: 'limits',
          title: 'Daily Payment & UPI Limits',
          desc: 'Adjust IMPS, NEFT and RTGS daily allowances',
          icon: Sliders,
          action: () => navigate('/more/limits'),
        },
      ],
    },
    {
      category: 'Business & Tools',
      items: [
        {
          id: 'cheque',
          title: 'Scan & Deposit Cheque',
          desc: 'Instant clearing via optical character scan',
          icon: ScanLine,
          action: () => navigate('/more/cheque-scan'),
        },
        {
          id: 'tax',
          title: 'GST & Business Tax Summary',
          desc: 'Annual business turnover and input credit',
          icon: Receipt,
          action: () => navigate('/more/gst-summary'),
        },
        {
          id: 'forex',
          title: 'Global Forex & Live FX Rates',
          desc: 'Competitive rates across 25+ global currencies',
          icon: Globe2,
          action: () => navigate('/pay-and-transfer'),
        },
      ],
    },
    {
      category: 'Security & Preferences',
      items: [
        {
          id: 'security',
          title: 'Digital Secure Key & Biometrics',
          desc: 'High-security OTP generation & Face ID login',
          icon: ShieldCheck,
          action: () => navigate('/secure-key'),
          badge: 'Active',
        },
        {
          id: 'support',
          title: 'Dedicated Premier Relationship Manager',
          desc: '24/7 priority kinetic concierge line',
          icon: HelpCircle,
          action: () => navigate('/profile'),
        },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Header Background: #DB0011 */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 shadow-sm border-b dark:border-slate-800 transition-colors duration-200 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" className="brightness-0 invert" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              HSBC Kinetic
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-white" />}
            </button>
            <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Premier More
            </span>
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mt-1">
          More Banking Services
        </h1>
        <p className="text-xs text-white/80 mt-0.5">
          Account: {userAccount.accountNumber} • {userAccount.holderName}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-5">
        {moreSections.map((sec) => (
          <div key={sec.category} className="space-y-1.5">
            <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              {sec.category}
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-[#DB0011] dark:group-hover:text-red-400 group-hover:bg-[#FFF5F6] dark:group-hover:bg-slate-800/90 transition-colors">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#DB0011] dark:group-hover:text-red-400 transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default ScreenMore;
