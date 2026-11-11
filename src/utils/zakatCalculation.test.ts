import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateZakat,
  calculateAllocations,
  formatBDT,
  DEFAULT_NISAB_THRESHOLD,
} from './zakatCalculation';
import {
  validateAllocationPercentages,
  computeGivingStats,
  DonationRecord,
} from './historyStats';

test('Zakat calculation applies 2.5% when net wealth >= nisab', () => {
  const result = calculateZakat({
    cash: 500000,
    goldGrams: 0,
    silverGrams: 0,
    investments: 0,
    debts: 0,
  });

  assert.equal(result.zakatableWealth, 500000);
  assert.equal(result.debtsDeducted, 0);
  assert.equal(result.netWealth, 500000);
  assert.equal(result.isAboveNisab, true);
  assert.equal(result.zakatDue, 12500); // 500,000 * 0.025 = 12,500
});

test('Zakat calculation yields 0 when below nisab threshold', () => {
  const result = calculateZakat({
    cash: 50000,
    goldGrams: 0,
    silverGrams: 0,
    investments: 0,
    debts: 0,
  });

  assert.equal(result.netWealth, 50000);
  assert.equal(result.isAboveNisab, false);
  assert.equal(result.zakatDue, 0);
});

test('Deducts debts accurately', () => {
  const result = calculateZakat({
    cash: 530000,
    goldGrams: 0,
    silverGrams: 0,
    investments: 0,
    debts: 30000,
  });

  assert.equal(result.zakatableWealth, 530000);
  assert.equal(result.netWealth, 500000);
  assert.equal(result.zakatDue, 12500);
});

test('FormatBDT correctly adds currency prefix and comma separation', () => {
  assert.equal(formatBDT(12500), 'BDT 12,500');
  assert.equal(formatBDT(87500), 'BDT 87,500');
  assert.equal(formatBDT(2400000), 'BDT 2,400,000');
  assert.equal(formatBDT(-30000), '-BDT 30,000');
});

test('Default distribution splits 40%, 35%, 25%, 0% summing to exact total', () => {
  const recipients = [
    { id: '1', name: 'City Hospital', category: 'Patient bills', percent: 40 },
    { id: '2', name: 'Mercy Medical Centre', category: 'Surgeries', percent: 35 },
    { id: '3', name: 'Care Foundation', category: 'Charity - medicine', percent: 25 },
    { id: '4', name: 'Orphan Aid Trust', category: 'Charity - food', percent: 0 },
  ];

  const allocations = calculateAllocations(12500, recipients);

  assert.equal(allocations[0].amount, 5000); // 40% of 12,500
  assert.equal(allocations[1].amount, 4375); // 35% of 12,500
  assert.equal(allocations[2].amount, 3125); // 25% of 12,500
  assert.equal(allocations[3].amount, 0);

  const totalAllocated = allocations.reduce((sum, item) => sum + item.amount, 0);
  assert.equal(totalAllocated, 12500);
});

test('Allocation remainder is assigned to largest share when rounding occurs', () => {
  const recipients = [
    { id: '1', name: 'City Hospital', category: 'Patient bills', percent: 33 },
    { id: '2', name: 'Mercy Medical Centre', category: 'Surgeries', percent: 33 },
    { id: '3', name: 'Care Foundation', category: 'Charity - medicine', percent: 34 },
  ];

  // 100 BDT split 33%, 33%, 34% -> floor gives 33, 33, 34 -> sum is 100
  const allocations = calculateAllocations(100, recipients);
  const total = allocations.reduce((s, i) => s + i.amount, 0);
  assert.equal(total, 100);
  assert.equal(allocations[2].amount, 34);
});

test('validateAllocationPercentages checks 100% total', () => {
  const valid = validateAllocationPercentages([40, 35, 25, 0]);
  assert.equal(valid.isValid, true);
  assert.equal(valid.totalPercent, 100);
  assert.equal(valid.errorMessage, undefined);

  const invalid = validateAllocationPercentages([40, 30, 20]);
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.totalPercent, 90);
  assert.equal(invalid.errorMessage, 'Percentages must total 100%');
});

test('computeGivingStats separates Zakat from general donations', () => {
  const donations: DonationRecord[] = [
    {
      id: 'ZK-1',
      date: '04 Oct 2026',
      recipientDisplay: '3 recipients',
      type: 'Zakat',
      amount: 12500,
      status: 'Completed',
      paymentMethod: 'bKash',
    },
    {
      id: 'ZK-2',
      date: '12 Mar 2026',
      recipientDisplay: 'Dialysis Fund',
      type: 'Donation',
      amount: 25000,
      status: 'Completed',
      paymentMethod: 'bKash',
    },
    {
      id: 'ZK-3',
      date: '10 Mar 2025',
      recipientDisplay: 'Care Foundation',
      type: 'Zakat',
      amount: 50000,
      status: 'Completed',
      paymentMethod: 'Card',
    },
  ];

  const stats = computeGivingStats(donations, 2026);
  assert.equal(stats.lifetimeGiving, 87500);
  assert.equal(stats.thisYearGiving, 37500); // 12,500 + 25,000 in 2026
  assert.equal(stats.zakatOnlyLifetime, 62500); // 12,500 + 50,000
  assert.equal(stats.zakatOnlyThisYear, 12500);
  assert.equal(stats.generalDonationsLifetime, 25000);
});
