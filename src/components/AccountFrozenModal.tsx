import React, { useEffect } from 'react';
import { Lock, AlertCircle, Phone, X } from 'lucide-react';

interface AccountFrozenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupportClick?: () => void;
}

const playBuzzer = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(160, ctx.currentTime + 0.22);
    gain2.gain.setValueAtTime(0.28, ctx.currentTime + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.22);
    osc2.stop(ctx.currentTime + 0.45);
  } catch {
    // Silently ignore audio playback errors
  }
};

export const AccountFrozenModal: React.FC<AccountFrozenModalProps> = ({
  isOpen,
  onClose,
  onSupportClick,
}) => {
  useEffect(() => {
    if (isOpen) {
      playBuzzer();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([200, 100, 300]);
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-red-200 text-center relative">
        {/* Top Red Bar */}
        <div className="h-1.5 bg-[#DB0011] w-full" />

        <div className="p-6 space-y-4">
          {/* Animated Red Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 text-[#DB0011] flex items-center justify-center mx-auto shadow-inner ring-8 ring-red-50">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h3 className="text-xl font-black text-black tracking-tight">
              Account Frozen
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed px-2">
              Your account has been frozen. Transaction failed. Please visit branch.
            </p>
          </div>

          {/* Security Alert Badge */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#DB0011] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-[#DB0011] block">
                Security Hold · Code: ACCT_FRZ_001
              </span>
              <span className="text-slate-600 mt-0.5 block">
                Debit transactions are currently disabled for this account.
              </span>
            </div>
          </div>

          {/* Buttons: Primary OK */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onClose}
              className="w-full h-11 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer"
            >
              OK
            </button>

            {onSupportClick && (
              <button
                onClick={onSupportClick}
                className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#DB0011]" />
                <span>Contact Branch / Support</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
