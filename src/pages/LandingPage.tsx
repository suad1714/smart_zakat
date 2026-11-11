/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  ShieldCheck,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1615] tracking-tight leading-[1.12]">
                Give your Zakat <br />
                <span className="text-[#F0440A]">with confidence.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#5C5551] max-w-xl leading-relaxed">
                Calculate Zakat in minutes and pay hospital bills directly. See exactly where every taka goes.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/calculator"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07] shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Calculate Zakat
              </Link>
              <Link
                to="/donate"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border border-[#DDD5CE] text-[#1A1615] font-semibold text-base hover:bg-[#FAF7F5] hover:border-[#1A1615] transition-all"
              >
                Donate Now
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic / Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#FFF0E8] border border-[#FFE2D1] p-8 sm:p-10 shadow-xs overflow-hidden flex flex-col justify-between min-h-[360px]">
              {/* Decorative Subtle Circles */}
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/40 pointer-events-none" />
              <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-[#FFE4D4]/60 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-white text-xs font-semibold text-[#F0440A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  100% Direct Verification
                </div>
                <h3 className="text-2xl font-bold text-[#1A1615]">
                  Direct Hospital Settlement
                </h3>
                <p className="text-sm text-[#635A55] leading-relaxed">
                  Every taka is matched to hospital-confirmed bill references. Patient identities remain strictly anonymised while giving donors verifiable proof of payment.
                </p>
              </div>

              {/* Mini visual indicator */}
              <div className="relative z-10 mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#635A55]">
                  <span>Bill #A-2291 · Heart Surgery</span>
                  <span className="text-[#F0440A]">BDT 5,000 paid</span>
                </div>
                <div className="w-full bg-[#FFE6D9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#F0440A] h-full rounded-full w-2/3" />
                </div>
                <p className="text-[11px] text-[#857C76] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified by City Hospital Billing Desk & Scholars
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stat 1 */}
          <div className="rounded-2xl bg-[#FFF0E8] p-8 text-center border border-[#FFE2D1] hover:shadow-xs transition-shadow">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F0440A] tracking-tight mb-2">
              BDT 2.4M
            </p>
            <p className="text-sm sm:text-base font-medium text-[#5E5652]">
              Donated so far
            </p>
          </div>

          {/* Stat 2 */}
          <div className="rounded-2xl bg-[#FFF0E8] p-8 text-center border border-[#FFE2D1] hover:shadow-xs transition-shadow">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F0440A] tracking-tight mb-2">
              120+
            </p>
            <p className="text-sm sm:text-base font-medium text-[#5E5652]">
              Patients helped
            </p>
          </div>

          {/* Stat 3 */}
          <div className="rounded-2xl bg-[#FFF0E8] p-8 text-center border border-[#FFE2D1] hover:shadow-xs transition-shadow">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F0440A] tracking-tight mb-2">
              15
            </p>
            <p className="text-sm sm:text-base font-medium text-[#5E5652]">
              Partner hospitals
            </p>
          </div>
        </div>
      </section>

      {/* Three Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <Link
            to="/calculator"
            className="flex items-start gap-4 p-6 rounded-2xl hover:bg-[#FFFBF9] border border-transparent hover:border-[#F2ECE7] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F0440A] flex-shrink-0 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1615] group-hover:text-[#F0440A] transition-colors">
                Easy Zakat calculator
              </h3>
              <p className="text-sm text-[#665E5A] mt-1 leading-relaxed">
                Know exactly what you owe
              </p>
            </div>
          </Link>

          {/* Feature 2 */}
          <Link
            to="/cases"
            className="flex items-start gap-4 p-6 rounded-2xl hover:bg-[#FFFBF9] border border-transparent hover:border-[#F2ECE7] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F0440A] flex-shrink-0 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1615] group-hover:text-[#F0440A] transition-colors">
                Verified patient cases
              </h3>
              <p className="text-sm text-[#665E5A] mt-1 leading-relaxed">
                Hospital-confirmed and eligible
              </p>
            </div>
          </Link>

          {/* Feature 3 */}
          <Link
            to="/history"
            className="flex items-start gap-4 p-6 rounded-2xl hover:bg-[#FFFBF9] border border-transparent hover:border-[#F2ECE7] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F0440A] flex-shrink-0 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1615] group-hover:text-[#F0440A] transition-colors">
                Proof of payment
              </h3>
              <p className="text-sm text-[#665E5A] mt-1 leading-relaxed">
                Bill receipts, privacy protected
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* How It Works Strip */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
        <div className="py-5 px-6 rounded-2xl bg-[#FAF7F5] border border-[#EDE7E2]">
          <p className="text-sm sm:text-base font-semibold text-[#4A4340] flex flex-wrap items-center justify-center gap-2">
            <span className="text-[#857B75] font-normal">How it works:</span>
            <span className="text-[#F0440A]">Calculate</span>
            <span className="text-[#B3A9A2]">&gt;</span>
            <span className="text-[#F0440A]">Choose recipients</span>
            <span className="text-[#B3A9A2]">&gt;</span>
            <span className="text-[#F0440A]">Pay</span>
            <span className="text-[#B3A9A2]">&gt;</span>
            <span className="text-[#F0440A]">Get proof</span>
          </p>
        </div>
      </section>
    </div>
  );
};
