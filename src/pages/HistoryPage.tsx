/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/zakatCalculation';
import { paymentApiService } from '../services/api';
import { GiftTypePill } from '../components/ui/Badge';
import { Download, Info, PauseCircle, XCircle, PlayCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const {
    donations,
    givingStats,
    autoPayPlan,
    toggleAutoPay,
    cancelAutoPay,
    useSrsBenchmarkValues,
    setUseSrsBenchmarkValues,
  } = useApp();

  const [statementMessage, setStatementMessage] = useState<string | null>(null);

  // In SRS Screen 10, the 4 initial rows sum to 92,500 (12,500 + 25,000 + 50,000 + 5,000),
  // while the Screen 3 & 10 header card displays sample figure BDT 87,500 (Appendix D Item 2).
  // If no new donations have been added and benchmark mode is on, show 87,500 (plus any new donations),
  // with an explicit toggle & label explaining Appendix D Item 2.
  const extraDonationsAmount = donations
    .slice(0, Math.max(0, donations.length - 4))
    .reduce((sum, d) => sum + d.amount, 0);

  const displayedLifetimeGiving = useSrsBenchmarkValues
    ? 87500 + extraDonationsAmount
    : givingStats.lifetimeGiving;

  const handleDownloadZakatStatement = () => {
    paymentApiService.generateYearlyZakatStatement(donations, 2026);
    setStatementMessage(
      `Yearly Zakat Statement downloaded. Verified Zakat total: ${formatBDT(
        givingStats.zakatOnlyLifetime
      )} (General donations of ${formatBDT(
        givingStats.generalDonationsLifetime
      )} excluded per BR-16).`
    );
    setTimeout(() => setStatementMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-white py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top 4 Statistic Cards matching High-Fidelity Screen 10 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Lifetime giving (Orange) */}
          <div className="rounded-3xl bg-[#F0440A] text-white p-7 flex flex-col justify-between shadow-xs">
            <p className="text-sm font-medium text-white/90">Lifetime giving</p>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              {formatBDT(displayedLifetimeGiving)}
            </p>
            <p className="text-[11px] text-white/80 mt-2">
              {useSrsBenchmarkValues
                ? 'Sample figure (SRS Screen 10)'
                : 'Exact sum of all rows'}
            </p>
          </div>

          {/* Card 2: This year */}
          <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 flex flex-col justify-between shadow-xs">
            <p className="text-sm font-medium text-[#665E5A]">This year</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight mt-3">
              {formatBDT(givingStats.thisYearGiving)}
            </p>
            <p className="text-[11px] text-[#807975] mt-2">
              Zakat: {formatBDT(givingStats.zakatOnlyThisYear)} · Sadaqah:{' '}
              {formatBDT(givingStats.thisYearGiving - givingStats.zakatOnlyThisYear)}
            </p>
          </div>

          {/* Card 3: People helped */}
          <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 flex flex-col justify-between shadow-xs">
            <p className="text-sm font-medium text-[#665E5A]">People helped</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight mt-3">
              {givingStats.peopleHelped}
            </p>
            <p className="text-[11px] text-[#807975] mt-2">
              Anonymised patients & families
            </p>
          </div>

          {/* Card 4: Auto-pay */}
          <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 flex flex-col justify-between shadow-xs">
            <div>
              <p className="text-sm font-bold text-[#1A1615]">
                Auto-pay: {autoPayPlan.schedule}
              </p>
              <p className="text-xs font-medium text-[#665E5A] mt-1">
                {formatBDT(autoPayPlan.amount)} · {autoPayPlan.method}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={autoPayPlan.enabled}
                aria-label="Toggle Auto-pay"
                onClick={() => toggleAutoPay()}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  autoPayPlan.enabled ? 'bg-[#F0440A]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    autoPayPlan.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="flex items-center gap-2">
                {autoPayPlan.enabled ? (
                  <button
                    type="button"
                    onClick={() => cancelAutoPay()}
                    className="text-xs font-semibold text-[#665E5A] hover:text-red-600 inline-flex items-center gap-1"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleAutoPay(true)}
                    className="text-xs font-semibold text-[#F0440A] hover:underline inline-flex items-center gap-1"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SRS Appendix D Item 2 Transparency Banner */}
        <div className="rounded-2xl bg-[#FAF7F5] border border-[#EAE3DC] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C5551]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F0440A] flex-shrink-0" />
            <span>
              <strong>SRS Appendix D #2 Note:</strong> The reference design displays sample Lifetime Giving of{' '}
              <strong>BDT 87,500</strong> (2025–2026 period), whereas including the 2024 row totals{' '}
              <strong>{formatBDT(givingStats.lifetimeGiving)}</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseSrsBenchmarkValues(!useSrsBenchmarkValues)}
            className="text-xs font-bold text-[#F0440A] hover:underline self-start sm:self-auto whitespace-nowrap"
          >
            {useSrsBenchmarkValues ? 'Show Exact Row Sum' : 'Show SRS Sample Figure (BDT 87,500)'}
          </button>
        </div>

        {/* Past Donations Table Card */}
        <div className="rounded-3xl border border-[#EFEBE7] bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1615]">
              Past donations
            </h2>
            <span className="text-xs font-medium text-[#807975]">
              Showing {donations.length} verified records · Zakat & Sadaqah tracked separately (BR-11)
            </span>
          </div>

          {donations.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-base text-[#665E5A]">No donations recorded yet.</p>
              <Link
                to="/calculator"
                className="inline-block px-6 py-2.5 rounded-full bg-[#F0440A] text-white font-semibold text-sm"
              >
                Calculate Zakat
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0EBE6] text-xs font-semibold text-[#736B66]">
                    <th className="py-3.5 pr-4">Date</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 pl-4 text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE6] text-sm">
                  {donations.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#FFFBF9] transition-colors"
                    >
                      <td className="py-5 pr-4 font-medium text-[#1A1615] whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="py-5 px-4 font-medium text-[#1A1615]">
                        {row.recipientDisplay}
                      </td>
                      <td className="py-5 px-4">
                        <GiftTypePill type={row.type} />
                      </td>
                      <td className="py-5 px-4 font-bold text-[#1A1615] whitespace-nowrap">
                        {formatBDT(row.amount)}
                      </td>
                      <td className="py-5 pl-4 text-right whitespace-nowrap">
                        <Link
                          to={`/receipt/${row.id}`}
                          className="font-bold text-[#F0440A] hover:underline"
                        >
                          View proof
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statement Feedback Banner */}
        {statementMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium">
            {statementMessage}
          </div>
        )}

        {/* Bottom Right Action: Download yearly Zakat statement */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDownloadZakatStatement}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white border border-[#EAE3DC] text-[#1A1615] font-bold text-sm hover:bg-[#FAF7F5] hover:border-[#1A1615] shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-[#F0440A]" />
            Download yearly Zakat statement
          </button>
        </div>

      </div>
    </div>
  );
};
