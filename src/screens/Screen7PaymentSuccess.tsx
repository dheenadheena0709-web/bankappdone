import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useBank } from '../context/BankContext';
import {
  Check,
  Share2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  CheckCheck
} from 'lucide-react';

export const Screen7PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { lastPayment } = useBank();
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.35 },
        colors: ['#DB0011', '#000000', '#10B981', '#F59E0B']
      });
    } catch {
      // ignore
    }
  }, []);

  const displayRecipient = lastPayment?.recipient || 'GREEN LEAF';
  const displayAmount = lastPayment?.amount ?? 12000000000.00;
  const displayDate = lastPayment?.date || '23/09/2026, 11:43 AM';
  const displayFrom = lastPayment?.fromAccount || 'S*** M*** S*** - 002197782010';
  const displayTxId = lastPayment?.transactionId || 'SWIFT-GL-23092026-88910';

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `HSBC: Payment of ₹${displayAmount} to ${displayRecipient} successful. Ref: ${displayTxId}`
    );
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px] px-4 py-5">
      {/* Top Header Icons: Share and Help */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-black uppercase tracking-wider">
          Payment Receipt
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black shadow-xs transition cursor-pointer"
            title="Share payment receipt"
            aria-label="Share"
          >
            {copiedReceipt ? (
              <CheckCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setShowSupport(!showSupport)}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black shadow-xs transition cursor-pointer"
            title="Help & Support"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSupport && (
        <div className="my-2 p-2.5 bg-slate-900 text-white text-xs rounded-lg text-center font-medium shadow-md">
          HSBC 24x7 Priority Support: 1800-420-1234 (Ref: {displayTxId})
        </div>
      )}

      {copiedReceipt && (
        <div className="my-2 p-2 bg-emerald-100 text-emerald-800 text-xs rounded-lg text-center font-bold">
          Receipt details copied!
        </div>
      )}

      {/* Center Success Card */}
      <div className="my-auto">
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-slate-200/80 shadow-md text-center relative overflow-hidden">
          {/* Top subtle decorative strip in #DB0011 */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#DB0011]" />

          {/* Green tick animation badge */}
          <div className="relative inline-flex mb-3.5 mt-1">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-6 ring-emerald-100">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-black tracking-tight">
            Payment completed
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transaction processed successfully
          </p>

          {/* Amount ₹2,000 */}
          <div className="mt-4 py-2.5 bg-[#F5F5F5] rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Amount
            </span>
            <div className="text-3xl font-black text-black font-mono mt-0.5">
              ₹{displayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Details List */}
          <div className="mt-4 space-y-2 text-left text-xs border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">To</span>
              <span className="font-bold text-black text-right">{displayRecipient}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">From</span>
              <span className="font-semibold text-slate-800 text-right">{displayFrom}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Date</span>
              <span className="font-semibold text-slate-800 text-right">{displayDate}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-black text-right">
                {displayTxId}
              </span>
            </div>
          </div>

          {/* Direct jump to mPassbook */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/mpassbook')}
              className="w-full py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-[#DB0011] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Verify in Physical mPassbook Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => navigate('/home')}
          className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center"
        >
          <span>Done</span>
        </button>

        <button
          onClick={() => navigate('/transfer')}
          className="w-full h-11 bg-white hover:bg-slate-50 border border-slate-300 text-black font-bold text-xs rounded-lg transition cursor-pointer"
        >
          Make another transfer
        </button>
      </div>
    </div>
  );
};
