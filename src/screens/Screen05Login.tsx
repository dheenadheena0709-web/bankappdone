import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useBank } from '../context/BankContext';
import {
  ArrowLeft,
  KeyRound,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  ShieldCheck,
  Delete,
  ShieldAlert,
  Lock,
  Sun,
  Moon
} from 'lucide-react';

export const Screen05Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithPassword, loginWithPin, setIsLoggedIn, darkMode, toggleDarkMode } = useBank();
  const [activeTab, setActiveTab] = useState<'pin' | 'password' | 'biometric'>('pin');

  // PIN state (Primary and working login method)
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Password state: Must always be EMPTY on page mount
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Biometric state: Auto-unlock is completely disabled
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Clear password field and remove any auto-saved password on mount
  useEffect(() => {
    // Explicitly enforce empty fields on mount
    setPassword('');
    setPasswordError('');
    setUsername('');
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('password');
        localStorage.removeItem('user_password');
        localStorage.removeItem('saved_password');
      }
    } catch {
      // ignore
    }
  }, []);

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
        // Dynamic PIN verification against all registered users
        const matched = loginWithPin(nextPin);
        if (matched) {
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
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Remove any password storage attempt - DO NOT save entered password to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('password');
        localStorage.removeItem('user_password');
        localStorage.removeItem('saved_password');
      }
    } catch {
      // ignore
    }

    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    // Match entered password against users structure
    const matched = loginWithPassword(username, password);
    if (matched) {
      setPassword(''); // keep field clean
      completeLogin();
    } else {
      setPasswordError('Invalid credentials. Please verify your details or log on with your 6-digit PIN.');
      showToast('Authentication failed. You can also log on using your PIN.');
    }
  };

  const handleBiometricAuth = () => {
    // Biometric direct unlock is completely disabled for security
    showToast('Biometric direct logon is disabled for security. Please authenticate using your PIN.');
    setTimeout(() => {
      setActiveTab('pin');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {/* Top Header: Simple, Clean Bank Banner - No User Info / No Selector */}
      <div className="bg-[#E30613] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 xs:pb-6 shadow-sm border-b border-transparent dark:border-slate-800">
        <div className="flex items-center justify-between mb-2 xs:mb-3">
          <button
            onClick={() => navigate('/welcome')}
            className="p-1.5 -ml-1 text-white hover:bg-black/10 active:scale-95 rounded-lg transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white cursor-pointer transition flex items-center justify-center active:scale-95"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-white" />}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-white font-medium bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Digital Key</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center pt-0.5 pb-1">
          <div className="p-2 xs:p-2.5 bg-white rounded-xl shadow-md mb-2 xs:mb-2.5">
            <BrandLogo size="md" variant="red" />
          </div>
          <h1 className="text-lg xs:text-xl font-bold tracking-tight text-white">Welcome to HSBC Bank</h1>
          <p className="text-[11px] xs:text-xs text-white/90 mt-0.5 font-medium">
            HSBC Bank - Secure Login
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-3 xs:px-4 pt-3 xs:pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] flex flex-col justify-between w-full max-w-full">
        <div>
          {/* Segmented Tab Controls (PIN, Password, Biometric) */}
          <div className="grid grid-cols-3 bg-slate-200 dark:bg-slate-900 p-1 rounded-xl mb-3.5 xs:mb-4 shadow-inner border border-transparent dark:border-slate-800 w-full">
            <button
              onClick={() => setActiveTab('pin')}
              className={`flex items-center justify-center gap-1 xs:gap-1.5 py-2 xs:py-2.5 text-[11px] xs:text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'pin'
                  ? 'bg-white dark:bg-slate-800 text-[#E30613] dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#E30613] dark:text-red-400" />
              <span>PIN</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center justify-center gap-1 xs:gap-1.5 py-2 xs:py-2.5 text-[11px] xs:text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-white dark:bg-slate-800 text-[#E30613] dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#E30613] dark:text-red-400" />
              <span>Password</span>
            </button>

            <button
              onClick={() => setActiveTab('biometric')}
              className={`flex items-center justify-center gap-1 xs:gap-1.5 py-2 xs:py-2.5 text-[11px] xs:text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'biometric'
                  ? 'bg-white dark:bg-slate-800 text-[#E30613] dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-[#E30613] dark:text-red-400" />
              <span>Biometric</span>
            </button>
          </div>

          {/* TAB 1: 6-DIGIT PIN */}
          {activeTab === 'pin' && (
            <div className="flex flex-col items-center w-full">
              <p className="text-xs text-black dark:text-slate-200 font-semibold mb-2.5 xs:mb-3">
                Enter your 6-digit PIN
              </p>

              {/* 6 Digit boxes - Fluid and responsive for 320px to 480px */}
              <div className="flex gap-1.5 xs:gap-2 justify-center mb-4 xs:mb-5 w-full max-w-full px-1">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const hasDigit = pin.length > index;
                  const isCurrent = pin.length === index;
                  return (
                    <div
                      key={index}
                      className={`w-8 h-10 xs:w-9.5 xs:h-11 sm:w-11 sm:h-12 rounded-lg border-2 flex items-center justify-center text-lg xs:text-xl font-bold transition-all ${
                        hasDigit
                          ? 'border-[#E30613] dark:border-red-500 bg-white dark:bg-slate-900 text-[#E30613] dark:text-red-400'
                          : isCurrent
                          ? 'border-[#E30613] dark:border-red-500 bg-white dark:bg-slate-900 ring-2 ring-[#E30613]/20'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {hasDigit ? '•' : ''}
                    </div>
                  );
                })}
              </div>

              {pinError && (
                <p className="text-xs text-[#E30613] dark:text-red-400 mb-2 font-semibold">{pinError}</p>
              )}

              {/* Numeric Keypad Below */}
              <div className="w-full max-w-[270px] xs:max-w-[290px] sm:max-w-xs mx-auto grid grid-cols-3 gap-1.5 xs:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(String(num))}
                    className="h-11 xs:h-12 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 border border-slate-200 dark:border-slate-800 text-lg xs:text-xl font-bold text-black dark:text-white shadow-xs flex items-center justify-center transition cursor-pointer select-none"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-11 xs:h-12 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer select-none"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-11 xs:h-12 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 border border-slate-200 dark:border-slate-800 text-lg xs:text-xl font-bold text-black dark:text-white shadow-xs flex items-center justify-center transition cursor-pointer select-none"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-11 xs:h-12 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer select-none"
                  aria-label="Backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-end w-full max-w-xs px-1 text-xs">
                <button
                  type="button"
                  onClick={() => showToast('PIN reset instructions sent to registered mobile number.')}
                  className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer font-medium"
                >
                  Forgot PIN?
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: USERNAME + PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-sm mx-auto px-1" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-black dark:text-slate-200 mb-1">
                  Username or Account Number
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-[#E30613] focus:border-transparent outline-none transition"
                  placeholder="Enter username or account number"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black dark:text-slate-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password-field"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full h-11 pl-3.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-[#E30613] focus:border-transparent outline-none transition"
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-[#E30613] dark:text-red-400 mt-1.5 font-semibold">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Password reset verification link sent to registered email.')}
                  className="text-xs text-[#E30613] dark:text-red-400 font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#E30613] hover:bg-[#c70510] text-white font-bold text-sm rounded-lg shadow-sm transition cursor-pointer mt-1"
              >
                Log on
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pin')}
                className="w-full py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#E30613] dark:hover:text-red-400 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Use 6-Digit PIN to Log On</span>
              </button>
            </form>
          )}

          {/* TAB 3: BIOMETRIC LOGIN (DISABLED FOR SECURITY) */}
          {activeTab === 'biometric' && (
            <div className="flex flex-col items-center text-center px-4 py-2">
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-tight mb-3 w-full max-w-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Biometric logon is disabled for security. Please authenticate using your 6-digit Secure Key PIN.</span>
              </div>

              {/* Center large icon: Fingerprint with lock overlay */}
              <div className="relative my-2">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-md bg-black/80 flex items-center justify-center opacity-70">
                  <img
                    src="/biometric_face_fingerprint.jpg"
                    alt="Touch ID / Face ID Biometric"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
                      <Lock className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-sm font-bold text-black dark:text-white">Touch ID / Face ID (Disabled)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs">
                  Biometric auto-unlock is turned off for security. Please log on with your PIN.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('pin')}
                className="mt-5 w-full max-w-xs h-12 bg-[#E30613] hover:bg-[#c70510] active:scale-[0.98] text-white font-bold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-5 h-5 text-white" />
                <span>Log on with 6-Digit PIN</span>
              </button>
            </div>
          )}
        </div>

        {/* Inline Info Toast */}
        {infoMessage && (
          <div className="mb-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium py-2 px-3 rounded-lg text-center shadow-lg animate-fade-in border border-transparent dark:border-slate-700">
            {infoMessage}
          </div>
        )}

        {/* Footer: Secure login with Digital Secure Key */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#E30613] dark:text-red-400" />
          <span>Secure login with Digital Secure Key</span>
        </div>
      </div>
    </div>
  );
};
