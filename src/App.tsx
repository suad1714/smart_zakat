/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Smart Zakat Main Application Router
 * Connects all 10 high-fidelity screens defined in SRS V2.0:
 *  - Screen 1: /                   (LandingPage)
 *  - Screen 2: /login              (LoginPage)
 *  - Screen 3: /dashboard          (DashboardPage)
 *  - Screen 4: /calculator         (CalculatorPage)
 *  - Screen 5: /donate             (ChooseDonatePage)
 *  - Screen 6: /donate/campaigns   (CampaignsPage)
 *  - Screen 7: /cases              (CasesPage)
 *  - Screen 8: /pay                (DistributePayPage)
 *  - Screen 9: /receipt & /receipt/:id (ReceiptPage)
 *  - Screen 10: /history           (HistoryPage)
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ChooseDonatePage } from './pages/ChooseDonatePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CasesPage } from './pages/CasesPage';
import { DistributePayPage } from './pages/DistributePayPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { HistoryPage } from './pages/HistoryPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-[#1A1615]">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/donate" element={<ChooseDonatePage />} />
                <Route path="/donate/campaigns" element={<CampaignsPage />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/pay" element={<DistributePayPage />} />
                <Route path="/receipt" element={<ReceiptPage />} />
                <Route path="/receipt/:id" element={<ReceiptPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
