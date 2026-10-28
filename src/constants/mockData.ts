export interface Transaction {
  id: string;
  date: string;
  time: string;
  senderName: string;
  transferMode: string;
  status: 'Success' | 'Pending' | 'Failed';
  narration: string;
  refNo: string;
  withdrawal: number | null; // Debit in Red
  deposit: number | null;    // Credit in Green
  balance: number;
  category: string;
  type: 'debit' | 'credit';
  amountText: string;
  description?: string;
  mode?: string;
  amount?: number;
}

export interface PayeeContact {
  id: string;
  initials: string;
  name: string;
  bank: string;
  accNumber: string;
  color: string;
  avatarBg: string;
}

export interface ElectricityBiller {
  id: string;
  name: string;
  state: string;
  code: string;
  iconBg: string;
  dueAmount?: number;
  consumerNo?: string;
  dueDate?: string;
}

// Balance: 12,00,00,00,000 INR
export const FIXED_BALANCE_AMOUNT = 12000000000.00;
export const FIXED_BALANCE_DISPLAY = '12,00,00,00,000';

// Transaction History: GREEN LEAF SWIFT at 1st, Acc Opening Deposit at 2nd
export const INITIAL_LEDGER_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-swift-greenleaf-01',
    date: '23/09/2026',
    time: '11:43 AM',
    senderName: 'GREEN LEAF',
    transferMode: 'SWIFT',
    status: 'Success',
    narration: 'SWIFT INWARD REMITTANCE / SENDER: GREEN LEAF / VALUE DT: 23-SEP-2026',
    refNo: 'SWIFT-GL-23092026-88910',
    withdrawal: null,
    deposit: 12000000000.00,
    balance: 12000000000.00,
    category: 'Inward Remittance',
    type: 'credit',
    amountText: '12,00,00,00,000'
  },
  {
    id: 'tx-opening-deposit-01',
    date: '09/09/2026',
    time: '10:47 AM',
    senderName: 'Acc Opening Deposit',
    transferMode: 'Cash/Direct Deposit',
    status: 'Success',
    narration: 'Acc Opening Deposit',
    refNo: 'DEP-09092026-1047',
    withdrawal: null,
    deposit: 10000.00,
    balance: 10000.00,
    category: 'Acc Opening Deposit',
    type: 'credit',
    amountText: '10,000'
  }
];

// Pre-seeded Payees sourced directly from transaction records (Media / AV Production companies)
export const PEOPLE_CONTACTS: PayeeContact[] = [
  {
    id: 'payee-v3-ent',
    initials: 'V3',
    name: 'V3 Events & Entertainment Pvt Ltd',
    bank: 'HDFC Bank Ltd',
    accNumber: '50200084920194',
    color: '#E30613',
    avatarBg: 'bg-red-50 text-[#E30613]'
  },
  {
    id: 'payee-brightline',
    initials: 'BM',
    name: 'Brightline Media Solutions Pvt Ltd',
    bank: 'ICICI Bank Ltd',
    accNumber: '001105029418',
    color: '#2563EB',
    avatarBg: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'payee-led-wall',
    initials: 'LW',
    name: 'LED Wall Rentals Pvt Ltd',
    bank: 'State Bank of India',
    accNumber: '38192048591',
    color: '#059669',
    avatarBg: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'payee-visual-craft',
    initials: 'VC',
    name: 'Visual Craft Studios',
    bank: 'Axis Bank Ltd',
    accNumber: '918020048192041',
    color: '#7C3AED',
    avatarBg: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'payee-sound-light',
    initials: 'SL',
    name: 'Sound & Light Pro Pvt Ltd',
    bank: 'Kotak Mahindra Bank',
    accNumber: '8210948291',
    color: '#D97706',
    avatarBg: 'bg-amber-50 text-amber-600'
  },
  {
    id: 'payee-techmantra',
    initials: 'TM',
    name: 'Techmantra Systems',
    bank: 'HSBC India',
    accNumber: '002849102941',
    color: '#E30613',
    avatarBg: 'bg-red-50 text-[#E30613]'
  },
  {
    id: 'payee-stagebox',
    initials: 'SB',
    name: 'Stagebox India',
    bank: 'Standard Chartered Bank',
    accNumber: '48201948201',
    color: '#0284C7',
    avatarBg: 'bg-sky-50 text-sky-600'
  },
  {
    id: 'payee-pixelstream',
    initials: 'PM',
    name: 'Pixelstream Media',
    bank: 'Yes Bank Ltd',
    accNumber: '0084920194819',
    color: '#9333EA',
    avatarBg: 'bg-fuchsia-50 text-fuchsia-600'
  },
  {
    id: 'payee-creative-hub',
    initials: 'CH',
    name: 'Creative Hub Solutions',
    bank: 'Bank of Baroda',
    accNumber: '29480100029481',
    color: '#EA580C',
    avatarBg: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'payee-eventpro',
    initials: 'EP',
    name: 'EventPro Logistics India',
    bank: 'Punjab National Bank',
    accNumber: '0184002100049281',
    color: '#4B5563',
    avatarBg: 'bg-slate-100 text-slate-700'
  },
  {
    id: 'payee-truss-rigging',
    initials: 'TR',
    name: 'Truss & Rigging Systems Pvt Ltd',
    bank: 'IndusInd Bank',
    accNumber: '100084920194',
    color: '#0D9488',
    avatarBg: 'bg-teal-50 text-teal-600'
  },
  {
    id: 'payee-audiokraft',
    initials: 'AK',
    name: 'AudioKraft Solutions',
    bank: 'Federal Bank',
    accNumber: '14820100492819',
    color: '#6366F1',
    avatarBg: 'bg-indigo-50 text-indigo-600'
  }
];

export const ELECTRICITY_BILLERS: ElectricityBiller[] = [
  { id: 'el-1', name: 'Adani Electricity Mumbai Ltd', state: 'Maharashtra', code: 'AEML', iconBg: 'bg-blue-600' },
  { id: 'el-2', name: 'Assam Power Distribution (APDCL)', state: 'Assam', code: 'APDCL', iconBg: 'bg-green-600' },
  { id: 'el-3', name: 'BESCOM - Bengaluru Electricity Supply', state: 'Karnataka', code: 'BESCOM', iconBg: 'bg-orange-600' },
  { id: 'el-4', name: 'CESC Kolkata Electricity Supply', state: 'West Bengal', code: 'CESC', iconBg: 'bg-red-600' },
  { id: 'el-5', name: 'Tata Power - Delhi Distribution Ltd', state: 'Delhi NCR', code: 'TPDDL', iconBg: 'bg-sky-600' },
  { id: 'el-6', name: 'Torrent Power - Surat & Ahmedabad', state: 'Gujarat', code: 'TPL', iconBg: 'bg-teal-600' },
  { id: 'el-7', name: 'TANGEDCO - Tamil Nadu Generation', state: 'Tamil Nadu', code: 'TNEB', iconBg: 'bg-amber-600' },
  { id: 'el-8', name: 'PSPCL - Punjab State Power Corp', state: 'Punjab', code: 'PSPCL', iconBg: 'bg-yellow-700' },
  { id: 'el-9', name: 'UPPCL (Urban) - Uttar Pradesh Power', state: 'Uttar Pradesh', code: 'UPPCL', iconBg: 'bg-blue-700' },
  { id: 'el-10', name: 'DHBVN - Dakshin Haryana Bijli Vitran', state: 'Haryana', code: 'DHBVN', iconBg: 'bg-indigo-600' },
];

export const LINKED_ELECTRICITY_ACCOUNT = {
  accountName: 'Sanskar Tower 1405',
  billerName: 'Torrent Power - Ahmedabad',
  consumerNo: '8392019482',
  dueDate: '12 Oct 2026',
  amount: 15000.00,
  billNumber: 'TP-MUM-2026-98124'
};

export const INTERNATIONAL_PAYEES = [
  { id: 'ip-1', name: 'P**** T*** SMITH', bank: 'Barclays Bank UK', iban: 'GB82 BARC 2004 0149 8812 01', currency: 'GBP', country: 'United Kingdom' },
  { id: 'ip-2', name: 'Alexander Von Keller', bank: 'Deutsche Bank AG', iban: 'DE89 3704 0044 0532 0130 00', currency: 'EUR', country: 'Germany' },
  { id: 'ip-3', name: 'Marcus Sterling LLC', bank: 'JPMorgan Chase US', iban: 'US33 CHAS 0210 0002 1892 44', currency: 'USD', country: 'United States' },
  { id: 'ip-4', name: 'Dubai Global Logistics FZE', bank: 'Emirates NBD', iban: 'AE07 0260 0012 3456 7890 12', currency: 'AED', country: 'United Arab Emirates' },
];

export const EXCHANGE_RATES = [
  { pair: 'USD / INR', rate: '84.12', change: '+0.15%' },
  { pair: 'GBP / INR', rate: '109.85', change: '-0.08%' },
  { pair: 'EUR / INR', rate: '92.30', change: '+0.22%' },
  { pair: 'AED / INR', rate: '22.90', change: '0.00%' },
];
