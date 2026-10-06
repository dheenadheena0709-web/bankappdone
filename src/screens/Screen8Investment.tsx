import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import {
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Landmark,
  Coins,
  FileText,
  Info,
  Compass
} from 'lucide-react';

export const Screen8Investment: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const totalAssetValue = 0;
  const totalGain = 0;
  const gainPercentage = 0;

  // Investment list data array cleared to [] as requested
  const holdings: any[] = [];

  const productsAndServices = [
    {
      id: 'mf',
      title: 'Mutual funds',
      desc: 'Explore 2,500+ top rated schemes',
      badge: 'Direct Schemes',
      icon: TrendingUp,
    },
    {
      id: 'fd',
      title: 'Fixed Deposits (e-FD)',
      desc: 'Guaranteed returns up to 7.85% p.a.',
      badge: '7.85% p.a.',
      icon: Landmark,
    },
    {
      id: 'sgb',
      title: 'Sovereign Gold Bonds',
      desc: 'Govt backed gold with 2.5% annual interest',
      badge: 'Govt Backed',
      icon: Coins,
    },
    {
      id: 'nps',
      title: 'National Pension System (NPS)',
      desc: 'Retirement tax saving scheme',
      badge: 'Tax Free',
      icon: FileText,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px]">
      {/* Header Background: #DB0011 */}
      <header className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold tracking-tight">Investment</h1>
          <button
            onClick={() => showToast('Portfolio report desk')}
            className="p-1 rounded-lg bg-black/10 hover:bg-black/20 text-white transition cursor-pointer"
            title="Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-white/80">
          Portfolio and market solutions
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-3.5">
        {/* MUTUAL FUNDS - TOTAL ASSET VALUE */}
        <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                Mutual Funds & Securities
              </span>
              <h2 className="text-xs font-bold text-black mt-0.5">
                Total asset value
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Portfolio
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-black">
              {totalAssetValue}
            </span>
            <span className="text-xs font-bold text-slate-600">INR</span>
          </div>

          {/* GAIN DISPLAY */}
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+{totalGain}</span>
              <span>(+{gainPercentage}%)</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Unrealized P&L</span>
          </div>

          {/* MY HOLDINGS SECTION WITH EMPTY MESSAGE */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-black">My holdings</span>
              <span className="text-[11px] text-slate-500 font-medium">
                0 Schemes
              </span>
            </div>

            {holdings.length === 0 ? (
              <div className="py-6 flex flex-col items-center justify-center text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1.5">
                  <TrendingUp className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">No investments yet</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  You have not added any mutual funds or securities yet.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* PRODUCTS AND SERVICES */}
        <div className="bg-[#FFFFFF] rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-slate-100">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Products and services
            </h3>
            <p className="text-[11px] text-slate-500">Explore market leading instruments</p>
          </div>

          <div className="divide-y divide-slate-100">
            {productsAndServices.map((product) => {
              const IconComp = product.icon;
              return (
                <button
                  key={product.id}
                  onClick={() => showToast(`${product.title} information requested`)}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DB0011] flex items-center justify-center font-bold">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-black group-hover:text-[#DB0011]">
                          {product.title}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                          {product.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{product.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTabOverride="invest" />
    </div>
  );
};
