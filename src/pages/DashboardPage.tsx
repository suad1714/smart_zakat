/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/zakatCalculation';
import {
  LayoutDashboard,
  Coins,
  Heart,
  Repeat,
  Receipt,
  Settings,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Building,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    autoPayPlan,
    toggleAutoPay,
    updateAutoPay,
    cancelAutoPay,
    donations,
    givingStats,
    useSrsBenchmarkValues,
  } = useApp();
  const navigate = useNavigate();

  // Active sidebar tab
  const [activeTab, setActiveTab] = useState<'overview' | 'zakat' | 'donations' | 'autopay' | 'receipts' | 'settings'>('overview');

  // Auto-pay manage modal
  const [showAutoPayModal, setShowAutoPayModal] = useState(false);
  const [autoPayAmount, setAutoPayAmount] = useState(autoPayPlan.amount.toString());
  const [autoPaySchedule, setAutoPaySchedule] = useState(autoPayPlan.schedule);
  const [autoPayMethod, setAutoPayMethod] = useState(autoPayPlan.method);

  const handleSaveAutoPay = (e: React.FormEvent) => {
    e.preventDefault();
    updateAutoPay({
      amount: Number(autoPayAmount) || 12500,
      schedule: autoPaySchedule,
      method: autoPayMethod as any,
      enabled: true,
    });
    setShowAutoPayModal(false);
  };

  // Filter donations based on tab
  const displayedDonations = donations.filter((d) => {
    if (activeTab === 'zakat') return d.type === 'Zakat';
    if (activeTab === 'donations') return d.type === 'Donation';
    return true; // overview or others show all
  });

  return (
    <div className="min-h-screen bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-[#EFEBE7] bg-white p-3 space-y-1 shadow-xs sticky top-28">
              
              {/* Overview */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === 'overview'
                    ? 'bg-[#FFF0E8] text-[#F0440A]'
                    : 'text-[#4A4340] hover:bg-[#FAF7F5]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>

              {/* Zakat */}
              <button
                onClick={() => setActiveTab('zakat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === 'zakat'
                    ? 'bg-[#FFF0E8] text-[#F0440A]'
                    : 'text-[#4A4340] hover:bg-[#FAF7F5]'
                }`}
              >
                <Coins className="w-4 h-4" />
                Zakat
              </button>

              {/* Donations */}
              <button
                onClick={() => setActiveTab('donations')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === 'donations'
                    ? 'bg-[#FFF0E8] text-[#F0440A]'
                    : 'text-[#4A4340] hover:bg-[#FAF7F5]'
                }`}
              >
                <Heart className="w-4 h-4" />
                Donations
              </button>

              {/* Auto-pay */}
              <button
                onClick={() => {
                  setActiveTab('autopay');
                  setShowAutoPayModal(true);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === 'autopay'
                    ? 'bg-[#FFF0E8] text-[#F0440A]'
                    : 'text-[#4A4340] hover:bg-[#FAF7F5]'
                }`}
              >
                <Repeat className="w-4 h-4" />
                Auto-pay
              </button>

              {/* Receipts */}
              <button
                onClick={() => navigate('/history')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === 'receipts'
                    ? 'bg-[#FFF0E8] text-[#F0440A]'
                    : 'text-[#4A4340] hover:bg-[#FAF7F5]'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Receipts
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === 'settings'
                    ? 'bg-[#FFF0E8] text-[#F0440A]'
                    : 'text-[#4A4340] hover:bg-[#FAF7F5]'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <div className="pt-4 border-t border-[#F0EBE6] px-3">
                <Link
                  to="/calculator"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FAF7F5] border border-[#E8E2DC] text-xs font-semibold text-[#1A1615] hover:bg-[#FFF0E8] hover:text-[#F0440A] transition-colors"
                >
                  <Coins className="w-3.5 h-3.5" />
                  Recalculate Zakat
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1615] tracking-tight">
                Assalamu Alaikum, {user.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#6B6561] bg-[#FAF7F5] px-3 py-1.5 rounded-full border border-[#EAE3DC]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Donor Account Verified</span>
              </div>
            </div>

            {/* Top Cards Row: Orange Zakat Due Card & White Total Given Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Orange Card: Zakat due this year */}
              <div className="rounded-2xl bg-[#F0440A] text-white p-7 sm:p-8 flex flex-col justify-between shadow-xs">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/90">
                    Zakat due this year
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    BDT 12,500
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    to="/pay"
                    state={{ prefillAmount: 12500 }}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-[#1A1615] font-semibold text-sm hover:bg-[#FFF0E8] hover:text-[#F0440A] shadow-sm transition-all active:scale-95"
                  >
                    Pay Now
                  </Link>
                </div>
              </div>

              {/* White Card: Total given */}
              <div className="rounded-2xl bg-white border border-[#EFEBE7] p-7 sm:p-8 flex flex-col justify-between shadow-xs">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#665E5A]">
                    Total given
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight">
                    {formatBDT(
                      useSrsBenchmarkValues
                        ? 87500 +
                            donations
                              .slice(0, Math.max(0, donations.length - 4))
                              .reduce((s, d) => s + d.amount, 0)
                        : givingStats.lifetimeGiving
                    )}
                  </p>
                </div>

                <div className="pt-6">
                  <p className="text-sm font-semibold text-[#665E5A]">
                    This year:{' '}
                    <span className="text-[#1A1615]">{formatBDT(givingStats.thisYearGiving)}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Middle Row: Your recent impact & Auto-pay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Your recent impact Card */}
              <div className="rounded-2xl bg-white border border-[#EFEBE7] p-6 sm:p-7 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1A1615]">
                    Your recent impact
                  </h3>
                  <Link to="/cases" className="text-xs font-semibold text-[#F0440A] hover:underline">
                    View cases
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* Impact item 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#1A1615]">
                        City Hospital - Bill #A-2291
                      </span>
                      <span className="font-bold text-[#1A1615]">BDT 5,000</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-[#EFEBE7] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#F0440A] h-full rounded-full w-[65%]" />
                    </div>
                  </div>

                  {/* Impact item 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#1A1615]">
                        Mercy Medical - Bill #M-5530
                      </span>
                      <span className="font-bold text-[#1A1615]">BDT 4,375</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-[#EFEBE7] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#F0440A] h-full rounded-full w-[45%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-pay Card */}
              <div className="rounded-2xl bg-white border border-[#EFEBE7] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1A1615]">
                    Auto-pay
                  </h3>
                  {/* Switch */}
                  <button
                    type="button"
                    onClick={() => toggleAutoPay()}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoPayPlan.enabled ? 'bg-[#F0440A]' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={autoPayPlan.enabled}
                    aria-label="Toggle Auto-pay"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        autoPayPlan.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-[#1A1615]">
                    {autoPayPlan.schedule}
                  </p>
                  <p className="text-sm text-[#665E5A]">
                    {autoPayPlan.enabled
                      ? `${formatBDT(autoPayPlan.amount)} via ${autoPayPlan.method}`
                      : 'Auto-pay is currently paused'}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setShowAutoPayModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FFF0E8] text-[#F0440A] font-semibold text-sm hover:bg-[#FFE6D9] transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Card: Recent donations */}
            <div className="rounded-2xl bg-white border border-[#EFEBE7] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1A1615]">
                  Recent donations
                </h3>
                <Link
                  to="/history"
                  className="text-sm font-semibold text-[#F0440A] hover:underline inline-flex items-center gap-1"
                >
                  View full history
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* List table */}
              <div className="divide-y divide-[#F2ECE7]">
                {displayedDonations.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFFBF9] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-[#736B66] font-medium min-w-[90px]">
                        {item.date}
                      </span>
                      <span className="text-sm font-semibold text-[#1A1615] min-w-[130px]">
                        {item.recipientDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          item.type === 'Zakat'
                            ? 'bg-[#FFF0E8] text-[#F0440A]'
                            : 'bg-[#F2EFEA] text-[#5C5551]'
                        }`}
                      >
                        {item.type}
                      </span>

                      <span className="text-sm font-bold text-[#1A1615] min-w-[100px] text-right">
                        {formatBDT(item.amount)}
                      </span>

                      <Link
                        to={`/receipt/${item.id}`}
                        className="text-xs font-semibold text-[#F0440A] hover:underline"
                      >
                        Proof
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Auto-pay Manage Modal */}
      {showAutoPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EFEBE7] space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-4">
              <h3 className="text-xl font-bold text-[#1A1615]">
                Manage Auto-Pay Plan
              </h3>
              <button
                onClick={() => setShowAutoPayModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAutoPay} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-1.5">
                  Yearly / Recurring Amount (BDT)
                </label>
                <input
                  type="number"
                  value={autoPayAmount}
                  onChange={(e) => setAutoPayAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-1.5">
                  Schedule
                </label>
                <select
                  value={autoPaySchedule}
                  onChange={(e) => setAutoPaySchedule(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                >
                  <option value="Ramadan 2027">Ramadan 2027 (Recommended)</option>
                  <option value="Yearly on 1st Muharram">Yearly on 1st Muharram</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-1.5">
                  Payment Method
                </label>
                <select
                  value={autoPayMethod}
                  onChange={(e) => setAutoPayMethod(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                >
                  <option value="bKash">bKash (Direct MFS)</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="bg-[#FFF0E8] p-3 rounded-xl text-xs text-[#6B615B]">
                <ShieldCheck className="w-4 h-4 inline-block text-[#F0440A] mr-1 -mt-0.5" />
                BR-17 Protection: You will be notified via SMS/email at least 3 days before any auto-pay charge. You can pause or cancel at any time.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#F0440A] text-white font-semibold text-sm hover:bg-[#D63A07] shadow-sm transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cancelAutoPay();
                    setShowAutoPayModal(false);
                  }}
                  className="py-3 px-4 rounded-full border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-all"
                >
                  Cancel Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
