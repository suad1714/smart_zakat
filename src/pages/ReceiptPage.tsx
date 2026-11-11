/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/zakatCalculation';
import { paymentApiService } from '../services/api';
import { CheckCircle2, Share2, Download, ArrowRight } from 'lucide-react';

export const ReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { donations, getDonationById } = useApp();
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Resolve target donation by route param, or default to latest / ZK-10482
  const donation =
    (id ? getDonationById(id) : undefined) ||
    getDonationById('ZK-10482') ||
    donations[0];

  if (!donation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-lg font-bold text-[#1A1615]">No receipt found.</p>
        <Link
          to="/donate"
          className="px-6 py-3 rounded-full bg-[#F0440A] text-white font-semibold text-sm"
        >
          Make a Donation
        </Link>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    paymentApiService.generateDownloadableReceipt(donation);
  };

  const handleShareImpact = async () => {
    const shareText = `I just supported verified medical care through Smart Zakat (${formatBDT(
      donation.amount
    )}). 100% transparent hospital bill settlement at smartzakat.org`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
      setShareFeedback('Privacy-safe impact summary copied to clipboard! (No personal or patient data included)');
      setTimeout(() => setShareFeedback(null), 4000);
    } catch {
      setShareFeedback(shareText);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Payment Success Indicator & Actions */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-[#F0440A] text-white flex items-center justify-center shadow-md">
              <span className="text-2xl font-extrabold tracking-tight">OK</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-[#1A1615] tracking-tight">
                Donation successful
              </h1>
              <p className="text-base text-[#665E5A] font-medium">
                {formatBDT(donation.amount)} - {donation.date}
              </p>
              <p className="text-xs font-semibold text-[#8A817C]">
                Receipt Reference: #{donation.id} · {donation.type}
              </p>
            </div>

            <div className="w-full max-w-xs space-y-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="w-full py-3.5 px-6 rounded-xl bg-[#F0440A] text-white font-semibold text-sm hover:bg-[#D63A07] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download Receipt (PDF)
              </button>

              <button
                type="button"
                onClick={handleShareImpact}
                className="w-full py-3.5 px-6 rounded-xl bg-white border border-[#EAE3DC] text-[#1A1615] font-semibold text-sm hover:bg-[#FAF7F5] transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share impact
              </button>
            </div>

            {shareFeedback && (
              <div className="max-w-xs p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{shareFeedback}</span>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/history"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0440A] hover:underline"
              >
                View all past donations in History
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Where your money went Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 sm:p-10 shadow-xs space-y-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1615]">
                Where your money went
              </h2>

              <div className="divide-y divide-[#F0EBE6]">
                {donation.allocations && donation.allocations.length > 0 ? (
                  donation.allocations.map((alloc, idx) => {
                    const headerTitle = alloc.billRef
                      ? `${alloc.recipient.replace(' Centre', '')} - ${alloc.billRef}`
                      : `${alloc.recipient} - ${alloc.category}`;
                    return (
                      <div key={idx} className="py-5 first:pt-0 last:pb-2 space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-base font-bold text-[#1A1615]">
                            {headerTitle}
                          </h3>
                          <span className="text-base font-extrabold text-[#1A1615]">
                            {formatBDT(alloc.amount)}
                          </span>
                        </div>
                        <p className="text-sm text-[#736B66]">
                          {alloc.notes || alloc.patientId || 'Verified healthcare allocation'}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#1A1615]">
                        {donation.recipientDisplay}
                      </h3>
                      <span className="text-base font-extrabold text-[#1A1615]">
                        {formatBDT(donation.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-[#736B66]">
                      Direct verified healthcare disbursement
                    </p>
                  </div>
                )}
              </div>

              {/* BR-14: Show scholar verification banner only for Zakat gifts */}
              {donation.type === 'Zakat' ? (
                <div className="rounded-2xl bg-[#FFF0E8] py-4 px-6 text-center">
                  <p className="text-sm font-bold text-[#1A1615]">
                    Zakat eligibility verified by scholars
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#FAF7F5] border border-[#EAE3DC] py-4 px-6 text-center">
                  <p className="text-sm font-semibold text-[#5C5551]">
                    Voluntary Donation (Sadaqah) · Verified Partner Settlement
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
