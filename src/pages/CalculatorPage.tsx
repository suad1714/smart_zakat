/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBDT, DEFAULT_NISAB_THRESHOLD } from '../utils/zakatCalculation';
import {
  HelpCircle,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const {
    calculatorInputs,
    setCalculatorInputs,
    calculationResult,
    useSrsBenchmarkValues,
    setUseSrsBenchmarkValues,
    user,
  } = useApp();

  const navigate = useNavigate();

  // Temporary local string states for responsive editing without losing focus or leading zeroes
  const [cashStr, setCashStr] = useState(calculatorInputs.cash.toString());
  const [goldStr, setGoldStr] = useState(calculatorInputs.goldGrams.toString());
  const [silverStr, setSilverStr] = useState(calculatorInputs.silverGrams.toString());
  const [investmentsStr, setInvestmentsStr] = useState(calculatorInputs.investments.toString());
  const [debtsStr, setDebtsStr] = useState(calculatorInputs.debts.toString());

  // Input validation errors
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, rawVal: string) => {
    // Disable pure benchmark override once user starts custom editing
    setUseSrsBenchmarkValues(false);

    const val = rawVal.replace(/[^0-9.]/g, '');
    const num = parseFloat(val) || 0;

    const nextErrors = { ...inputErrors };

    if (rawVal.trim() !== '' && isNaN(Number(val))) {
      nextErrors[field] = 'Enter a valid amount';
    } else if (num < 0) {
      nextErrors[field] = 'Amount cannot be negative';
    } else {
      delete nextErrors[field];
    }
    setInputErrors(nextErrors);

    if (field === 'cash') {
      setCashStr(val);
      setCalculatorInputs((prev) => ({ ...prev, cash: num }));
    } else if (field === 'gold') {
      setGoldStr(val);
      setCalculatorInputs((prev) => ({ ...prev, goldGrams: num }));
    } else if (field === 'silver') {
      setSilverStr(val);
      setCalculatorInputs((prev) => ({ ...prev, silverGrams: num }));
    } else if (field === 'investments') {
      setInvestmentsStr(val);
      setCalculatorInputs((prev) => ({ ...prev, investments: num }));
    } else if (field === 'debts') {
      setDebtsStr(val);
      setCalculatorInputs((prev) => ({ ...prev, debts: num }));
    }
  };

  const resetToSrsBenchmark = () => {
    setCashStr('450000');
    setGoldStr('40');
    setSilverStr('0');
    setInvestmentsStr('120000');
    setDebtsStr('30000');
    setCalculatorInputs({
      cash: 450000,
      goldGrams: 40,
      silverGrams: 0,
      investments: 120000,
      debts: 30000,
    });
    setUseSrsBenchmarkValues(true);
    setInputErrors({});
  };

  const handleContinueToDonate = () => {
    if (!calculationResult.isAboveNisab || calculationResult.zakatDue <= 0) return;

    if (!user.isLoggedIn) {
      // Alternate Flow AF2: Guest continues -> redirect to login with state
      navigate('/login', {
        state: { from: { pathname: '/pay' }, zakatAmount: calculationResult.zakatDue },
      });
    } else {
      navigate('/pay', { state: { prefillAmount: calculationResult.zakatDue } });
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight">
                Zakat Calculator
              </h1>
              <p className="text-base text-[#665E5A] mt-2 font-medium">
                Enter your assets as of today
              </p>
            </div>

            {/* SRS Benchmark Reset Button */}
            <button
              onClick={resetToSrsBenchmark}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DDD5CE] bg-[#FAF7F5] text-xs font-semibold text-[#544D48] hover:bg-[#FFF0E8] hover:text-[#F0440A] hover:border-[#F0440A] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Load Screen 4 Design Benchmark
            </button>
          </div>
        </div>

        {/* 2-Column Layout matching Screen 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form Fields & About Nisab Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Cash & bank savings */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Cash & bank savings
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-sm font-medium text-[#7D736D]">
                    BDT
                  </span>
                  <input
                    type="text"
                    value={cashStr}
                    onChange={(e) => handleInputChange('cash', e.target.value)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                    placeholder="450,000"
                  />
                </div>
                {inputErrors.cash && (
                  <p className="text-xs text-red-500 mt-1">{inputErrors.cash}</p>
                )}
              </div>

              {/* Gold (grams) */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Gold (grams)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={goldStr}
                    onChange={(e) => handleInputChange('gold', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                    placeholder="40"
                  />
                  <span className="absolute right-4 top-3.5 text-sm font-medium text-[#7D736D]">
                    g
                  </span>
                </div>
                {inputErrors.gold && (
                  <p className="text-xs text-red-500 mt-1">{inputErrors.gold}</p>
                )}
              </div>

              {/* Silver (grams) */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Silver (grams)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={silverStr}
                    onChange={(e) => handleInputChange('silver', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-3.5 text-sm font-medium text-[#7D736D]">
                    g
                  </span>
                </div>
                {inputErrors.silver && (
                  <p className="text-xs text-red-500 mt-1">{inputErrors.silver}</p>
                )}
              </div>

              {/* Investments / business stock */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Investments / business stock
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-sm font-medium text-[#7D736D]">
                    BDT
                  </span>
                  <input
                    type="text"
                    value={investmentsStr}
                    onChange={(e) => handleInputChange('investments', e.target.value)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                    placeholder="120,000"
                  />
                </div>
                {inputErrors.investments && (
                  <p className="text-xs text-red-500 mt-1">{inputErrors.investments}</p>
                )}
              </div>

              {/* Debts & liabilities (deduct) */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Debts & liabilities (deduct)
                </label>
                <div className="relative sm:w-1/2">
                  <span className="absolute left-4 top-3.5 text-sm font-medium text-[#7D736D]">
                    BDT
                  </span>
                  <input
                    type="text"
                    value={debtsStr}
                    onChange={(e) => handleInputChange('debts', e.target.value)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                    placeholder="30,000"
                  />
                </div>
                {inputErrors.debts && (
                  <p className="text-xs text-red-500 mt-1">{inputErrors.debts}</p>
                )}
              </div>
            </div>

            {/* About Nisab Box (Exact match from design page 4) */}
            <div className="rounded-2xl bg-[#FFF0E8] border border-[#FFE2D1] p-6 space-y-3">
              <h3 className="text-base font-bold text-[#1A1615]">
                About Nisab
              </h3>
              <p className="text-sm text-[#5C534E] leading-relaxed">
                Zakat is due when your wealth stays above the nisab threshold for a full lunar year.
              </p>
              
              {calculationResult.isAboveNisab ? (
                <div className="flex items-center gap-2 text-sm font-bold text-[#F0440A] pt-1">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Your total is above nisab, so Zakat applies.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-bold text-amber-700 pt-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Your wealth is below nisab; Zakat is not due.</span>
                </div>
              )}

              {/* Appendix D note clarification tooltip */}
              <div className="text-[11px] text-[#8C827B] pt-2 border-t border-[#FFE4D5] flex items-center justify-between">
                <span>
                  Nisab benchmark: <strong>{formatBDT(DEFAULT_NISAB_THRESHOLD)}</strong> (595g Silver standard)
                </span>
                <span className="italic">SRS V2.0 Academic Spec</span>
              </div>
            </div>

          </div>

          {/* Right Column: Your Result Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-[#1A1615]">
                Your result
              </h2>

              <div className="space-y-4 pb-4 border-b border-[#F0EBE6]">
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium text-[#665E5A]">Zakatable wealth</span>
                  <span className="font-bold text-[#1A1615]">
                    {formatBDT(calculationResult.zakatableWealth)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base">
                  <span className="font-medium text-[#665E5A]">Debts deducted</span>
                  <span className="font-bold text-[#665E5A]">
                    - {formatBDT(calculationResult.debtsDeducted)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base pt-2">
                  <span className="font-semibold text-[#1A1615]">Net wealth</span>
                  <span className="font-extrabold text-[#1A1615]">
                    {formatBDT(calculationResult.netWealth)}
                  </span>
                </div>
              </div>

              {/* Peach highlight box: Zakat due (2.5%) */}
              <div className="rounded-2xl bg-[#FFF0E8] p-6 text-center space-y-1.5 border border-[#FFE2D1]">
                <p className="text-xs sm:text-sm font-semibold text-[#665E5A]">
                  Zakat due (2.5%)
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#F0440A] tracking-tight">
                  {formatBDT(calculationResult.zakatDue)}
                </p>
              </div>

              {/* Action Button: Continue to Donate */}
              {calculationResult.isAboveNisab && calculationResult.zakatDue > 0 ? (
                <button
                  onClick={handleContinueToDonate}
                  className="w-full py-4 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07] shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Continue to Donate
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full py-3.5 px-6 rounded-full bg-gray-200 text-gray-500 font-semibold text-sm cursor-not-allowed"
                  >
                    Zakat Not Due (Below Nisab)
                  </button>
                  <Link
                    to="/donate/campaigns"
                    className="block text-center w-full py-3 px-6 rounded-full border border-[#DDD5CE] bg-white text-[#1A1615] font-semibold text-sm hover:bg-[#FAF7F5]"
                  >
                    Give General Donation (Sadaqah) Instead
                  </Link>
                </div>
              )}

              <p className="text-xs text-[#8A817C] text-center leading-relaxed">
                Formula: Net Wealth = Zakatable Wealth − Debts • Zakat Due = Net Wealth × 2.5%
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
