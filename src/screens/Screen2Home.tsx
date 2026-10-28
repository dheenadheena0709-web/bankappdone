import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { LuxuryBalanceShimmer } from '../components/LuxuryBalanceShimmer';
import { AccountCardSkeletonOverlay } from '../components/AccountCardSkeletonOverlay';
import { useBank, DEFAULT_USER, User } from '../context/BankContext';
import {
  Bell,
  Eye,
  EyeOff,
  ChevronRight,
  Send,
  Receipt,
  BookOpen,
  QrCode,
  Copy,
  Check,
  Building2,
  CreditCard,
  SlidersHorizontal,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CheckCircle2,
  X,
  Printer,
  Download,
  Zap,
  Sparkles,
  ShieldCheck,
  Wifi,
  RotateCw,
  Sun,
  Moon,
  Briefcase,
  FileText,
  Mail,
  Info,
  Phone,
  LogOut,
  MessageSquare,
  Lock,
  KeyRound
} from 'lucide-react';

export const Screen2Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    userAccount,
    currentUser,
    switchAccount,
    transactions,
    showBalance,
    setShowBalance,
    darkMode,
    toggleDarkMode,
    setIsLoggedIn
  } = useBank();

  // Personal Savings Account
  const selectedAccount: User = currentUser || userAccount || DEFAULT_USER;
  const currentAccNumber = selectedAccount.accountNo || selectedAccount.accountNumber || '002197782010';
  const currentAccName = selectedAccount.accountName || 'SAVINGS ACCOUNT - PREMIER';
  const currentBalance = selectedAccount.balance;
  const currentAccCategory = 'Premier';
  const displayName = selectedAccount.holderName || selectedAccount.name || 'Sirajudeen Mohamed Sharif';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HB';

  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountLoading, setIsAccountLoading] = useState(true);
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);

  interface NotificationItem {
    id: string;
    title: string;
    desc: string;
    time: string;
    read: boolean;
    tag: string;
  }

  // Personal notifications - empty for all accounts
  const [personalNotifications, setPersonalNotifications] = useState<NotificationItem[]>([]);

  const activeNotifications = personalNotifications;
  const activeUnreadCount = activeNotifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setPersonalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Elegant skeleton loading simulation for home dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsAccountLoading(false);
      }, 350);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshAccounts = () => {
    setIsAccountLoading(true);
    setTimeout(() => {
      setIsAccountLoading(false);
      showToast('Account balances synchronized');
    }, 600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyAcc = () => {
    navigator.clipboard?.writeText(currentAccNumber);
    setCopied(true);
    showToast('Account number copied: ' + currentAccNumber);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F8F9FA] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 animate-fade-in transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* ================= TOP HEADER (HSBC CORPORATE / PREMIER RED + GLASSMORPHISM) ================= */}
      <header className="bg-gradient-to-b from-[#E30613] via-[#D80512] to-[#C90410] dark:from-[#b8040f] dark:via-[#9e030c] dark:to-[#850209] text-white pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-6 shadow-[0_8px_30px_rgba(227,6,19,0.22)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-200 w-full">
        {/* Subtle decorative atmospheric glow in header */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-48 h-48 bg-black/15 rounded-full blur-2xl pointer-events-none" />

        {/* Layout: Left = HSBC logo, Center = Welcome back + Name + PREMIER badge, Right = action buttons */}
        <div className="header-container relative z-10">
          {/* Left = HSBC logo */}
          <div className="p-1.5 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)] shrink-0 flex items-center justify-center">
            <BrandLogo size="sm" variant="red" />
          </div>

          {/* Center = Welcome back + Name + PREMIER badge */}
          <div className="welcome-section">
            <div className="welcome-line">
              <span className="text-[11px] sm:text-xs text-white/90 font-medium tracking-wide whitespace-nowrap">
                Welcome back,
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-black tracking-widest uppercase shadow-xs bg-gradient-to-r from-[#D4AF37]/35 via-[#FFDF73]/45 to-[#D4AF37]/35 border border-[#FFE58F]/70 text-[#FFE58F]">
                <Sparkles className="w-2.5 h-2.5 text-[#FFE58F]" />
                <span>PREMIER</span>
              </span>
            </div>
            <div className="user-name text-white tracking-tight leading-snug mt-0.5 overflow-x-auto no-scrollbar font-bold text-sm sm:text-base">
              {displayName}
            </div>
          </div>

          {/* Right = action buttons (dark mode, SMS, notification, logout) in a single row with gap */}
          <div className="action-buttons">
            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-300 stroke-[2.2]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-white stroke-[2.2]" />
              )}
            </button>

            {/* SMS */}
            <button
              onClick={() => setShowSmsModal(true)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner transition cursor-pointer"
              title="SMS Alerts & Banking"
              aria-label="SMS Alerts"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white stroke-[2.2]" />
            </button>

            {/* Notification */}
            <button
              onClick={() => setShowNotifications(true)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white relative shadow-inner transition cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-white stroke-[2.2]" />
              {activeUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full ring-2 ring-[#E30613]" />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 active:scale-95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner transition cursor-pointer"
              title="Log out of HSBC Mobile Banking"
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5 text-white stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* ================= ACCOUNT OVERVIEW BAR ================= */}
        <div className="relative z-10 flex items-center justify-between mb-2.5 px-4 gap-2">
          {/* Account Indicator: Personal Savings ONLY */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-1.5 px-3 bg-black/40 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-xs font-bold">Savings Account</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white text-slate-900 shadow-xs">
                •••• {currentAccNumber.slice(-4)}
              </span>
            </div>
          </div>

          <button
            onClick={handleRefreshAccounts}
            disabled={isAccountLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-[10px] font-bold transition border border-white/20 backdrop-blur-xs cursor-pointer shadow-xs disabled:opacity-75 shrink-0"
            title="Synchronize Account Balances"
            aria-label="Synchronize account balances"
          >
            <RotateCw className={`w-3 h-3 text-white ${isAccountLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>

        {/* ================= ACCOUNT OVERVIEW CARD (EXECUTIVE MAROON / OBSIDIAN GRADIENT) ================= */}
        <div className="relative overflow-hidden rounded-[24px] p-4.5 xs:p-5 bg-gradient-to-br from-[#2D0206] via-[#1B0104] to-[#0A0002] border border-[#D4AF37]/65 shadow-[0_18px_45px_-12px_rgba(227,6,19,0.4),0_8px_24px_rgba(0,0,0,0.65)] text-white select-none mx-3 xs:mx-4">
          {/* SKELETON LOADING OVERLAY WITH 'animate-shimmer-dark' EFFECT */}
          <AccountCardSkeletonOverlay isLoading={isAccountLoading} />

          {/* Glossy Specular Glass Highlights */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#E30613]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.12] pointer-events-none" />

          {/* Top Row: Account Name, Active Badge & Toggle Visibility */}
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-wider text-white/90 uppercase block font-sans">
                  {currentAccName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-400" />
                  <span>ACTIVE</span>
                </span>
              </div>

              {/* Account Number with Masked Display */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-xs text-white/95 font-bold tracking-wider">
                  •••• {currentAccNumber.slice(-4)}
                </span>
              </div>
            </div>

            {/* Right side: EMV Chip + Eye/EyeOff */}
            <div className="flex items-center gap-2.5">
              {/* EMV Gold Chip Icon */}
              <div className="w-8 h-6 rounded-md bg-gradient-to-br from-[#E6C665] via-[#C9A237] to-[#8C6D1F] border border-[#FFE58F]/70 p-0.5 shadow-xs flex items-center justify-center opacity-90">
                <div className="w-full h-full border border-amber-950/30 rounded-xs flex flex-col justify-center gap-0.5 px-0.5">
                  <div className="w-full h-px bg-amber-950/40" />
                  <div className="w-full h-px bg-amber-950/40" />
                </div>
              </div>

              {/* Eye / EyeOff Icon */}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white/90 transition cursor-pointer backdrop-blur-xs shadow-xs"
                title={showBalance ? 'Hide balance' : 'Show balance'}
                aria-label="Toggle balance visibility"
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4 stroke-[2.2]" />
                ) : (
                  <Eye className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>
            </div>
          </div>

          {/* Balance Section: 32px Bold Typography */}
          <div className="relative z-10 mt-4 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/60 tracking-widest uppercase font-bold block">
                Available Account Balance
              </span>
            </div>

            <div className="mt-1">
              <LuxuryBalanceShimmer
                amount={currentBalance}
                currency="INR"
                size="lg"
                isMasked={!showBalance}
              />
            </div>
          </div>

          {/* Bottom Row of Card: Holder Name, Contactless & Category */}
          <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-white/70 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-widest text-white/95 uppercase text-xs">
                {displayName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-90">
              <Wifi className="w-3.5 h-3.5 rotate-90 stroke-[2.2] text-[#FFE58F]" />
              <span className="font-bold tracking-widest text-[9px] uppercase text-[#FFE58F]">
                Premier Savings
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* ================= 5 ACTION BUTTONS ================= */}
        <section aria-label="Quick Actions" className="w-full">
          <div className="grid grid-cols-5 gap-1 xs:gap-2 text-center w-full">
            {/* 1. Transfer */}
            <button
              onClick={() => navigate('/transfer')}
              className="flex flex-col items-center gap-1 group cursor-pointer select-none active:scale-[0.92] transition-transform duration-150 ease-out touch-manipulation focus:outline-none w-full min-w-0"
            >
              <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-[14px] xs:rounded-[16px] bg-[#FFF5F6] dark:bg-slate-900 border border-[#FAD2D5] dark:border-slate-800 flex items-center justify-center shadow-[0_4px_12px_rgba(227,6,19,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(227,6,19,0.18)] group-hover:scale-[1.04] group-active:scale-[0.95] group-active:bg-[#FFE8EA] dark:group-active:bg-slate-800 transition-all duration-150 ease-out">
                <Send className="w-4.5 h-4.5 xs:w-5 xs:h-5 text-[#E30613] stroke-[2.2] group-active:scale-95 transition-transform duration-150" />
              </div>
              <span className="text-[9.5px] xs:text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#E30613] dark:group-hover:text-red-400 group-active:text-[#E30613] group-active:scale-95 transition-all duration-150 truncate max-w-full block">
                Transfer
              </span>
            </button>

            {/* 2. UPI */}
            <button
              onClick={() => navigate('/upi')}
              className="flex flex-col items-center gap-1 group cursor-pointer select-none active:scale-[0.92] transition-transform duration-150 ease-out touch-manipulation focus:outline-none w-full min-w-0"
            >
              <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-[14px] xs:rounded-[16px] bg-[#FFF5F6] dark:bg-slate-900 border border-[#FAD2D5] dark:border-slate-800 flex items-center justify-center shadow-[0_4px_12px_rgba(227,6,19,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(227,6,19,0.18)] group-hover:scale-[1.04] group-active:scale-[0.95] group-active:bg-[#FFE8EA] dark:group-active:bg-slate-800 transition-all duration-150 ease-out">
                <Zap className="w-4.5 h-4.5 xs:w-5 xs:h-5 text-[#E30613] stroke-[2.2] group-active:scale-95 transition-transform duration-150" />
              </div>
              <span className="text-[9.5px] xs:text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#E30613] dark:group-hover:text-red-400 group-active:text-[#E30613] group-active:scale-95 transition-all duration-150 truncate max-w-full block">
                UPI Pay
              </span>
            </button>

            {/* 3. Pay Bills */}
            <button
              onClick={() => navigate('/people-and-bills')}
              className="flex flex-col items-center gap-1 group cursor-pointer select-none active:scale-[0.92] transition-transform duration-150 ease-out touch-manipulation focus:outline-none w-full min-w-0"
            >
              <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-[14px] xs:rounded-[16px] bg-[#FFF5F6] dark:bg-slate-900 border border-[#FAD2D5] dark:border-slate-800 flex items-center justify-center shadow-[0_4px_12px_rgba(227,6,19,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(227,6,19,0.18)] group-hover:scale-[1.04] group-active:scale-[0.95] group-active:bg-[#FFE8EA] dark:group-active:bg-slate-800 transition-all duration-150 ease-out">
                <Receipt className="w-4.5 h-4.5 xs:w-5 xs:h-5 text-[#E30613] stroke-[2.2] group-active:scale-95 transition-transform duration-150" />
              </div>
              <span className="text-[9.5px] xs:text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#E30613] dark:group-hover:text-red-400 group-active:text-[#E30613] group-active:scale-95 transition-all duration-150 truncate max-w-full block">
                Pay Bills
              </span>
            </button>

            {/* 4. Passbook */}
            <button
              onClick={() => navigate('/mpassbook')}
              className="flex flex-col items-center gap-1 group cursor-pointer select-none active:scale-[0.92] transition-transform duration-150 ease-out touch-manipulation focus:outline-none w-full min-w-0"
            >
              <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-[14px] xs:rounded-[16px] bg-[#FFF5F6] dark:bg-slate-900 border border-[#FAD2D5] dark:border-slate-800 flex items-center justify-center shadow-[0_4px_12px_rgba(227,6,19,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(227,6,19,0.18)] group-hover:scale-[1.04] group-active:scale-[0.95] group-active:bg-[#FFE8EA] dark:group-active:bg-slate-800 transition-all duration-150 ease-out">
                <BookOpen className="w-4.5 h-4.5 xs:w-5 xs:h-5 text-[#E30613] stroke-[2.2] group-active:scale-95 transition-transform duration-150" />
              </div>
              <span className="text-[9.5px] xs:text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#E30613] dark:group-hover:text-red-400 group-active:text-[#E30613] group-active:scale-95 transition-all duration-150 truncate max-w-full block">
                Passbook
              </span>
            </button>

            {/* 5. Scan QR */}
            <button
              onClick={() => navigate('/scan-qr')}
              className="flex flex-col items-center gap-1 group cursor-pointer select-none active:scale-[0.92] transition-transform duration-150 ease-out touch-manipulation focus:outline-none w-full min-w-0"
            >
              <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-[14px] xs:rounded-[16px] bg-[#FFF5F6] dark:bg-slate-900 border border-[#FAD2D5] dark:border-slate-800 flex items-center justify-center shadow-[0_4px_12px_rgba(227,6,19,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(227,6,19,0.18)] group-hover:scale-[1.04] group-active:scale-[0.95] group-active:bg-[#FFE8EA] dark:group-active:bg-slate-800 transition-all duration-150 ease-out">
                <QrCode className="w-4.5 h-4.5 xs:w-5 xs:h-5 text-[#E30613] stroke-[2.2] group-active:scale-95 transition-transform duration-150" />
              </div>
              <span className="text-[9.5px] xs:text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#E30613] dark:group-hover:text-red-400 group-active:text-[#E30613] group-active:scale-95 transition-all duration-150 truncate max-w-full block">
                Scan QR
              </span>
            </button>
          </div>
        </section>

        {/* ================= RECENT TRANSACTIONS (5 RECENT TRANSACTIONS ONLY ON HOMEPAGE) ================= */}
        <section
          aria-label="Recent Transactions"
          className="bg-white dark:bg-slate-900 rounded-[20px] p-4.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-100/90 dark:border-slate-800 overflow-hidden"
        >
          {/* Card Section Header */}
          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#E30613] dark:text-red-400 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Recent Transactions
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              Showing 5 of {transactions.length}
            </span>
          </div>

          {/* Transactions List - 5 Recent Only */}
          <div className="divide-y divide-slate-100/90 dark:divide-slate-800">
            {transactions.slice(0, 5).map((tx) => {
              const isDebit = tx.type === 'debit' || (tx.withdrawal !== null && (tx.withdrawal || 0) > 0);
              const amtFormatted = isDebit
                ? `-₹${(tx.withdrawal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `+₹${(tx.deposit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const balFormatted = `₹${tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="py-3.5 first:pt-1 last:pb-1 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 rounded-xl px-1.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Left Icon */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform ${
                          isDebit
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-[#E30613] dark:text-red-400 border border-rose-200/80 dark:border-rose-800/60'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60'
                        }`}
                      >
                        {isDebit ? (
                          <ArrowUpRight className="w-5 h-5 stroke-[2.4]" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5 stroke-[2.4]" />
                        )}
                      </div>

                      <div>
                        {/* Sender & Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#E30613] dark:group-hover:text-red-400 transition-colors">
                            {tx.senderName}
                          </span>

                          {/* Transfer Mode Badge */}
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 rounded-full tracking-wide">
                            {tx.transferMode}
                          </span>

                          {/* Green Success Badge */}
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded-full flex items-center gap-1 tracking-wide">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                            <span>Success</span>
                          </span>
                        </div>

                        {/* Date and Time */}
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                          <span>{tx.date}</span>
                          <span>·</span>
                          <span>{tx.time}</span>
                        </div>

                        {/* Narration */}
                        <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1" title={tx.narration}>
                          {tx.narration}
                        </div>

                        {/* Reference Number */}
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                          Ref: {tx.refNo}
                        </div>
                      </div>
                    </div>

                    {/* Right Amount & Balance */}
                    <div className="text-right shrink-0">
                      <div
                        className={`text-sm sm:text-base font-black font-mono tracking-tight ${
                          isDebit ? 'text-[#E30613] dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {amtFormatted}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${
                          isDebit ? 'text-[#E30613] dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isDebit ? 'Debit' : 'Credit'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 block">
                        Bal: {balFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Micro Detail: View Receipt / Details */}
                  <div className="mt-2 pt-2 border-t border-slate-100/60 dark:border-slate-800 flex items-center justify-between text-xs text-[#E30613] dark:text-red-400 font-bold group-hover:underline">
                    <span className="text-[11px]">View Corporate Advice & Details</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* See More Button for Full Transactions */}
          <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => navigate('/mpassbook')}
              className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:text-[#E30613] dark:hover:text-red-400 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs group cursor-pointer active:scale-[0.98]"
            >
              <span>See More Transactions ({transactions.length} Total)</span>
              <ChevronRight className="w-4 h-4 text-[#E30613] dark:text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* ================= BANK SERVICES MENU CARDS ================= */}
        <section aria-label="Banking Services" className="bg-white dark:bg-slate-900 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-100/90 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* 1. Borrowing */}
          <button
            onClick={() => showToast('Borrowing: 1,00,00,000 offer available')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#E30613] dark:text-red-400 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E30613] dark:group-hover:text-red-400 transition-colors">
                  Borrowing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Loans & Mortgages</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                Pre-approved
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* 2. Cards */}
          <button
            onClick={() => showToast('Cards: 1 Debit Card Active')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E30613] dark:group-hover:text-red-400 transition-colors">
                  Cards
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Debit and Credit cards</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">1 Card</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* 3. Services / Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E30613] dark:group-hover:text-red-400 transition-colors">
                  Services & Personal Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">View KYC profile, statements & settings</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>
        </section>

        {/* Physical mPassbook Quick Banner */}
        <div
          onClick={() => navigate('/mpassbook')}
          className="bg-white dark:bg-slate-900 rounded-[20px] p-4 flex items-center justify-between cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-100/90 dark:border-slate-800 hover:border-[#E30613]/40 dark:hover:border-[#E30613]/60 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF5F6] dark:bg-slate-800 text-[#E30613] dark:text-red-400 border border-[#FAD2D5] dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">mPassbook Digital Ledger</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-[#E30613] text-white rounded-full">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                View physical passbook ledger with printed deposit entries
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E30613] group-hover:translate-x-0.5 transition" />
        </div>
      </main>

      {/* ================= TRANSACTION ADVICE MODAL (AUTHENTIC PREMIER SLIP) ================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-left border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#E30613] rounded">
                  <BrandLogo size="sm" variant="red" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {selectedTx.withdrawal ? 'Debit Voucher / Payment Advice' : 'Credit Advice / Inward Remittance'}
                  </h3>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                    {selectedTx.withdrawal ? 'Corporate Debit Confirmation' : 'Corporate Credit Receipt'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 border-b border-slate-100 dark:border-slate-800">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border ${
                  selectedTx.withdrawal
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-[#E30613] dark:text-red-400 border-rose-200 dark:border-rose-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span
                className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  selectedTx.withdrawal
                    ? 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80'
                    : 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80'
                }`}
              >
                Status: {selectedTx.status} · {selectedTx.withdrawal ? 'Debited' : 'Credited'}
              </span>
              <div
                className={`text-2xl font-black font-mono mt-2 ${
                  selectedTx.withdrawal
                    ? 'text-[#E30613] dark:text-red-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {selectedTx.withdrawal
                  ? `-₹${selectedTx.withdrawal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `+₹${(selectedTx.deposit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
            </div>

            <div className="py-3 space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-1 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date & Time</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{selectedTx.date} · {selectedTx.time}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  {selectedTx.withdrawal ? 'Beneficiary / Payee' : 'Particulars / Remitter'}
                </span>
                <strong className="text-slate-900 dark:text-slate-100 font-black">{selectedTx.senderName}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transfer Mode</span>
                <strong className="text-sky-700 dark:text-sky-400 font-bold">{selectedTx.transferMode}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  {selectedTx.withdrawal ? 'Debited Account' : 'Beneficiary Account'}
                </span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{currentAccNumber}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Narration</span>
                <span className="text-slate-900 dark:text-slate-100 font-mono text-[10px] text-right max-w-[200px] truncate">
                  {selectedTx.narration}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reference / Ref No</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono text-[11px]">{selectedTx.refNo}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ledger Balance</span>
                <strong className="text-[#E30613] dark:text-red-400 font-mono font-bold">
                  ₹{selectedTx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => {
                  showToast('Receipt downloaded');
                  setSelectedTx(null);
                }}
                className="flex-1 h-10 rounded-lg bg-[#E30613] hover:bg-[#c40510] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACCOUNT DETAILS MODAL / POPUP ================= */}
      {showAccountDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#2D0206] via-[#1B0104] to-[#0A0002] text-white flex items-center justify-between border-b border-[#D4AF37]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-[#FFE58F]/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#FFE58F]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Personal Savings Account Details
                  </h3>
                  <p className="text-[11px] text-[#FFE58F] font-mono">
                    {displayName} (••••{currentAccNumber.slice(-4)})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAccountDetailsModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
                aria-label="Close Account Details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-2.5 overflow-y-auto">
              {/* Account Holder Name */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Account Holder Name
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5 block">
                    {displayName}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Verified Entity
                </span>
              </div>

              {/* Account Type */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Account Type
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {currentAccName}
                </span>
              </div>

              {/* Full Account Number */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Full Account Number
                  </span>
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5 block tracking-wider">
                    {currentAccNumber}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(currentAccNumber);
                    showToast(`Full Account Number copied: ${currentAccNumber}`);
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#E30613] transition cursor-pointer shadow-xs active:scale-95"
                  title="Copy Account Number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* IFSC & MICR Codes */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    IFSC Code
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-xs font-black text-slate-900 dark:text-slate-100">
                      {selectedAccount.ifsc || 'HSBC0400002'}
                    </span>
                    <button
                      onClick={() => {
                        const ifsc = selectedAccount.ifsc || 'HSBC0400002';
                        navigator.clipboard?.writeText(ifsc);
                        showToast(`IFSC Code Copied: ${ifsc}`);
                      }}
                      className="text-slate-400 hover:text-[#E30613] p-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    MICR Code
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-xs font-black text-slate-900 dark:text-slate-100">
                      {selectedAccount.micr || selectedAccount.micrCode || '600002013'}
                    </span>
                    <button
                      onClick={() => {
                        const micr = selectedAccount.micr || selectedAccount.micrCode || '600002013';
                        navigator.clipboard?.writeText(micr);
                        showToast(`MICR Code Copied: ${micr}`);
                      }}
                      className="text-slate-400 hover:text-[#E30613] p-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Email
                  </span>
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-0.5 block">
                    {selectedAccount.email || 'Not registered'}
                  </span>
                </div>
                {selectedAccount.email && (
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedAccount.email);
                      showToast('Email Copied');
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#E30613] transition cursor-pointer shadow-xs active:scale-95"
                    title="Copy Email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Phone Number */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Phone
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                    {selectedAccount.phone || selectedAccount.mobile || '+91 96775 13691'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const ph = selectedAccount.phone || selectedAccount.mobile || '+91 96775 13691';
                    navigator.clipboard?.writeText(ph);
                    showToast(`Phone Copied: ${ph}`);
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#E30613] transition cursor-pointer shadow-xs active:scale-95"
                  title="Copy Phone"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Address */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Residential Address
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed font-medium">
                    {selectedAccount.address || (String(selectedAccount.id) === 'user-001' ? '142, Anna Salai, Chennai, Tamil Nadu 600002' : 'Not registered')}
                  </p>
                </div>
                {selectedAccount.address && (
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedAccount.address || '');
                      showToast('Address Copied');
                    }}
                    className="p-2 mt-0.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#E30613] transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                    title="Copy Address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Branch */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Branch
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 block">
                  {selectedAccount.branch || 'HSBC Fort Main Branch, Mumbai'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowAccountDetailsModal(false)}
                className="px-6 py-2 rounded-xl bg-[#E30613] hover:bg-[#C90410] active:scale-95 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NOTIFICATIONS MODAL ================= */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="p-4 bg-[#E30613] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    Personal Notifications
                  </h3>
                  <span className="text-[10px] text-white/80">
                    No new updates
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 flex flex-col justify-center items-center">
              {activeNotifications.length === 0 ? (
                <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                    <Bell className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No new notifications
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px] mt-1">
                    You have no new notifications or alerts at this time.
                  </p>
                </div>
              ) : (
                activeNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-2xl border transition w-full ${
                      notif.read
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500'
                        : 'bg-red-50/50 dark:bg-slate-800 border-red-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-[#E30613] dark:text-red-400">
                        {notif.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {notif.time}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.desc}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end">
              <button
                onClick={() => setShowNotifications(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer transition active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SMS ALERTS MODAL ================= */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    Personal SMS Banking Alerts
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Linked: {selectedAccount.phone || selectedAccount.mobile || '+91 9876543210'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 flex flex-col justify-center items-center">
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                  <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No new SMS alerts
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mt-1">
                  There are no recent SMS banking alerts recorded for this account.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700/60 flex justify-end">
              <button
                onClick={() => setShowSmsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#E30613] text-white text-xs font-bold cursor-pointer transition active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Screen2Home;
