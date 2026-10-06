import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Send, HelpCircle, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTabOverride?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTabOverride }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (activeTabOverride) return activeTabOverride;
    const path = location.pathname;
    if (path.includes('/home') || path === '/accounts') return 'home';
    if (path.includes('/investment')) return 'investment';
    if (path.includes('/people-and-bills') || path.includes('/move-money') || path.includes('/transfer') || path.includes('/pay-and-transfer')) return 'move-money';
    if (path.includes('/support')) return 'support';
    if (path.includes('/mpassbook')) return 'passbook';
    return 'home';
  };

  const activeTab = getActiveTab();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/home',
    },
    {
      id: 'investment',
      label: 'Investment',
      icon: TrendingUp,
      path: '/investment',
    },
    {
      id: 'move-money',
      label: 'Move Money',
      icon: Send,
      path: '/people-and-bills',
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      path: '/profile',
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full bg-[#FFFFFF] border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-3 py-1"
    >
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center min-h-[50px] py-1 transition-colors group cursor-pointer ${
                isActive ? 'text-[#DB0011]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-[#DB0011] stroke-[2.4]' : 'text-slate-500 stroke-[1.8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 whitespace-nowrap font-medium ${
                  isActive ? 'text-[#DB0011] font-bold' : 'text-slate-600'
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
