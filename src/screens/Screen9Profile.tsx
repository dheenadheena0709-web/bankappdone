import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { useBank } from '../context/BankContext';
import {
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
  Settings
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
  const { userAccount, setIsLoggedIn } = useBank();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-IN');
  const [langToast, setLangToast] = useState<string | null>(null);

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
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-screen">
      {/* Header Background: #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight">My details & Settings</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-white/90 hover:text-white bg-black/15 px-2.5 py-1 rounded-md transition cursor-pointer font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-white text-black p-3 rounded-xl shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#DB0011] text-white font-black text-lg flex items-center justify-center shrink-0">
            SMS
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-black">{userAccount.holderName}</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500">
              Account No: <strong className="font-mono text-black">{userAccount.accountNumber}</strong>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              IFSC: {userAccount.ifsc} · {userAccount.branch}
            </p>
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
        {/* Personal & Account Details */}
        <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* 1. Personal details (ID and tax residency) > */}
          <button
            onClick={() => setActiveModal('personal')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  Personal details
                </h3>
                <p className="text-xs text-slate-500">ID and tax residency</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 2. Contact details (Phone, email) > */}
          <button
            onClick={() => setActiveModal('contact')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  Contact details
                </h3>
                <p className="text-xs text-slate-500">Phone, email</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 3. Employment details (Address, Income) > */}
          <button
            onClick={() => setActiveModal('employment')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  Employment details
                </h3>
                <p className="text-xs text-slate-500">Address, Income</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          {/* 4. KYC Declaration (Re-submit) > */}
          <button
            onClick={() => setActiveModal('kyc')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  KYC Declaration
                </h3>
                <p className="text-xs text-slate-500">Re-submit declaration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        </div>

        {/* SETTINGS & APP PREFERENCES (Language Selector, PWA, Tools) */}
        <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Settings & Preferences
            </h4>
          </div>

          {/* Language Selector inside settings menu */}
          <button
            onClick={() => setActiveModal('language')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black group-hover:text-[#DB0011]">
                  App Language
                </h3>
                <p className="text-xs text-slate-500">
                  {currentLangObj.name} ({currentLangObj.native})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {currentLangObj.native}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        </div>

        {/* Security Summary */}
        <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 p-3.5 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-black uppercase tracking-wider text-[10px]">
            Security
          </h4>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600">Digital Secure Key</span>
            <span className="font-bold text-emerald-700">Active</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-slate-100">
            <span className="text-slate-600">Touch ID / Face ID</span>
            <span className="font-bold text-emerald-700">Enabled</span>
          </div>
        </div>
      </main>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-xl text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
              <h3 className="text-sm font-bold text-black">
                {activeModal === 'language' && 'Select App Language'}
                {activeModal === 'personal' && 'Personal details'}
                {activeModal === 'contact' && 'Contact details'}
                {activeModal === 'employment' && 'Employment details'}
                {activeModal === 'kyc' && 'KYC Declaration'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 py-1">
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
                            ? 'border-[#DB0011] bg-red-50 text-[#DB0011] font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{lang.name}</div>
                          <div className="text-[11px] text-slate-500">{lang.native}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#DB0011]" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {activeModal === 'personal' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Full Name</span>
                    <strong className="text-black">{userAccount.holderName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Account Number</span>
                    <strong className="font-mono text-black">{userAccount.accountNumber}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>IFSC Code</span>
                    <strong className="font-mono text-black">{userAccount.ifsc}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>PAN Number</span>
                    <strong className="font-mono text-black">{userAccount.panNumber}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Account Balance</span>
                    <strong className="text-[#DB0011] font-mono font-bold">{userAccount.balance.toLocaleString('en-IN')} inr</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Account Status</span>
                    <strong className="text-emerald-700 font-bold">Active</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Tax Residency</span>
                    <span className="font-bold text-emerald-700">India Resident</span>
                  </div>
                </>
              )}

              {activeModal === 'contact' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Mobile Phone</span>
                    <strong className="font-mono text-black">{userAccount.mobile}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Email Address</span>
                    <strong className="text-black">{userAccount.email}</strong>
                  </div>
                </>
              )}

              {activeModal === 'employment' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Employment</span>
                    <strong className="text-black">{userAccount.employment}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Annual Income</span>
                    <strong className="font-mono text-black">Nil</strong>
                  </div>
                </>
              )}

              {activeModal === 'kyc' && (
                <>
                  <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800">
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
              className="w-full mt-3 h-9 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-black rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTabOverride="support" />
    </div>
  );
};
