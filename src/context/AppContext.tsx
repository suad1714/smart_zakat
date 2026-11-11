/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Centralized Application State Provider.
 * Separates domain state and business rules from presentation components,
 * utilizing storageService for resilient LocalStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AssetInputs,
  CalculationResult,
  calculateZakat,
  DEFAULT_NISAB_THRESHOLD,
} from '../utils/zakatCalculation';
import {
  DonationRecord,
  AutoPayPlan,
  GivingStats,
  computeGivingStats,
} from '../utils/historyStats';
import { storageService } from '../services/api';

export interface Campaign {
  id: string;
  title: string;
  category: 'Surgery' | 'Dialysis' | 'Medicine';
  goalAmount: number;
  raisedAmount: number;
  percentFunded: number;
  verifiedPartner: string;
  imagePlaceholderColor: string;
  description: string;
}

export interface PatientCase {
  id: string;
  title: string;
  category: 'Surgery' | 'Dialysis' | 'Medicine';
  amountNeeded: number;
  raisedAmount: number;
  percentFunded: number;
  hospitalName: string;
  verifiedByHospital: boolean;
  anonymisedPatientId: string;
  description: string;
  isFullyFunded: boolean;
}

export interface RecipientOption {
  id: string;
  name: string;
  category: string;
  defaultPercent: number;
  currentPercent: number;
  selected: boolean;
  scholarApproved: boolean;
  billRefSample?: string;
  patientIdSample?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}

interface AppContextType {
  user: UserProfile;
  login: (emailOrPhone: string, name?: string) => void;
  logout: () => void;

  // Calculator
  calculatorInputs: AssetInputs;
  setCalculatorInputs: React.Dispatch<React.SetStateAction<AssetInputs>>;
  calculationResult: CalculationResult;
  useSrsBenchmarkValues: boolean;
  setUseSrsBenchmarkValues: (val: boolean) => void;

  // AutoPay
  autoPayPlan: AutoPayPlan;
  toggleAutoPay: (enabled?: boolean) => void;
  updateAutoPay: (plan: Partial<AutoPayPlan>) => void;
  cancelAutoPay: () => void;

  // Giving data
  campaigns: Campaign[];
  patientCases: PatientCase[];
  recipients: RecipientOption[];
  updateRecipientPercent: (id: string, percent: number) => void;
  toggleRecipientSelected: (id: string) => void;
  resetDefaultDistribution: () => void;

  // History & Transactions
  donations: DonationRecord[];
  givingStats: GivingStats;
  addDonation: (
    newDonation: Omit<DonationRecord, 'id' | 'date' | 'status'> & { customDate?: string }
  ) => string;
  getDonationById: (id: string) => DonationRecord | undefined;
  resetDemoData: () => void;
}

const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'ZK-10482',
    date: '04 Oct 2026',
    recipientDisplay: '3 recipients',
    type: 'Zakat',
    amount: 12500,
    status: 'Completed',
    paymentMethod: 'bKash',
    allocations: [
      {
        recipient: 'City Hospital',
        category: 'Patient bills',
        billRef: 'Bill #A-2291',
        patientId: 'Patient P-***41 (anonymised)',
        amount: 5000,
        percent: 40,
        notes: 'Heart surgery, Patient ID P-***41 (anonymised)',
      },
      {
        recipient: 'Mercy Medical',
        category: 'Surgeries',
        billRef: 'Bill #M-5530',
        patientId: 'Patient P-***17 (anonymised)',
        amount: 4375,
        percent: 35,
        notes: 'Dialysis, Patient ID P-***17 (anonymised)',
      },
      {
        recipient: 'Care Foundation',
        category: 'Charity - medicine',
        billRef: 'Medicine pack',
        patientId: 'Medicine for 12 patients',
        amount: 3125,
        percent: 25,
        notes: 'Medicine for 12 patients',
      },
    ],
  },
  {
    id: 'ZK-09140',
    date: '12 Mar 2026',
    recipientDisplay: 'Dialysis Fund',
    type: 'Donation',
    amount: 25000,
    status: 'Completed',
    paymentMethod: 'bKash',
    allocations: [
      {
        recipient: 'Free Dialysis Centre',
        category: 'Dialysis',
        amount: 25000,
        percent: 100,
        notes: 'Kidney care emergency dialysis sessions',
      },
    ],
  },
  {
    id: 'ZK-07821',
    date: '10 Mar 2025',
    recipientDisplay: 'Care Foundation',
    type: 'Zakat',
    amount: 50000,
    status: 'Completed',
    paymentMethod: 'Card',
    allocations: [
      {
        recipient: 'Care Foundation',
        category: 'Charity - medicine',
        amount: 50000,
        percent: 100,
        notes: 'Medical support for impoverished families',
      },
    ],
  },
  {
    id: 'ZK-05411',
    date: '02 Mar 2024',
    recipientDisplay: 'City Hospital',
    type: 'Zakat',
    amount: 5000,
    status: 'Completed',
    paymentMethod: 'Bank transfer',
    allocations: [
      {
        recipient: 'City Hospital',
        category: 'Patient bills',
        billRef: 'Bill #CH-109',
        patientId: 'Patient P-***09 (anonymised)',
        amount: 5000,
        percent: 100,
        notes: 'Trauma care bill clearance',
      },
    ],
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Emergency Surgery Fund',
    category: 'Surgery',
    goalAmount: 500000,
    raisedAmount: 360000,
    percentFunded: 72,
    verifiedPartner: 'Dhaka Medical Trust',
    imagePlaceholderColor: '#FFE7DA',
    description:
      'Subsidising urgent surgical interventions and ICU beds for low-income patients unable to bear sudden operation costs.',
  },
  {
    id: 'camp-2',
    title: 'Free Dialysis Centre',
    category: 'Dialysis',
    goalAmount: 800000,
    raisedAmount: 360000,
    percentFunded: 45,
    verifiedPartner: 'Kidney Care Foundation',
    imagePlaceholderColor: '#FFDFD2',
    description:
      'Supplying hemodialysis sessions, dialyzers, and bicarbonate solution for chronic kidney disease patients.',
  },
  {
    id: 'camp-3',
    title: 'Child Medicine Pack',
    category: 'Medicine',
    goalAmount: 250000,
    raisedAmount: 150000,
    percentFunded: 60,
    verifiedPartner: 'Shishu Health Alliance',
    imagePlaceholderColor: '#FFEADF',
    description:
      'Essential antibiotics, asthma inhalers, and pediatric nutritional supplies distributed directly to partner clinics.',
  },
];

const INITIAL_CASES: PatientCase[] = [
  {
    id: 'A-2291',
    title: 'Heart surgery - #A-2291',
    category: 'Surgery',
    amountNeeded: 90000,
    raisedAmount: 58500,
    percentFunded: 65,
    hospitalName: 'City Hospital',
    verifiedByHospital: true,
    anonymisedPatientId: 'P-***41',
    description:
      'Coronary artery bypass graft for a 48-year-old day laborer with no private insurance or savings.',
    isFullyFunded: false,
  },
  {
    id: 'B-1180',
    title: 'Dialysis (3 months) - #B-1180',
    category: 'Dialysis',
    amountNeeded: 36000,
    raisedAmount: 10800,
    percentFunded: 30,
    hospitalName: 'Mercy Medical Centre',
    verifiedByHospital: true,
    anonymisedPatientId: 'P-***17',
    description:
      'Twelve sessions of maintenance hemodialysis and erythropoietin injections for an elderly female patient.',
    isFullyFunded: false,
  },
  {
    id: 'C-0742',
    title: 'Child cancer care - #C-0742',
    category: 'Medicine',
    amountNeeded: 150000,
    raisedAmount: 120000,
    percentFunded: 80,
    hospitalName: 'Child Cancer Care',
    verifiedByHospital: true,
    anonymisedPatientId: 'P-***88',
    description:
      'Second round of pediatric chemotherapy protocols and supportive medication under oncological supervision.',
    isFullyFunded: false,
  },
];

const INITIAL_RECIPIENTS: RecipientOption[] = [
  {
    id: 'rec-1',
    name: 'City Hospital',
    category: 'Patient bills',
    defaultPercent: 40,
    currentPercent: 40,
    selected: true,
    scholarApproved: true,
    billRefSample: 'Bill #A-2291',
    patientIdSample: 'Patient ID P-***41',
  },
  {
    id: 'rec-2',
    name: 'Mercy Medical Centre',
    category: 'Surgeries',
    defaultPercent: 35,
    currentPercent: 35,
    selected: true,
    scholarApproved: true,
    billRefSample: 'Bill #M-5530',
    patientIdSample: 'Patient ID P-***17',
  },
  {
    id: 'rec-3',
    name: 'Care Foundation',
    category: 'Charity - medicine',
    defaultPercent: 25,
    currentPercent: 25,
    selected: true,
    scholarApproved: true,
    billRefSample: 'Medicine pack',
    patientIdSample: 'Medicine for 12 patients',
  },
  {
    id: 'rec-4',
    name: 'Orphan Aid Trust',
    category: 'Charity - food',
    defaultPercent: 0,
    currentPercent: 0,
    selected: false,
    scholarApproved: true,
    billRefSample: 'Food pack #OA-14',
    patientIdSample: 'Vulnerable families',
  },
];

const INITIAL_AUTOPAY: AutoPayPlan = {
  enabled: true,
  amount: 12500,
  schedule: 'Ramadan 2027',
  method: 'bKash',
  nextRunDate: '15 Mar 2027',
};

const INITIAL_USER: UserProfile = {
  name: 'Rahim',
  email: 'rahim@example.com',
  phone: '+8801712345678',
  isLoggedIn: true,
};

const INITIAL_CALCULATOR_INPUTS: AssetInputs = {
  cash: 450000,
  goldGrams: 40,
  silverGrams: 0,
  investments: 120000,
  debts: 30000,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() =>
    storageService.getItem('user', INITIAL_USER)
  );

  const [calculatorInputs, setCalculatorInputs] = useState<AssetInputs>(() =>
    storageService.getItem('calc', INITIAL_CALCULATOR_INPUTS)
  );

  // SRS Appendix D Item 1 & 2 Toggle:
  // Preserves exact prototype reference figures on initial view while allowing live formula recalculation.
  const [useSrsBenchmarkValues, setUseSrsBenchmarkValues] = useState<boolean>(true);

  const [autoPayPlan, setAutoPayPlan] = useState<AutoPayPlan>(() =>
    storageService.getItem('autopay', INITIAL_AUTOPAY)
  );

  const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
    storageService.getItem('campaigns', INITIAL_CAMPAIGNS)
  );

  const [patientCases, setPatientCases] = useState<PatientCase[]>(() =>
    storageService.getItem('cases', INITIAL_CASES)
  );

  const [recipients, setRecipients] = useState<RecipientOption[]>(() =>
    storageService.getItem('recipients', INITIAL_RECIPIENTS)
  );

  const [donations, setDonations] = useState<DonationRecord[]>(() =>
    storageService.getItem('donations', INITIAL_DONATIONS)
  );

  const [calculationResult, setCalculationResult] = useState<CalculationResult>({
    zakatableWealth: 530000,
    debtsDeducted: 30000,
    netWealth: 500000,
    isAboveNisab: true,
    nisabThreshold: DEFAULT_NISAB_THRESHOLD,
    zakatDue: 12500,
    effectiveRate: 0.025,
  });

  useEffect(() => {
    const isInitialScreen4Values =
      calculatorInputs.cash === 450000 &&
      calculatorInputs.goldGrams === 40 &&
      calculatorInputs.silverGrams === 0 &&
      calculatorInputs.investments === 120000 &&
      calculatorInputs.debts === 30000;

    if (useSrsBenchmarkValues && isInitialScreen4Values) {
      setCalculationResult({
        zakatableWealth: 530000,
        debtsDeducted: 30000,
        netWealth: 500000,
        isAboveNisab: true,
        nisabThreshold: DEFAULT_NISAB_THRESHOLD,
        zakatDue: 12500,
        effectiveRate: 0.025,
      });
    } else {
      setCalculationResult(calculateZakat(calculatorInputs));
    }
  }, [calculatorInputs, useSrsBenchmarkValues]);

  useEffect(() => {
    storageService.setItem('user', user);
    storageService.setItem('calc', calculatorInputs);
    storageService.setItem('autopay', autoPayPlan);
    storageService.setItem('campaigns', campaigns);
    storageService.setItem('cases', patientCases);
    storageService.setItem('recipients', recipients);
    storageService.setItem('donations', donations);
  }, [user, calculatorInputs, autoPayPlan, campaigns, patientCases, recipients, donations]);

  const login = (emailOrPhone: string, name?: string) => {
    setUser({
      name: name || 'Rahim',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'rahim@example.com',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '+8801712345678',
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const toggleAutoPay = (enabled?: boolean) => {
    setAutoPayPlan((prev) => ({
      ...prev,
      enabled: enabled !== undefined ? enabled : !prev.enabled,
    }));
  };

  const updateAutoPay = (plan: Partial<AutoPayPlan>) => {
    setAutoPayPlan((prev) => ({
      ...prev,
      ...plan,
    }));
  };

  const cancelAutoPay = () => {
    setAutoPayPlan((prev) => ({
      ...prev,
      enabled: false,
    }));
  };

  const updateRecipientPercent = (id: string, percent: number) => {
    setRecipients((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, currentPercent: Math.max(0, Math.min(100, percent)) } : r
      )
    );
  };

  const toggleRecipientSelected = (id: string) => {
    setRecipients((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextSelected = !r.selected;
          return {
            ...r,
            selected: nextSelected,
            currentPercent: nextSelected
              ? r.currentPercent > 0
                ? r.currentPercent
                : r.defaultPercent || 25
              : 0,
          };
        }
        return r;
      })
    );
  };

  const resetDefaultDistribution = () => {
    setRecipients(INITIAL_RECIPIENTS);
  };

  const addDonation = (
    newDonation: Omit<DonationRecord, 'id' | 'date' | 'status'> & { customDate?: string }
  ) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 89999);
    const newId = `ZK-${randomSuffix}`;

    const todayStr =
      newDonation.customDate ||
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

    const record: DonationRecord = {
      ...newDonation,
      id: newId,
      date: todayStr,
      status: 'Completed',
    };

    setDonations((prev) => [record, ...prev]);

    // Also update case funded percentage if a patient case bill was funded
    if (newDonation.allocations && newDonation.allocations.length === 1) {
      const alloc = newDonation.allocations[0];
      if (alloc.billRef && alloc.billRef.startsWith('Bill #')) {
        const caseId = alloc.billRef.replace('Bill #', '').trim();
        setPatientCases((prevCases) =>
          prevCases.map((c) => {
            if (c.id === caseId) {
              const nextRaised = Math.min(c.amountNeeded, c.raisedAmount + newDonation.amount);
              const nextPercent = Math.min(100, Math.round((nextRaised / c.amountNeeded) * 100));
              return {
                ...c,
                raisedAmount: nextRaised,
                percentFunded: nextPercent,
                isFullyFunded: nextPercent >= 100,
              };
            }
            return c;
          })
        );
      }
    }

    if (newDonation.isMonthly) {
      setAutoPayPlan({
        enabled: true,
        amount: newDonation.amount,
        schedule: 'Monthly',
        method: newDonation.paymentMethod,
        nextRunDate: 'Next month',
      });
    }

    return newId;
  };

  const getDonationById = (id: string) => {
    return donations.find((d) => d.id === id);
  };

  const resetDemoData = () => {
    storageService.clearAll();
    setUser(INITIAL_USER);
    setCalculatorInputs(INITIAL_CALCULATOR_INPUTS);
    setAutoPayPlan(INITIAL_AUTOPAY);
    setCampaigns(INITIAL_CAMPAIGNS);
    setPatientCases(INITIAL_CASES);
    setRecipients(INITIAL_RECIPIENTS);
    setDonations(INITIAL_DONATIONS);
    setUseSrsBenchmarkValues(true);
  };

  const givingStats = computeGivingStats(donations, 2026);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        calculatorInputs,
        setCalculatorInputs,
        calculationResult,
        useSrsBenchmarkValues,
        setUseSrsBenchmarkValues,
        autoPayPlan,
        toggleAutoPay,
        updateAutoPay,
        cancelAutoPay,
        campaigns,
        patientCases,
        recipients,
        updateRecipientPercent,
        toggleRecipientSelected,
        resetDefaultDistribution,
        donations,
        givingStats,
        addDonation,
        getDonationById,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
