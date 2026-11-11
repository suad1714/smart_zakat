/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProgressBarProps {
  percent: number;
  labelLeft?: string;
  labelRight?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  labelLeft,
  labelRight,
}) => {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="space-y-2">
      {(labelLeft || labelRight) && (
        <div className="flex items-center justify-between text-xs font-semibold text-[#665E5A]">
          {labelLeft && <span>{labelLeft}</span>}
          {labelRight && <span>{labelRight}</span>}
        </div>
      )}
      <div className="w-full bg-[#EFEBE7] h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-[#F0440A] h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
