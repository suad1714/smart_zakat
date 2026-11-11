/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Scalable API & Persistence Service Layer.
 * Implements the Adapter Pattern specified in SRS Section 6.4 (Interoperability)
 * so local persistence can be swapped with REST/JSON backend endpoints without changing UI components.
 */

import { ENV_CONFIG } from '../config/env';
import { DonationRecord, AutoPayPlan } from '../utils/historyStats';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ApiError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Safe LocalStorage wrapper with structured error handling.
 */
export const storageService = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const fullKey = `${ENV_CONFIG.storagePrefix}_${key}`;
      const raw = localStorage.getItem(fullKey);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key "${key}":`, err);
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      const fullKey = `${ENV_CONFIG.storagePrefix}_${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to write key "${key}":`, err);
      return false;
    }
  },

  clearAll(): void {
    try {
      const keys = ['user', 'calc', 'autopay', 'campaigns', 'cases', 'recipients', 'donations'];
      keys.forEach((k) => localStorage.removeItem(`${ENV_CONFIG.storagePrefix}_${k}`));
    } catch (err) {
      console.error('[StorageService] Failed to clear storage:', err);
    }
  },
};

/**
 * Payment Provider Adapter Interface (SRS 3.3 & 6.4)
 */
export interface PaymentRequestPayload {
  amount: number;
  method: 'bKash' | 'Nagad' | 'Card' | 'Bank transfer';
  type: 'Zakat' | 'Donation';
  recipientSummary: string;
}

export const paymentApiService = {
  /**
   * Simulates atomic payment processing with provider validation (SRS 6.2 Financial Safety).
   */
  async processPayment(payload: PaymentRequestPayload): Promise<ApiResponse<{ transactionId: string; issuedAt: string }>> {
    try {
      if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
        throw new ApiError('Invalid payment amount specified.', 422);
      }

      const minAmount =
        payload.type === 'Zakat' ? ENV_CONFIG.minZakatPaymentBdt : ENV_CONFIG.minGeneralDonationBdt;

      if (payload.amount < minAmount) {
        throw new ApiError(`Enter an amount of at least ${minAmount}`, 422);
      }

      // Generate deterministic-style receipt ID matching SRS (e.g. ZK-10482)
      const randomSuffix = Math.floor(10000 + Math.random() * 89999);
      const transactionId = `ZK-${randomSuffix}`;
      const issuedAt = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      return {
        success: true,
        data: { transactionId, issuedAt },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected payment processing error';
      return {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Generates a downloadable text/printable receipt or statement document (SRS UC-7 & UC-8).
   */
  generateDownloadableReceipt(donation: DonationRecord): void {
    try {
      const allocationLines = (donation.allocations || [])
        .map(
          (a) =>
            `  - ${a.recipient}${a.billRef ? ` (${a.billRef})` : ''}: BDT ${a.amount.toLocaleString()} (${a.percent}%)${
              a.patientId ? ` | ${a.patientId}` : ''
            }`
        )
        .join('\n');

      const content = [
        '============================================================',
        '                   SMART ZAKAT OFFICIAL RECEIPT             ',
        '                 Give your Zakat with confidence            ',
        '============================================================',
        `Receipt Reference : ${donation.id}`,
        `Date Issued       : ${donation.date}`,
        `Contribution Type : ${donation.type}`,
        `Payment Method    : ${donation.paymentMethod}`,
        `Total Amount      : BDT ${donation.amount.toLocaleString()}`,
        `Status            : ${donation.status}`,
        '------------------------------------------------------------',
        'WHERE YOUR MONEY WENT (VERIFIED ALLOCATIONS):',
        allocationLines || `  - ${donation.recipientDisplay}: BDT ${donation.amount.toLocaleString()} (100%)`,
        '------------------------------------------------------------',
        donation.type === 'Zakat'
          ? 'SHARIAH VERIFICATION: Zakat eligibility verified by scholars (BR-14).'
          : 'NOTE: Voluntary Sadaqah / General Donation. Not counted as Zakat (BR-11).',
        'PRIVACY NOTICE: Patient identities are strictly anonymised (BR-13).',
        '============================================================',
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SmartZakat_Receipt_${donation.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[PaymentApiService] Failed to generate receipt download:', err);
    }
  },

  /**
   * Generates a downloadable yearly Zakat-only statement per SRS BR-16.
   */
  generateYearlyZakatStatement(donations: DonationRecord[], year: number = 2026): void {
    try {
      const zakatDonations = donations.filter((d) => d.type === 'Zakat' && d.status === 'Completed');
      const totalZakat = zakatDonations.reduce((sum, d) => sum + d.amount, 0);

      const rows = zakatDonations
        .map((d) => `  ${d.date.padEnd(14)} | ${d.id.padEnd(10)} | ${d.recipientDisplay.padEnd(24)} | BDT ${d.amount.toLocaleString()}`)
        .join('\n');

      const content = [
        '========================================================================',
        `             SMART ZAKAT - YEARLY ZAKAT STATEMENT (${year})             `,
        '========================================================================',
        'Business Rule BR-16: General donations (Sadaqah) are excluded from this',
        'official Zakat statement. Only scholar-verified Zakat gifts are listed.',
        '------------------------------------------------------------------------',
        '  DATE           | RECEIPT ID | RECIPIENT                | AMOUNT       ',
        '------------------------------------------------------------------------',
        rows || '  No Zakat transactions recorded.',
        '------------------------------------------------------------------------',
        `  TOTAL VERIFIED ZAKAT PAID: BDT ${totalZakat.toLocaleString()}`,
        '========================================================================',
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SmartZakat_Yearly_Zakat_Statement_${year}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[PaymentApiService] Failed to generate yearly statement:', err);
    }
  },
};
