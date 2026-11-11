/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, RefreshCw, FileText, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetDemoData } = useApp();

  return (
    <footer className="bg-[#FAF7F5] border-t border-[#EFEBE7] mt-20 pt-16 pb-12 text-[#4A4543]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F0440A] flex items-center justify-center text-white font-extrabold text-sm">
                SZ
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1A1615]">
                Smart Zakat
              </span>
            </div>
            <p className="text-sm text-[#6B6561] max-w-md leading-relaxed">
              Give your Zakat with confidence. A transparent charity fintech platform that enables donors to calculate annual Zakat, fund hospital bills directly, and verify every taka allocated to scholar-approved recipients.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2DD] text-xs font-medium text-[#4A4543]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F0440A]" />
                Shariah Board Reviewed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2DD] text-xs font-medium text-[#4A4543]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Hospital Verified Bills
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2DD] text-xs font-medium text-[#4A4543]">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                SRS V2.0 Compliant
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1A1615]">
              Platform Screens
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#F0440A] transition-colors">
                  Screen 1: Landing Page
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-[#F0440A] transition-colors">
                  Screen 4: Zakat Calculator
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-[#F0440A] transition-colors">
                  Screen 5: Choose How to Give
                </Link>
              </li>
              <li>
                <Link to="/donate/campaigns" className="hover:text-[#F0440A] transition-colors">
                  Screen 6: Active Campaigns
                </Link>
              </li>
              <li>
                <Link to="/cases" className="hover:text-[#F0440A] transition-colors">
                  Screen 7: Verified Patient Cases
                </Link>
              </li>
              <li>
                <Link to="/pay" className="hover:text-[#F0440A] transition-colors">
                  Screen 8: Distribute & Pay
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Demo Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1A1615]">
              Donor & History
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-[#F0440A] transition-colors">
                  Screen 3: Donor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#F0440A] transition-colors">
                  Screen 10: History & Auto-Pay
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#F0440A] transition-colors">
                  Screen 2: Login / Register
                </Link>
              </li>
              <li>
                <Link to="/receipt/ZK-10482" className="hover:text-[#F0440A] transition-colors">
                  Screen 9: Proof of Payment
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0D8D0] bg-white text-xs font-medium text-[#6B6561] hover:text-[#F0440A] hover:border-[#F0440A] transition-all"
                title="Reset LocalStorage demo data to default baseline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EAE3DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#807975]">
          <p>
            © 2026 Smart Zakat Prototype. University Software Engineering Mid-Progress Evaluation.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Currency: <strong>Bangladeshi Taka (BDT)</strong>
            </span>
            <span>•</span>
            <span>Netlify Deployment Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
