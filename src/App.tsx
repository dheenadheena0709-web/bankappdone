import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BankProvider } from './context/BankContext';
import { MobileFrame } from './components/MobileFrame';
import { TabSlideLayout } from './components/TabSlideLayout';

// Screens
import { ScreenSplash } from './screens/ScreenSplash';
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
import { ScreenMore } from './screens/ScreenMore';
import { MoreEStatements } from './screens/MoreEStatements';
import { MoreCards } from './screens/MoreCards';
import { MoreLimits } from './screens/MoreLimits';
import { MoreChequeScan } from './screens/MoreChequeScan';
import { MoreGSTSummary } from './screens/MoreGSTSummary';
import { ScreenQRScanner } from './screens/ScreenQRScanner';
import { ScreenUPI } from './screens/ScreenUPI';
import { ScreenFAQ } from './screens/ScreenFAQ';

export default function App() {
  return (
    <BrowserRouter>
      <BankProvider>
        <MobileFrame>
          <TabSlideLayout>
            {(loc) => (
              <Routes location={loc}>
                {/* Screen Splash - 3-second animated intro before login */}
                <Route path="/" element={<ScreenSplash />} />
                <Route path="/splash" element={<ScreenSplash />} />

                {/* Screen 0 - Welcome / Landing (Existing Login Page - 100% Unchanged) */}
                <Route path="/welcome" element={<Screen0Welcome />} />

                {/* Screen 0.5 - Login Page (PIN, Password, Biometric) */}
                <Route path="/login" element={<Screen05Login />} />

                {/* Screen 1 - Digital Secure Key Intro */}
                <Route path="/secure-key" element={<Screen1SecureKey />} />

                {/* Tab 1: Accounts / Home */}
                <Route path="/home" element={<Screen2Home />} />
                <Route path="/accounts" element={<Screen2Home />} />

                {/* Tab 2: Payments / Move Money / People & Bills */}
                <Route path="/payments" element={<Screen3PeopleBills />} />
                <Route path="/people-and-bills" element={<Screen3PeopleBills />} />
                <Route path="/move-money" element={<Screen3PeopleBills />} />
                <Route path="/pay-and-transfer" element={<Screen5PayTransfer />} />

                {/* Detail & Action Sub-pages */}
                <Route path="/electricity-bill" element={<Screen4Electricity />} />
                <Route path="/upi" element={<ScreenUPI />} />
                <Route path="/transfer" element={<Screen6TransferForm />} />
                <Route path="/payment-success" element={<Screen7PaymentSuccess />} />
                <Route path="/payment-failed" element={<Screen7PaymentSuccess />} />

                {/* Tab 3: Business / Investments */}
                <Route path="/business" element={<Screen8Investment />} />
                <Route path="/investment" element={<Screen8Investment />} />

                {/* Tab 4: Support / Profile */}
                <Route path="/support" element={<Screen9Profile />} />
                <Route path="/profile" element={<Screen9Profile />} />
                <Route path="/profile/faq" element={<ScreenFAQ />} />
                <Route path="/faq" element={<ScreenFAQ />} />
                <Route path="/help" element={<ScreenFAQ />} />

                {/* Tab 5: More / mPassbook & Sub-pages */}
                <Route path="/more" element={<ScreenMore />} />
                <Route path="/mpassbook" element={<Screen10Passbook />} />
                <Route path="/more/e-statements" element={<MoreEStatements />} />
                <Route path="/more/cards" element={<MoreCards />} />
                <Route path="/more/limits" element={<MoreLimits />} />
                <Route path="/more/cheque-scan" element={<MoreChequeScan />} />
                <Route path="/more/gst-summary" element={<MoreGSTSummary />} />

                {/* QR Scanner Screen */}
                <Route path="/scan-qr" element={<ScreenQRScanner />} />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </TabSlideLayout>
        </MobileFrame>
      </BankProvider>
    </BrowserRouter>
  );
}
