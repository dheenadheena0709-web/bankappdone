import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Send,
  ShieldCheck,
  CreditCard,
  FileText,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'general' | 'accounts' | 'transfers' | 'security' | 'cards' | 'tools';
  question: string;
  answer: string;
  highlights?: string[];
  link?: { label: string; path: string };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'passbook-1',
    category: 'accounts',
    question: 'How do I access and read my digital mPassbook ledger?',
    answer:
      'Navigate to the "More" tab from the bottom navigation bar and select "Digital mPassbook Ledger". Your mPassbook presents authentic bank ledger ruled pages with debit, credit, transaction narration, reference IDs, and real-time running balance. You can filter by date or search specific transaction remarks.',
    highlights: ['Go to More > Digital mPassbook Ledger', 'Filter debits, credits, and dates', 'Offline-style physical passbook simulation'],
    link: { label: 'Open mPassbook', path: '/mpassbook' }
  },
  {
    id: 'estatement-1',
    category: 'accounts',
    question: 'Where can I view or download my official account e-Statements?',
    answer:
      'Open the "More" tab and select "Official e-Statements & Certificates". You can view certified statements for available periods (e.g. October 2026), view formal bank seal verification, and download PDF certificates.',
    highlights: ['More > Official e-Statements', 'Includes bank seal & branch stamp', 'October statement available'],
    link: { label: 'View e-Statements', path: '/more/e-statements' }
  },
  {
    id: 'transfer-1',
    category: 'transfers',
    question: 'How do I transfer funds using IMPS, NEFT, or RTGS?',
    answer:
      'Navigate to "Payments" tab or tap "Send Money" on Home. Enter the beneficiary account number, re-confirm the account number, and enter their IFSC code. You can choose between instant IMPS (24x7) or standard NEFT/RTGS settlement and authorize using your 6-digit Secure Key PIN.',
    highlights: ['Instant 24x7 IMPS transfers', 'Automatic bank & branch IFSC detection', 'Zero transfer charges for Premier accounts'],
    link: { label: 'Go to Transfer Form', path: '/transfer' }
  },
  {
    id: 'upi-1',
    category: 'transfers',
    question: 'How does UPI payment and QR scanning work in the app?',
    answer:
      'Tap "UPI Payments" or the "Scan QR" button at the top of the Home screen. You can point your device camera at any UPI QR code (Google Pay, PhonePe, Paytm, BharatQR) or upload a QR image directly from your photo gallery. You can also send funds to any UPI ID or linked mobile number.',
    highlights: ['Supports all NPCI UPI & BharatQR codes', 'Upload QR screenshots from gallery', 'Instant payment with 6-digit UPI PIN'],
    link: { label: 'Open UPI Screen', path: '/upi' }
  },
  {
    id: 'my-upi-id',
    category: 'transfers',
    question: 'What is my personal UPI ID and how do I receive payments?',
    answer:
      'Your default UPI handle is sirajudeen.sharif@hsbc linked to your Premier Savings Account (••••2010). To share your QR code with senders, open the UPI Payments screen and tap "My QR". You can copy your UPI ID or show the QR code directly.',
    highlights: ['Default ID: sirajudeen.sharif@hsbc', 'Linked to Savings Account ••••2010', 'Tap "My QR" to display and copy'],
    link: { label: 'View My UPI ID', path: '/upi' }
  },
  {
    id: 'security-1',
    category: 'security',
    question: 'What is the Digital Secure Key and how does it protect my account?',
    answer:
      'The Digital Secure Key turns your phone into an encrypted hardware security token. It generates single-use authorization codes locally on your smartphone, even without cellular reception or Wi-Fi, preventing phishing and unauthorized transactions.',
    highlights: ['Single-use cryptographic codes', 'Works offline without cell reception', 'Protects high-value transfers & sign-in'],
    link: { label: 'Secure Key Overview', path: '/secure-key' }
  },
  {
    id: 'biometric-1',
    category: 'security',
    question: 'Why is Biometric login disabled and how do I authenticate?',
    answer:
      'Biometric auto-unlock is disabled for enhanced security to prevent unauthorized access. The 6-digit Digital Secure Key PIN is the primary, required, and authorized login method to access your account.',
    highlights: ['PIN is primary and authorized logon method', 'Biometric auto-unlock disabled for security', 'Prevents unauthorized device bypass'],
    link: { label: 'Go to Logon Screen', path: '/login' }
  },
  {
    id: 'frozen-1',
    category: 'security',
    question: 'What does "Account Frozen (Code: ACCT_FRZ_001)" mean?',
    answer:
      'If you encounter the "Account Frozen" alert when attempting a debit transfer, outgoing debit transactions have been paused by compliance. Please visit your home branch (HSBC Fort Main Branch, Mumbai) with original government identification documents (PAN and Aadhaar) for biometric verification.',
    highlights: ['Security Hold Code ACCT_FRZ_001', 'Visit Fort Main Branch, Mumbai', 'Bring original PAN & Aadhaar documents'],
  },
  {
    id: 'cards-1',
    category: 'cards',
    question: 'How do I manage my Premier Debit Card limits and controls?',
    answer:
      'Go to "More" > "Kinetic Premier Debit & Virtual Cards". You can view your card details, set domestic and international POS limits, toggle contactless payment locks, or request a replacement card.',
    highlights: ['Zero foreign currency markup', 'Instant contactless & online toggles', 'Complimentary airport lounge access'],
    link: { label: 'View Cards', path: '/more/cards' }
  },
  {
    id: 'limits-1',
    category: 'cards',
    question: 'What are my daily transaction limits and how do I change them?',
    answer:
      'Visit "More" > "Daily Payment & UPI Limits". You can inspect your Daily UPI Cap (up to ₹1,00,000/day), IMPS Transfer Cap (up to ₹5,00,000/day), and ATM Cash Withdrawal limit. Adjusting limits takes effect immediately.',
    highlights: ['UPI limit: ₹1,00,000/day', 'IMPS limit: ₹5,00,000/day', 'Adjust limits anytime with Secure Key'],
    link: { label: 'Adjust Limits', path: '/more/limits' }
  },
  {
    id: 'cheque-1',
    category: 'tools',
    question: 'How can I deposit a physical bank cheque through the app?',
    answer:
      'Open "More" > "Scan & Deposit Cheque". Capture clear photos of the front and back of your signed CTS-2010 cheque. Enter the cheque amount and date. Funds will clear into your Premier Savings Account within 24 to 48 banking hours.',
    highlights: ['CTS-2010 digital clearing', 'Capture front & back photos', 'Cheque clearing within 24-48 hours'],
    link: { label: 'Deposit Cheque', path: '/more/cheque-scan' }
  },
  {
    id: 'gst-1',
    category: 'tools',
    question: 'Where can I access my GST and Business Tax Summary?',
    answer:
      'Navigate to "More" > "GST & Business Tax Summary". You can verify your registered GST number (GSTIN), business trade name, and tax filing records.',
    highlights: ['Registered GSTIN details', 'Business tax filing summaries', 'Tax invoices and certificates'],
    link: { label: 'View GST Summary', path: '/more/gst-summary' }
  },
  {
    id: 'dark-mode-1',
    category: 'general',
    question: 'How do I toggle Dark Mode or change the application language?',
    answer:
      'Open the "Support" or "Profile" tab from the bottom navigation. In "Settings & Preferences", use the Dark Mode switch to swap between high-contrast dark theme and light theme. You can also tap "App Language" to choose between English, Hindi, Tamil, Telugu, Marathi, Bengali, and Kannada.',
    highlights: ['Dark theme with Slate-900 palette', '7 regional Indian languages supported', 'Preferences automatically saved locally'],
    link: { label: 'Open Settings', path: '/profile' }
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'accounts', label: 'Accounts & Passbook', icon: BookOpen },
  { id: 'transfers', label: 'Transfers & UPI', icon: Send },
  { id: 'security', label: 'Security & Login', icon: ShieldCheck },
  { id: 'cards', label: 'Cards & Limits', icon: CreditCard },
  { id: 'tools', label: 'Cheques & Tax', icon: FileText },
  { id: 'general', label: 'General & Theme', icon: HelpCircle },
];

export const ScreenFAQ: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'passbook-1': true, // Expanded by default for instant preview
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    filteredFAQs.forEach((item) => {
      allExpanded[item.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F5F5F5] dark:bg-slate-950 min-h-screen min-h-[100dvh] text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Top Header Background: #DB0011 */}
      <header className="bg-[#DB0011] dark:bg-slate-900 text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-5 shadow-sm border-b border-transparent dark:border-slate-800 transition-colors duration-200 w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/profile')}
              className="p-1 -ml-1 text-white hover:bg-black/10 rounded-lg transition cursor-pointer"
              aria-label="Back to Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Help & FAQs</h1>
              <p className="text-xs text-white/80 dark:text-slate-400">
                Frequently Asked Questions & User Guides
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. UPI, passbook, limits)..."
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs font-medium border border-transparent focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 space-y-3.5">
        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#DB0011] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header with count and Expand/Collapse All */}
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'Question' : 'Questions'} Found
          </span>
          {filteredFAQs.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={expandAll}
                className="text-[#DB0011] dark:text-red-400 font-semibold hover:underline cursor-pointer"
              >
                Expand all
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={collapseAll}
                className="text-slate-500 dark:text-slate-400 font-semibold hover:underline cursor-pointer"
              >
                Collapse all
              </button>
            </div>
          )}
        </div>

        {/* FAQ Accordion List */}
        {filteredFAQs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No matching questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                We couldn&apos;t find any questions matching &quot;{searchQuery}&quot;. Try different keywords or browse all categories.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFAQs.map((item) => {
              const isExpanded = !!expandedIds[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full p-4 flex items-start justify-between gap-3 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {item.category}
                        </span>
                        {item.highlights && item.highlights.length > 0 && (
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                        {item.highlights && item.highlights.length > 0 && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#DB0011] dark:group-hover:text-red-400 transition leading-snug">
                        {item.question}
                      </h3>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Answer Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 animate-fade-in">
                      <p>{item.answer}</p>

                      {/* Bullet Key Points */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-150 dark:border-slate-800 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                            Key Takeaways
                          </span>
                          {item.highlights.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Direct Navigation Button if Applicable */}
                      {item.link && (
                        <div className="pt-1">
                          <button
                            onClick={() => navigate(item.link!.path)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-[#DB0011] dark:text-red-400 text-xs font-bold transition cursor-pointer"
                          >
                            <span>{item.link.label}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Need More Assistance Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm mt-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#DB0011] dark:text-red-400 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                Still have questions?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Contact HSBC Premier 24x7 Customer Support
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <a
              href="tel:18002663456"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 flex flex-col items-start gap-1 transition"
            >
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Toll-Free Phone</span>
              <strong className="text-slate-900 dark:text-white font-mono text-[11px]">1800 266 3456</strong>
            </a>

            <a
              href="mailto:supportindia@hsbc.com"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 flex flex-col items-start gap-1 transition"
            >
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Email Support</span>
              <strong className="text-slate-900 dark:text-white text-[11px] truncate w-full">supportindia@hsbc.com</strong>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScreenFAQ;
