/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reusable Verification & Gift Type Badges (SRS Section 3.1).
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerificationBadgeProps {
  label: 'Verified partner' | 'Verified by hospital' | 'Reviewed by scholar board' | string;
  variant?: 'orange' | 'emerald' | 'neutral';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  label,
  variant = 'orange',
}) => {
  const styles = {
    orange: 'bg-[#FFF0E8] text-[#F0440A] border-[#FFE2D1]',
    emerald: 'bg-[#FFF0E8] text-[#1A1615] border-[#FFE2D1]',
    neutral: 'bg-[#FAF7F5] text-[#5C5551] border-[#EAE3DC]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}
    >
      <ShieldCheck
        className={`w-3.5 h-3.5 ${
          variant === 'emerald' ? 'text-emerald-600' : 'text-[#F0440A]'
        }`}
      />
      {label}
    </span>
  );
};

interface GiftTypePillProps {
  type: 'Zakat' | 'Donation' | 'Zakat or Donation';
}

export const GiftTypePill: React.FC<GiftTypePillProps> = ({ type }) => {
  if (type === 'Zakat') {
    return (
      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FFF0E8] text-[#F0440A]">
        Zakat
      </span>
    );
  }
  if (type === 'Donation') {
    return (
      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F2EFEA] text-[#5C5551]">
        Donation
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FFF0E8] text-[#1A1615] border border-[#FFE2D1]">
      Zakat or Donation
    </span>
  );
};
