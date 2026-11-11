/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBDT, calculateAllocations } from '../utils/zakatCalculation';
import { validateAllocationPercentages } from '../utils/historyStats';
import { paymentApiService } from '../services/api';
import { ENV_CONFIG } from '../config/env';
import { ShieldCheck, AlertCircle, Check } from 'lucide-react';

export const DistributePayPage: React.FC = () => {
  const {
    calculationResult,
    recipients,
    updateRecipientPercent,
    toggleRecipientSelected,
    resetDefaultDistribution,
    addDonation,
    updateAutoPay,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  // Pre-fill from location state or calculator zakatDue (default 12,500)
  const initialAmount =
    (location.state as { prefillAmount?: number })?.prefillAmount ||
    (calculationResult.zakatDue > 0 ? calculationResult.zakatDue : 12500);

  const [amountStr, setAmountStr] = useState<string>(initialAmount.toString());
  const [autoDistribute, setAutoDistribute] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Card' | 'Bank transfer'>('bKash');
  const [makeAutomatic, setMakeAutomatic] = useState<boolean>(true);
  const [repeatInterval, setRepeatInterval] = useState<string>('Ramadan (yearly)');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync default distribution when auto-distribute is toggled on
  useEffect(() => {
    if (autoDistribute) {
      resetDefaultDistribution();
    }
  }, [autoDistribute]);

  const numericAmount = Math.max(0, Math.round(Number(amountStr.replace(/[^0-9.]/g, '')) || 0));

  // Validate percentages (BR-8)
  const percentages = recipients.map((r) => (r.selected ? r.currentPercent : 0));
  const percentValidation = validateAllocationPercentages(percentages);

  // Validate amount (Screen 8 Entry Exception Table: min BDT 100)
  const isAmountValid = numericAmount >= ENV_CONFIG.minZakatPaymentBdt;

  // Live per-recipient allocations (BR-8 rounding remainder assigned to largest share)
  const allocations = calculateAllocations(
    numericAmount,
    recipients.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      percent: r.selected ? r.currentPercent : 0,
      billRef: r.billRefSample,
      patientId: r.patientIdSample,
    }))
  );

  const activeAllocations = allocations.filter((a) => a.percent > 0);

  const handleToggleAutoDistribute = () => {
    const next = !autoDistribute;
    setAutoDistribute(next);
    setErrorMsg(null);
    if (next) {
      resetDefaultDistribution();
    }
  };

  const handlePayNow = async () => {
    setErrorMsg(null);

    if (!isAmountValid) {
      setErrorMsg(`Enter an amount of at least ${ENV_CONFIG.minZakatPaymentBdt}`);
      return;
    }

    if (!percentValidation.isValid) {
      setErrorMsg(percentValidation.errorMessage || 'Percentages must total 100%');
      return;
    }

    setIsProcessing(true);

    const response = await paymentApiService.processPayment({
      amount: numericAmount,
      method: paymentMethod,
      type: 'Zakat',
      recipientSummary: `${activeAllocations.length} recipients`,
    });

    setIsProcessing(false);

    if (!response.success) {
      setErrorMsg(response.error || 'Payment failed. Please try another method.');
      return;
    }

    // AF1: Save AutoPay plan if enabled
    if (makeAutomatic) {
      updateAutoPay({
        enabled: true,
        amount: numericAmount,
        schedule: repeatInterval.includes('Ramadan') ? 'Ramadan 2027' : repeatInterval,
        method: paymentMethod,
      });
    }

    const newReceiptId = addDonation({
      recipientDisplay:
        activeAllocations.length === 1
          ? activeAllocations[0].name
          : `${activeAllocations.length} recipients`,
      type: 'Zakat',
      amount: numericAmount,
      paymentMethod,
      allocations: activeAllocations.map((a) => ({
        recipient: a.name,
        category: a.category,
        amount: a.amount,
        percent: a.percent,
        billRef: a.billRef,
        patientId: a.patientId ? `${a.patientId} (anonymised)` : undefined,
        notes:
          a.name === 'City Hospital'
            ? 'Heart surgery, Patient ID P-***41 (anonymised)'
            : a.name === 'Mercy Medical Centre'
            ? 'Dialysis, Patient ID P-***17 (anonymised)'
            : a.name === 'Care Foundation'
            ? 'Medicine for 12 patients'
            : 'Food support for vulnerable families',
      })),
    });

    navigate(`/receipt/${newReceiptId}`);
  };

  return (
    <div className="min-h-screen bg-white py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Distribute Controls */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight">
                Distribute and pay
              </h1>
            </div>

            {/* Amount & Auto-distribute Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="w-full sm:w-72">
                <label
                  htmlFor="zakat-amount-input"
                  className="block text-xs font-semibold text-[#665E5A] mb-2"
                >
                  Amount (BDT)
                </label>
                <input
                  id="zakat-amount-input"
                  type="text"
                  value={amountStr}
                  onChange={(e) => {
                    setAmountStr(e.target.value);
                    setErrorMsg(null);
                  }}
                  aria-label="Amount (BDT)"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                />
                {!isAmountValid && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    Enter an amount of at least {ENV_CONFIG.minZakatPaymentBdt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pb-2">
                <span className="text-sm font-bold text-[#1A1615]">
                  Auto-distribute fairly
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoDistribute}
                  aria-label="Auto-distribute fairly"
                  onClick={handleToggleAutoDistribute}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoDistribute ? 'bg-[#F0440A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      autoDistribute ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Recipients Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1A1615]">Recipients</h2>
                {!autoDistribute && (
                  <span
                    className={`text-xs font-bold ${
                      percentValidation.isValid ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    Allocated: {percentValidation.totalPercent}% / 100%
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {recipients.map((rec) => {
                  const effectivePercent = rec.selected ? rec.currentPercent : 0;
                  return (
                    <div
                      key={rec.id}
                      className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
                        rec.selected
                          ? 'border-[#EFEBE7] bg-white'
                          : 'border-[#F2EFEA] bg-[#FAF7F5] opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (autoDistribute) setAutoDistribute(false);
                            toggleRecipientSelected(rec.id);
                          }}
                          aria-label={`Select ${rec.name}`}
                          className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                            rec.selected
                              ? 'bg-[#F0440A] border-[#F0440A] text-white'
                              : 'bg-white border-[#F0440A] text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                        <div>
                          <p className="text-sm font-bold text-[#1A1615]">{rec.name}</p>
                          <p className="text-xs text-[#7D736D]">{rec.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {autoDistribute ? (
                          <span className="text-base font-extrabold text-[#1A1615]">
                            {effectivePercent}%
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              disabled={!rec.selected}
                              value={effectivePercent}
                              onChange={(e) =>
                                updateRecipientPercent(rec.id, parseInt(e.target.value, 10) || 0)
                              }
                              aria-label={`${rec.name} percentage`}
                              className="w-20 px-2.5 py-1.5 text-right rounded-lg border border-[#DDD5CE] font-bold text-sm text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A] disabled:bg-gray-100"
                            />
                            <span className="text-sm font-bold text-[#1A1615]">%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!percentValidation.isValid && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>
                    {percentValidation.errorMessage} (Current total: {percentValidation.totalPercent}%)
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <h2 className="text-base font-bold text-[#1A1615]">Payment method</h2>
              <div className="flex flex-wrap items-center gap-6 pt-1">
                {[
                  { id: 'bKash', label: 'bKash / Nagad' },
                  { id: 'Nagad', label: 'Nagad Direct' },
                  { id: 'Card', label: 'Card' },
                  { id: 'Bank transfer', label: 'Bank transfer' },
                ].map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <label
                      key={pm.id}
                      className="inline-flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#F0440A] bg-[#F0440A]'
                            : 'border-[#C9BFB8] bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                      <span
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className="text-sm font-medium text-[#1A1615]"
                      >
                        {pm.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#EFEBE7] bg-white p-7 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-[#1A1615]">Summary</h2>

              <div className="space-y-3.5 pb-5 border-b border-[#F0EBE6]">
                {activeAllocations.length > 0 ? (
                  activeAllocations.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-[#665E5A] font-medium">
                        {item.name.replace(' Centre', '')}
                      </span>
                      <span className="font-bold text-[#1A1615]">
                        {formatBDT(item.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8A817C]">
                    Select at least one recipient with 100% total allocation.
                  </p>
                )}
              </div>

              {/* Total Line */}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#1A1615]">Total</span>
                <span className="text-xl font-extrabold text-[#1A1615]">
                  {formatBDT(numericAmount)}
                </span>
              </div>

              {/* Make this automatic & Repeat every */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1A1615]">
                    Make this automatic
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={makeAutomatic}
                    aria-label="Make this automatic"
                    onClick={() => setMakeAutomatic(!makeAutomatic)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      makeAutomatic ? 'bg-[#F0440A]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                        makeAutomatic ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="repeat-every-select"
                    className="block text-xs font-medium text-[#665E5A]"
                  >
                    Repeat every
                  </label>
                  <select
                    id="repeat-every-select"
                    value={repeatInterval}
                    disabled={!makeAutomatic}
                    onChange={(e) => setRepeatInterval(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DC] bg-white text-sm font-semibold text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A] disabled:opacity-50"
                  >
                    <option value="Ramadan (yearly)">Ramadan (yearly)</option>
                    <option value="Muharram (yearly)">Muharram (yearly)</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Reviewed by scholar board notice */}
              <div className="pt-1 flex items-center gap-1.5 text-xs font-medium text-[#7D736D]">
                <ShieldCheck className="w-4 h-4 text-[#F0440A]" />
                <span>Reviewed by scholar board</span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={!percentValidation.isValid || !isAmountValid || isProcessing}
                className="w-full py-4 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isProcessing ? 'Processing...' : `Pay ${formatBDT(numericAmount)}`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
