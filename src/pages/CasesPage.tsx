/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, PatientCase } from '../context/AppContext';
import { formatBDT } from '../utils/zakatCalculation';
import { ShieldCheck, HeartPulse, UserX, X, Heart, Coins, CheckCircle2 } from 'lucide-react';

export const CasesPage: React.FC = () => {
  const { patientCases, addDonation, user } = useApp();
  const navigate = useNavigate();

  // Category filter: 'All' | 'Surgery' | 'Dialysis' | 'Medicine'
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Selected case for funding modal
  const [fundingCase, setFundingCase] = useState<PatientCase | null>(null);
  const [giftType, setGiftType] = useState<'Zakat' | 'Donation'>('Zakat');
  const [fundAmountStr, setFundAmountStr] = useState<string>('5000');
  const [fundingError, setFundingError] = useState<string | null>(null);

  const filteredCases = patientCases.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  const handleOpenFundingModal = (c: PatientCase) => {
    setFundingCase(c);
    setGiftType('Zakat');
    const remaining = c.amountNeeded - c.raisedAmount;
    setFundAmountStr(Math.min(5000, remaining).toString());
    setFundingError(null);
  };

  const handleConfirmFunding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundingCase) return;

    const amount = Number(fundAmountStr) || 0;
    const remaining = fundingCase.amountNeeded - fundingCase.raisedAmount;

    if (amount < 100) {
      setFundingError('Please enter an amount of at least BDT 100.');
      return;
    }

    if (amount > remaining) {
      setFundingError(`Amount exceeds remaining need of ${formatBDT(remaining)}. Please enter ${remaining} or less.`);
      return;
    }

    // Process simulated donation
    const receiptId = addDonation({
      recipientDisplay: `${fundingCase.hospitalName} - Bill #${fundingCase.id}`,
      type: giftType,
      amount,
      paymentMethod: 'bKash',
      allocations: [
        {
          recipient: fundingCase.hospitalName,
          category: fundingCase.category,
          billRef: `Bill #${fundingCase.id}`,
          patientId: `Patient ${fundingCase.anonymisedPatientId} (anonymised)`,
          amount,
          percent: 100,
          notes: `${fundingCase.title}, Patient ID ${fundingCase.anonymisedPatientId}`,
        },
      ],
    });

    setFundingCase(null);
    navigate(`/receipt/${receiptId}`);
  };

  return (
    <div className="min-h-screen bg-white py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight">
              Verified patient cases
            </h1>
            <p className="text-sm text-[#665E5A] mt-1.5 font-medium">
              All cases are hospital-verified and anonymised
            </p>
          </div>

          {/* Filter Pills matching high-fidelity screen 7 */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#FAF7F5] border border-[#EAE3DC] self-start sm:self-auto overflow-x-auto">
            {['All', 'Surgery', 'Dialysis', 'Medicine'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#F0440A] text-white shadow-xs'
                    : 'text-[#5C5551] hover:text-[#1A1615] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCases.map((patientCase) => {
            return (
              <div
                key={patientCase.id}
                className="rounded-3xl border border-[#EFEBE7] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div className="space-y-5">
                  {/* Visual peach placeholder banner */}
                  <div className="w-full h-44 rounded-2xl bg-[#FFF0E8] border border-[#FFE2D1] flex items-center justify-center text-[#F0440A] relative overflow-hidden">
                    <HeartPulse className="w-16 h-16 opacity-80 group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 right-3 text-[11px] font-semibold bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[#665E5A]">
                      ID: {patientCase.anonymisedPatientId}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-[#1A1615]">
                      {patientCase.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#665E5A]">
                      Needed: {formatBDT(patientCase.amountNeeded)}
                    </p>

                    {/* Verified by hospital badge */}
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E8] text-[#1A1615] text-xs font-semibold border border-[#FFE2D1]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified by hospital
                      </span>
                    </div>
                  </div>

                  {/* Funding progress */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#665E5A]">
                      <span>{patientCase.percentFunded}% funded</span>
                      <span>Remaining: {formatBDT(patientCase.amountNeeded - patientCase.raisedAmount)}</span>
                    </div>
                    <div className="w-full bg-[#EFEBE7] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#F0440A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${patientCase.percentFunded}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action & Note */}
                <div className="pt-8 space-y-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleOpenFundingModal(patientCase)}
                    className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-sm hover:bg-[#D63A07] shadow-sm transition-all active:scale-95"
                  >
                    Fund this bill
                  </button>

                  <p className="text-xs text-[#807975] flex items-center justify-center gap-1">
                    <UserX className="w-3.5 h-3.5" />
                    Patient identity is protected
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Funding Modal (UC-6) */}
      {fundingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EFEBE7] space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1A1615]">
                  Fund Medical Bill
                </h3>
                <p className="text-xs text-[#665E5A] mt-0.5">
                  {fundingCase.title} · {fundingCase.hospitalName}
                </p>
              </div>
              <button
                onClick={() => setFundingCase(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {fundingError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                {fundingError}
              </div>
            )}

            <form onSubmit={handleConfirmFunding} className="space-y-5">
              {/* Type selection: Zakat or Donation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#665E5A] mb-2">
                  Contribution Type (BR-7)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGiftType('Zakat')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      giftType === 'Zakat'
                        ? 'border-[#F0440A] bg-[#FFF0E8] text-[#1A1615] font-bold'
                        : 'border-[#EAE3DC] bg-white text-[#5C5551]'
                    }`}
                  >
                    <Coins className="w-5 h-5 text-[#F0440A]" />
                    <div>
                      <p className="text-sm font-bold">Zakat</p>
                      <p className="text-[11px] text-[#786F69]">Eligible medical aid</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGiftType('Donation')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      giftType === 'Donation'
                        ? 'border-[#F0440A] bg-[#FFF0E8] text-[#1A1615] font-bold'
                        : 'border-[#EAE3DC] bg-white text-[#5C5551]'
                    }`}
                  >
                    <Heart className="w-5 h-5 text-[#F0440A]" />
                    <div>
                      <p className="text-sm font-bold">General Sadaqah</p>
                      <p className="text-[11px] text-[#786F69]">Voluntary charity</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#665E5A]">
                    Amount to Fund (BDT)
                  </label>
                  <span className="text-xs text-[#807975]">
                    Remaining: {formatBDT(fundingCase.amountNeeded - fundingCase.raisedAmount)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-medium text-[#7D736D]">
                    BDT
                  </span>
                  <input
                    type="number"
                    value={fundAmountStr}
                    onChange={(e) => setFundAmountStr(e.target.value)}
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-bold focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                    min={100}
                    max={fundingCase.amountNeeded - fundingCase.raisedAmount}
                    required
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {[1000, 3000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFundAmountStr(preset.toString())}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE3DC] text-xs font-semibold text-[#544D48] hover:bg-[#FFF0E8] hover:text-[#F0440A]"
                  >
                    +{preset.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFundAmountStr((fundingCase.amountNeeded - fundingCase.raisedAmount).toString())}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F5] border border-[#DDD5CE] text-xs font-bold text-[#F0440A] hover:bg-[#FFF0E8]"
                >
                  Pay Remaining Full
                </button>
              </div>

              {/* Privacy and Scholar Note */}
              <div className="rounded-xl bg-[#FAF7F5] border border-[#EAE3DC] p-3 text-xs text-[#6B615B] space-y-1">
                <p className="flex items-center gap-1.5 font-medium text-[#1A1615]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified hospital account settlement
                </p>
                <p className="text-[11px] text-[#807975]">
                  Funds are remitted directly to {fundingCase.hospitalName} billing desk against voucher #{fundingCase.id}. Patient privacy is maintained under BR-13.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07] shadow-sm transition-all active:scale-95"
              >
                Confirm Payment & Generate Proof
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
