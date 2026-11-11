/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Campaign } from '../context/AppContext';
import { formatBDT } from '../utils/zakatCalculation';
import { ShieldCheck, Check, Heart, Sparkles, Building2, Stethoscope, Pill, Syringe } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { campaigns, addDonation, user } = useApp();
  const navigate = useNavigate();

  // Category filter: 'All' | 'Surgery' | 'Dialysis' | 'Medicine'
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Selected campaign
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || 'camp-1');

  // Donation Amount Selection
  const [selectedPreset, setSelectedPreset] = useState<number | 'other'>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Toggles
  const [donateAnonymously, setDonateAnonymously] = useState(false);
  const [repeatMonthly, setRepeatMonthly] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  const getActiveAmount = (): number => {
    if (selectedPreset === 'other') {
      return Number(customAmount) || 0;
    }
    return selectedPreset;
  };

  const handleDonateNow = () => {
    setValidationError(null);
    const amount = getActiveAmount();
    if (amount < 50) {
      setValidationError('Enter a valid amount (minimum BDT 50)');
      return;
    }

    const campaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

    // Record as type Donation (not Zakat) per BR-11
    const newReceiptId = addDonation({
      recipientDisplay: campaign.title,
      type: 'Donation',
      amount,
      paymentMethod: 'bKash',
      isAnonymous: donateAnonymously,
      isMonthly: repeatMonthly,
      allocations: [
        {
          recipient: campaign.verifiedPartner,
          category: campaign.category,
          amount,
          percent: 100,
          notes: `${campaign.title} - General Healthcare Fund`,
        },
      ],
    });

    navigate(`/receipt/${newReceiptId}`);
  };

  return (
    <div className="min-h-screen bg-white py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight">
              Active campaigns
            </h1>
            <p className="text-sm text-[#665E5A] mt-1.5">
              Support verified healthcare relief funds (Sadaqah / General Donation)
            </p>
          </div>

          {/* Filter Pills matching high-fidelity screen */}
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

        {/* 3 Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCampaigns.map((camp) => {
            const isSelected = selectedCampaignId === camp.id;
            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`rounded-3xl border transition-all p-6 sm:p-7 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#F0440A] ring-2 ring-[#F0440A]/20 bg-[#FFFDFB] shadow-md'
                    : 'border-[#EFEBE7] bg-white hover:border-[#DDD5CE] shadow-xs'
                }`}
              >
                <div className="space-y-5">
                  {/* Visual card header */}
                  <div
                    className="w-full h-44 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: camp.imagePlaceholderColor }}
                  >
                    {camp.category === 'Surgery' && (
                      <Syringe className="w-16 h-16 text-[#F0440A]/70" />
                    )}
                    {camp.category === 'Dialysis' && (
                      <Stethoscope className="w-16 h-16 text-[#F0440A]/70" />
                    )}
                    {camp.category === 'Medicine' && (
                      <Pill className="w-16 h-16 text-[#F0440A]/70" />
                    )}

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#F0440A] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#1A1615]">
                      {camp.title}
                    </h3>
                    
                    {/* Verified partner badge */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E8] text-[#F0440A] text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified partner
                      </span>
                    </div>
                  </div>

                  {/* Funding progress */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#665E5A]">
                      <span>{camp.percentFunded}% of goal</span>
                      <span>Goal: {formatBDT(camp.goalAmount)}</span>
                    </div>
                    <div className="w-full bg-[#EFEBE7] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#F0440A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${camp.percentFunded}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCampaignId(camp.id);
                    }}
                    className={`w-full py-3 px-6 rounded-full font-semibold text-sm transition-all ${
                      isSelected
                        ? 'bg-[#F0440A] text-white shadow-xs'
                        : 'bg-[#FFF0E8] text-[#F0440A] hover:bg-[#FFE5D6]'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Your donation (Exact match to Screen 6) */}
        <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 sm:p-10 shadow-xs space-y-8">
          <div>
            <h3 className="text-xl font-bold text-[#1A1615]">
              Your donation
            </h3>
            <p className="text-xs text-[#807975] mt-1">
              Contributing to: <strong>{campaigns.find((c) => c.id === selectedCampaignId)?.title}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Amount Selection */}
            <div className="lg:col-span-7 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#665E5A]">
                Amount (BDT)
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                {[500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(amt);
                      setCustomAmount('');
                    }}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                      selectedPreset === amt
                        ? 'bg-[#F0440A] text-white shadow-xs'
                        : 'bg-[#FFF0E8] text-[#1A1615] hover:bg-[#FFE5D6]'
                    }`}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedPreset('other')}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                    selectedPreset === 'other'
                      ? 'bg-[#F0440A] text-white shadow-xs'
                      : 'bg-[#FFF0E8] text-[#1A1615] hover:bg-[#FFE5D6]'
                  }`}
                >
                  Other
                </button>

                {selectedPreset === 'other' && (
                  <div className="relative flex-1 min-w-[140px]">
                    <span className="absolute left-3 top-3 text-xs font-bold text-[#807975]">
                      BDT
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="e.g. 5000"
                      className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#DDD5CE] bg-white text-sm font-bold text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                      min={50}
                      autoFocus
                    />
                  </div>
                )}
              </div>
              {validationError && (
                <p className="text-xs font-semibold text-red-600 pt-1">
                  {validationError}
                </p>
              )}
            </div>

            {/* Checkboxes / Toggles on the Right */}
            <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-[#F0EBE6] lg:pl-8">
              
              {/* Donate anonymously */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-[#4A4340] group-hover:text-[#1A1615]">
                  Donate anonymously
                </span>
                <button
                  type="button"
                  onClick={() => setDonateAnonymously(!donateAnonymously)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    donateAnonymously ? 'bg-[#F0440A]' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={donateAnonymously}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      donateAnonymously ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {/* Repeat monthly */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-[#4A4340] group-hover:text-[#1A1615]">
                  Repeat monthly
                </span>
                <button
                  type="button"
                  onClick={() => setRepeatMonthly(!repeatMonthly)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    repeatMonthly ? 'bg-[#F0440A]' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={repeatMonthly}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      repeatMonthly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

            </div>

          </div>

          {/* Action Row & Note: General donations are not counted as Zakat */}
          <div className="pt-6 border-t border-[#F0EBE6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-medium text-[#736B66]">
              General donations are not counted as Zakat.
            </p>

            <button
              onClick={handleDonateNow}
              className="py-3.5 px-8 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07] shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Donate Now ({formatBDT(getActiveAmount())})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
