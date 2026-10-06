# HSBC India Mobile Banking Prototype

A high-fidelity mobile banking application prototype built with **React**, **TypeScript**, **Tailwind CSS**, and **React Router**, styled according to the HSBC mobile design language and color architecture (`#DB0011`).

---

## 🔑 Demo Access Credentials
- **Login PIN**: `775533` (6-digit PIN input with custom numeric keypad)
- **Transaction PIN**: `775533` (Required to authorize bank transfers)
- **Alternate Login**: Username/Password (`vignesh.mohan`) or Biometric Authentication (Touch ID / Face ID)

---

## 📱 PWA Mobile Home Screen Installation
This app includes full Progressive Web App (PWA) configuration with the official **HSBC India icon**:
- **Android (Chrome)**: Tap the Chrome menu (⋮) -> **"Add to Home screen"** or **"Install app"**.
- **iPhone / iPad (Safari)**: Tap the Safari Share button -> **"Add to Home Screen"**.
- An **"Install to Phone"** button in the app provides an interactive preview and platform guide.

---

## 🚀 Screen Flow & Modules

1. **Screen 0 - Welcome / Landing (`/` or `/welcome`)**
   - Scenic alpine lake backdrop
   - "Welcome to HSBC" card
   - Actions: "Yes, log on or register" (primary red) & "Not yet, open a new account"

2. **Screen 0.5 - Login Page (`/login`)**
   - 3 Authentication tabs:
     - **PIN**: 6-digit boxes with custom on-screen keypad (PIN: `775533`)
     - **Password**: Username & password fields with visibility toggle
     - **Biometric**: Glowing fingerprint/face scan animation

3. **Screen 1 - Digital Secure Key Intro (`/secure-key`)**
   - Security overview and 6-digit PIN verification confirmation

4. **Screen 2 - Home / Bank Accounts (`/home`)**
   - Account Card: `SAVINGS ACCOUNT - RES` (`DB-XXXX-XXXX-1234`) with `₹2,50,999.00 INR` balance
   - Fast Action icons: Transfer, Pay Bills, mPassbook, Scan QR
   - mPassbook Real Ledger quick launcher badge
   - Menu list: *Bank Accounts >*, *Borrowing >*, *Cards >*, *Services >*
   - Bottom Nav: Home, Investment, Move Money, Support

5. **Screen 3 - People & Business (`/people-and-bills`)**
   - Grid of 8 circular contacts (`HR`, `CI`, `MR`, `RR`, `HI`, `B`, `RV`, `SB`)
   - Recent transactions feed
   - 8 Bill Payment categories (Mobile Recharge, Postpaid, Electricity, Gas, FASTag, EMI, Rent, View All)

6. **Screen 4 - Electricity Bill Payment (`/electricity-bill`)**
   - Search bar by bill operator
   - Linked Account (*Sanskar Tower 1405*, Consumer #8392019482) with instant Pay button
   - Catalog of Indian electricity providers (Adani, BESCOM, CESC, Tata Power, Torrent Power, etc.)

7. **Screen 5 - Pay and Transfer Main (`/pay-and-transfer`)**
   - Domestic and international transfer menus
   - Indicative Forex rates (USD, GBP, EUR, AED)
   - International payees and "Add payee" modal

8. **Screen 6 - Bank Transfer Form (`/transfer`)**
   - Clean, blank form on load (no pre-filled data)
   - Beneficiary Name, Account Number, Confirm Account Number with live match verification
   - IFSC Code input with auto-detected bank name (SBIN, HDFC, ICIC, HSBC, UTIB, KKBK, etc.)
   - Account Type (Savings / Current) & Transfer Mode (IMPS Instant / NEFT)
   - Step 2: Full Confirmation summary screen
   - Step 3: Transaction PIN popup (6 digits, keypad, PIN: `775533`)
   - Step 4: 2-second processing spinner with HSBC red theme
   - Step 5: Transfer success screen with 12-digit transaction ID and confetti

9. **Screen 7 - Payment Completed (`/payment-success`)**
   - Detailed transfer receipt, download and share options, direct link to mPassbook

10. **Screen 8 - Investment (`/investment`)**
    - Mutual Funds asset valuation (`₹50,571.13 INR`)
    - Asset allocation bar chart and unrealized gains

11. **Screen 9 - My Details / Support (`/profile`)**
    - Customer profile (Vignesh Mohan, Customer ID: 98402914)
    - Expandable KYC, tax residency, and contact information modals

12. **Screen 10 - mPassbook Real Ledger (`/mpassbook`)**
    - Authentic physical passbook styled with paper ruled lines and official ink stamp
    - Clean header (no large balance box)
    - 5-Column ledger: Date, Particulars/Narration, Withdrawal (Red), Deposit (Green), Balance
    - 20 realistic transactions with mathematical balance integrity
    - Printable (`window.print()`) & CSV statement export

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (version 18 or newer)
- npm or pnpm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎨 Theme Specifications
- **Primary Red**: `#DB0011`
- **Background**: `#F5F5F5`
- **Cards**: `#FFFFFF` with soft shadows
- **Text**: Black (`#000000`)
- **Ledger Font**: IBM Plex Mono & Courier Prime
