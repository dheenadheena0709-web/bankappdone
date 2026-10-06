import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BankProvider } from './context/BankContext';
import { MobileFrame } from './components/MobileFrame';

// Screens
import { Screen0Welcome } from './screens/Screen0Welcome';
import { Screen05Login } from './screens/Screen05Login';
import { Screen1SecureKey } from './screens/Screen1SecureKey';
import { Screen2Home } from './screens/Screen2Home';
import { Screen3PeopleBills } from './screens/Screen3PeopleBills';
import { Screen4Electricity } from './screens/Screen4Electricity';
import { Screen5PayTransfer } from './screens/Screen5PayTransfer';
import { Screen6TransferForm } from './screens/Screen6TransferForm';
import { Screen7PaymentSuccess } from './screens/Screen7PaymentSuccess';
import { Screen8Investment } from './screens/Screen8Investment';
import { Screen9Profile } from './screens/Screen9Profile';
import { Screen10Passbook } from './screens/Screen10Passbook';

export default function App() {
  return (
    <BrowserRouter>
      <BankProvider>
        <MobileFrame>
          <Routes>
            {/* Screen 0 - Welcome / Landing */}
            <Route path="/" element={<Screen0Welcome />} />
            <Route path="/welcome" element={<Screen0Welcome />} />

            {/* Screen 0.5 - Login Page (PIN, Password, Biometric) */}
            <Route path="/login" element={<Screen05Login />} />

            {/* Screen 1 - Digital Secure Key Intro */}
            <Route path="/secure-key" element={<Screen1SecureKey />} />

            {/* Screen 2 - Home / Bank Accounts */}
            <Route path="/home" element={<Screen2Home />} />
            <Route path="/accounts" element={<Screen2Home />} />

            {/* Screen 3 - People & Business + Bill Payments */}
            <Route path="/people-and-bills" element={<Screen3PeopleBills />} />
            <Route path="/move-money" element={<Screen3PeopleBills />} />

            {/* Screen 4 - Electricity Bill Payment */}
            <Route path="/electricity-bill" element={<Screen4Electricity />} />

            {/* Screen 5 - Pay and Transfer Main */}
            <Route path="/pay-and-transfer" element={<Screen5PayTransfer />} />

            {/* Screen 6 - Transfer Form */}
            <Route path="/transfer" element={<Screen6TransferForm />} />

            {/* Screen 7 - Payment Completed */}
            <Route path="/payment-success" element={<Screen7PaymentSuccess />} />

            {/* Screen 8 - Investment */}
            <Route path="/investment" element={<Screen8Investment />} />

            {/* Screen 9 - My Details / Profile */}
            <Route path="/profile" element={<Screen9Profile />} />

            {/* Screen 10 - mPASSBOOK - REAL PHYSICAL LEDGER */}
            <Route path="/mpassbook" element={<Screen10Passbook />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MobileFrame>
      </BankProvider>
    </BrowserRouter>
  );
}
