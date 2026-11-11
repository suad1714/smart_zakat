/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AssetInputs {
  cash: number;
  goldGrams: number;
  silverGrams: number;
  investments: number;
  debts: number;
}

export interface MetalPrices {
  goldPerGram: number; // in BDT
  silverPerGram: number; // in BDT
}

export const DEFAULT_METAL_PRICES: MetalPrices = {
  goldPerGram: 10500,
  silverPerGram: 180,
};

// 595 grams of silver is the standard classical silver Nisab (approx BDT 107,100 at 180 BDT/g)
export const DEFAULT_NISAB_THRESHOLD = 107100;

export interface CalculationResult {
  zakatableWealth: number;
  debtsDeducted: number;
  netWealth: number;
  isAboveNisab: boolean;
  nisabThreshold: number;
  zakatDue: number; // 2.5% if >= nisab, else 0
  effectiveRate: number;
}

/**
 * Format any numeric value as "BDT n,nnn" with thousands separators per SRS standard.
 */
export function formatBDT(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-US').format(Math.abs(rounded));
  return `${rounded < 0 ? '-' : ''}BDT ${formatted}`;
}

/**
 * Calculates net wealth and zakat due based on standard Shariah rules:
 * Net Wealth = Zakatable Wealth - Debts
 * Zakat Due = Net Wealth * 2.5% (only if Net Wealth >= Nisab)
 */
export function calculateZakat(
  inputs: AssetInputs,
  prices: MetalPrices = DEFAULT_METAL_PRICES,
  nisabThreshold: number = DEFAULT_NISAB_THRESHOLD,
  includeGoldSilverInTotal: boolean = true
): CalculationResult {
  const cash = Math.max(0, Number(inputs.cash) || 0);
  const gold = Math.max(0, Number(inputs.goldGrams) || 0);
  const silver = Math.max(0, Number(inputs.silverGrams) || 0);
  const investments = Math.max(0, Number(inputs.investments) || 0);
  const debts = Math.max(0, Number(inputs.debts) || 0);

  const goldValue = includeGoldSilverInTotal ? gold * prices.goldPerGram : 0;
  const silverValue = includeGoldSilverInTotal ? silver * prices.silverPerGram : 0;

  const zakatableWealth = Math.round(cash + goldValue + silverValue + investments);
  const debtsDeducted = Math.min(zakatableWealth, debts);
  const netWealth = Math.max(0, zakatableWealth - debts);

  const isAboveNisab = netWealth >= nisabThreshold;
  const zakatDue = isAboveNisab ? Math.round(netWealth * 0.025) : 0;

  return {
    zakatableWealth,
    debtsDeducted: debts,
    netWealth,
    isAboveNisab,
    nisabThreshold,
    zakatDue,
    effectiveRate: 0.025,
  };
}

export interface RecipientAllocation {
  id: string;
  name: string;
  category: string;
  percent: number;
  amount: number;
  billRef?: string;
  patientId?: string;
}

/**
 * Implements BR-8: Allocation percentages shall total exactly 100%;
 * amounts are rounded to whole taka with the remainder assigned to the largest share.
 */
export function calculateAllocations(
  totalAmount: number,
  recipients: Array<{ id: string; name: string; category: string; percent: number; billRef?: string; patientId?: string }>
): RecipientAllocation[] {
  if (totalAmount <= 0) {
    return recipients.map((r) => ({ ...r, amount: 0 }));
  }

  // Initial rounding down
  let allocatedSum = 0;
  const result: RecipientAllocation[] = recipients.map((r) => {
    const rawAmt = Math.floor((totalAmount * r.percent) / 100);
    allocatedSum += rawAmt;
    return {
      ...r,
      amount: rawAmt,
    };
  });

  // Assign any fractional rounding remainder to the recipient with the largest percentage
  const remainder = Math.round(totalAmount) - allocatedSum;
  if (remainder !== 0 && result.length > 0) {
    let maxIdx = 0;
    let maxPercent = -1;
    for (let i = 0; i < result.length; i++) {
      if (result[i].percent > maxPercent) {
        maxPercent = result[i].percent;
        maxIdx = i;
      }
    }
    result[maxIdx].amount += remainder;
  }

  return result;
}
