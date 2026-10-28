import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { useBank } from '../context/BankContext';
import {
  ArrowLeft,
  User,
  Phone,
  Briefcase,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  LogOut,
  X,
  Globe,
  Check,
  CheckCircle2,
  Settings,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  native: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en-IN', name: 'English (India)', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const Screen9Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, currentUser, setCurrentUser, users, setIsLoggedIn, darkMode, toggleDarkMode } = useBank();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-IN');
  const [langToast, setLangToast] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-passbook');

  const toggleInlineFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLanguage(lang.code);
    setActiveModal(null);
    setLangToast(`Language updated to ${lang.name} (${lang.native})`);
    setTimeout(() => setLangToast(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Background: #DB0011 */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-3 pb-4 shadow-sm border-b dark:border-slate-800 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/home')}
              className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">My details & Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg bg-black/15 hover:bg-black/25 text-white transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-white/90 hover:text-white bg-black/15 px-2.5 py-1 rounded-md transition cursor-pointer font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Language toast */}
      {langToast && (
        <div className="mx-4 mt-3 p-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{langToast}</span>
        </div>
      )}

      {/* Main List */}
      <main className="flex-1 px-4 py-3 space-y-3.5">
        {/* Profile Card - Single Savings Account */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#DB0011] text-white flex items-center justify-center text-sm font-black shadow-md">
                {(userAccount.holderName || userAccount.name || 'Account Holder')
                  .split(' ')
                  .filter(Boolean)
                  .map((w: string) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'HB'}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {userAccount.holderName || userAccount.name || 'Sirajudeen Mohamed Sharif'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  A/C: {userAccount.accountNumber || userAccount.accountNo || '002197782010'}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              Premier Active
            </span>
          </div>

          {/* Quick Details Grid: Phone, Email, PAN */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px]">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Mobile / Phone</span>
              <strong className="font-mono block text-[9.5px] leading-tight text-slate-900 dark:text-slate-100 font-bold tracking-tight">
                {userAccount.phone || userAccount.mobile || '+91 96775 13691'}
              </strong>
            </div>

            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Email</span>
              <strong className="text-slate-900 dark:text-slate-100 truncate block text-[10px]">
                {userAccount.email || 'Not provided'}
              </strong>
            </div>

            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">PAN Number</span>
              <strong className="font-mono text-slate-900 dark:text-slate-100 truncate block">
                {userAccount.panNumber || userAccount.panNo || 'FUCPS1419A'}
              </strong>
            </div>
          </div>
        </div>

        {/* Personal & Account Details */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* 1. Personal details (ID and tax residency) > */}
          <button
            onClick={() => setActiveModal('personal')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Personal details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">ID and tax residency</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 2. Contact details (Phone, email) > */}
          <button
            onClick={() => setActiveModal('contact')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Contact details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Phone, email
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 3. Employment details (Address, Income) > */}
          <button
            onClick={() => setActiveModal('employment')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Employment details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Address, Income</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 4. KYC Declaration (Re-submit) > */}
          <button
            onClick={() => setActiveModal('kyc')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  KYC Declaration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Re-submit declaration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                Active
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        </div>

        {/* SETTINGS & APP PREFERENCES (Language Selector, Dark Theme, Tools) */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div className="px-3.5 py-2 bg-slate-50/70 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
              Settings & Preferences
            </h4>
          </div>

          {/* Theme Switcher Toggle */}
          <div className="w-full p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white">
                  Dark Mode Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {darkMode ? 'Dark Theme (Slate 900)' : 'Light Theme'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                darkMode ? 'bg-[#DB0011]' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={darkMode}
              aria-label="Toggle Dark Mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-xs ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language Selector inside settings menu */}
          <button
            onClick={() => setActiveModal('language')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  App Language
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentLangObj.name} ({currentLangObj.native})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {currentLangObj.native}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* Help & FAQs Menu Item */}
          <button
            onClick={() => navigate('/profile/faq')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400">
                  Help & FAQs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Guides, search & common questions</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                13 Guides
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        </div>

        {/* FAQ & HELP ACCORDION (Expandable questions right in Profile) */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center font-bold">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px]">
                  Common Questions & Help
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Tap to expand and learn how to navigate the app</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/faq')}
              className="text-xs font-bold text-[#DB0011] dark:text-red-400 hover:underline cursor-pointer"
            >
              See all &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Question 1: mPassbook */}
            <div className="p-3">
              <button
                onClick={() => toggleInlineFaq('faq-passbook')}
                className="w-full flex items-center justify-between text-left gap-2 cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#DB0011] dark:group-hover:text-red-400 transition">
                  How do I view my digital mPassbook ledger?
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    expandedFaqId === 'faq-passbook' ? 'rotate-180 text-[#DB0011] dark:text-red-400' : ''
                  }`}
                />
              </button>
              {expandedFaqId === 'faq-passbook' && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 animate-fade-in space-y-1.5">
                  <p>
                    Go to the <strong>More</strong> tab from the bottom navigation bar and select <strong>Digital mPassbook Ledger</strong>. You can inspect your transaction narration, debits, credits, and live balance formatted just like a real bank passbook.
                  </p>
                  <button
                    onClick={() => navigate('/mpassbook')}
                    className="text-[11px] font-bold text-[#DB0011] dark:text-red-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Open mPassbook</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              )}
            </div>

            {/* Question 2: Transfers & UPI */}
            <div className="p-3">
              <button
                onClick={() => toggleInlineFaq('faq-transfers')}
                className="w-full flex items-center justify-between text-left gap-2 cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#DB0011] dark:group-hover:text-red-400 transition">
                  How do I make a payment or transfer funds?
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    expandedFaqId === 'faq-transfers' ? 'rotate-180 text-[#DB0011] dark:text-red-400' : ''
                  }`}
                />
              </button>
              {expandedFaqId === 'faq-transfers' && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 animate-fade-in space-y-1.5">
                  <p>
                    Navigate to the <strong>Payments</strong> tab for IMPS or NEFT bank transfers, or tap <strong>Scan QR / UPI</strong> to send money to any merchant or person via UPI ID (<code className="text-[#DB0011] dark:text-red-400 font-mono">sirajudeen.sharif@hsbc</code>).
                  </p>
                  <button
                    onClick={() => navigate('/transfer')}
                    className="text-[11px] font-bold text-[#DB0011] dark:text-red-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Go to Transfer screen</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              )}
            </div>

            {/* Question 3: Account Frozen Alert */}
            <div className="p-3">
              <button
                onClick={() => toggleInlineFaq('faq-frozen')}
                className="w-full flex items-center justify-between text-left gap-2 cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#DB0011] dark:group-hover:text-red-400 transition">
                  What does &quot;Account Frozen (Code: ACCT_FRZ_001)&quot; mean?
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    expandedFaqId === 'faq-frozen' ? 'rotate-180 text-[#DB0011] dark:text-red-400' : ''
                  }`}
                />
              </button>
              {expandedFaqId === 'faq-frozen' && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 animate-fade-in space-y-1">
                  <p>
                    Outgoing debit transfers are on compliance hold. Please visit your home branch (<strong>HSBC Fort Main Branch, Mumbai</strong>) with your original PAN card and Aadhaar for biometric re-verification.
                  </p>
                </div>
              )}
            </div>

            {/* Question 4: Limits & Cards */}
            <div className="p-3">
              <button
                onClick={() => toggleInlineFaq('faq-limits')}
                className="w-full flex items-center justify-between text-left gap-2 cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#DB0011] dark:group-hover:text-red-400 transition">
                  How do I check daily payment & UPI limits?
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    expandedFaqId === 'faq-limits' ? 'rotate-180 text-[#DB0011] dark:text-red-400' : ''
                  }`}
                />
              </button>
              {expandedFaqId === 'faq-limits' && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 animate-fade-in space-y-1.5">
                  <p>
                    Open <strong>More</strong> &gt; <strong>Daily Payment & UPI Limits</strong> to view your ₹1,00,000/day UPI limit and ₹5,00,000/day IMPS limit.
                  </p>
                  <button
                    onClick={() => navigate('/more/limits')}
                    className="text-[11px] font-bold text-[#DB0011] dark:text-red-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>View Daily Limits</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => navigate('/profile/faq')}
              className="text-xs font-bold text-[#DB0011] dark:text-red-400 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Explore All 13 Questions & Detailed User Guides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security Summary */}
        <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px]">
            Security
          </h4>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600 dark:text-slate-400">Digital Secure Key</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Active</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Touch ID / Face ID</span>
            <span className="font-bold text-slate-500 dark:text-slate-400">Disabled</span>
          </div>
        </div>
      </main>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm p-4 shadow-xl text-left border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2.5">
              <h3 className="text-sm font-bold text-black dark:text-white">
                {activeModal === 'language' && 'Select App Language'}
                {activeModal === 'personal' && 'Personal details'}
                {activeModal === 'contact' && 'Contact details'}
                {activeModal === 'employment' && 'Employment details'}
                {activeModal === 'kyc' && 'KYC Declaration'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 py-1">
              {/* LANGUAGE SELECTOR */}
              {activeModal === 'language' && (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'border-[#DB0011] bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{lang.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{lang.native}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#DB0011] dark:text-red-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {activeModal === 'personal' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Full Name</span>
                    <strong className="text-black dark:text-white">{userAccount.holderName || userAccount.name || 'Sirajudeen Mohamed'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Account Number</span>
                    <strong className="font-mono text-black dark:text-white">{userAccount.accountNumber || userAccount.accountNo || '002197782010'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Account Type</span>
                    <strong className="text-black dark:text-white text-[11px] text-right">{(userAccount.accountName || 'SAVINGS ACCOUNT - PREMIER').toUpperCase()}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">IFSC Code</span>
                    <strong className="font-mono text-black dark:text-white">{userAccount.ifsc || 'HSBC0400002'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">MICR Code</span>
                    <strong className="font-mono text-black dark:text-white">{userAccount.micr || userAccount.micrCode || '600002013'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">PAN Number</span>
                    <strong className="font-mono text-black dark:text-white">{userAccount.panNumber || userAccount.panNo || 'FUCPS1419A'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Account Status</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Active
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Tax Residency</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">India Resident</span>
                  </div>
                </>
              )}

              {activeModal === 'contact' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Mobile Phone</span>
                    <strong className="font-mono text-black dark:text-white font-bold">
                      {userAccount.phone || userAccount.mobile || '+91 9876543210'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Email Address</span>
                    <strong className="text-black dark:text-white text-[11px] truncate">
                      {userAccount.email || 'Not provided'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Registered Branch</span>
                    <strong className="text-black dark:text-white text-[10px] text-right">{userAccount.branch || 'HSBC Fort Main Branch, Mumbai'}</strong>
                  </div>
                  <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Registered Address</span>
                    <strong className="text-black dark:text-white text-[11px] font-normal leading-relaxed block mt-0.5">
                      {userAccount.address || (String(userAccount.id) === 'user-001' ? '142, Anna Salai, Chennai, Tamil Nadu 600002' : 'Not provided')}
                    </strong>
                  </div>
                </>
              )}

              {activeModal === 'employment' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Employment</span>
                    <strong className="text-black dark:text-white">{userAccount.employment || 'Salaried - Professional'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Annual Income</span>
                    <strong className="font-mono text-black dark:text-white">
                      ₹25,00,000
                    </strong>
                  </div>
                  <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Residential Address</span>
                    <strong className="text-black dark:text-white text-[11px] font-normal leading-relaxed block mt-0.5">
                      {userAccount.address || (String(userAccount.id) === 'user-001' ? '142, Anna Salai, Chennai, Tamil Nadu 600002' : 'Not provided')}
                    </strong>
                  </div>
                </>
              )}

              {activeModal === 'kyc' && (
                <>
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300">
                    <p className="font-bold">KYC Verified</p>
                    <p className="text-[11px]">Valid till October 2028</p>
                  </div>
                  <button
                    onClick={() => {
                      setLangToast('KYC documents are up to date');
                      setActiveModal(null);
                    }}
                    className="w-full mt-2 h-10 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold rounded-lg cursor-pointer"
                  >
                    Re-submit KYC
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-3 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-black dark:text-white rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screen9Profile;
