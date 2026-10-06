import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useBank } from '../context/BankContext';
import { ArrowLeft, KeyRound, Key, Fingerprint, Eye, EyeOff, ShieldCheck, CheckCircle2, Delete } from 'lucide-react';

export const Screen05Login: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, setIsLoggedIn } = useBank();
  const [activeTab, setActiveTab] = useState<'pin' | 'password' | 'biometric'>('pin');

  // PIN state
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Password state
  const [username, setUsername] = useState('002197782010');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Biometric state
  const [isScanning, setIsScanning] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInfoMessage(msg);
    setTimeout(() => setInfoMessage(null), 3000);
  };

  const completeLogin = () => {
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setPinError('');
      if (nextPin.length === 6) {
        if (nextPin === '775533') {
          setTimeout(() => {
            completeLogin();
          }, 300);
        } else {
          setTimeout(() => {
            setPinError('Invalid PIN. Please try again.');
            setPin('');
          }, 300);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '775533' || password === '••••••••••••') {
      completeLogin();
    } else {
      showToast('Incorrect password. Please try again.');
    }
  };

  const handleBiometricAuth = () => {
    setIsScanning(true);
    setBioSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setBioSuccess(true);
      setTimeout(() => {
        completeLogin();
      }, 500);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] min-h-[740px]">
      {/* Top Header Background: #DB0011 */}
      <div className="bg-[#DB0011] text-white px-4 pt-3 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate('/')}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] text-white font-bold bg-black/20 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Key Protected</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="p-2 bg-white rounded-xl shadow-md mb-2">
            <BrandLogo size="md" variant="red" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">{userAccount.holderName}</h1>
          <p className="text-xs text-white/90 mt-0.5 font-mono">A/C: {userAccount.accountNumber} · HSBC Premier</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 pt-4 pb-3 flex flex-col justify-between">
        <div>
          {/* Segmented Tab Controls (PIN, Password, Biometric) */}
          <div className="grid grid-cols-3 bg-slate-200 p-1 rounded-xl mb-4 shadow-inner">
            <button
              onClick={() => setActiveTab('pin')}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'pin'
                  ? 'bg-white text-[#DB0011] shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#DB0011]" />
              <span>PIN</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-white text-[#DB0011] shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#DB0011]" />
              <span>Password</span>
            </button>

            <button
              onClick={() => setActiveTab('biometric')}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'biometric'
                  ? 'bg-white text-[#DB0011] shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-[#DB0011]" />
              <span>Biometric</span>
            </button>
          </div>

          {/* TAB 1: 6-DIGIT PIN */}
          {activeTab === 'pin' && (
            <div className="flex flex-col items-center">
              <p className="text-xs text-black font-semibold mb-3">
                Enter your 6-digit PIN
              </p>

              {/* 6 Digit boxes */}
              <div className="flex gap-2 justify-center mb-5">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const hasDigit = pin.length > index;
                  const isCurrent = pin.length === index;
                  return (
                    <div
                      key={index}
                      className={`w-11 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                        hasDigit
                          ? 'border-[#DB0011] bg-white text-[#DB0011]'
                          : isCurrent
                          ? 'border-[#DB0011] bg-white ring-2 ring-[#DB0011]/20'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {hasDigit ? '•' : ''}
                    </div>
                  );
                })}
              </div>

              {pinError && (
                <p className="text-xs text-[#DB0011] mb-2 font-semibold">{pinError}</p>
              )}

              {/* Numeric Keypad Below */}
              <div className="w-full max-w-xs grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(String(num))}
                    className="h-12 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-xl font-bold text-black shadow-xs flex items-center justify-center transition cursor-pointer select-none"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 flex items-center justify-center transition cursor-pointer select-none"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-12 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-xl font-bold text-black shadow-xs flex items-center justify-center transition cursor-pointer select-none"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer select-none"
                  aria-label="Backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-end w-full max-w-xs px-1 text-xs">
                <button
                  type="button"
                  onClick={() => showToast('PIN reset instructions sent to registered mobile number.')}
                  className="text-slate-600 hover:text-black cursor-pointer font-medium"
                >
                  Forgot PIN?
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: USERNAME + PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-sm mx-auto px-1">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-[#DB0011] focus:border-transparent outline-none transition"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-3.5 pr-10 rounded-lg border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-[#DB0011] focus:border-transparent outline-none transition"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Password reset verification link sent.')}
                  className="text-xs text-[#DB0011] font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-sm rounded-lg shadow-sm transition cursor-pointer mt-1"
              >
                Log on
              </button>
            </form>
          )}

          {/* TAB 3: BIOMETRIC LOGIN */}
          {activeTab === 'biometric' && (
            <div className="flex flex-col items-center text-center px-4 py-2">
              <p className="text-xs text-slate-700 mb-3 font-semibold">
                Touch ID / Face ID
              </p>

              {/* Center large icon: Fingerprint image with green-blue gradient + pulse animation */}
              <div className="relative my-2">
                <div
                  className={`absolute -inset-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-30 filter blur-md transition duration-500 ${
                    isScanning ? 'animate-pulse scale-110 opacity-75' : ''
                  }`}
                />

                <div
                  className={`relative w-40 h-40 rounded-2xl overflow-hidden border-2 shadow-lg bg-black transition-transform duration-300 ${
                    isScanning ? 'border-emerald-400 scale-105' : 'border-slate-300'
                  }`}
                >
                  <img
                    src="/biometric_face_fingerprint.jpg"
                    alt="Touch ID / Face ID Biometric"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-300 via-cyan-400 to-emerald-300 shadow-[0_0_12px_#34d399] animate-bounce top-1/2" />
                  )}
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-black">Touch ID / Face ID</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan fingerprint sensor or face
                </p>
              </div>

              {bioSuccess ? (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Biometric Verified! Redirecting...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  disabled={isScanning}
                  className="mt-5 w-full max-w-xs h-12 bg-[#DB0011] hover:bg-[#b5000e] active:scale-[0.98] text-white font-bold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Fingerprint className="w-5 h-5 text-white" />
                  <span>{isScanning ? 'Scanning Sensor...' : 'Authenticate with Biometrics'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Inline Info Toast */}
        {infoMessage && (
          <div className="mb-2 bg-slate-900 text-white text-xs font-medium py-2 px-3 rounded-lg text-center shadow-lg animate-fade-in">
            {infoMessage}
          </div>
        )}

        {/* Footer: Secure login with Digital Secure Key */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#DB0011]" />
          <span>Secure login with Digital Secure Key</span>
        </div>
      </div>
    </div>
  );
};
