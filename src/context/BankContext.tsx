import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { INITIAL_LEDGER_TRANSACTIONS, Transaction, FIXED_BALANCE_DISPLAY } from '../constants/mockData';

export interface DebitCard {
  number: string;
  maskedNumber?: string;
  cvv: string;
  expiry: string;
  holder?: string;
  status: 'Active' | 'Inactive' | 'Blocked';
}

export interface User {
  id: string | number;
  accountNo: string;
  accountNumber: string; // alias for accountNo
  fullAccountNumber: string;
  name: string;
  holderName: string; // alias for name
  accountName: string;
  accountType: string;
  type?: 'SAVINGS' | 'COMPANY' | 'PERSONAL';
  balance: number;
  balanceText: string;
  currency: string;
  ifsc: string;
  branch: string;
  upiId: string;
  mobile: string;
  phone?: string;
  email: string;
  panNumber: string;
  panNo?: string;
  employment: string;
  pin: string;
  password?: string;
  debitCard: DebitCard;
  transactions?: Transaction[];
  isBusiness?: boolean;
  companyName?: string;
  micr?: string;
  micrCode?: string;
  gstNumber?: string | null;
  gstin?: string | null;
  cin?: string | null;
  address?: string;
}

// Backward compatibility alias
export type UserAccount = User;

export interface LastPayment {
  recipient: string;
  amount: number;
  date: string;
  fromAccount: string;
  transactionId: string;
  reference: string;
  type: string;
}

interface BankContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  selectedAccount: User;
  setSelectedAccount: React.Dispatch<React.SetStateAction<User>>;
  userAccount: User;
  setUserAccount: React.Dispatch<React.SetStateAction<User>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (user: User) => void;
  switchUser: (userIdOrAccount: string) => User | null;
  switchAccount: (accountTypeOrId?: string) => User;
  loginWithPassword: (accountOrUsername: string, pass: string) => User | null;
  loginWithPin: (pin: string) => User | null;
  generateCardNumber: (bin?: string) => string;
  transactions: Transaction[];
  lastPayment: LastPayment | null;
  setLastPayment: (payment: LastPayment | null) => void;
  executeTransfer: (params: { recipient: string; amount: number; reference: string; transferType: string }) => LastPayment;
  executeBillPayment: (params: { billerName: string; consumerNo: string; amount: number }) => LastPayment;
  resetAccountData: () => void;
  showBalance: boolean;
  setShowBalance: (val: boolean) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  deviceFrame: boolean;
  setDeviceFrame: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  activeAccountType?: 'savings';
  setActiveAccountType?: React.Dispatch<React.SetStateAction<'savings'>>;
  selectedAccountId?: string;
  setSelectedAccountId?: React.Dispatch<React.SetStateAction<string>>;
  savingsAccounts: User[];
  savingsAccount: User;
}

// Helpers for dynamic member cards and accounts
export const generateCardNumber = (bin = '4532'): string => {
  const b2 = Math.floor(1000 + Math.random() * 9000).toString();
  const b3 = Math.floor(1000 + Math.random() * 9000).toString();
  const b4 = Math.floor(1000 + Math.random() * 9000).toString();
  return `${bin} ${b2} ${b3} ${b4}`;
};

export const generateCVV = (): string => {
  return Math.floor(100 + Math.random() * 900).toString();
};

export const generateExpiry = (): string => {
  const futureYear = (new Date().getFullYear() + 4).toString().slice(-2);
  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
  return `${month}/${futureYear}`;
};

export const generateAccountNumber = (): string => {
  return '0021' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

const getStoredUserBalance = (userId: string | number, defaultBal: number): number => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const key = `hsbc_balance_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored !== null && !isNaN(Number(stored))) {
      const val = Number(stored);
      // Auto-migrate old corporate balance to new target balance
      if (String(userId) === 'user-biz-090807' && val === 961288165.54) {
        localStorage.setItem(key, String(defaultBal));
        return defaultBal;
      }
      return val;
    }
    // Backwards compatibility for existing default user
    if (String(userId) === 'user-001') {
      const legacy = localStorage.getItem('hsbc_balance') || localStorage.getItem('bank_balance');
      if (legacy !== null && !isNaN(Number(legacy)) && Number(legacy) >= 1000000000) {
        return Number(legacy);
      }
    }
  }
  return defaultBal;
};

// 1. EXISTING USER - Sirajudeen Mohamed Sharif
export const DEFAULT_USER: User = {
  id: 'user-001',
  accountNo: '002197782010',
  accountNumber: '002197782010',
  fullAccountNumber: '002197782010',
  name: 'Sirajudeen Mohamed Sharif',
  holderName: 'Sirajudeen Mohamed Sharif',
  accountName: 'SAVINGS ACCOUNT - PREMIER',
  accountType: 'Premier Savings Account',
  type: 'SAVINGS',
  balance: getStoredUserBalance('user-001', 12000000000),
  balanceText: FIXED_BALANCE_DISPLAY,
  currency: 'INR',
  ifsc: 'HSBC0400002',
  branch: 'HSBC Fort Main Branch, Mumbai',
  upiId: 'sirajudeen.sharif@hsbc',
  mobile: '9677513691',
  email: 'sirajudeen.mohamed@hsbc.co.in',
  panNumber: 'FUCPS1419A',
  employment: 'Salaried Professional',
  pin: '998877',
  password: 'Password@123',
  isBusiness: false,
  companyName: undefined,
  gstin: null,
  gstNumber: null,
  cin: null,
  address: '142, Anna Salai, Chennai, Tamil Nadu 600002',
  debitCard: {
    number: '4532 8921 5409 4022',
    maskedNumber: '•••• •••• •••• 4022',
    cvv: '842',
    expiry: '09/29',
    holder: 'Sirajudeen Mohamed Sharif',
    status: 'Active'
  },
  transactions: INITIAL_LEDGER_TRANSACTIONS
};

// Single Active Account: Sirajudeen Mohamed Sharif
export const INITIAL_USERS: User[] = [DEFAULT_USER];

// Helper for future member creation (ready for 30 members)
export const createMemberUser = (params: {
  name: string;
  accountNo?: string;
  balance?: number;
  pin?: string;
  password?: string;
  mobile?: string;
  email?: string;
  panNumber?: string;
}): User => {
  const accountNo = params.accountNo || generateAccountNumber();
  const cardNum = generateCardNumber();
  const bal = params.balance !== undefined ? params.balance : 50000;
  return {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    accountNo,
    accountNumber: accountNo,
    fullAccountNumber: accountNo,
    name: params.name,
    holderName: params.name,
    accountName: `${params.name.toUpperCase()} - PREMIER`,
    accountType: 'Premier Savings Account',
    balance: bal,
    balanceText: bal.toLocaleString('en-IN'),
    currency: 'INR',
    ifsc: 'HSBC0400002',
    branch: 'HSBC Fort Main Branch, Mumbai',
    upiId: `${params.name.toLowerCase().replace(/\s+/g, '.')}@hsbc`,
    mobile: params.mobile || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: params.email || `${params.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    panNumber: params.panNumber || 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F',
    employment: 'Salaried / Professional',
    pin: params.pin || '123456',
    password: params.password || params.pin || 'Password@123',
    debitCard: {
      number: cardNum,
      maskedNumber: `•••• •••• •••• ${cardNum.slice(-4)}`,
      cvv: generateCVV(),
      expiry: generateExpiry(),
      status: 'Active'
    },
    transactions: [
      {
        id: `tx-init-${Date.now()}`,
        date: '10/10/2026',
        time: '12:00 PM',
        senderName: 'Initial Account Deposit',
        transferMode: 'NEFT',
        status: 'Success',
        narration: `NEFT/INWARD DEPOSIT/ACCOUNT OPENING/${params.name.toUpperCase()}`,
        refNo: `NEFT-INIT-${Math.floor(100000 + Math.random() * 900000)}`,
        withdrawal: null,
        deposit: bal,
        balance: bal,
        category: 'Inward Remittance',
        type: 'credit',
        amountText: bal.toLocaleString('en-IN')
      }
    ]
  };
};

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Clean up all corporate account data on initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('hsbc_users_list_v4');
        localStorage.removeItem('hsbc_users_list_v3');
        localStorage.removeItem('hsbc_users_list_v2');
        localStorage.removeItem('hsbc_users_list');
        localStorage.removeItem('hsbc_balance_user-003');
        localStorage.removeItem('hsbc_balance_user-biz-090807');
        localStorage.removeItem('user-biz-090807');
        localStorage.removeItem('hsbc_account_type');
        localStorage.removeItem('hsbc_selected_account_id');
        if (localStorage.getItem('hsbc_balance_2') === '60000' || localStorage.getItem('hsbc_balance_2') === '10000') {
          localStorage.removeItem('hsbc_balance_2');
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Central Users List - contains only the savings member
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Central Current User State (Authorized account only)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return {
      ...DEFAULT_USER,
      balance: getStoredUserBalance('user-001', 12000000000)
    };
  });

  // Selected account and userAccount are aliases to currentUser
  const [selectedAccount, setSelectedAccount] = useState<User>(currentUser);
  const [userAccount, setUserAccount] = useState<User>(currentUser);

  useEffect(() => {
    setSelectedAccount(currentUser);
    setUserAccount(currentUser);
  }, [currentUser]);

  // Sync current user balance to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && currentUser?.id) {
      try {
        localStorage.setItem('hsbc_current_user_id', String(currentUser.id));
        localStorage.setItem(`hsbc_balance_${currentUser.id}`, String(currentUser.balance));
        localStorage.setItem('hsbc_balance', String(currentUser.balance));
        localStorage.setItem('bank_balance', String(currentUser.balance));
      } catch {
        // ignore
      }
    }
  }, [currentUser]);

  // Single savings account state
  const savingsAccounts = [currentUser];
  const savingsAccount = currentUser;
  const activeAccountType = 'savings' as const;
  const selectedAccountId = currentUser.accountNo;

  const addUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  // Switch Account
  const switchAccount = (_accountTypeOrId?: string): User => {
    setLastPayment(null);
    setCurrentUser(DEFAULT_USER);
    setSelectedAccount(DEFAULT_USER);
    setUserAccount(DEFAULT_USER);
    return DEFAULT_USER;
  };

  const switchUser = (_userIdOrAccount?: string): User | null => {
    setCurrentUser(DEFAULT_USER);
    setSelectedAccount(DEFAULT_USER);
    setUserAccount(DEFAULT_USER);
    return DEFAULT_USER;
  };

  // Login with Password: Only authorized account allowed
  const loginWithPassword = (_accountOrUsername: string, pass: string): User | null => {
    const cleanPass = pass.trim();
    const cleanAccount = _accountOrUsername.trim().toLowerCase();

    // Reject all other credentials (including 425581, corporate 090807, old PIN, and tests)
    if (cleanPass === '090807' || cleanPass === '696196' || cleanPass === '112233' || cleanPass === '425581' || cleanAccount === '002197777540') {
      return null;
    }

    // Match authorized account
    if (
      cleanPass === '998877' ||
      cleanPass === 'Password@123' ||
      cleanPass === DEFAULT_USER.password ||
      cleanPass === DEFAULT_USER.pin ||
      cleanAccount === '002197782010' ||
      cleanAccount.includes('sirajudeen') ||
      cleanAccount.includes('sharif')
    ) {
      const personalUser: User = {
        ...DEFAULT_USER,
        balance: getStoredUserBalance('user-001', 12000000000)
      };
      setCurrentUser(personalUser);
      setSelectedAccount(personalUser);
      setUserAccount(personalUser);
      try {
        localStorage.setItem('hsbc_current_user_id', 'user-001');
      } catch {
        // ignore
      }
      setIsLoggedIn(true);
      return personalUser;
    }

    return null;
  };

  // Login with PIN: Only authorized account allowed
  const loginWithPin = (enteredPin: string): User | null => {
    const cleanPin = enteredPin.trim();

    // Reject other PINs (including old PIN 696196)
    if (cleanPin === '090807' || cleanPin === '696196' || cleanPin === '112233' || cleanPin === '425581') {
      return null;
    }

    // Match authorized account PIN
    if (cleanPin === '998877' || cleanPin === DEFAULT_USER.pin || cleanPin === 'Password@123' || cleanPin === DEFAULT_USER.password) {
      const personalUser: User = {
        ...DEFAULT_USER,
        balance: getStoredUserBalance('user-001', 12000000000)
      };
      setCurrentUser(personalUser);
      setSelectedAccount(personalUser);
      setUserAccount(personalUser);
      try {
        localStorage.setItem('hsbc_current_user_id', 'user-001');
      } catch {
        // ignore
      }
      setIsLoggedIn(true);
      return personalUser;
    }

    return null;
  };

  // Transactions are dynamically derived from currentUser
  const userTransactions = currentUser.transactions && currentUser.transactions.length > 0
    ? currentUser.transactions
    : (currentUser.id === 'user-001' ? INITIAL_LEDGER_TRANSACTIONS : []);

  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Clear legacy dark default if user hadn't explicitly chosen
      const legacy = localStorage.getItem('hsbc_theme');
      if (legacy !== null && !localStorage.getItem('hsbc_theme_mode')) {
        localStorage.removeItem('hsbc_theme');
      }
      const stored = localStorage.getItem('hsbc_theme_mode');
      if (stored !== null) {
        return stored === 'dark';
      }
    }
    // Default to Light Mode as requested
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('hsbc_theme_mode', darkMode ? 'dark' : 'light');
        localStorage.removeItem('hsbc_theme');
      }
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', darkMode ? '#0f172a' : '#DB0011');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const [lastPayment, setLastPayment] = useState<LastPayment | null>({
    recipient: 'GREEN LEAF',
    amount: 12000000000,
    date: '23/09/2026, 11:43 AM',
    fromAccount: 'GREEN LEAF (SWIFT)',
    transactionId: 'SWIFT-GL-23092026-88910',
    reference: 'Inward SWIFT Remittance',
    type: 'SWIFT'
  });

  const executeTransfer = ({
    recipient,
    amount,
    reference,
    transferType
  }: {
    recipient: string;
    amount: number;
    reference: string;
    transferType: string;
  }): LastPayment => {
    const currentBalance = currentUser.balance;
    const newBalance = Math.max(0, currentBalance - amount);

    const txId = 'SWIFT' + Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: dateFormatted,
      time: timeFormatted,
      senderName: currentUser.name,
      transferMode: transferType,
      status: 'Success',
      narration: `${transferType}/${recipient.toUpperCase()}/${reference ? reference.toUpperCase() : 'TRANSFER'}`,
      refNo: `TX-${txId}`,
      withdrawal: amount,
      deposit: null,
      balance: newBalance,
      category: 'Transfer',
      type: 'debit',
      amountText: `₹${amount.toLocaleString('en-IN')}`
    };

    const updatedTransactions = [newTx, ...(currentUser.transactions || [])];

    const updatedUser = {
      ...currentUser,
      balance: newBalance,
      balanceText: newBalance.toLocaleString('en-IN'),
      transactions: updatedTransactions
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    const paymentResult: LastPayment = {
      recipient,
      amount,
      date: `Today, ${dateFormatted}, ${timeFormatted}`,
      fromAccount: `${currentUser.name} - ${currentUser.accountNo}`,
      transactionId: txId,
      reference: reference || 'Online Banking Transfer',
      type: transferType
    };

    setLastPayment(paymentResult);
    return paymentResult;
  };

  const executeBillPayment = ({
    billerName,
    consumerNo,
    amount
  }: {
    billerName: string;
    consumerNo: string;
    amount: number;
  }): LastPayment => {
    const currentBalance = currentUser.balance;
    const newBalance = Math.max(0, currentBalance - amount);

    const txId = 'BPS' + Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: dateFormatted,
      time: timeFormatted,
      senderName: currentUser.name,
      transferMode: 'BBPS',
      status: 'Success',
      narration: `BBPS/ELEC BILL/${billerName.slice(0, 15).toUpperCase()}/CON-${consumerNo}`,
      refNo: `BPS-${txId}`,
      withdrawal: amount,
      deposit: null,
      balance: newBalance,
      category: 'Utilities',
      type: 'debit',
      amountText: `₹${amount.toLocaleString('en-IN')}`
    };

    const updatedTransactions = [newTx, ...(currentUser.transactions || [])];

    const updatedUser = {
      ...currentUser,
      balance: newBalance,
      balanceText: newBalance.toLocaleString('en-IN'),
      transactions: updatedTransactions
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    const paymentResult: LastPayment = {
      recipient: billerName,
      amount,
      date: `Today, ${dateFormatted}, ${timeFormatted}`,
      fromAccount: `${currentUser.name} - ${currentUser.accountNo}`,
      transactionId: txId,
      reference: `Electricity Bill Payment: Cons# ${consumerNo}`,
      type: 'BBPS'
    };

    setLastPayment(paymentResult);
    return paymentResult;
  };

  const resetAccountData = () => {
    localStorage.removeItem('hsbc_users_list_v4');
    localStorage.removeItem('hsbc_users_list_v3');
    localStorage.removeItem('hsbc_users_list_v2');
    localStorage.removeItem('hsbc_users_list');
    localStorage.removeItem('hsbc_current_user_id');
    localStorage.removeItem('hsbc_balance_user-001');
    localStorage.removeItem('hsbc_balance_user-002');
    localStorage.removeItem('hsbc_balance_user-003');
    setUsers(INITIAL_USERS);
    setCurrentUser(DEFAULT_USER);
  };

  return (
    <BankContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        selectedAccount: currentUser,
        setSelectedAccount: setCurrentUser,
        userAccount: currentUser,
        setUserAccount: setCurrentUser,
        users,
        setUsers,
        addUser,
        switchUser,
        switchAccount,
        loginWithPassword,
        loginWithPin,
        generateCardNumber,
        transactions: userTransactions,
        lastPayment,
        setLastPayment,
        executeTransfer,
        executeBillPayment,
        resetAccountData,
        showBalance,
        setShowBalance,
        activeNavTab,
        setActiveNavTab,
        deviceFrame,
        setDeviceFrame,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        activeAccountType,
        selectedAccountId,
        savingsAccounts,
        savingsAccount
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
