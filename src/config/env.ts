/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Centralized Environment & Domain Configuration.
 * Separates environment variables, constants, and SRS business rule thresholds from UI components.
 */

export interface AppConfig {
  appName: string;
  appUrl: string;
  currency: string;
  zakatRate: number;
  defaultNisabBdt: number;
  storagePrefix: string;
  minZakatPaymentBdt: number;
  minGeneralDonationBdt: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  apiSimulationDelayMs: number;
}

export const ENV_CONFIG: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Smart Zakat',
  appUrl: import.meta.env.VITE_APP_URL || 'https://smartzakat.org',
  currency: 'BDT',
  zakatRate: 0.025, // 2.5% per SRS BR-4
  defaultNisabBdt: Number(import.meta.env.VITE_DEFAULT_NISAB_BDT) || 107100, // 595g Silver benchmark
  storagePrefix: 'smart_zakat_academic_demo_v2',
  minZakatPaymentBdt: 100, // SRS Screen 8 Entry Exception Table
  minGeneralDonationBdt: 50, // SRS Screen 6 Entry Exception Table
  maxLoginAttempts: 5, // SRS BR-1
  lockoutDurationMinutes: 15, // SRS BR-1
  apiSimulationDelayMs: 300,
};
