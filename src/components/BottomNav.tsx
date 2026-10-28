import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Briefcase, HelpCircle, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTabOverride?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTabOverride }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bouncingTab, setBouncingTab] = useState<string | null>(null);

  const getActiveTab = () => {
    if (activeTabOverride) return activeTabOverride;
    const path = location.pathname;
    if (path === '/home' || path === '/accounts') return 'accounts';
    if (path.includes('/payment') || path.includes('/people-and-bills') || path.includes('/move-money') || path.includes('/pay-and-transfer')) return 'payments';
    if (path.includes('/investment') || path.includes('/business')) return 'business';
    if (path.includes('/support') || path.includes('/profile') || path.includes('/faq') || path.includes('/help')) return 'support';
    if (path.includes('/more') || path.includes('/mpassbook')) return 'more';
    return 'accounts';
  };

  const activeTab = getActiveTab();

  const navItems = [
    {
      id: 'accounts',
      label: 'Accounts',
      icon: Home,
      path: '/home',
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: Send,
      path: '/people-and-bills',
    },
    {
      id: 'business',
      label: 'Business',
      icon: Briefcase,
      path: '/investment',
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      path: '/profile',
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      path: '/more',
    },
  ];

  const handleTabClick = (item: { id: string; path: string }) => {
    // Trigger bounce animation
    setBouncingTab(item.id);
    setTimeout(() => {
      setBouncingTab((curr) => (curr === item.id ? null : curr));
    }, 450);

    if (location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-[calc(10px+env(safe-area-inset-bottom,0px))] inset-x-2 xs:inset-x-3 max-w-md mx-auto w-[calc(100%-16px)] xs:w-[calc(100%-24px)] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.14),0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)] border border-slate-200/80 dark:border-slate-800 px-1.5 xs:px-2 py-1.5 transition-all select-none"
    >
      <div className="grid grid-cols-5 items-center w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isBouncing = bouncingTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-full transition-all duration-200 group cursor-pointer active:scale-95 touch-manipulation focus:outline-none w-full min-w-0 ${
                isActive ? 'text-[#E30613] dark:text-[#ff4d5a]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div
                className={`relative flex items-center justify-center transform-gpu ${
                  isBouncing ? 'animate-haptic-bounce' : ''
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 xs:w-5 xs:h-5 transition-all duration-200 ${
                    isActive
                      ? 'scale-110 text-[#E30613] dark:text-[#ff4d5a] stroke-[2.4] drop-shadow-xs'
                      : 'stroke-[1.8] group-hover:scale-105'
                  }`}
                />
              </div>
              <span
                className={`text-[8.5px] xs:text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full transition-colors ${
                  isActive ? 'text-[#E30613] dark:text-[#ff4d5a] font-bold' : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

