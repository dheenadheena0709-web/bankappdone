import React, { createContext, useContext, useState, ReactNode } from 'react';
import { INITIAL_LEDGER_TRANSACTIONS, Transaction, FIXED_BALANCE_AMOUNT, FIXED_BALANCE_DISPLAY } from '../constants/mockData';

export interface UserAccount {
  accountName: string;
  accountNumber: string;
  fullAccountNumber: string;
  accountType: string;
  balance: number;
  balanceText: string;
  currency: string;
  ifsc: string;
  branch: string;
  upiId: string;
  holderName: string;
  mobile: string;
  email: string;
  panNumber: string;
  employment: string;
}

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
  userAccount: UserAccount;
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
}

const getStoredBalance = (): number => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('hsbc_balance') || localStorage.getItem('bank_balance');
    if (!stored || stored === '50000') {
      localStorage.setItem('hsbc_balance', '12000000000');
      localStorage.setItem('bank_balance', '12000000000');
      return 12000000000;
    }
    return Number(stored);
  }
  return 12000000000;
};

const DEFAULT_ACCOUNT: UserAccount = {
  accountName: 'SAVINGS ACCOUNT - PREMIER',
  accountNumber: '002197782010',
  fullAccountNumber: '002197782010',
  accountType: 'Premier Savings Account',
  balance: getStoredBalance(),
  balanceText: FIXED_BALANCE_DISPLAY,
  currency: 'INR',
  ifsc: 'HSBC0400002',
  branch: 'HSBC Fort Main Branch, Mumbai',
  upiId: 'sirajudeen.sharif@hsbc',
  holderName: 'Sirajudeen Mohamed Sharif',
  mobile: '9677513691',
  email: '-',
  panNumber: 'FUCPS1419A',
  employment: 'Nil'
};

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userAccount, setUserAccount] = useState<UserAccount>(() => ({
    ...DEFAULT_ACCOUNT,
    balance: getStoredBalance(),
  }));
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_LEDGER_TRANSACTIONS);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);

  const [lastPayment, setLastPayment] = useState<LastPayment | null>({
    recipient: 'GREEN LEAF',
    amount: 12000000000,
    date: '23/10/2026, 11:43 AM',
    fromAccount: 'GREEN LEAF (SWIFT)',
    transactionId: 'SWIFT-GL-23102026-88910',
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
    const currentBalance = getStoredBalance();
    const newBalance = currentBalance - amount;
    localStorage.setItem('hsbc_balance', String(newBalance));
    localStorage.setItem('bank_balance', String(newBalance));
    setUserAccount(prev => ({ ...prev, balance: newBalance }));

    const txId = 'SWIFT' + Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: dateFormatted,
      time: timeFormatted,
      senderName: userAccount.holderName,
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

    setTransactions(prev => [newTx, ...prev]);

    const paymentResult: LastPayment = {
      recipient,
      amount,
      date: `Today, ${dateFormatted}, ${timeFormatted}`,
      fromAccount: `${userAccount.holderName} - 002197782010`,
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
    const currentBalance = getStoredBalance();
    const newBalance = currentBalance - amount;
    localStorage.setItem('hsbc_balance', String(newBalance));
    localStorage.setItem('bank_balance', String(newBalance));
    setUserAccount(prev => ({ ...prev, balance: newBalance }));

    const txId = 'BPS' + Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: dateFormatted,
      time: timeFormatted,
      senderName: userAccount.holderName,
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

    setTransactions(prev => [newTx, ...prev]);

    const paymentResult: LastPayment = {
      recipient: billerName,
      amount,
      date: `Today, ${dateFormatted}, ${timeFormatted}`,
      fromAccount: `${userAccount.holderName} - 002197782010`,
      transactionId: txId,
      reference: `Electricity Bill Payment: Cons# ${consumerNo}`,
      type: 'BBPS'
    };

    setLastPayment(paymentResult);
    return paymentResult;
  };

  const resetAccountData = () => {
    localStorage.setItem('hsbc_balance', '12000000000');
    localStorage.setItem('bank_balance', '12000000000');
    setUserAccount({ ...DEFAULT_ACCOUNT, balance: 12000000000 });
    setTransactions(INITIAL_LEDGER_TRANSACTIONS);
  };

  return (
    <BankContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userAccount,
        transactions,
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
        setDeviceFrame
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
