/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coins, Heart, HeartPulse, ArrowRight, ShieldCheck } from 'lucide-react';

export const ChooseDonatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching high-fidelity design */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight">
            How would you like to give?
          </h1>
          <p className="text-base sm:text-lg text-[#665E5A] font-medium">
            Every gift is tracked and labelled Zakat or Donation
          </p>
        </div>

        {/* Three Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Pay Zakat */}
          <div className="rounded-3xl border border-[#EFEBE7] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              {/* Peach visual placeholder matching the design */}
              <div className="w-full h-44 rounded-2xl bg-[#FFF0E8] border border-[#FFE2D1] flex items-center justify-center text-[#F0440A]">
                <Coins className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1615]">
                  Pay Zakat
                </h3>
                <p className="text-sm text-[#665E5A] leading-relaxed">
                  Calculate Zakat and give to eligible people
                </p>
              </div>

              {/* Tag */}
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF0E8] text-[#F0440A] text-xs font-semibold">
                  Zakat
                </span>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/calculator"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-sm hover:bg-[#D63A07] shadow-sm transition-all active:scale-95"
              >
                Start
              </Link>
            </div>
          </div>

          {/* Card 2: General Donation */}
          <div className="rounded-3xl border border-[#EFEBE7] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              {/* Peach visual placeholder matching the design */}
              <div className="w-full h-44 rounded-2xl bg-[#FFF0E8] border border-[#FFE2D1] flex items-center justify-center text-[#F0440A]">
                <Heart className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1615]">
                  General Donation
                </h3>
                <p className="text-sm text-[#665E5A] leading-relaxed">
                  Support hospital and charity campaigns (Sadaqah)
                </p>
              </div>

              {/* Tag */}
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#F2EFEA] text-[#5C5551] text-xs font-semibold">
                  Donation
                </span>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/donate/campaigns"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-sm hover:bg-[#D63A07] shadow-sm transition-all active:scale-95"
              >
                Browse campaigns
              </Link>
            </div>
          </div>

          {/* Card 3: Fund a Patient's Bill */}
          <div className="rounded-3xl border border-[#EFEBE7] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              {/* Peach visual placeholder matching the design */}
              <div className="w-full h-44 rounded-2xl bg-[#FFF0E8] border border-[#FFE2D1] flex items-center justify-center text-[#F0440A]">
                <HeartPulse className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1615]">
                  Fund a Patient's Bill
                </h3>
                <p className="text-sm text-[#665E5A] leading-relaxed">
                  Pay a verified hospital bill directly
                </p>
              </div>

              {/* Tag */}
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF0E8] text-[#1A1615] text-xs font-semibold border border-[#FFE2D1]">
                  Zakat or Donation
                </span>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/cases"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-sm hover:bg-[#D63A07] shadow-sm transition-all active:scale-95"
              >
                View cases
              </Link>
            </div>
          </div>

        </div>

        {/* Shariah note */}
        <div className="mt-12 text-center text-xs text-[#807975] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F0440A]" />
          <span>Every transaction complies with BR-7: all contributions are unambiguously tracked as either Zakat or Donation.</span>
        </div>

      </div>
    </div>
  );
};
