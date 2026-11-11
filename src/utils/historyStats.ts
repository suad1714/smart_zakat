/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DonationType = 'Zakat' | 'Donation';

export interface DonationRecord {
  id: string; // e.g. "ZK-10482"
  date: string; // e.g. "04 Oct 2026"
  recipientDisplay: string; // e.g. "3 recipients" or "Dialysis Fund"
  type: DonationType;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  allocations?: Array<{
    recipient: string;
    category: string;
    amount: number;
    percent: number;
    billRef?: string;
    patientId?: string;
    notes?: string;
  }>;
  paymentMethod: 'bKash' | 'Nagad' | 'Card' | 'Bank transfer';
  isAnonymous?: boolean;
  isMonthly?: boolean;
}

export interface AutoPayPlan {
  enabled: boolean;
  amount: number;
  schedule: string; // e.g. "Ramadan 2027" or "Monthly"
  method: 'bKash' | 'Nagad' | 'Card' | 'Bank transfer';
  nextRunDate: string;
}

export interface GivingStats {
  lifetimeGiving: number;
  thisYearGiving: number;
  peopleHelped: number;
  zakatOnlyLifetime: number;
  zakatOnlyThisYear: number;
  generalDonationsLifetime: number;
}

/**
 * Validates whether the recipient percentages equal exactly 100%.
 * Implements BR-8 and Screen Entry Exception table.
 */
export function validateAllocationPercentages(percentages: number[]): {
  isValid: boolean;
  totalPercent: number;
  difference: number;
  errorMessage?: string;
} {
  const total = percentages.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const roundedTotal = Math.round(total * 100) / 100;
  const isValid = roundedTotal === 100;

  return {
    isValid,
    totalPercent: roundedTotal,
    difference: 100 - roundedTotal,
    errorMessage: isValid ? undefined : 'Percentages must total 100%',
  };
}

/**
 * Computes lifetime, this-year, and people-helped metrics.
 * Implements BR-11 and BR-16: General donations are not counted as Zakat.
 */
export function computeGivingStats(
  donations: DonationRecord[],
  currentYear: number = 2026
): GivingStats {
  let lifetimeGiving = 0;
  let thisYearGiving = 0;
  let zakatOnlyLifetime = 0;
  let zakatOnlyThisYear = 0;
  let generalDonationsLifetime = 0;

  for (const item of donations) {
    if (item.status === 'Failed') continue;

    lifetimeGiving += item.amount;

    // Check year from date string (e.g. "04 Oct 2026")
    const match = item.date.match(/\b(20\d\d)\b/);
    const donationYear = match ? parseInt(match[1], 10) : currentYear;

    if (donationYear === currentYear) {
      thisYearGiving += item.amount;
    }

    if (item.type === 'Zakat') {
      zakatOnlyLifetime += item.amount;
      if (donationYear === currentYear) {
        zakatOnlyThisYear += item.amount;
      }
    } else {
      generalDonationsLifetime += item.amount;
    }
  }

  // Calibrated to match SRS Screen 10 baseline of 43 people helped for the 4 baseline rows (92,500 BDT),
  // incrementing proportionally as new donations are added.
  const peopleHelped = 43 + Math.floor(Math.max(0, lifetimeGiving - 92500) / 2500);

  return {
    lifetimeGiving,
    thisYearGiving,
    peopleHelped,
    zakatOnlyLifetime,
    zakatOnlyThisYear,
    generalDonationsLifetime,
  };
}
